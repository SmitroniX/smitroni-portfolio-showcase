import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Copy,
  Check,
  X,
  FolderGit2,
  FileDown,
  Terminal,
  Play,
  Shield,
  Layers,
  Briefcase,
  Cpu,
  Command,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import {
  PERSONAL_INFO,
  PROJECTS,
  SKILL_DOMAINS,
  EXPERIENCES,
  CERTIFICATIONS,
} from '../data/portfolioData';
import { sounds } from '../utils/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCompiler?: () => void;
  onOpenDarkSide?: () => void;
}

interface ShellEntry {
  cmd?: string;
  lines: string[];
  accent?: 'default' | 'orange' | 'cyan' | 'emerald' | 'error';
}

const NEOFETCH_LINES = [
  '   _____ __  __ _____ _______ ____   ____  _   _ _______   __',
  '  / ____|  \\/  |_   _|__   __|  _ \\ / __ \\| \\ | |_   _\\ \\ / /',
  '  \\___ \\| |\\/| | | |    | |  | |_) | |  | |  \\| | | |  \\ V / ',
  '  ____) | |  | |_| |_   | |  |  _ <| |__| | |\\  |_| |_ / . \\ ',
  ' |_____/|_|  |_|_____|  |_|  |_| \\_\\\\____/|_| \\_|_____/_/ \\_\\',
  '',
  '  user     : Asmit Jogdand (@SmitroniX)',
  '  school   : RAIT, Mumbai University (B.E. Comp Engg • 8.65 CGPA)',
  '  core     : Java 21 LTS, C/C++, TypeScript, Python, React 19, Node.js',
  '  systems  : ShadowLauncher (138 FPS), SmiTriX PWA, DYPU Connect, Cloud IDE',
  '  security : Captain @ sudo Unknown (HTB Team #331386)',
  '  status   : Open for SWE Internships & Systems Contracts',
];

const QUICK_SHELL_CMDS = ['help', 'neofetch', 'skills', 'projects', 'certs', 'compiler'];

export const TerminalModal: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenCompiler,
  onOpenDarkSide,
}) => {
  const [mode, setMode] = useState<'palette' | 'shell'>('palette');
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  // Interactive Shell State
  const [shellInput, setShellInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [entries, setEntries] = useState<ShellEntry[]>([
    {
      lines: [
        'SmitroniX Developer Shell v2.6 (bash-compat)',
        'Type "help" for available commands, or try "neofetch", "skills", "projects".',
      ],
      accent: 'cyan',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const shellInputRef = useRef<HTMLInputElement>(null);
  const shellEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => {
        if (mode === 'palette') inputRef.current?.focus();
        else shellInputRef.current?.focus();
      }, 60);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    shellEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const handleCopyEmail = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
      onClose();
    }, 900);
  };

  const allActions = useMemo(
    () => [
      {
        title: 'Switch to Interactive Developer Shell',
        desc: 'Run neofetch, whoami, skills, projects, certs right in browser',
        icon: <Terminal className="w-4 h-4 text-[#FF8A00]" />,
        action: () => {
          sounds.playClick();
          setMode('shell');
        },
      },
      {
        title: 'Launch Code With SmitroniX (Cloud IDE)',
        desc: 'Multi-language cloud runner with Java Swing/AWT desktop',
        icon: <Play className="w-4 h-4 text-emerald-400" />,
        action: () => {
          sounds.playWarp();
          onClose();
          if (onOpenCompiler) onOpenCompiler();
        },
      },
      {
        title: 'Jump to Featured Projects',
        desc: 'ShadowLauncher, SmiTriX, DYPU Connect & Shadow_API',
        icon: <FolderGit2 className="w-4 h-4 text-[#00F0FF]" />,
        action: () => {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          onClose();
        },
      },
      {
        title: 'Jump to Skills & 6-Axis Radar',
        desc: 'Java 21, C/C++, React 19, TypeScript, Spring Boot, Docker, AWS',
        icon: <Cpu className="w-4 h-4 text-[#FF8A00]" />,
        action: () => {
          document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
          onClose();
        },
      },
      {
        title: 'Jump to DevOps & Cloud Architecture',
        desc: 'CI/CD, multi-stage Docker builds, AWS EC2 & observability',
        icon: <Layers className="w-4 h-4 text-amber-400" />,
        action: () => {
          document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
          onClose();
        },
      },
      {
        title: 'Jump to Experience & Certifications',
        desc: 'Naviotech Intern, HTB sudo Unknown, Hypixel, RAIT (8.65 CGPA)',
        icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
        action: () => {
          document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
          onClose();
        },
      },
      {
        title: 'Download Official Resume (PDF)',
        desc: 'Verified B.E. Computer Engineering resume',
        icon: <FileDown className="w-4 h-4 text-white" />,
        action: () => {
          window.open(PERSONAL_INFO.resumeUrl, '_blank');
          onClose();
        },
      },
      {
        title: 'Copy Email Address',
        desc: PERSONAL_INFO.email,
        icon: copied ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Copy className="w-4 h-4 text-slate-400" />
        ),
        action: handleCopyEmail,
      },
      {
        title: 'Open GitHub Profile',
        desc: 'github.com/SmitroniX (52+ public repos)',
        icon: <GithubIcon className="w-4 h-4 text-slate-200" />,
        action: () => {
          window.open(PERSONAL_INFO.socials.github, '_blank');
          onClose();
        },
      },
      {
        title: 'Open LinkedIn Profile',
        desc: 'linkedin.com/in/asmit-jogdand',
        icon: <LinkedinIcon className="w-4 h-4 text-[#00F0FF]" />,
        action: () => {
          window.open(PERSONAL_INFO.socials.linkedin, '_blank');
          onClose();
        },
      },
      {
        title: '[Classified] HTB Team sudo Unknown (#331386)',
        desc: 'Open secret offensive security & CTF research dossier',
        icon: <Shield className="w-4 h-4 text-rose-400" />,
        action: () => {
          onClose();
          if (onOpenDarkSide) onOpenDarkSide();
        },
      },
    ],
    [copied, onClose, onOpenCompiler, onOpenDarkSide]
  );

  const filtered = useMemo(
    () =>
      allActions.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase())
      ),
    [allActions, query]
  );

  useEffect(() => {
    setSelectedIdx(0);
  }, [query, mode]);

  const handlePaletteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev - 1 + Math.max(1, filtered.length)) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      e.preventDefault();
      filtered[selectedIdx].action();
    }
  };

  const executeShellCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    sounds.playKeyTick();

    setCmdHistory((prev) => [cmd, ...prev.slice(0, 29)]);
    setHistoryPointer(-1);
    const lower = cmd.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setEntries([]);
      return;
    }

    if (lower === 'help' || lower === '?') {
      setEntries((prev) => [
        ...prev,
        {
          cmd,
          accent: 'cyan',
          lines: [
            'Available commands:',
            '  neofetch        System & developer specs',
            '  whoami          Short engineering bio',
            '  skills          List all 6 technical skill domains',
            '  projects        List flagship engineering projects',
            '  experience      Career & internship timeline',
            '  certs           Verified credentials & IDs',
            '  education       Academic standing @ RAIT Mumbai',
            '  socials         GitHub, LinkedIn, LeetCode, HTB links',
            '  compiler        Launch built-in 9-language Cloud IDE',
            '  darkside        Unlock classified CTF research modal',
            '  clear           Clear terminal buffer',
          ],
        },
      ]);
      return;
    }

    if (lower === 'neofetch') {
      setEntries((prev) => [...prev, { cmd, accent: 'orange', lines: NEOFETCH_LINES }]);
      return;
    }

    if (lower === 'whoami' || lower === 'cat resume.txt') {
      setEntries((prev) => [
        ...prev,
        {
          cmd,
          accent: 'emerald',
          lines: [
            `${PERSONAL_INFO.name} (@${PERSONAL_INFO.handle})`,
            PERSONAL_INFO.role,
            PERSONAL_INFO.shortBio,
            `Email: ${PERSONAL_INFO.email} | Location: ${PERSONAL_INFO.location}`,
          ],
        },
      ]);
      return;
    }

    if (lower === 'skills' || lower === 'ls skills') {
      const lines = SKILL_DOMAINS.map(
        (d) => `[${d.shortTitle.padEnd(10)}] (${d.score}%) → ${d.items.map((i) => i.name).join(', ')}`
      );
      setEntries((prev) => [...prev, { cmd, accent: 'cyan', lines }]);
      return;
    }

    if (lower === 'projects' || lower === 'ls' || lower === 'ls projects') {
      const lines = PROJECTS.map(
        (p) => `• ${p.title} [${p.category}] — ${p.stats?.value ?? p.status}`
      );
      setEntries((prev) => [...prev, { cmd, accent: 'orange', lines }]);
      return;
    }

    if (lower === 'experience') {
      const lines = EXPERIENCES.map(
        (e) => `• ${e.role} @ ${e.company} (${e.period})`
      );
      setEntries((prev) => [...prev, { cmd, accent: 'default', lines }]);
      return;
    }

    if (lower === 'certs' || lower === 'certifications') {
      const lines = CERTIFICATIONS.map(
        (c) => `✓ ${c.title} — ${c.issuer} (${c.year})${c.credentialId ? ` [ID: ${c.credentialId}]` : ''}`
      );
      setEntries((prev) => [...prev, { cmd, accent: 'emerald', lines }]);
      return;
    }

    if (lower === 'education') {
      setEntries((prev) => [
        ...prev,
        {
          cmd,
          accent: 'cyan',
          lines: [
            `${PERSONAL_INFO.education.degree}`,
            `${PERSONAL_INFO.education.institution}`,
            `CGPA: ${PERSONAL_INFO.education.cgpa} (Sem 1: ${PERSONAL_INFO.education.sem1} | Sem 2: ${PERSONAL_INFO.education.sem2})`,
            `HSC: ${PERSONAL_INFO.education.hsc} | ICSE: ${PERSONAL_INFO.education.icse}`,
          ],
        },
      ]);
      return;
    }

    if (lower === 'socials') {
      setEntries((prev) => [
        ...prev,
        {
          cmd,
          accent: 'cyan',
          lines: [
            `GitHub     : ${PERSONAL_INFO.socials.github}`,
            `LinkedIn   : ${PERSONAL_INFO.socials.linkedin}`,
            `LeetCode   : ${PERSONAL_INFO.socials.leetcode}`,
            `HackerRank : ${PERSONAL_INFO.socials.hackerrank}`,
            `HackTheBox : ${PERSONAL_INFO.socials.hackthebox}`,
          ],
        },
      ]);
      return;
    }

    if (lower === 'compiler' || lower === 'ide') {
      onClose();
      if (onOpenCompiler) onOpenCompiler();
      return;
    }

    if (lower === 'darkside' || lower === 'sudo su' || lower === 'blackhat') {
      onClose();
      if (onOpenDarkSide) onOpenDarkSide();
      return;
    }

    setEntries((prev) => [
      ...prev,
      {
        cmd,
        accent: 'error',
        lines: [`bash: ${cmd}: command not found. Type "help" to list supported commands.`],
      },
    ]);
  };

  const handleShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeShellCommand(shellInput);
    setShellInput('');
  };

  const handleShellKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && cmdHistory.length > 0) {
      e.preventDefault();
      const nextPtr = Math.min(historyPointer + 1, cmdHistory.length - 1);
      setHistoryPointer(nextPtr);
      setShellInput(cmdHistory[nextPtr]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer <= 0) {
        setHistoryPointer(-1);
        setShellInput('');
      } else {
        const nextPtr = historyPointer - 1;
        setHistoryPointer(nextPtr);
        setShellInput(cmdHistory[nextPtr]);
      }
    }
  };

  const accentTextMap = {
    default: 'text-slate-300',
    orange: 'text-[#FFB84D]',
    cyan: 'text-[#67E8F9]',
    emerald: 'text-emerald-300',
    error: 'text-rose-400',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Developer Command Palette and Shell"
        >
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative w-full max-w-2xl rounded-2xl bg-[#080C15] border border-white/[0.14] shadow-2xl shadow-black/95 overflow-hidden z-10"
          >
            {/* Top Mode Switcher Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[#05080F]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMode('palette')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    mode === 'palette'
                      ? 'bg-[#FF6B00]/18 border border-[#FF6B00]/40 text-[#FF9E2C] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Command className="w-3.5 h-3.5" />
                  <span>Command Palette</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('shell')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    mode === 'shell'
                      ? 'bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Interactive Shell</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {mode === 'palette' ? (
              <>
                {/* Search Input */}
                <div className="flex items-center px-4 py-3.5 border-b border-white/[0.07] bg-[#070B13]">
                  <Search className="w-4 h-4 text-[#FF8A00] shrink-0 mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handlePaletteKeyDown}
                    placeholder="Search sections, actions, Cloud IDE, socials..."
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>

                {/* Action Results */}
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                  {filtered.length === 0 ? (
                    <div className="p-6 text-center text-xs font-mono text-slate-500">
                      No matching actions. Switch to Interactive Shell to run CLI commands.
                    </div>
                  ) : (
                    filtered.map((item, i) => {
                      const active = i === selectedIdx;
                      return (
                        <button
                          key={item.title}
                          type="button"
                          onMouseEnter={() => setSelectedIdx(i)}
                          onClick={item.action}
                          className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                            active
                              ? 'bg-white/[0.08] border border-[#FF8A00]/30'
                              : 'border border-transparent hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-[#05080F] border border-white/[0.07] shrink-0">
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div
                                className={`text-xs font-semibold truncate ${
                                  active ? 'text-[#FF9E2C]' : 'text-white'
                                }`}
                              >
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ArrowRight
                            className={`w-3.5 h-3.5 shrink-0 ml-2 transition-transform ${
                              active ? 'text-[#FF8A00] translate-x-0.5' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="px-4 py-2.5 border-t border-white/[0.07] bg-[#05080F] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>↑↓ Navigate • Enter Run</span>
                  <span>ESC Close</span>
                </div>
              </>
            ) : (
              /* Interactive Developer Bash Shell */
              <div className="bg-[#04070D] font-mono text-xs">
                {/* Clickable Quick Command Chips */}
                <div className="px-4 py-2 border-b border-white/[0.06] flex flex-wrap items-center gap-1.5 bg-[#070B13]">
                  <span className="text-[10px] text-slate-500 mr-1">QUICK:</span>
                  {QUICK_SHELL_CMDS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => executeShellCommand(c)}
                      className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-[#FF6B00]/20 border border-white/[0.07] hover:border-[#FF6B00]/40 text-[10px] text-slate-300 hover:text-[#FF9E2C] transition-colors cursor-pointer"
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Output Buffer */}
                <div className="h-72 overflow-y-auto p-4 space-y-3 leading-relaxed">
                  {entries.map((entry, idx) => (
                    <div key={idx} className="space-y-1">
                      {entry.cmd && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#FF8A00] font-bold">smitronix@dev</span>
                          <span className="text-slate-500">:~$</span>
                          <span className="text-white">{entry.cmd}</span>
                        </div>
                      )}
                      <pre
                        className={`whitespace-pre-wrap text-[11px] font-mono ${
                          accentTextMap[entry.accent ?? 'default']
                        }`}
                      >
                        {entry.lines.join('\n')}
                      </pre>
                    </div>
                  ))}
                  <div ref={shellEndRef} />
                </div>

                {/* Live Prompt Input */}
                <form
                  onSubmit={handleShellSubmit}
                  className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.08] bg-[#060910]"
                >
                  <span className="text-[#FF8A00] font-bold shrink-0">smitronix@dev:~$</span>
                  <input
                    ref={shellInputRef}
                    type="text"
                    value={shellInput}
                    onChange={(e) => setShellInput(e.target.value)}
                    onKeyDown={handleShellKeyDown}
                    placeholder="type 'help' or 'neofetch'..."
                    aria-label="Shell command input"
                    className="w-full bg-transparent text-white placeholder:text-slate-600 focus:outline-none text-xs"
                  />
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
