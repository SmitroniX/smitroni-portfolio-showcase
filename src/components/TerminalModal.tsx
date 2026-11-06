import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, ExternalLink, Mail, Copy, Check, X, FolderGit2, FileDown, Terminal, Play, Shield } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCompiler?: () => void;
  onOpenDarkSide?: () => void;
}

export const TerminalModal: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenCompiler,
  onOpenDarkSide,
}) => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1000);
  };

  const allActions = [
    {
      title: 'View Flagship Projects',
      desc: 'ShadowLauncher, SmiTriX, DYPU Connect & Cloud IDE',
      icon: <FolderGit2 className="w-4 h-4 text-cyan-400" />,
      action: () => {
        window.location.hash = '#projects';
        onClose();
      },
    },
    {
      title: 'DevOps & Architecture Pipeline',
      desc: 'CI/CD, multi-stage Docker builds, and edge delivery',
      icon: <Terminal className="w-4 h-4 text-purple-400" />,
      action: () => {
        window.location.hash = '#architecture';
        onClose();
      },
    },
    {
      title: 'Tech Stack & Core Disciplines',
      desc: 'Java 21, C++, React 19, TypeScript, Docker, AWS',
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      action: () => {
        window.location.hash = '#skills';
        onClose();
      },
    },
    {
      title: 'Experience & Academic Timeline',
      desc: 'Naviotech Solution, HTB Team sudo Unknown, RAIT Mumbai',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => {
        window.location.hash = '#experience';
        onClose();
      },
    },
    {
      title: 'Download Resume (PDF)',
      desc: 'Latest official software engineering resume',
      icon: <FileDown className="w-4 h-4 text-white" />,
      action: () => {
        window.open(PERSONAL_INFO.resumeUrl, '_blank');
        onClose();
      },
    },
    {
      title: 'Copy Email Address',
      desc: PERSONAL_INFO.email,
      icon: copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />,
      action: handleCopyEmail,
    },
    {
      title: 'Open GitHub Profile',
      desc: 'github.com/SmitroniX (52+ repositories)',
      icon: <GithubIcon className="w-4 h-4 text-slate-300" />,
      action: () => {
        window.open(PERSONAL_INFO.socials.github, '_blank');
        onClose();
      },
    },
    {
      title: 'Open LinkedIn Profile',
      desc: 'linkedin.com/in/asmit-jogdand',
      icon: <LinkedinIcon className="w-4 h-4 text-blue-400" />,
      action: () => {
        window.open(PERSONAL_INFO.socials.linkedin, '_blank');
        onClose();
      },
    },
    {
      title: 'Code With SmitroniX (Cloud IDE)',
      desc: 'Multi-language cloud runner with Java Swing/AWT desktop',
      icon: <Play className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onClose();
        if (onOpenCompiler) onOpenCompiler();
      },
    },
    {
      title: '🛡️ [Classified] HTB Team sudo Unknown (#331386)',
      desc: 'Cybersecurity research, binary exploitation & CTF challenges',
      icon: <Shield className="w-4 h-4 text-red-400" />,
      action: () => {
        onClose();
        if (onOpenDarkSide) onOpenDarkSide();
      },
    },
  ];

  const filtered = allActions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-[#090D15] border border-white/[0.12] shadow-2xl shadow-black/90 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-black/40">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-500">
              No matching actions found.
            </div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] flex items-center justify-between text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    {item.icon}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-black/40 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Navigate with mouse or tap</span>
          <span>ESC to close</span>
        </div>

      </div>
    </div>
  );
};
