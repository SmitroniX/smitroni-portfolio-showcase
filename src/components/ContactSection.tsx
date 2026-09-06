import React, { useState } from 'react';
import { Mail, Copy, Check, Send, MapPin, Sparkles, ArrowUpRight, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
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
    if (!form.name || !form.email || !form.message) return;

    sounds.playClick();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
      sounds.playSuccess();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF8A00', '#FFFFFF', '#10B981'],
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono text-[#FF8A00] tracking-widest uppercase font-semibold">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
            Let&apos;s Build Something Remarkable
          </h2>
          <p className="text-slate-400 text-sm font-sans mt-3 leading-relaxed">
            I&apos;m currently open to software engineering internships, freelance contracts, and exciting open-source collaborations. Have an idea or role in mind? Let&apos;s connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Direct Channels (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email Card */}
            <SpotlightCard className="p-6 space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase">Direct Email</span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs sm:text-sm font-mono text-slate-200 truncate">
                  {PERSONAL_INFO.email}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors shrink-0 ml-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-white/5 font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
                  <span>{PERSONAL_INFO.location}</span>
                </div>
                <div className="text-slate-500">
                  Timezone: IST (UTC+5:30) • Rapid response
                </div>
              </div>
            </SpotlightCard>

            {/* Social Cards */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="bento-card p-5 rounded-2xl block hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <LinkedinIcon className="w-5 h-5 text-[#0A66C2]" />
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <div className="font-semibold text-white text-sm">LinkedIn</div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">@asmit-jogdand</div>
              </a>

              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="bento-card p-5 rounded-2xl block hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <GithubIcon className="w-5 h-5 text-slate-200" />
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <div className="font-semibold text-white text-sm">GitHub</div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">@SmitroniX</div>
              </a>
            </div>

          </div>

          {/* Message Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <SpotlightCard className="p-6 sm:p-8">
              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Message Sent!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                    Thank you, {form.name}. I&apos;ve received your message and will reply to {form.email} as soon as possible.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', message: '' });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Alex Mercer"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A00] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A00] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Hi Asmit, I came across your portfolio and wanted to discuss..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A00] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSending ? (
                      <span>Sending note...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </SpotlightCard>
          </div>

        </div>

      </div>
    </section>
  );
};
