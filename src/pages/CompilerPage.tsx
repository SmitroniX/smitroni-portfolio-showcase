import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Clock,
  Cpu,
  ArrowLeft,
  Trash2,
  Sparkles,
  ChevronDown,
  FileCode2,
  Sliders,
  CornerDownLeft,
  Send,
  Code2,
  Printer
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { DEFAULT_STARTER_CODES } from '../data/compilerSamples';
import { executeInteractiveSession } from '../utils/codeRunner';
import { LabReportModal } from '../components/LabReportModal';
import confetti from 'canvas-confetti';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-bash';
import {
  JavaIcon,
  PythonIcon,
  CppIcon,
  CIcon,
  JavaScriptIcon,
  TypeScriptIcon,
  RustIcon,
  GoIcon,
  BashIcon
} from '../components/BrandIcons';

interface CompilerPageProps {
  onBackToHome: () => void;
}

interface LanguageOption {
  id: string;
  name: string;
  shortName: string;
  judge0Id: number;
  icon: React.ReactNode;
  extension: string;
  version: string;
}

const COMPILER_LANGUAGES: LanguageOption[] = [
  { id: 'java', name: 'Java (JDK 17)', shortName: 'Java', judge0Id: 91, icon: <JavaIcon className="w-4 h-4 shrink-0" />, extension: 'java', version: 'JDK 17' },
  { id: 'python', name: 'Python 3', shortName: 'Python', judge0Id: 100, icon: <PythonIcon className="w-4 h-4 shrink-0" />, extension: 'py', version: '3.12' },
  { id: 'cpp', name: 'C++ (GCC 14)', shortName: 'C++', judge0Id: 105, icon: <CppIcon className="w-4 h-4 shrink-0" />, extension: 'cpp', version: 'GCC 14.1' },
  { id: 'c', name: 'C (GCC 14)', shortName: 'C', judge0Id: 103, icon: <CIcon className="w-4 h-4 shrink-0" />, extension: 'c', version: 'GCC 14.1' },
  { id: 'javascript', name: 'JavaScript', shortName: 'JS', judge0Id: 97, icon: <JavaScriptIcon className="w-4 h-4 shrink-0" />, extension: 'js', version: 'Node 20' },
  { id: 'typescript', name: 'TypeScript', shortName: 'TS', judge0Id: 101, icon: <TypeScriptIcon className="w-4 h-4 shrink-0" />, extension: 'ts', version: 'v5.6' },
  { id: 'rust', name: 'Rust', shortName: 'Rust', judge0Id: 108, icon: <RustIcon className="w-4 h-4 shrink-0" />, extension: 'rs', version: '1.85' },
  { id: 'go', name: 'Go', shortName: 'Go', judge0Id: 107, icon: <GoIcon className="w-4 h-4 shrink-0" />, extension: 'go', version: '1.23' },
  { id: 'bash', name: 'Bash', shortName: 'Bash', judge0Id: 46, icon: <BashIcon className="w-4 h-4 shrink-0" />, extension: 'sh', version: 'v5.0' },
];

export const CompilerPage: React.FC<CompilerPageProps> = ({ onBackToHome }) => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(COMPILER_LANGUAGES[0]);
  
  // Default starter code for current language
  const [code, setCode] = useState<string>(DEFAULT_STARTER_CODES[COMPILER_LANGUAGES[0].id] || '');
  const [stdin, setStdin] = useState<string>('');
  
  // Unified Real-Time Terminal Stream State (VS Code Style)
  const [terminalLines, setTerminalLines] = useState<Array<{ id: string; type: 'stdout' | 'stderr' | 'stdin' | 'system'; text: string }>>([
    {
      id: 'welcome-1',
      type: 'system',
      text: 'SmitroniX Cloud Terminal [v2.4.0-universal]',
    },
    {
      id: 'welcome-2',
      type: 'system',
      text: 'Type "run" or press ⌘+Enter to execute.\nInteractive inputs are typed directly inside this terminal.',
    },
  ]);
  const [terminalInputValue, setTerminalInputValue] = useState<string>('');
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [isWaitingForInput, setIsWaitingForInput] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionStats, setExecutionStats] = useState<{ time?: string; memory?: string; status?: string } | null>(null);
  
  // UI states
  const [copied, setCopied] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'output'>('editor');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showStdinDrawer, setShowStdinDrawer] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Formatted terminal execution output for lab report printing
  const terminalOutputText = useMemo(() => {
    return terminalLines
      .filter((l) => l.type === 'stdout' || l.type === 'stderr' || l.type === 'stdin')
      .map((l) => l.text)
      .join('\n');
  }, [terminalLines]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const inputResolverRef = useRef<((val: string) => void) | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom on any new line, prompt, or user keystroke
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLines, activePrompt, terminalInputValue]);

  // Sync scroll between transparent textarea, highlighted pre underlay, and gutter
  const handleEditorScroll = () => {
    if (textareaRef.current) {
      const top = textareaRef.current.scrollTop;
      const left = textareaRef.current.scrollLeft;
      if (preRef.current) {
        preRef.current.scrollTop = top;
        preRef.current.scrollLeft = left;
      }
      if (gutterRef.current) {
        gutterRef.current.scrollTop = top;
      }
    }
  };

  // Sync scroll on code or language switch
  useEffect(() => {
    if (textareaRef.current) {
      const top = textareaRef.current.scrollTop;
      const left = textareaRef.current.scrollLeft;
      if (preRef.current) {
        preRef.current.scrollTop = top;
        preRef.current.scrollLeft = left;
      }
      if (gutterRef.current) {
        gutterRef.current.scrollTop = top;
      }
    }
  }, [code, selectedLang]);

  // Retrieve Prism language grammar
  const getPrismGrammar = (langId: string) => {
    switch (langId) {
      case 'java':
        return Prism.languages.java;
      case 'python':
        return Prism.languages.python;
      case 'cpp':
        return Prism.languages.cpp;
      case 'c':
        return Prism.languages.c;
      case 'javascript':
        return Prism.languages.javascript;
      case 'typescript':
        return Prism.languages.typescript || Prism.languages.javascript;
      case 'rust':
        return Prism.languages.rust;
      case 'go':
        return Prism.languages.go;
      case 'bash':
        return Prism.languages.bash;
      default:
        return Prism.languages.clike;
    }
  };

  // Colorized syntax highlighting HTML according to active language
  const highlightedCodeHtml = useMemo(() => {
    try {
      const grammar = getPrismGrammar(selectedLang.id);
      if (grammar) {
        return Prism.highlight(code, grammar, selectedLang.id);
      }
    } catch {
      // Fallback cleanly to escaped plaintext if grammar throws
    }
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }, [code, selectedLang.id]);

  // Check if code expects user input
  const detectInputRequirement = (source: string) => {
    return /(Scanner|cin\s*>>|input\s*\(|getline\s*\(|scanf\s*\(|readLine\s*\(|Console\.ReadLine)/.test(source);
  };

  // Language switch handler - loads default starter template
  const selectLanguage = (lang: LanguageOption) => {
    sounds.playClick();
    setSelectedLang(lang);
    setCode(DEFAULT_STARTER_CODES[lang.id] || '');
    setStdin('');
    setExecutionStats(null);
    setIsWaitingForInput(false);
    setActivePrompt('');
    inputResolverRef.current = null;
    setIsLangDropdownOpen(false);
    setTerminalLines([
      {
        id: `lang-${Date.now()}`,
        type: 'system',
        text: `Switched environment to ${lang.name} [Default Template].\nPress "Run" or ⌘+Enter to execute.`,
      },
    ]);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    sounds.playClick();
    setCode(DEFAULT_STARTER_CODES[selectedLang.id] || '');
    setStdin('');
    setExecutionStats(null);
    setIsWaitingForInput(false);
    setActivePrompt('');
    inputResolverRef.current = null;
    setTerminalLines([
      {
        id: `reset-${Date.now()}`,
        type: 'system',
        text: `Reset editor to ${selectedLang.name} default template.`,
      },
    ]);
  };

  const handleClearOutput = () => {
    sounds.playClick();
    setTerminalLines([]);
    setExecutionStats(null);
    setIsWaitingForInput(false);
    setActivePrompt('');
    inputResolverRef.current = null;
  };

  // Quick suggestion chips based on code context
  const quickChips = useMemo(() => {
    if (code.includes('String') || code.includes('Palindrome') || code.includes('nextLine')) {
      return ['madam', 'racecar', 'hello', 'radar'];
    }
    return ['5', '10', '15', '25'];
  }, [code]);

  // Core execution engine with unified real-time interactive terminal (VS Code Style)
  const executeCode = async () => {
    if (isRunning && !isWaitingForInput) return;
    sounds.playWarp();
    setIsRunning(true);
    setActiveMobileTab('output');
    setExecutionStats(null);
    setIsWaitingForInput(false);
    setActivePrompt('');

    // EVERY RUN FIRST CLEAR THE OUTPUT AREA
    const startTimestamp = Date.now();
    const fileName = selectedLang.extension === 'java' ? 'Main.java' : `main.${selectedLang.extension}`;
    setTerminalLines([
      {
        id: `cmd-${startTimestamp}`,
        type: 'system',
        text: `smitronix@cloud:~$ run ${fileName}`,
      },
    ]);

    setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 60);

    try {
      const result = await executeInteractiveSession(
        selectedLang.id,
        selectedLang.judge0Id,
        code,
        {
          onStdout: (text: string) => {
            setTerminalLines((prev) => [
              ...prev,
              {
                id: `stdout-${Date.now()}-${Math.random()}`,
                type: 'stdout',
                text,
              },
            ]);
          },
          onStderr: (text: string) => {
            setTerminalLines((prev) => [
              ...prev,
              {
                id: `stderr-${Date.now()}-${Math.random()}`,
                type: 'stderr',
                text,
              },
            ]);
          },
          onRequestInput: (promptText: string) => {
            return new Promise<string>((resolve) => {
              setIsWaitingForInput(true);
              setActivePrompt(promptText || '> ');
              setTerminalInputValue('');
              inputResolverRef.current = resolve;
              setTimeout(() => {
                terminalInputRef.current?.focus();
              }, 40);
            });
          },
        }
      );

      setExecutionStats({
        time: result.duration,
        memory: result.memory,
        status: result.status,
      });

      if (result.isSuccess) {
        sounds.playSuccess();
        confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } });
      } else {
        sounds.playClick();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setTerminalLines((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: 'stderr',
          text: `[Runtime Error]: ${msg}`,
        },
      ]);
      setExecutionStats({ status: 'Error', time: '0ms', memory: '0 MB' });
      sounds.playClick();
    } finally {
      setIsRunning(false);
      setIsWaitingForInput(false);
      setActivePrompt('');
      inputResolverRef.current = null;
    }
  };

  // Interactive input submission directly in the unified terminal
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = terminalInputValue;
    setTerminalInputValue('');

    // If active execution is waiting for an interactive prompt:
    if (isWaitingForInput && inputResolverRef.current) {
      setTerminalLines((prev) => [
        ...prev,
        {
          id: `stdin-${Date.now()}-${Math.random()}`,
          type: 'stdin',
          text: `${activePrompt}${val}`,
        },
      ]);

      const resolver = inputResolverRef.current;
      inputResolverRef.current = null;
      setIsWaitingForInput(false);
      setActivePrompt('');
      resolver(val);
      return;
    }

    // CLI Shell Commands when idle
    const trimmed = val.trim();
    if (!trimmed) return;

    setTerminalLines((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}-${Math.random()}`,
        type: 'stdin',
        text: `smitronix@cloud:~$ ${val}`,
      },
    ]);

    if (trimmed === 'clear' || trimmed === 'cls') {
      setTerminalLines([]);
      return;
    }

    if (trimmed === 'help') {
      setTerminalLines((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          type: 'system',
          text: 'Available Commands:\n  run   - Execute current code\n  clear - Clear terminal\n  reset - Reset to starter template\n  help  - Show commands',
        },
      ]);
      return;
    }

    if (trimmed === 'reset') {
      handleResetCode();
      return;
    }

    if (trimmed === 'run' || trimmed.startsWith('run ') || trimmed.startsWith('python') || trimmed.startsWith('node') || trimmed.startsWith('java')) {
      executeCode();
      return;
    }

    // Default: execute code
    executeCode();
  };

  // Quick suggestion chip click (resolves active input immediately)
  const handleQuickInput = (val: string) => {
    if (isWaitingForInput && inputResolverRef.current) {
      setTerminalLines((prev) => [
        ...prev,
        {
          id: `stdin-${Date.now()}-${Math.random()}`,
          type: 'stdin',
          text: `${activePrompt}${val}`,
        },
      ]);
      const resolver = inputResolverRef.current;
      inputResolverRef.current = null;
      setIsWaitingForInput(false);
      setActivePrompt('');
      resolver(val);
    }
  };

  // Keyboard shortcut (⌘+Enter / Ctrl+Enter), Tab indentation, auto-closing quotes/brackets & auto-indent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Run shortcut: ⌘+Enter or Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      executeCode();
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 2. Tab / Shift+Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!e.shiftKey) {
        const newCode = code.substring(0, start) + '    ' + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      } else {
        const before = code.substring(0, start);
        const lineStart = before.lastIndexOf('\n') + 1;
        const currentLine = code.substring(lineStart, end);
        if (currentLine.startsWith('    ')) {
          const newCode = code.substring(0, lineStart) + currentLine.substring(4);
          setCode(newCode);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 4);
          }, 0);
        }
      }
      return;
    }

    // 3. Auto-indent on Enter
    if (e.key === 'Enter') {
      const before = code.substring(0, start);
      const after = code.substring(end);
      const currentLine = before.substring(before.lastIndexOf('\n') + 1);
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';

      // Expand {|} on Enter into formatted block
      if (before.endsWith('{') && after.startsWith('}')) {
        e.preventDefault();
        const extraIndent = '    ';
        const insert = `\n${currentIndent}${extraIndent}\n${currentIndent}`;
        const newCode = before + insert + after;
        setCode(newCode);
        setTimeout(() => {
          const newPos = start + currentIndent.length + extraIndent.length + 1;
          textarea.selectionStart = textarea.selectionEnd = newPos;
        }, 0);
        return;
      }

      // Preserve indentation on Enter, add 4 spaces if line ends with { or :
      const shouldExtra = (before.trimEnd().endsWith('{') || (selectedLang.id === 'python' && before.trimEnd().endsWith(':')));
      const extra = shouldExtra ? '    ' : '';
      e.preventDefault();
      const insert = `\n${currentIndent}${extra}`;
      const newCode = before + insert + after;
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + insert.length;
      }, 0);
      return;
    }

    // 4. Auto-closing quotes & brackets
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
    };
    const closers = new Set([')', ']', '}', '"', "'", '`']);

    // If typing closer right before that exact closer, skip over it
    if (closers.has(e.key) && start === end && code[start] === e.key) {
      e.preventDefault();
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      return;
    }

    // Auto-insert pair
    if (pairs[e.key]) {
      e.preventDefault();
      const open = e.key;
      const close = pairs[e.key];
      const selected = code.substring(start, end);
      const newCode = code.substring(0, start) + open + selected + close + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (selected.length > 0) {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        } else {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
      }, 0);
      return;
    }

    // 5. Backspace between matching pair
    if (e.key === 'Backspace' && start === end && start > 0) {
      const prevChar = code[start - 1];
      const nextChar = code[start];
      if (pairs[prevChar] === nextChar) {
        e.preventDefault();
        const newCode = code.substring(0, start - 1) + code.substring(start + 1);
        setCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 1;
        }, 0);
        return;
      }
    }
  };

  const lineCount = code.split('\n').length;
  const isInputRequired = detectInputRequirement(code);

  return (
    <div className="h-[100dvh] w-full max-w-[100vw] flex flex-col bg-[#070B13] text-slate-100 font-sans overflow-hidden select-none">
      
      {/* Top Header Bar (Responsive for Mobile & Desktop) */}
      <header className="h-14 border-b border-white/10 bg-[#0B101B] px-3 sm:px-4 flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Back & Platform Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onBackToHome();
            }}
            className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors border border-white/5"
            title="Return to Portfolio"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1">
              <span className="text-[#FF8A00]">SmitroniX</span>
              <span className="hidden xs:inline text-slate-300 font-medium">Compiler</span>
            </span>
            <span className="hidden xl:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Online
            </span>
          </div>
        </div>

        {/* Center: Responsive Language Selector & Desktop Sample Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Language Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-mono font-semibold text-white shadow-sm transition-all"
            >
              <span className="flex items-center shrink-0">{selectedLang.icon}</span>
              <span className="hidden sm:inline">{selectedLang.name}</span>
              <span className="sm:hidden">{selectedLang.shortName}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 sm:left-1/2 sm:-translate-x-1/2 w-52 sm:w-56 rounded-2xl bg-[#0C121E] border border-white/15 shadow-2xl py-1 z-50 overflow-hidden backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-white/5">
                  Select Language
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {COMPILER_LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => selectLanguage(lang)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors text-left ${
                        selectedLang.id === lang.id
                          ? 'bg-[#FF8A00]/15 text-[#FF8A00] font-bold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="flex items-center shrink-0">{lang.icon}</span>
                        <span>{lang.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-500">{lang.version}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right: Quick Tools & Green Run Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          <button
            onClick={() => setShowStdinDrawer(!showStdinDrawer)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-mono transition-colors hidden sm:inline-flex items-center gap-1 ${
              showStdinDrawer ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
            title="Toggle Stdin Batch Drawer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Batch stdin</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          <button
            onClick={handleResetCode}
            className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden xs:block"
            title="Reset to Default Template"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Print / PDF Lab Report Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsPrintModalOpen(true);
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Print Code & Output to PDF (Lab Journal)"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF8A00]" />
            <span className="hidden md:inline">Print / PDF</span>
          </button>

          {/* Prominent Green Run Button (Easily tappable on mobile) */}
          <button
            onClick={() => executeCode()}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-60 shrink-0"
          >
            {isRunning ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Running</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run</span>
                <span className="text-[10px] opacity-75 font-sans hidden sm:inline">(⌘↵)</span>
              </>
            )}
          </button>

        </div>
      </header>

      {/* Mobile Tab Selector (High Contrast & Clear Badges) */}
      <div className="md:hidden flex items-center border-b border-white/10 bg-[#0B101B] shrink-0">
        <button
          onClick={() => setActiveMobileTab('editor')}
          className={`flex-1 py-2.5 text-xs font-mono text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
            activeMobileTab === 'editor'
              ? 'border-[#FF8A00] text-[#FF8A00] font-bold bg-white/[0.02]'
              : 'border-transparent text-slate-400'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Editor ({selectedLang.extension})</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('output')}
          className={`flex-1 py-2.5 text-xs font-mono text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'output'
              ? 'border-emerald-400 text-emerald-400 font-bold bg-white/[0.02]'
              : 'border-transparent text-slate-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Terminal Output</span>
          {isWaitingForInput ? (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/20 text-amber-300 font-bold animate-pulse">
              Input ↵
            </span>
          ) : executionStats ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          ) : null}
        </button>
      </div>

      {/* Main Split IDE Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* LEFT PANE: Full Code Editor */}
        <div
          className={`flex-1 flex flex-col border-r border-white/10 bg-[#060A11] overflow-hidden ${
            activeMobileTab === 'output' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Editor Header Tab Bar */}
          <div className="h-9 border-b border-white/5 bg-[#090E17] px-3 sm:px-4 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex items-center shrink-0">{selectedLang.icon}</span>
              <span className="font-semibold text-white">Main.{selectedLang.extension}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400">{lineCount} lines</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] sm:text-[11px] font-mono font-medium">
                Default
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                UTF-8 • Tab = 4
              </span>
            </div>
          </div>

          {/* Optional Stdin Drawer */}
          {showStdinDrawer && (
            <div className="p-2 sm:p-3 bg-slate-900/90 border-b border-white/10 flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-xs font-mono text-[#FF8A00] shrink-0">stdin:</span>
              <input
                type="text"
                value={stdin}
                onChange={(e) => {
                  setStdin(e.target.value);
                }}
                placeholder="Batch stdin values..."
                className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-white placeholder-slate-500"
              />
            </div>
          )}

          {/* Code Textarea with Line Numbers Gutter */}
          <div className="flex-1 flex overflow-hidden relative select-text">
            
            {/* Dynamic Line Numbers Gutter (Compact on mobile) */}
            <div
              ref={gutterRef}
              className="w-8 sm:w-12 py-2.5 sm:py-3 bg-[#05080E] border-r border-white/5 select-none font-mono text-[11px] sm:text-[12px] text-slate-600 text-right pr-1 sm:pr-2.5 overflow-hidden shrink-0 leading-[20px] sm:leading-[22px]"
              aria-hidden="true"
            >
              {Array.from({ length: Math.max(lineCount, 25) }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Syntax Highlighted Code Editor */}
            <div className="relative flex-1 overflow-hidden bg-[#060A11]">
              {/* Highlighted Prism Code Underlay */}
              <pre
                ref={preRef}
                aria-hidden="true"
                className="absolute inset-0 p-2.5 sm:p-3 m-0 font-mono text-[12px] sm:text-[13px] leading-[20px] sm:leading-[22px] pointer-events-none overflow-hidden whitespace-pre font-normal select-none"
                style={{ tabSize: 4 }}
                dangerouslySetInnerHTML={{ __html: highlightedCodeHtml + '\n' }}
              />

              {/* Transparent Textarea for Typing, Selection & Keystrokes */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleEditorScroll}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="absolute inset-0 p-2.5 sm:p-3 m-0 font-mono text-[12px] sm:text-[13px] leading-[20px] sm:leading-[22px] outline-none resize-none overflow-auto whitespace-pre bg-transparent text-transparent caret-emerald-400 selection:bg-emerald-500/25 selection:text-transparent"
                style={{ tabSize: 4 }}
                placeholder="Write your code here..."
              />
            </div>

          </div>

          {/* Editor Status Bottom Strip */}
          <div className="border-t border-white/10 bg-[#090E17] px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-emerald-400 text-[11px]">Template:</span>
              <span className="text-slate-200 text-[11px] truncate">Default ({selectedLang.name})</span>
            </div>

            <div className="text-[11px] text-slate-500 shrink-0 ml-2 hidden sm:block">
              Press ⌘+Enter to Run
            </div>
          </div>

        </div>

        {/* RIGHT PANE: Interactive Terminal Output Console (Write Input Directly) */}
        <div
          className={`flex-1 flex flex-col bg-[#04060A] overflow-hidden ${
            activeMobileTab === 'editor' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Terminal Header */}
          <div className="h-9 border-b border-white/5 bg-[#070A10] px-3 sm:px-4 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">Terminal Output</span>
              {executionStats?.status && (
                <span className="px-2 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {executionStats.status}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {executionStats && (
                <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono">
                  {executionStats.time && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Clock className="w-3 h-3" /> {executionStats.time}
                    </span>
                  )}
                  {executionStats.memory && (
                    <span className="flex items-center gap-1 text-cyan-400 hidden sm:flex">
                      <Cpu className="w-3 h-3" /> {executionStats.memory}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPrintModalOpen(true);
                }}
                className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono"
                title="Print Report / Export PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span className="hidden xs:inline">Print/PDF</span>
              </button>

              <button
                onClick={handleClearOutput}
                className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors"
                title="Clear Output"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Screen (VS Code Integrated Console - Click anywhere to focus and type) */}
          <div
            ref={terminalScrollRef}
            onClick={() => terminalInputRef.current?.focus()}
            className="flex-1 p-3 sm:p-4 font-mono text-[12px] sm:text-[13px] leading-relaxed overflow-y-auto select-text bg-[#04060A] cursor-text flex flex-col justify-between"
          >
            <div className="space-y-1">
              {/* Historical output stream */}
              {terminalLines.map((line) => (
                <div key={line.id} className="whitespace-pre-wrap break-words">
                  {line.type === 'stdin' ? (
                    <span className="text-emerald-400 font-semibold">{line.text}</span>
                  ) : line.type === 'stderr' ? (
                    <span className="text-rose-400">{line.text}</span>
                  ) : line.type === 'system' ? (
                    <span className="text-cyan-400/90 font-medium">{line.text}</span>
                  ) : (
                    <span className="text-slate-200">{line.text}</span>
                  )}
                </div>
              ))}

              {/* Quick suggestion chips when program is waiting for input */}
              {isWaitingForInput && (
                <div className="py-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-amber-400/80 font-mono">Suggestions:</span>
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickInput(chip);
                      }}
                      className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-mono font-bold border border-amber-500/30 active:scale-95 transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Active Inline Prompt (True VS Code Style: Prompt + Typing Line directly in stream) */}
              <form
                onSubmit={handleTerminalSubmit}
                className="flex items-center flex-wrap gap-x-1 font-mono text-[12px] sm:text-[13px] pt-0.5"
              >
                <span
                  className={
                    isWaitingForInput
                      ? 'text-amber-400 font-bold shrink-0'
                      : 'text-emerald-400 font-semibold shrink-0'
                  }
                >
                  {isWaitingForInput ? activePrompt : 'smitronix@cloud:~$ '}
                </span>

                <div className="relative flex-1 min-w-[140px] inline-flex items-center">
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInputValue}
                    onChange={(e) => setTerminalInputValue(e.target.value)}
                    disabled={isRunning && !isWaitingForInput}
                    placeholder={
                      isRunning && !isWaitingForInput
                        ? 'Executing...'
                        : isWaitingForInput
                        ? 'Type input & press Enter ↵'
                        : 'Type "run" or press ⌘+Enter'
                    }
                    className="w-full bg-transparent border-none outline-none font-mono text-[12px] sm:text-[13px] text-white p-0 m-0 focus:ring-0 placeholder:text-slate-600 caret-emerald-400"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  {/* Blinking cursor block when idle or prompt waiting */}
                  {!terminalInputValue && !(isRunning && !isWaitingForInput) && (
                    <span className="inline-block w-1.5 sm:w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 pointer-events-none shrink-0" />
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Terminal Bottom Status Bar */}
          <div className="h-7 sm:h-8 border-t border-white/5 bg-[#06080E] px-3 sm:px-4 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>SmitroniX Cloud Engine</span>
            </div>
            <div className="text-slate-400">
              {selectedLang.shortName} • {executionStats?.status || 'Ready'}
            </div>
          </div>

        </div>

      </div>

      {/* Academic Lab Report & PDF Print Modal */}
      <LabReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        code={code}
        languageName={selectedLang.name}
        languageExtension={selectedLang.extension}
        terminalOutput={terminalOutputText}
      />

    </div>
  );
};
