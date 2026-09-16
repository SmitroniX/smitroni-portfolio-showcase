import React, { useState, useEffect, useRef } from 'react';
import {
  Coffee,
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
  ExternalLink
} from 'lucide-react';
import {
  JavaGuiState,
  JavaGuiComponent,
  JavaGuiDialog,
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
  const [theme, setTheme] = useState<'classic' | 'modern'>('modern');
  const [lastEvent, setLastEvent] = useState<string>('Window initialized');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state when new guiState is passed
  useEffect(() => {
    setComponents(guiState.components);
    setActiveDialog(guiState.dialogs[0] || null);
    setLastEvent('Window initialized');
  }, [guiState]);

  // Render Graphics Canvas commands on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set display size and high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement?.clientWidth || guiState.width || 400;
    const h = canvas.parentElement?.clientHeight || guiState.height || 300;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = guiState.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    if (!guiState.graphicsCommands || guiState.graphicsCommands.length === 0) return;

    // Execute drawing commands
    let currentColor = '#0F172A';
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = 1.5;
    ctx.font = '13px sans-serif';

    for (const cmd of guiState.graphicsCommands) {
      if (cmd.type === 'color') {
        currentColor = String(cmd.params[0]) || '#0F172A';
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
        const radius = Number(cmd.params[4]) || 10;
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
  }, [guiState, isMaximized]);

  // Handle Button Clicks
  const handleBtnClick = (comp: JavaGuiComponent) => {
    sounds.playClick();
    const result = handleVirtualButtonClick(comp, components, guiState.rawCode);
    setComponents(result.updatedComponents);
    setLastEvent(result.logText);
    if (onLogEvent) {
      onLogEvent(result.logText);
    }
    if (result.newDialog) {
      setActiveDialog(result.newDialog);
    }
  };

  // Update text field value in state
  const handleInputChange = (id: string, newVal: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: newVal } : c))
    );
  };

  // Reset to initial parsed state
  const handleReset = () => {
    sounds.playClick();
    setComponents(guiState.components);
    setLastEvent('Window reset to initial state');
    if (onLogEvent) onLogEvent('[GUI]: Window reset to default values');
  };

  const hasGraphics = guiState.graphicsCommands && guiState.graphicsCommands.length > 0;

  return (
    <div
      className={`relative flex flex-col rounded-xl overflow-hidden transition-all duration-200 select-none shadow-2xl border ${
        theme === 'classic'
          ? 'bg-[#ECE9D8] border-[#0055EA] text-slate-900 font-sans'
          : 'bg-[#0F172A] border-white/15 text-slate-100 font-sans'
      } ${
        isMaximized
          ? 'fixed inset-4 sm:inset-8 z-50 shadow-2xl'
          : 'w-full h-full min-h-[360px]'
      }`}
    >
      {/* Java Window Title Bar (Windows / Swing Look & Feel) */}
      <div
        className={`h-9 sm:h-10 px-3 flex items-center justify-between select-none shrink-0 ${
          theme === 'classic'
            ? 'bg-gradient-to-r from-[#0055EA] via-[#357AE8] to-[#0055EA] text-white'
            : 'bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] border-b border-white/10 text-white'
        }`}
      >
        {/* Left: Java Icon & Title */}
        <div className="flex items-center gap-2 min-w-0 truncate">
          <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Coffee className="w-3.5 h-3.5 text-[#FF8A00]" />
          </div>
          <span className="font-semibold text-xs sm:text-sm truncate tracking-tight">
            {guiState.title || 'Java GUI Application'}
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/10 text-white/90">
            {guiState.appletMode ? 'Applet' : 'Swing / AWT'}
          </span>
        </div>

        {/* Right: Theme Switcher & Window Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'classic' ? 'modern' : 'classic')}
            className="p-1 rounded text-[10px] font-mono hover:bg-white/10 text-white/80 transition-colors hidden xs:flex items-center gap-1"
            title={`Switch to ${theme === 'classic' ? 'Modern Dark' : 'Classic Swing'} theme`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden md:inline">{theme === 'classic' ? 'Classic' : 'Modern'}</span>
          </button>

          {/* Reset GUI Button */}
          <button
            onClick={handleReset}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset GUI State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title={isMaximized ? 'Restore Window' : 'Maximize Window'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Window */}
          {onClose && (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1 rounded text-white/80 hover:text-white hover:bg-rose-500 transition-colors"
              title="Close GUI Window"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Window Container Body */}
      <div
        className={`flex-1 relative overflow-auto p-4 ${
          theme === 'classic' ? 'bg-[#ECE9D8] text-slate-900' : 'bg-[#0B1120] text-slate-100'
        }`}
        style={{
          minHeight: 280,
        }}
      >
        {/* 1. Optional 2D Graphics Canvas Layer (for paint(Graphics g)) */}
        {hasGraphics && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        )}

        {/* 2. Interactive GUI Components Container */}
        {components.length > 0 ? (
          <div
            className={`relative z-10 w-full h-full ${
              guiState.layout === 'grid'
                ? 'grid gap-3 items-center'
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
                  }
                : undefined
            }
          >
            {components.map((comp) => {
              // Calculate custom inline positioning if layout is null (absolute)
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

              // Render JButton / Button
              if (comp.type === 'button') {
                return (
                  <button
                    key={comp.id}
                    onClick={() => handleBtnClick(comp)}
                    style={style}
                    className={`px-4 py-2 text-xs sm:text-sm font-medium transition-all active:scale-95 shadow-sm rounded-lg flex items-center justify-center cursor-pointer ${
                      theme === 'classic'
                        ? 'bg-gradient-to-b from-[#FFFFFF] to-[#ECE9D8] hover:from-[#ECE9D8] hover:to-[#DCD7C8] text-slate-900 border border-[#7F9DB9] active:shadow-inner'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold border border-emerald-400/30 shadow-emerald-500/20'
                    }`}
                  >
                    {comp.text}
                  </button>
                );
              }

              // Render JLabel / Label
              if (comp.type === 'label') {
                return (
                  <div
                    key={comp.id}
                    style={style}
                    className={`text-xs sm:text-sm font-semibold select-text flex items-center ${
                      theme === 'classic' ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    {comp.text}
                  </div>
                );
              }

              // Render JTextField / TextField
              if (comp.type === 'textfield' || comp.type === 'passwordfield') {
                return (
                  <input
                    key={comp.id}
                    type={comp.type === 'passwordfield' ? 'password' : 'text'}
                    value={comp.text}
                    onChange={(e) => handleInputChange(comp.id, e.target.value)}
                    style={style}
                    placeholder="Enter text..."
                    className={`px-3 py-1.5 text-xs sm:text-sm font-mono rounded-lg outline-none transition-all ${
                      theme === 'classic'
                        ? 'bg-white text-slate-900 border border-[#7F9DB9] focus:border-[#0055EA] focus:ring-1 focus:ring-[#0055EA]'
                        : 'bg-slate-900/80 text-white border border-white/20 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                    } ${!style.width ? 'min-w-[120px] max-w-[200px]' : ''}`}
                  />
                );
              }

              // Render JTextArea
              if (comp.type === 'textarea') {
                return (
                  <textarea
                    key={comp.id}
                    value={comp.text}
                    onChange={(e) => handleInputChange(comp.id, e.target.value)}
                    style={style}
                    placeholder="Text Area..."
                    rows={3}
                    className={`p-2.5 text-xs sm:text-sm font-mono rounded-lg outline-none resize-none w-full ${
                      theme === 'classic'
                        ? 'bg-white text-slate-900 border border-[#7F9DB9]'
                        : 'bg-slate-900/80 text-white border border-white/20'
                    }`}
                  />
                );
              }

              // Render JCheckBox
              if (comp.type === 'checkbox') {
                return (
                  <label
                    key={comp.id}
                    style={style}
                    className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={comp.checked}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span>{comp.text}</span>
                  </label>
                );
              }

              // Render JRadioButton
              if (comp.type === 'radio') {
                return (
                  <label
                    key={comp.id}
                    style={style}
                    className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="java_gui_radio_group"
                      defaultChecked={comp.checked}
                      className="text-emerald-500 focus:ring-0"
                    />
                    <span>{comp.text}</span>
                  </label>
                );
              }

              // Render JComboBox / Choice
              if (comp.type === 'combobox') {
                return (
                  <select
                    key={comp.id}
                    style={style}
                    className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg outline-none cursor-pointer ${
                      theme === 'classic'
                        ? 'bg-white text-slate-900 border border-[#7F9DB9]'
                        : 'bg-slate-900 text-white border border-white/20'
                    }`}
                  >
                    {(comp.options || ['Item 1', 'Item 2', 'Item 3']).map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                );
              }

              return null;
            })}
          </div>
        ) : !hasGraphics ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Coffee className="w-10 h-10 text-amber-500 mb-2 opacity-80" />
            <div className="text-sm font-semibold text-slate-200">Empty Java Frame</div>
            <div className="text-xs text-slate-400 mt-1 max-w-sm">
              Frame was created with <code className="font-mono text-emerald-400">new JFrame()</code>, but no components have been added via <code className="font-mono text-emerald-400">add()</code> yet.
            </div>
          </div>
        ) : null}

        {/* 3. Interactive JOptionPane Dialog Popup */}
        {activeDialog && (
          <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div
              className={`w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border ${
                theme === 'classic'
                  ? 'bg-[#ECE9D8] border-[#0055EA] text-slate-900'
                  : 'bg-[#1E293B] border-white/20 text-white'
              }`}
            >
              {/* Dialog Title */}
              <div
                className={`h-7 px-3 flex items-center justify-between text-xs font-bold ${
                  theme === 'classic'
                    ? 'bg-[#0055EA] text-white'
                    : 'bg-slate-800 text-slate-200 border-b border-white/10'
                }`}
              >
                <span>{activeDialog.title || 'Message'}</span>
                <button
                  onClick={() => setActiveDialog(null)}
                  className="hover:opacity-75 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dialog Body */}
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium leading-relaxed select-text">
                    {activeDialog.message}
                  </p>

                  {/* Input field if showInputDialog */}
                  {activeDialog.type === 'input' && (
                    <input
                      type="text"
                      value={dialogInput}
                      onChange={(e) => setDialogInput(e.target.value)}
                      placeholder="Type response..."
                      className={`mt-3 w-full px-3 py-1.5 text-xs font-mono rounded-lg outline-none ${
                        theme === 'classic'
                          ? 'bg-white text-slate-900 border border-[#7F9DB9]'
                          : 'bg-slate-900 text-white border border-white/20'
                      }`}
                      autoFocus
                    />
                  )}
                </div>
              </div>

              {/* Dialog Buttons */}
              <div className="px-4 py-2.5 bg-black/10 flex justify-end gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onLogEvent) {
                      onLogEvent(`[JOptionPane]: User clicked OK (Response: "${dialogInput || 'OK'}")`);
                    }
                    setActiveDialog(null);
                    setDialogInput('');
                  }}
                  className="px-4 py-1 rounded text-xs font-bold bg-[#0055EA] hover:bg-[#357AE8] text-white transition-all shadow"
                >
                  OK
                </button>
                {activeDialog.type === 'input' && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveDialog(null);
                      setDialogInput('');
                    }}
                    className="px-3 py-1 rounded text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar / Event Telemetry */}
      <div
        className={`h-7 sm:h-8 px-3 flex items-center justify-between text-[10px] sm:text-[11px] font-mono shrink-0 border-t ${
          theme === 'classic'
            ? 'bg-[#E0DFD8] border-[#7F9DB9] text-slate-600'
            : 'bg-[#0B0F19] border-white/10 text-slate-400'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate">{lastEvent}</span>
        </div>

        <div className="text-slate-500 shrink-0 hidden sm:block">
          {guiState.layout.toUpperCase()} • {guiState.width}x{guiState.height}
        </div>
      </div>
    </div>
  );
};
