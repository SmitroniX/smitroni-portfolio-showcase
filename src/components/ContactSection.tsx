import React, { useState } from 'react';
import { Mail, Copy, Check, Send, ArrowUpRight, MapPin, Clock } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
    }, 600);
  };

  const socialLinks = [
    { name: 'GitHub', url: PERSONAL_INFO.socials.github, handle: '@SmitroniX' },
    { name: 'LinkedIn', url: PERSONAL_INFO.socials.linkedin, handle: 'in/asmit-jogdand' },
    { name: 'LeetCode', url: PERSONAL_INFO.socials.leetcode, handle: 'u/SmitroniX' },
    { name: 'HackTheBox', url: PERSONAL_INFO.socials.hackthebox, handle: 'Team #331386' },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-semibold">
            // Connectivity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Let&apos;s Build Something Great
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            I&apos;m currently available for software engineering internships, backend contracts, and collaborative open-source systems. Reach out directly or send a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Direct Channels (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email Card */}
            <SpotlightCard className="p-6 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                Direct Email
              </span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-xs sm:text-sm font-mono text-slate-200 truncate">
                  {PERSONAL_INFO.email}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-xs font-mono text-white flex items-center gap-1.5 transition-colors shrink-0 ml-2 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </SpotlightCard>

            {/* Social Channels Card */}
            <SpotlightCard className="p-6 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                Profiles &amp; Repositories
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{s.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{s.handle}</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </SpotlightCard>

            {/* Location & Timezone Card */}
            <SpotlightCard className="p-5 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Mumbai, India (IST)</span>
              </div>
              <div className="text-emerald-400 font-semibold">
                ● Active Timezone
              </div>
            </SpotlightCard>

          </div>

          {/* Interactive Contact Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <SpotlightCard className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Message Dispatched!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thank you for reaching out. I will review your message and reply to{' '}
                    <strong className="text-slate-200">{form.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', message: '' });
                    }}
                    className="mt-4 px-4 py-2 rounded-full text-xs font-mono text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400 uppercase">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Alex Chen"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400 uppercase">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 uppercase">
                      Message / Project Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Hi Asmit, I came across your portfolio and wanted to discuss..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-slate-950 font-semibold text-xs sm:text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSending ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
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
