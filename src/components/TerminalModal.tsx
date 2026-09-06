import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, Maximize2, ShieldAlert } from 'lucide-react';
import { sounds } from '../utils/sound';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';
import confetti from 'canvas-confetti';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerMatrix: () => void;
}

interface CommandLog {
  id: number;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  onTriggerMatrix,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 1,
      type: 'output',
      text: 'SmitroniX Interactive Shell [Version 4.2.0-rc1]\n(c) 2026 Asmit Jogdand. All systems operational.\nType "help" for a list of available commands.',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    sounds.playKeyTick();

    // Add to logs
    const newLogs: CommandLog[] = [
      ...logs,
      { id: Date.now(), type: 'input', text: `smitronix@nexus:~$ ${cmdText}` },
    ];

    // Add to history
    setHistory((prev) => [...prev, cmdText]);
    setHistoryIdx(-1);

    switch (trimmed) {
      case 'help':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `AVAILABLE COMMANDS:\n` +
            `  • whoami / bio    : Display Asmit's background and core credentials\n` +
            `  • skills          : List core tech stack & engineering proficiency\n` +
            `  • projects        : Display flagship repositories and live platforms\n` +
            `  • experience      : Show work history (Naviotech, RAIT, Hypixel)\n` +
            `  • matrix          : Engage full-screen SmiTriX code rain simulation\n` +
            `  • contact         : Print direct email and transmission endpoints\n` +
            `  • sudo hire       : [CONFIDENTIAL] Trigger fast-track hire protocol\n` +
            `  • clear           : Clear terminal buffer\n` +
            `  • exit            : Close terminal window`,
        });
        break;

      case 'whoami':
      case 'bio':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `NAME     : Asmit Jogdand (SmitroniX)\n` +
            `ROLE     : Full Stack & Cloud Systems Engineer\n` +
            `COLLEGE  : B.Tech in Computer Engineering @ RAIT (DYPU), 2025-2029\n` +
            `LOCATION : Mumbai, Maharashtra, India\n` +
            `BIO      : Cloud Computing student. Python wizard. React & Node.js aficionado.\n` +
            `PHILOSOPHY : "Code with purpose. Learn without limits. Build what matters."`,
        });
        break;

      case 'skills':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `SKILLS MATRIX:\n` +
            `  [FRONTEND] React.js (95%), TypeScript (90%), Tailwind CSS (95%), Three.js (85%)\n` +
            `  [BACKEND]  Node.js & Express (92%), Python (95%), RESTful APIs (94%), WebSockets\n` +
            `  [CLOUD]    AWS (EC2/S3/Lambda), Firebase, Docker, Linux, CI/CD, Serverless\n` +
            `  [DATABASE] MongoDB, MySQL, Redis Caching, System Architecture\n` +
            `  [SYSTEMS]  Discord.js v14, Bukkit/Spigot Plugin Engineering, Automation`,
        });
        break;

      case 'projects':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: PROJECTS.map((p) => `• ${p.title.padEnd(16)} [${p.category.padEnd(12)}] : ${p.tagline}`).join('\n'),
        });
        break;

      case 'experience':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `CAREER TIMELINE:\n` +
            `  • 2026-Present : Web Development Intern @ Naviotech Solution Pvt Ltd\n` +
            `  • 2025-Present : Operations & Marketing @ Social Wing RAIT\n` +
            `  • 2024-2025    : Freelance Software Engineer (Discord Bots, Automation)\n` +
            `  • 2023-2024    : Plugin Developer @ Hypixel Inc Ecosystem\n` +
            `  • 2023         : AI & Software Testing Intern`,
        });
        break;

      case 'matrix':
        sounds.playWarp();
        onTriggerMatrix();
        newLogs.push({
          id: Date.now() + 1,
          type: 'success',
          text: 'INITIALIZING SMITRIX STREAM... MATRIX PROTOCOL ACTIVE.',
        });
        break;

      case 'sudo hire':
      case 'sudo hire smitronix':
      case 'hire':
        sounds.playSuccess();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6B00', '#00F0FF', '#00FF9D', '#FFD700'],
        });
        newLogs.push({
          id: Date.now() + 1,
          type: 'success',
          text: `⚡ ACCESS GRANTED: EXCELLENT DECISION!\n` +
            `Email transmission initialized for: jogdandasmit@gmail.com\n` +
            `Connect on LinkedIn: https://www.linkedin.com/in/asmit-jogdand`,
        });
        break;

      case 'contact':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `TRANSMISSION CHANNELS:\n` +
            `  • EMAIL    : jogdandasmit@gmail.com\n` +
            `  • LINKEDIN : https://www.linkedin.com/in/asmit-jogdand\n` +
            `  • GITHUB   : https://github.com/SmitroniX\n` +
            `  • LEETCODE : https://leetcode.com/u/SmitroniX/\n` +
            `  • WEBSITE  : https://smitronix.dev`,
        });
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        sounds.playClick();
        onClose();
        return;

      default:
        newLogs.push({
          id: Date.now() + 1,
          type: 'error',
          text: `command not found: "${trimmed}". Type "help" for valid commands.`,
        });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInputVal('');
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#06090E] border border-orange-500/50 rounded-2xl shadow-[0_0_50px_rgba(255,107,0,0.25)] flex flex-col h-[520px] max-h-[85vh] overflow-hidden">
        
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 font-mono text-xs text-slate-300 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#FF6B00]" />
              smitronix@nexus: ~ (zsh)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div
          className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto space-y-3 bg-[#05070B]/90 select-text"
          onClick={() => inputRef.current?.focus()}
        >
          {logs.map((log) => (
            <div
              key={log.id}
              className={`whitespace-pre-wrap leading-relaxed ${
                log.type === 'input'
                  ? 'text-[#00F0FF] font-semibold'
                  : log.type === 'error'
                  ? 'text-rose-400'
                  : log.type === 'success'
                  ? 'text-[#00FF9D] font-bold'
                  : 'text-slate-300'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Field */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
          <span className="font-mono text-xs sm:text-sm text-[#FF6B00] font-bold shrink-0">
            smitronix@nexus:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs sm:text-sm text-white focus:ring-0"
            placeholder="Type 'help', 'bio', 'skills', 'projects', 'sudo hire'..."
            autoFocus
          />
        </div>

      </div>
    </div>
  );
};
