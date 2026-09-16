import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Minus,
  Square,
  RotateCcw,
  Maximize2,
  Minimize2,
  Info,
  HelpCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Volume2,
  Wifi,
  Battery,
  Search,
  ChevronDown,
  Monitor,
  Folder,
  FileCode2,
  Trash2
} from 'lucide-react';
import {
  JavaGuiState,
  JavaGuiComponent,
  JavaGuiDialog,
  JavaMenuItem,
  handleVirtualButtonClick
} from '../utils/javaGuiRunner';
import { sounds } from '../utils/sound';

interface JavaGuiWindowProps {
  guiState: JavaGuiState;
  onLogEvent?: (log: string) => void;
  onClose?: () => void;
}

export const JavaGuiWindow: React.FC<JavaGuiWindowProps> = ({
  guiState,
  onLogEvent,
  onClose,
}) => {
  const [components, setComponents] = useState<JavaGuiComponent[]>(guiState.components);
  const [activeDialog, setActiveDialog] = useState<JavaGuiDialog | null>(guiState.dialogs[0] || null);
  const [dialogInput, setDialogInput] = useState<string>('');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [theme, setTheme] = useState<'windows-dark' | 'windows-light'>('windows-dark');
  const [wallpaper, setWallpaper] = useState<'bloom-dark' | 'bloom-light' | 'midnight'>('bloom-dark');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState<string>('');
  const [systemDate, setSystemDate] = useState<string>('');

  // Dragging & Resizing State
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 24, y: 24 });
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: Math.max(guiState.width || 520, 360),
    height: Math.max(guiState.height || 400, 300),
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startW: 0,
    startH: 0,
  });

  const desktopContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const calcMemoryRef = useRef<{ prevVal?: number; op?: string; clearOnNextDigit?: boolean }>({});

  // Sync state when guiState updates
  useEffect(() => {
    setComponents(guiState.components);
    setActiveDialog(guiState.dialogs[0] || null);
    setWindowSize({
      width: Math.max(guiState.width || 520, 360),
      height: Math.max(guiState.height || 400, 300),
    });
    setIsMinimized(false);
    calcMemoryRef.current = {};
  }, [guiState]);

  // Live Windows clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setSystemDate(
        now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Window Drag Handler (Move on virtual desktop)
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  // Window Resize Handler (Bottom-right corner)
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: windowSize.width,
      startH: windowSize.height,
    };
  };

  // Global mouse move & mouse up listeners for dragging / resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        const newX = Math.max(0, dragStartRef.current.startX + dx);
        const newY = Math.max(0, dragStartRef.current.startY + dy);
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const dw = e.clientX - resizeStartRef.current.mouseX;
        const dh = e.clientY - resizeStartRef.current.mouseY;
        const newW = Math.max(320, resizeStartRef.current.startW + dw);
        const newH = Math.max(220, resizeStartRef.current.startH + dh);
        setWindowSize({ width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  // Render Graphics Canvas commands on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement?.clientWidth || windowSize.width;
    const h = canvas.parentElement?.clientHeight || windowSize.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = guiState.backgroundColor || (theme === 'windows-dark' ? '#202020' : '#F9F9F9');
    ctx.fillRect(0, 0, w, h);

    if (!guiState.graphicsCommands || guiState.graphicsCommands.length === 0) return;

    let currentColor = theme === 'windows-dark' ? '#FFFFFF' : '#000000';
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = 1.5;
    ctx.font = '13px "Segoe UI", Tahoma, sans-serif';

    for (const cmd of guiState.graphicsCommands) {
      if (cmd.type === 'color') {
        currentColor = String(cmd.params[0]) || currentColor;
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
      } else if (cmd.type === 'string') {
        const text = String(cmd.params[0]);
        const x = Number(cmd.params[1]) || 20;
        const y = Number(cmd.params[2]) || 20;
        ctx.fillStyle = cmd.color || currentColor;
        ctx.fillText(text, x, y);
      } else if (cmd.type === 'line') {
        const x1 = Number(cmd.params[0]) || 0;
        const y1 = Number(cmd.params[1]) || 0;
        const x2 = Number(cmd.params[2]) || 100;
        const y2 = Number(cmd.params[3]) || 100;
        ctx.strokeStyle = cmd.color || currentColor;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (cmd.type === 'rect') {
        const x = Number(cmd.params[0]) || 0;
        const y = Number(cmd.params[1]) || 0;
        const rw = Number(cmd.params[2]) || 50;
        const rh = Number(cmd.params[3]) || 50;
        ctx.strokeStyle = cmd.color || currentColor;
        ctx.strokeRect(x, y, rw, rh);
      } else if (cmd.type === 'fillRect') {
        const x = Number(cmd.params[0]) || 0;
        const y = Number(cmd.params[1]) || 0;
        const rw = Number(cmd.params[2]) || 50;
        const rh = Number(cmd.params[3]) || 50;
        ctx.fillStyle = cmd.color || currentColor;
        ctx.fillRect(x, y, rw, rh);
      } else if (cmd.type === 'oval') {
        const x = Number(cmd.params[0]) || 0;
        const y = Number(cmd.params[1]) || 0;
        const rw = Number(cmd.params[2]) || 50;
        const rh = Number(cmd.params[3]) || 50;
        ctx.strokeStyle = cmd.color || currentColor;
        ctx.beginPath();
        ctx.ellipse(x + rw / 2, y + rh / 2, rw / 2, rh / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (cmd.type === 'fillOval') {
        const x = Number(cmd.params[0]) || 0;
        const y = Number(cmd.params[1]) || 0;
        const rw = Number(cmd.params[2]) || 50;
        const rh = Number(cmd.params[3]) || 50;
        ctx.fillStyle = cmd.color || currentColor;
        ctx.beginPath();
        ctx.ellipse(x + rw / 2, y + rh / 2, rw / 2, rh / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
      } else if (cmd.type === 'roundRect' || cmd.type === 'fillRoundRect') {
        const x = Number(cmd.params[0]) || 0;
        const y = Number(cmd.params[1]) || 0;
        const rw = Number(cmd.params[2]) || 50;
        const rh = Number(cmd.params[3]) || 50;
        const radius = Number(cmd.params[4]) || 8;
        ctx.beginPath();
        ctx.roundRect(x, y, rw, rh, radius);
        if (cmd.type === 'fillRoundRect') {
          ctx.fillStyle = cmd.color || currentColor;
          ctx.fill();
        } else {
          ctx.strokeStyle = cmd.color || currentColor;
          ctx.stroke();
        }
      }
    }
  }, [guiState, windowSize, isMaximized, theme]);

  // Handle Button Click Event
  const handleBtnClick = (comp: JavaGuiComponent) => {
    sounds.playClick();
    const result = handleVirtualButtonClick(
      comp,
      components,
      guiState.rawCode,
      calcMemoryRef.current
    );
    setComponents(result.updatedComponents);
    if (result.calcMemoryUpdate) {
      calcMemoryRef.current = result.calcMemoryUpdate;
    }
    if (onLogEvent) {
      onLogEvent(result.logText);
    }
    if (result.newDialog) {
      setActiveDialog(result.newDialog);
    }
  };

  // Handle Text Input Changes
  const handleInputChange = (id: string, newVal: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: newVal } : c))
    );
  };

  // Reset Window State
  const handleReset = () => {
    sounds.playClick();
    setComponents(guiState.components);
    calcMemoryRef.current = {};
    if (onLogEvent) onLogEvent('[GUI System]: Window state reset to default');
  };

  // Close active dialog
  const handleCloseDialog = () => {
    sounds.playClick();
    setActiveDialog(null);
    setDialogInput('');
  };

  // Submit input dialog
  const handleSubmitDialog = () => {
    sounds.playClick();
    if (activeDialog && activeDialog.type === 'input') {
      if (onLogEvent) onLogEvent(`[JOptionPane Input]: "${dialogInput}"`);
    }
    setActiveDialog(null);
    setDialogInput('');
  };

  const hasGraphics = guiState.graphicsCommands && guiState.graphicsCommands.length > 0;

  return (
    <div
      ref={desktopContainerRef}
      className={`relative w-full h-full min-h-[480px] flex flex-col overflow-hidden select-none font-sans ${
        wallpaper === 'bloom-dark'
          ? 'bg-gradient-to-br from-[#0B1528] via-[#08101E] to-[#040810]'
          : wallpaper === 'bloom-light'
          ? 'bg-gradient-to-br from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8]'
          : 'bg-[#0A0E17]'
      }`}
      onClick={() => setOpenMenuId(null)}
    >
      {/* Windows 11 Desktop Ambient Wallpaper Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Desktop Top Workspace (Canvas for Windows) */}
      <div className="flex-1 relative overflow-hidden p-2 sm:p-4">
        
        {/* Subtle Windows Desktop Icons (Decorative & Authentic) */}
        <div className="absolute top-4 left-4 flex flex-col gap-5 z-0 pointer-events-none opacity-40 hidden sm:flex">
          <div className="flex flex-col items-center gap-1 w-14">
            <div className="w-9 h-9 rounded-lg bg-sky-600/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-sm">
              <Monitor className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-white font-medium drop-shadow text-center">This PC</span>
          </div>

          <div className="flex flex-col items-center gap-1 w-14">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Folder className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-white font-medium drop-shadow text-center">Projects</span>
          </div>

          <div className="flex flex-col items-center gap-1 w-14">
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
              <FileCode2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-white font-medium drop-shadow text-center">Java GUI</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REAL WINDOWS APPLICATION WINDOW CONTAINER                                 */}
        {/* ========================================================================= */}
        {!isMinimized && (
          <div
            style={
              isMaximized
                ? {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 0,
                  }
                : {
                    position: 'absolute',
                    left: position.x,
                    top: position.y,
                    width: windowSize.width,
                    height: windowSize.height,
                  }
            }
            className={`flex flex-col rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.65)] transition-all z-20 border ${
              theme === 'windows-dark'
                ? 'bg-[#202020] border-[#383838] text-[#F3F3F3]'
                : 'bg-[#F9F9F9] border-[#D1D5DB] text-[#1E293B]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* WINDOW TITLE BAR (AUTHENTIC WINDOWS 11 CHROME) */}
            <div
              onMouseDown={handleTitleMouseDown}
              onDoubleClick={() => setIsMaximized(!isMaximized)}
              className={`h-8 sm:h-9 px-2.5 flex items-center justify-between select-none cursor-move shrink-0 border-b ${
                theme === 'windows-dark'
                  ? 'bg-[#181818] border-[#2B2B2B] text-white'
                  : 'bg-[#EAEAEA] border-[#D6D6D6] text-[#1E293B]'
              }`}
            >
              {/* Left: Windows Java Duke Icon & Title */}
              <div className="flex items-center gap-2 min-w-0 truncate">
                {/* Official Java Duke Cup / Window Icon */}
                <div className="w-4 h-4 rounded flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 8C3 6.89543 3.89543 6 5 6H16C17.1046 6 18 6.89543 18 8V14C18 16.7614 15.7614 19 13 19H8C5.23858 19 3 16.7614 3 14V8Z"
                      fill="#FF8A00"
                    />
                    <path
                      d="M18 9H19.5C20.8807 9 22 10.1193 22 11.5C22 12.8807 20.8807 14 19.5 14H18"
                      stroke="#FF8A00"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path d="M7 3L8 4" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M11 2L12 4" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                <span className="text-[12px] sm:text-[13px] font-normal truncate tracking-tight font-['Segoe_UI']">
                  {guiState.title || 'Java GUI Application'}
                </span>

                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono hidden md:inline-block ${
                    theme === 'windows-dark' ? 'bg-white/10 text-slate-300' : 'bg-black/5 text-slate-600'
                  }`}
                >
                  {guiState.appletMode ? 'Applet' : 'Swing / AWT'}
                </span>
              </div>

              {/* Right: Windows Control Box (Minimize, Maximize, Close) */}
              <div className="flex items-center shrink-0 h-full">
                {/* Theme Switcher Icon */}
                <button
                  onClick={() => setTheme(theme === 'windows-dark' ? 'windows-light' : 'windows-dark')}
                  className={`h-full px-2 flex items-center justify-center transition-colors ${
                    theme === 'windows-dark' ? 'hover:bg-[#2F2F2F] text-slate-300' : 'hover:bg-[#DCDCDC] text-slate-700'
                  }`}
                  title={`Switch to ${theme === 'windows-dark' ? 'Windows Light' : 'Windows Dark'} theme`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>

                {/* Reset App Form */}
                <button
                  onClick={handleReset}
                  className={`h-full px-2 flex items-center justify-center transition-colors ${
                    theme === 'windows-dark' ? 'hover:bg-[#2F2F2F] text-slate-300' : 'hover:bg-[#DCDCDC] text-slate-700'
                  }`}
                  title="Reset Form to Initial State"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Minimize Button (—) */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className={`h-full w-10 sm:w-11 flex items-center justify-center transition-colors ${
                    theme === 'windows-dark' ? 'hover:bg-[#2F2F2F] text-slate-300' : 'hover:bg-[#DCDCDC] text-slate-700'
                  }`}
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Maximize / Restore Button (🗖) */}
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className={`h-full w-10 sm:w-11 flex items-center justify-center transition-colors ${
                    theme === 'windows-dark' ? 'hover:bg-[#2F2F2F] text-slate-300' : 'hover:bg-[#DCDCDC] text-slate-700'
                  }`}
                  title={isMaximized ? 'Restore Down' : 'Maximize'}
                >
                  {isMaximized ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Square className="w-3 h-3" />
                  )}
                </button>

                {/* Close Button (✕) with Iconic Windows Red Hover (#E81123) */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onClose) onClose();
                  }}
                  className="h-full w-10 sm:w-11 flex items-center justify-center hover:bg-[#E81123] hover:text-white transition-colors text-slate-400"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* WINDOWS MENU BAR (JMenuBar: File, Edit, View, Help) */}
            {guiState.menus && guiState.menus.length > 0 && (
              <div
                className={`h-6 sm:h-7 px-2 flex items-center gap-1 text-[11px] font-['Segoe_UI'] border-b shrink-0 relative ${
                  theme === 'windows-dark'
                    ? 'bg-[#1F1F1F] border-[#2A2A2A] text-slate-300'
                    : 'bg-[#F3F3F3] border-[#E0E0E0] text-slate-700'
                }`}
              >
                {guiState.menus.map((menu) => (
                  <div key={menu.id} className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === menu.id ? null : menu.id)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        openMenuId === menu.id
                          ? theme === 'windows-dark'
                            ? 'bg-[#333333] text-white'
                            : 'bg-[#E5E5E5] text-slate-900'
                          : theme === 'windows-dark'
                          ? 'hover:bg-[#2B2B2B]'
                          : 'hover:bg-[#EAEAEA]'
                      }`}
                    >
                      {menu.label}
                    </button>

                    {/* Dropdown Menu Popup */}
                    {openMenuId === menu.id && menu.items && menu.items.length > 0 && (
                      <div
                        className={`absolute top-full left-0 mt-1 min-w-[170px] py-1 rounded-md shadow-2xl z-50 border backdrop-blur-md ${
                          theme === 'windows-dark'
                            ? 'bg-[#2A2A2A]/95 border-[#3D3D3D] text-slate-200'
                            : 'bg-white/95 border-slate-300 text-slate-800'
                        }`}
                      >
                        {menu.items.map((item) => {
                          if (item.isSeparator) {
                            return (
                              <div
                                key={item.id}
                                className={`my-1 border-t ${
                                  theme === 'windows-dark' ? 'border-white/10' : 'border-slate-200'
                                }`}
                              />
                            );
                          }
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                sounds.playClick();
                                setOpenMenuId(null);
                                if (item.label.toLowerCase().includes('exit') && onClose) {
                                  onClose();
                                } else if (item.label.toLowerCase().includes('new')) {
                                  handleReset();
                                } else if (item.label.toLowerCase().includes('about')) {
                                  setActiveDialog({
                                    id: 'about-dialog',
                                    type: 'message',
                                    title: 'About Java GUI Engine',
                                    message: 'Code With SmitroniX Virtual Windows GUI Engine.\nRunning Java Swing & AWT Runtime.',
                                    dialogType: 'info',
                                  });
                                }
                              }}
                              className={`w-full px-3 py-1 text-left text-xs flex items-center justify-between transition-colors ${
                                theme === 'windows-dark'
                                  ? 'hover:bg-[#0078D4] hover:text-white'
                                  : 'hover:bg-[#0078D4] hover:text-white'
                              }`}
                            >
                              <span>{item.label}</span>
                              {item.shortcut && (
                                <span className="text-[10px] opacity-60 ml-3">{item.shortcut}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* WINDOW CLIENT AREA (COMPONENTS & 2D CANVAS) */}
            <div
              className={`flex-1 relative overflow-auto p-3 sm:p-5 ${
                theme === 'windows-dark'
                  ? 'bg-[#202020] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] text-[#000000]'
              }`}
              style={{
                backgroundColor: guiState.backgroundColor !== '#F1F5F9' && guiState.backgroundColor !== '#F3F3F3'
                  ? guiState.backgroundColor
                  : undefined,
              }}
            >
              {/* Optional Vector Canvas Layer (for paint(Graphics g)) */}
              {hasGraphics && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <canvas ref={canvasRef} className="w-full h-full block" />
                </div>
              )}

              {/* Dynamic Components Container */}
              {components.length > 0 ? (
                <div
                  className={`relative z-10 w-full h-full ${
                    guiState.layout === 'grid'
                      ? 'grid items-center'
                      : guiState.layout === 'border'
                      ? 'flex flex-col justify-between h-full gap-3'
                      : guiState.layout === 'null'
                      ? 'relative min-h-[300px]'
                      : 'flex flex-wrap items-center justify-center gap-3'
                  }`}
                  style={
                    guiState.layout === 'grid'
                      ? {
                          gridTemplateColumns: `repeat(${guiState.gridCols || 2}, minmax(0, 1fr))`,
                          gridTemplateRows: `repeat(${guiState.gridRows || 2}, minmax(0, 1fr))`,
                          gap: `${guiState.gridVgap || 8}px ${guiState.gridHgap || 8}px`,
                        }
                      : undefined
                  }
                >
                  {components.map((comp) => {
                    const style: React.CSSProperties =
                      guiState.layout === 'null' && comp.bounds
                        ? {
                            position: 'absolute',
                            left: comp.bounds.x,
                            top: comp.bounds.y,
                            width: comp.bounds.width,
                            height: comp.bounds.height,
                          }
                        : {};

                    if (comp.color) style.color = comp.color;
                    if (comp.bgColor) style.backgroundColor = comp.bgColor;

                    // 1. JButton / Button (Authentic Windows 11 Push Button)
                    if (comp.type === 'button') {
                      return (
                        <button
                          key={comp.id}
                          onClick={() => handleBtnClick(comp)}
                          style={style}
                          className={`px-3 py-1.5 text-xs sm:text-sm font-['Segoe_UI'] font-medium rounded transition-all active:scale-[0.98] shadow-sm flex items-center justify-center cursor-pointer border ${
                            theme === 'windows-dark'
                              ? 'bg-[#2D2D2D] hover:bg-[#383838] border-[#3F3F3F] text-white active:bg-[#252525]'
                              : 'bg-[#FBFBFB] hover:bg-[#F3F4F6] border-[#D1D5DB] text-slate-900 active:bg-[#E5E7EB]'
                          }`}
                        >
                          {comp.text}
                        </button>
                      );
                    }

                    // 2. JLabel / Label
                    if (comp.type === 'label') {
                      return (
                        <div
                          key={comp.id}
                          style={style}
                          className={`text-xs sm:text-sm font-['Segoe_UI'] select-text flex items-center ${
                            comp.isBold ? 'font-bold' : 'font-normal'
                          } ${theme === 'windows-dark' ? 'text-slate-200' : 'text-slate-800'}`}
                        >
                          {comp.text}
                        </div>
                      );
                    }

                    // 3. JTextField & JPasswordField (Authentic Windows 11 Line Focus)
                    if (comp.type === 'textfield' || comp.type === 'passwordfield') {
                      return (
                        <input
                          key={comp.id}
                          type={comp.type === 'passwordfield' ? 'password' : 'text'}
                          value={comp.text}
                          onChange={(e) => handleInputChange(comp.id, e.target.value)}
                          style={style}
                          placeholder="Enter text..."
                          className={`px-2.5 py-1 text-xs sm:text-sm font-['Segoe_UI'] rounded outline-none border transition-all ${
                            theme === 'windows-dark'
                              ? 'bg-[#2C2C2C] text-white border-[#454545] focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4]'
                              : 'bg-white text-slate-900 border-[#868686] focus:border-[#0067C0] focus:ring-1 focus:ring-[#0067C0]'
                          } ${!style.width ? 'min-w-[120px] max-w-[220px]' : ''}`}
                        />
                      );
                    }

                    // 4. JTextArea
                    if (comp.type === 'textarea') {
                      return (
                        <textarea
                          key={comp.id}
                          value={comp.text}
                          onChange={(e) => handleInputChange(comp.id, e.target.value)}
                          style={style}
                          placeholder="Text Area..."
                          rows={3}
                          className={`p-2 text-xs sm:text-sm font-['Segoe_UI'] rounded outline-none resize-none border w-full ${
                            theme === 'windows-dark'
                              ? 'bg-[#2C2C2C] text-white border-[#454545] focus:border-[#0078D4]'
                              : 'bg-white text-slate-900 border-[#868686] focus:border-[#0067C0]'
                          }`}
                        />
                      );
                    }

                    // 5. JCheckBox (Windows Checkbox with checkmark)
                    if (comp.type === 'checkbox') {
                      return (
                        <label
                          key={comp.id}
                          style={style}
                          className="flex items-center gap-2 text-xs sm:text-sm font-['Segoe_UI'] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            defaultChecked={comp.checked}
                            className="w-4 h-4 rounded text-[#0078D4] focus:ring-0 cursor-pointer"
                          />
                          <span>{comp.text}</span>
                        </label>
                      );
                    }

                    // 6. JRadioButton (Windows Radio Button)
                    if (comp.type === 'radio') {
                      return (
                        <label
                          key={comp.id}
                          style={style}
                          className="flex items-center gap-2 text-xs sm:text-sm font-['Segoe_UI'] cursor-pointer select-none"
                        >
                          <input
                            type="radio"
                            name="java_win_radio"
                            defaultChecked={comp.checked}
                            className="w-4 h-4 text-[#0078D4] focus:ring-0 cursor-pointer"
                          />
                          <span>{comp.text}</span>
                        </label>
                      );
                    }

                    // 7. JComboBox (Windows Dropdown)
                    if (comp.type === 'combobox') {
                      return (
                        <div key={comp.id} style={style} className="relative inline-block">
                          <select
                            className={`px-3 py-1 pr-8 text-xs sm:text-sm font-['Segoe_UI'] rounded border outline-none cursor-pointer appearance-none ${
                              theme === 'windows-dark'
                                ? 'bg-[#2C2C2C] text-white border-[#454545]'
                                : 'bg-white text-slate-900 border-[#868686]'
                            }`}
                          >
                            {(comp.options || ['Option 1', 'Option 2', 'Option 3']).map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      );
                    }

                    // 8. JSlider (Windows Accent Slider)
                    if (comp.type === 'slider') {
                      return (
                        <div key={comp.id} style={style} className="flex items-center gap-2 min-w-[160px]">
                          <input
                            type="range"
                            min={comp.min || 0}
                            max={comp.max || 100}
                            defaultValue={Number(comp.value) || 50}
                            className="w-full accent-[#0078D4] cursor-pointer"
                          />
                        </div>
                      );
                    }

                    // 9. JProgressBar (Windows Progress Bar)
                    if (comp.type === 'progressbar') {
                      return (
                        <div
                          key={comp.id}
                          style={style}
                          className="w-full max-w-xs h-3 bg-slate-700/30 rounded-full overflow-hidden border border-white/10 relative"
                        >
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-[#0078D4] rounded-full"
                            style={{ width: `${comp.value || 65}%` }}
                          />
                        </div>
                      );
                    }

                    // 10. JTable (Windows DataGrid)
                    if (comp.type === 'table') {
                      return (
                        <div
                          key={comp.id}
                          style={style}
                          className={`w-full overflow-x-auto rounded border text-xs font-['Segoe_UI'] ${
                            theme === 'windows-dark'
                              ? 'bg-[#1B1B1B] border-[#333]'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          <table className="w-full border-collapse">
                            <thead>
                              <tr
                                className={
                                  theme === 'windows-dark'
                                    ? 'bg-[#292929] text-slate-200 border-b border-[#3A3A3A]'
                                    : 'bg-[#F1F1F1] text-slate-800 border-b border-slate-300'
                                }
                              >
                                {(comp.columns || ['COL 1', 'COL 2', 'COL 3']).map((c, i) => (
                                  <th key={i} className="p-2 text-left font-semibold">
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(comp.rows || []).map((row, ri) => (
                                <tr
                                  key={ri}
                                  className={`border-b ${
                                    theme === 'windows-dark'
                                      ? 'border-white/5 hover:bg-white/5'
                                      : 'border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  {row.map((cell, ci) => (
                                    <td key={ci} className="p-2">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              ) : !hasGraphics ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-3 shadow-inner">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-slate-200 font-['Segoe_UI']">Java Windows Frame Active</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-sm">
                    Frame was created with <code className="font-mono text-sky-400">new JFrame()</code>. Add components with <code className="font-mono text-sky-400">frame.add()</code> or shapes in <code className="font-mono text-sky-400">paint(Graphics g)</code>.
                  </div>
                </div>
              ) : null}
            </div>

            {/* WINDOWS STATUS BAR AT BOTTOM OF WINDOW */}
            <div
              className={`h-6 px-3 flex items-center justify-between text-[10.5px] font-['Segoe_UI'] border-t shrink-0 ${
                theme === 'windows-dark'
                  ? 'bg-[#181818] border-[#2B2B2B] text-slate-400'
                  : 'bg-[#F0F0F0] border-[#D6D6D6] text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{guiState.statusText || 'Ready'}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span>{components.length} components</span>
                <span>JVM JDK 17</span>
              </div>
            </div>

            {/* Bottom-Right Corner Resize Drag Handle */}
            {!isMaximized && (
              <div
                onMouseDown={handleResizeMouseDown}
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30 flex items-end justify-end p-0.5"
                title="Drag to resize window"
              >
                <div className="w-2 h-2 border-r-2 border-b-2 border-slate-500" />
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* AUTHENTIC JOPTIONPANE MODAL DIALOG                                        */}
        {/* ========================================================================= */}
        {activeDialog && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <div
              className={`w-full max-w-sm rounded-lg overflow-hidden shadow-2xl border ${
                theme === 'windows-dark'
                  ? 'bg-[#2B2B2B] border-[#444] text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {/* Dialog Titlebar */}
              <div
                className={`h-7 px-3 flex items-center justify-between border-b ${
                  theme === 'windows-dark'
                    ? 'bg-[#202020] border-[#383838]'
                    : 'bg-[#EAEAEA] border-[#D6D6D6]'
                }`}
              >
                <span className="text-xs font-['Segoe_UI'] font-medium">
                  {activeDialog.title || 'Message'}
                </span>
                <button
                  onClick={handleCloseDialog}
                  className="w-6 h-6 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dialog Body */}
              <div className="p-4 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {activeDialog.dialogType === 'warning' ? (
                    <AlertTriangle className="w-7 h-7 text-amber-500" />
                  ) : activeDialog.dialogType === 'question' ? (
                    <HelpCircle className="w-7 h-7 text-[#0078D4]" />
                  ) : (
                    <Info className="w-7 h-7 text-[#0078D4]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-['Segoe_UI'] whitespace-pre-line leading-relaxed">
                    {activeDialog.message}
                  </div>

                  {activeDialog.type === 'input' && (
                    <input
                      type="text"
                      value={dialogInput}
                      onChange={(e) => setDialogInput(e.target.value)}
                      placeholder="Type response..."
                      className={`mt-3 w-full px-2.5 py-1 text-xs sm:text-sm font-['Segoe_UI'] rounded border outline-none ${
                        theme === 'windows-dark'
                          ? 'bg-[#1E1E1E] text-white border-[#555] focus:border-[#0078D4]'
                          : 'bg-white text-slate-900 border-[#888] focus:border-[#0067C0]'
                      }`}
                      autoFocus
                    />
                  )}
                </div>
              </div>

              {/* Dialog Buttons */}
              <div
                className={`px-4 py-2.5 flex items-center justify-end gap-2 border-t ${
                  theme === 'windows-dark' ? 'bg-[#222] border-[#333]' : 'bg-[#F2F2F2] border-[#E0E0E0]'
                }`}
              >
                {activeDialog.type === 'input' ? (
                  <>
                    <button
                      onClick={handleSubmitDialog}
                      className="px-4 py-1 text-xs font-['Segoe_UI'] font-medium rounded bg-[#0078D4] hover:bg-[#0067C0] text-white transition-colors"
                    >
                      OK
                    </button>
                    <button
                      onClick={handleCloseDialog}
                      className={`px-4 py-1 text-xs font-['Segoe_UI'] font-medium rounded border transition-colors ${
                        theme === 'windows-dark'
                          ? 'bg-[#333] hover:bg-[#444] border-[#444]'
                          : 'bg-white hover:bg-slate-100 border-slate-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCloseDialog}
                    className="px-5 py-1 text-xs font-['Segoe_UI'] font-medium rounded bg-[#0078D4] hover:bg-[#0067C0] text-white transition-colors"
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* AUTHENTIC WINDOWS 11 TASKBAR AT BOTTOM                                    */}
      {/* ========================================================================= */}
      <div className="h-11 sm:h-12 border-t border-white/10 bg-[#0F141F]/80 backdrop-blur-xl px-3 flex items-center justify-between shrink-0 z-40 select-none shadow-2xl">
        
        {/* Left / Center: Windows 11 Centered App Icons */}
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          
          {/* Windows 11 Start Button (Iconic 4 blue squares) */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsMinimized(!isMinimized);
            }}
            className="w-9 h-9 rounded-lg hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center"
            title="Windows Start"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8.5" height="8.5" rx="1" fill="#0078D4" />
              <rect x="12.5" y="3" width="8.5" height="8.5" rx="1" fill="#0078D4" />
              <rect x="3" y="12.5" width="8.5" height="8.5" rx="1" fill="#0078D4" />
              <rect x="12.5" y="12.5" width="8.5" height="8.5" rx="1" fill="#0078D4" />
            </svg>
          </button>

          {/* Windows Search */}
          <button
            className="w-9 h-9 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center text-slate-300 hidden xs:flex"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Running Java App Taskbar Button (with Active Glow Bar) */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsMinimized(!isMinimized);
            }}
            className={`h-9 px-2.5 rounded-lg flex items-center gap-2 transition-all relative ${
              !isMinimized
                ? 'bg-white/15 text-white shadow-inner'
                : 'hover:bg-white/10 text-slate-300'
            }`}
            title={`${guiState.title || 'Java App'} (Click to minimize/restore)`}
          >
            <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 8C3 6.89543 3.89543 6 5 6H16C17.1046 6 18 6.89543 18 8V14C18 16.7614 15.7614 19 13 19H8C5.23858 19 3 16.7614 3 14V8Z"
                  fill="#FF8A00"
                />
              </svg>
            </div>
            <span className="text-xs font-['Segoe_UI'] font-medium truncate max-w-[120px] hidden sm:inline">
              {guiState.title || 'Java App'}
            </span>

            {/* Windows 11 Running App Indicator Pill */}
            <span
              className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all ${
                !isMinimized ? 'w-4 bg-[#0078D4]' : 'w-1.5 bg-slate-400'
              }`}
            />
          </button>

        </div>

        {/* Right: Windows System Tray & Clock */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-300 shrink-0">
          
          {/* Wallpaper Switcher */}
          <button
            onClick={() =>
              setWallpaper(
                wallpaper === 'bloom-dark'
                  ? 'bloom-light'
                  : wallpaper === 'bloom-light'
                  ? 'midnight'
                  : 'bloom-dark'
              )
            }
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-[10px] font-mono hidden md:flex items-center gap-1"
            title="Switch Windows Wallpaper"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Wallpaper</span>
          </button>

          {/* Tray Icons (Audio, Wifi, Battery) */}
          <div className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-white/10 transition-colors text-slate-400 hidden xs:flex">
            <Wifi className="w-3.5 h-3.5" />
            <Volume2 className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>

          {/* Windows Clock & Date */}
          <div
            className="px-2 py-0.5 rounded hover:bg-white/10 transition-colors text-right cursor-default leading-tight"
            title={new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          >
            <div className="text-[11px] font-['Segoe_UI'] font-medium text-slate-200">
              {systemTime || '12:00 PM'}
            </div>
            <div className="text-[9.5px] font-['Segoe_UI'] text-slate-400">
              {systemDate || '1/1/2026'}
            </div>
          </div>

          {/* Windows Peek Desktop Line */}
          <div
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-1.5 h-6 hover:bg-white/30 border-l border-white/20 transition-colors cursor-pointer shrink-0 ml-1"
            title="Show Desktop"
          />

        </div>

      </div>

    </div>
  );
};
