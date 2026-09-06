import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, ArrowRight, ExternalLink, Mail, Copy, Check, X, Sparkles, FolderGit2, User, Code2, Play } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCompiler?: () => void;
}

export const TerminalModal: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onOpenCompiler }) => {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  const handleHireTrigger = () => {
    sounds.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF8A00', '#FFFFFF', '#10B981'],
    });
    setTimeout(() => {
      window.location.href = `mailto:${PERSONAL_INFO.email}?subject=Opportunity%20for%20Asmit%20Jogdand`;
      onClose();
    }, 800);
  };

  const navigationActions = [
    {
      title: 'Launch Online Compiler (IDE)',
      desc: 'Full-screen Programiz-style runner for Python, C++, Java, Rust, JS',
      icon: <Play className="w-4 h-4 text-emerald-400 fill-current" />,
      action: () => {
        onClose();
        if (onOpenCompiler) onOpenCompiler();
      },
    },
    {
      title: 'View Projects',
      desc: 'Explore DYPU Connect, AniPlex, and cloud APIs',
      icon: <FolderGit2 className="w-4 h-4 text-[#FF8A00]" />,
      action: () => {
        window.location.hash = '#projects';
        onClose();
      },
    },
    {
      title: 'DevOps & Architecture Pipeline',
      desc: 'CI/CD, Docker multi-stage builds, and cloud orchestration',
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      action: () => {
        window.location.hash = '#devops';
        onClose();
      },
    },
    {
      title: 'Technical Arsenal & Stack',
      desc: 'React, TypeScript, Node.js, AWS, and databases',
      icon: <Code2 className="w-4 h-4 text-amber-400" />,
      action: () => {
        window.location.hash = '#skills';
        onClose();
      },
    },
    {
      title: 'Experience & Background',
      desc: 'Naviotech, RAIT Social Wing, and Hypixel',
      icon: <User className="w-4 h-4 text-purple-400" />,
      action: () => {
        window.location.hash = '#experience';
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
      title: 'Fast-Track Hire / Get in Touch',
      desc: 'Send an email directly with confetti celebration',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: handleHireTrigger,
    },
  ];

  const externalLinks = [
    {
      title: 'GitHub Profile',
      desc: 'github.com/SmitroniX (52+ repositories)',
      icon: <GithubIcon className="w-4 h-4 text-slate-300" />,
      url: PERSONAL_INFO.socials.github,
    },
    {
      title: 'LinkedIn Profile',
      desc: 'linkedin.com/in/asmit-jogdand',
      icon: <LinkedinIcon className="w-4 h-4 text-[#0A66C2]" />,
      url: PERSONAL_INFO.socials.linkedin,
    },
    {
      title: 'LeetCode Profile',
      desc: 'leetcode.com/u/SmitroniX',
      icon: <Terminal className="w-4 h-4 text-amber-500" />,
      url: PERSONAL_INFO.socials.leetcode,
    },
  ];

  const filteredNav = navigationActions.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLinks = externalLinks.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#090E17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-slate-900/50">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search projects, compiler, skills..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 font-sans"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          
          {/* Navigation & Commands */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Quick Actions
              </div>
              <div className="space-y-0.5">
                {filteredNav.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playClick();
                      action.action();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        {action.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                          {action.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {action.desc}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Social Profiles */}
          {filteredLinks.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Profiles &amp; Repositories
              </div>
              <div className="space-y-0.5">
                {filteredLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        {link.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                          {link.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {link.desc}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Command Palette • Asmit Jogdand</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
