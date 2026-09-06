import React, { useState } from 'react';
import { Send, Mail, Copy, Check, Sparkles, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Cloud & Full Stack Project',
    message: '',
  });

  const handleCopyEmail = () => {
    sounds.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    sounds.playWarp();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
      sounds.playSuccess();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#00F0FF', '#00FF9D'],
      });
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-widest font-bold">
              <span>05 //</span> TRANSMISSION DECK
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase mt-2">
              Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8A00] to-amber-300">Connect</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-mono mt-4 md:mt-0 max-w-md">
            Available for software engineering roles, high-impact cloud architectures, freelance systems, and innovative collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Direct Communication Channels (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Email Copy Hub */}
            <div className="cyber-card rounded-2xl p-6 sm:p-7 border border-orange-500/30">
              <span className="text-xs font-mono text-[#FF6B00] uppercase font-bold">
                Direct Neural Transmission
              </span>
              <h3 className="text-xl font-bold font-display text-white mt-1 mb-4">
                Get In Touch Directly
              </h3>
              
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Mail className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  <span className="text-xs sm:text-sm font-mono text-slate-200 truncate">
                    {PERSONAL_INFO.email}
                  </span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-[#FF8A00] border border-orange-500/30 text-xs font-mono flex items-center gap-1.5 shrink-0 transition-all"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 space-y-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00F0FF]" />
                  <span>{PERSONAL_INFO.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00FF9D]" />
                  <span>Timezone: IST (UTC+5:30) • Rapid Response</span>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="cyber-card rounded-2xl p-5 border border-slate-800 hover:border-[#00F0FF] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <LinkedinIcon className="w-5 h-5 text-[#00F0FF] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono text-slate-500">CONNECT ↗</span>
                </div>
                <div className="text-sm font-bold font-display text-white">LinkedIn</div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">@asmit-jogdand</div>
              </a>

              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="cyber-card rounded-2xl p-5 border border-slate-800 hover:border-[#FF6B00] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <GithubIcon className="w-5 h-5 text-[#FF6B00] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono text-slate-500">REPOS ↗</span>
                </div>
                <div className="text-sm font-bold font-display text-white">GitHub</div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">@SmitroniX</div>
              </a>
            </div>

          </div>

          {/* Holographic Transmission Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-800 relative">
              
              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(0,255,157,0.3)]">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Transmission Dispatched!
                  </h3>
                  <p className="text-sm font-mono text-slate-300 max-w-sm">
                    Thank you, {formState.name}. Your packet has been received into the queue. Expect a swift response.
                  </p>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSubmitted(false);
                      setFormState({ name: '', email: '', subject: 'Cloud & Full Stack Project', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        Your Identity / Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Alex Mercer"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-sans text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B00] transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">
                        Email Endpoint
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-sans text-white placeholder-slate-600 focus:outline-none focus:border-[#00F0FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-slate-300 uppercase">
                      Objective / Topic
                    </label>
                    <select
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-sans text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    >
                      <option>Cloud & Full Stack Project</option>
                      <option>Software Engineer / Internship Opportunity</option>
                      <option>Discord Bot & Automation Architecture</option>
                      <option>Freelance Collaboration</option>
                      <option>Tech Discussion / Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-slate-300 uppercase">
                      Message Packet
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Share details about your idea, role, or technical requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-sans text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B00] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-black font-bold font-mono text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,107,0,0.35)] hover:shadow-[0_0_35px_rgba(255,107,0,0.6)] active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {isSending ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" /> Transmitting Signal...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Dispatch Transmission
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
