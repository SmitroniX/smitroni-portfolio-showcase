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
} from 'lucide-react';
import {
  JavaGuiState,
  JavaGuiComponent,
  JavaGuiDialog,
  JavaMenuItem,
  handleVirtualButtonClick,
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
  const [theme, setTheme] = useState<'windows-native' | 'windows-dark' | 'windows-light'>('windows-native');
  const [wallpaper, setWallpaper] = useState<'bloom-dark' | 'bloom-light' | 'midnight'>('bloom-dark');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState<string>('');
  const [systemDate, setSystemDate] = useState<string>('');

  // Dragging & Resizing State
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 30, y: 20 });
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: Math.max(guiState.width || 420, 360),
    height: Math.max(guiState.height || 540, 460),
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
      width: Math.max(guiState.width || 420, 360),
      height: Math.max(guiState.height || 540, 460),
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
        const newW = Math.max(300, resizeStartRef.current.startW + dw);
        const newH = Math.max(360, resizeStartRef.current.startH + dh);
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
    ctx.fillStyle = guiState.backgroundColor || '#141414';
    ctx.fillRect(0, 0, w, h);

    if (!guiState.graphicsCommands || guiState.graphicsCommands.length === 0) return;

    let currentColor = '#FFFFFF';
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
    if (onLogEvent) onLogEvent('[GUI System]: Window reset to default values');
  };

  const handleCloseDialog = () => {
    sounds.playClick();
    setActiveDialog(null);
    setDialogInput('');
  };

  const handleSubmitDialog = () => {
    sounds.playClick();
    if (activeDialog && activeDialog.type === 'input') {
      if (onLogEvent) onLogEvent(`[JOptionPane Input]: "${dialogInput}"`);
    }
    setActiveDialog(null);
    setDialogInput('');
  };

  const hasGraphics = guiState.graphicsCommands && guiState.graphicsCommands.length > 0;
  const primaryDisplay = components.find((c) => c.type === 'textfield');
  const buttonsOnly = components.filter((c) => c.type === 'button');
  const nonButtonComponents = components.filter((c) => c.type !== 'button');
  const isCalcGrid = buttonsOnly.length >= 16;

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
      {/* Desktop Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Desktop Workspace (Canvas for Windows) */}
      <div className="flex-1 relative overflow-hidden p-2 sm:p-4">
        
        {/* Subtle Desktop Icons */}
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
        {/* REAL WINDOWS APPLICATION WINDOW (MATCHING USER SCREENSHOT EXACTLY)        */}
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
            className="flex flex-col rounded-lg overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.7)] transition-all z-20 border border-[#3A3A3A] bg-[#121212] text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. AUTHENTIC WINDOWS TITLE BAR (WHITE BACKGROUND AS PER SCREENSHOT) */}
            <div
              onMouseDown={handleTitleMouseDown}
              onDoubleClick={() => setIsMaximized(!isMaximized)}
              className="h-8 sm:h-9 px-2.5 flex items-center justify-between select-none cursor-move shrink-0 bg-white border-b border-[#E0E0E0] text-black"
            >
              {/* Left: Classic Official Java Duke Cup Icon & Window Title */}
              <div className="flex items-center gap-2 min-w-0 truncate">
                {/* Official Colorful Java Cup Icon: Blue cup, red steam */}
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M19 3C19 3 21 5.5 18 7.5C15 9.5 18 11.5 18 11.5"
                      stroke="#EA2D2E"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14 2C14 2 16 4.5 13 6.5C10 8.5 13 10.5 13 10.5"
                      stroke="#EA2D2E"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 13C6 11.8954 6.89543 11 8 11H21C22.1046 11 23 11.8954 23 13V20C23 22.7614 20.7614 25 18 25H11C8.23858 25 6 22.7614 6 20V13Z"
                      fill="#007396"
                    />
                    <path
                      d="M23 14H25C26.6569 14 28 15.3431 28 17C28 18.6569 26.6569 20 25 20H23"
                      stroke="#007396"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 27C8 29 22 29 26 27"
                      stroke="#007396"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <span className="text-[12px] sm:text-[13px] font-normal truncate tracking-tight text-black font-['Segoe_UI']">
                  {guiState.title || 'Scientific Calculator'}
                </span>
              </div>

              {/* Right: Iconic Windows Controls (—, 🗖, ✕ with Red Hover) */}
              <div className="flex items-center shrink-0 h-full">
                {/* Reset App Form */}
                <button
                  onClick={handleReset}
                  className="h-full px-2 flex items-center justify-center hover:bg-[#EBEBEB] text-slate-700 transition-colors"
                  title="Reset Calculator"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Minimize Button (—) */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="h-full w-10 sm:w-11 flex items-center justify-center hover:bg-[#EBEBEB] text-black transition-colors"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Maximize / Restore Button (🗖) */}
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="h-full w-10 sm:w-11 flex items-center justify-center hover:bg-[#EBEBEB] text-black transition-colors"
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
                  className="h-full w-10 sm:w-11 flex items-center justify-center hover:bg-[#E81123] hover:text-white transition-colors text-black"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Optional Menu Bar (if specified in code) */}
            {guiState.menus && guiState.menus.length > 0 && (
              <div className="h-6 px-2 flex items-center gap-1 text-[11px] font-['Segoe_UI'] bg-[#1E1E1E] border-b border-[#2C2C2C] text-slate-300 shrink-0">
                {guiState.menus.map((menu) => (
                  <span key={menu.id} className="px-2 py-0.5 rounded hover:bg-[#2C2C2C] cursor-pointer">
                    {menu.label}
                  </span>
                ))}
              </div>
            )}

            {/* 2. WINDOW CONTENT BODY (DARK MATTE BACKGROUND #121212) */}
            <div className="flex-1 flex flex-col p-3 sm:p-4 overflow-hidden bg-[#121212]">
              
              {/* Optional 2D Graphics Canvas Layer */}
              {hasGraphics && (
                <div className="relative w-full h-44 mb-3 rounded-lg overflow-hidden border border-white/10 bg-[#161616]">
                  <canvas ref={canvasRef} className="w-full h-full block" />
                </div>
              )}

              {/* AUTHENTIC TOP DISPLAY PANEL (Exact match to screenshot) */}
              <div className="p-3 sm:p-4 bg-[#1C1C1C] rounded-lg mb-3 flex flex-col justify-between min-h-[76px] sm:min-h-[84px] shrink-0 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] font-['Segoe_UI']">
                  {guiState.subtitle || 'SCIENTIFIC CALCULATOR'}
                </span>
                <span className="text-right text-white font-bold text-3xl sm:text-4xl tracking-tight font-['Segoe_UI'] overflow-x-auto select-text leading-tight">
                  {primaryDisplay?.text || '0'}
                </span>
              </div>

              {/* Non-button components (labels, fields, checkboxes etc.) if any */}
              {nonButtonComponents.length > 0 && !isCalcGrid && (
                <div className="mb-3 flex flex-wrap gap-2 items-center">
                  {nonButtonComponents.map((comp) => {
                    if (comp.type === 'label') {
                      return (
                        <div key={comp.id} className="text-xs text-slate-300 font-medium">
                          {comp.text}
                        </div>
                      );
                    }
                    if (comp.type === 'checkbox') {
                      return (
                        <label key={comp.id} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                          <input type="checkbox" defaultChecked={comp.checked} className="rounded text-[#0078D4]" />
                          <span>{comp.text}</span>
                        </label>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {/* 3. AUTHENTIC 5-COLUMN BUTTONS GRID (Exact match to screenshot) */}
              {buttonsOnly.length > 0 ? (
                <div
                  className="flex-1 grid gap-1.5 sm:gap-2 items-stretch"
                  style={{
                    gridTemplateColumns: `repeat(${guiState.gridCols || 5}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${guiState.gridRows || 6}, minmax(0, 1fr))`,
                  }}
                >
                  {buttonsOnly.map((btn) => {
                    const text = btn.text.trim();

                    // Exact color mapping from user screenshot:
                    let bgColor = btn.bgColor || '#282828';
                    let textColor = btn.color || '#FFFFFF';

                    if (text === 'C' || text === '⌫' || text === 'DEL' || text === 'CLR') {
                      bgColor = '#C63636'; // Coral Red from screenshot
                    } else if (['/', '×', '*', '-', '+'].includes(text)) {
                      bgColor = '#1976D2'; // Vivid Accent Blue from screenshot
                    } else if (text === '=') {
                      bgColor = '#0FA958'; // Vibrant Emerald Green from screenshot
                    } else if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', '1/x', 'π', 'e', '(', ')'].includes(text)) {
                      bgColor = '#383838'; // Scientific Function Gray from screenshot
                    } else if (/^[0-9]$|\./.test(text)) {
                      bgColor = '#262626'; // Charcoal Digit Gray from screenshot
                    }

                    return (
                      <button
                        key={btn.id}
                        onClick={() => handleBtnClick(btn)}
                        style={{ backgroundColor: bgColor, color: textColor }}
                        className="w-full h-full rounded-md font-['Segoe_UI'] font-bold text-sm sm:text-base flex items-center justify-center cursor-pointer transition-all active:scale-95 hover:brightness-110 shadow-sm border border-black/10 select-none"
                      >
                        {text === '⌫' ? (
                          <span className="text-base sm:text-lg">⌫</span>
                        ) : (
                          text
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : null}

            </div>

            {/* Bottom-Right Resize Handle */}
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-2xl border border-[#444] bg-[#222222] text-white">
              {/* Dialog Titlebar */}
              <div className="h-7 px-3 flex items-center justify-between bg-[#1A1A1A] border-b border-[#333]">
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
                      className="mt-3 w-full px-2.5 py-1 text-xs sm:text-sm font-['Segoe_UI'] rounded border bg-[#181818] text-white border-[#555] focus:border-[#0078D4] outline-none"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              {/* Dialog Buttons */}
              <div className="px-4 py-2.5 flex items-center justify-end gap-2 border-t bg-[#1A1A1A] border-[#333]">
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
                      className="px-4 py-1 text-xs font-['Segoe_UI'] font-medium rounded border bg-[#333] hover:bg-[#444] border-[#444] text-white transition-colors"
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
      <div className="h-11 sm:h-12 border-t border-white/10 bg-[#0F141F]/90 backdrop-blur-xl px-3 flex items-center justify-between shrink-0 z-40 select-none shadow-2xl">
        
        {/* Left / Center: Windows 11 Centered App Icons */}
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          
          {/* Windows 11 Start Button (Iconic 4 blue tiles) */}
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
            title={`${guiState.title || 'Scientific Calculator'} (Click to minimize/restore)`}
          >
            <div className="w-5 h-5 rounded bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 32 32" fill="none">
                <path d="M19 3C19 3 21 5.5 18 7.5C15 9.5 18 11.5 18 11.5" stroke="#EA2D2E" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 13C6 11.8954 6.89543 11 8 11H21C22.1046 11 23 11.8954 23 13V20C23 22.7614 20.7614 25 18 25H11C8.23858 25 6 22.7614 6 20V13Z" fill="#007396" />
              </svg>
            </div>
            <span className="text-xs font-['Segoe_UI'] font-medium truncate max-w-[130px] hidden sm:inline">
              {guiState.title || 'Scientific Calculator'}
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
