import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Send,
  ArrowUpRight,
  MapPin,
  FileDown,
  Mail,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { Magnetic } from './Magnetic';
import { sounds } from '../utils/sound';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    sounds.playInject();
    setIsSending(true);

    window.setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
      sounds.playSuccess();
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.72 },
        colors: ['#FF6B00', '#FF9E2C', '#00F0FF', '#10B981'],
      });
    }, 520);
  };

  const socialLinks = [
    { name: 'GitHub', url: PERSONAL_INFO.socials.github, handle: '@SmitroniX' },
    { name: 'LinkedIn', url: PERSONAL_INFO.socials.linkedin, handle: 'in/asmit-jogdand' },
    { name: 'LeetCode', url: PERSONAL_INFO.socials.leetcode, handle: 'u/SmitroniX' },
    { name: 'HackerRank', url: PERSONAL_INFO.socials.hackerrank, handle: '@jogdandasmit' },
    { name: 'HackTheBox', url: PERSONAL_INFO.socials.hackthebox, handle: 'Team #331386' },
    { name: 'Instagram', url: PERSONAL_INFO.socials.instagram, handle: '@asmit.jogdand_pvt' },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12"
        >
          <span className="text-xs font-mono text-[#FF8A00] tracking-widest uppercase font-semibold">
            // Connectivity &amp; Opportunities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Let&apos;s Engineer Something Impactful
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Currently open for Software Engineering internships, full-stack / backend contracts,
            and open-source systems collaboration. Drop a message or grab my resume directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Direct Channels (Left 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Direct Email + Mailto */}
            <SpotlightCard className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Direct Email
                </span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#00F0FF] hover:text-white transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>Open Mail</span>
                </a>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#05080F] border border-white/[0.07]">
                <span className="text-xs sm:text-sm font-mono text-slate-200 truncate">
                  {PERSONAL_INFO.email}
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.07] hover:bg-[#FF6B00]/20 border border-white/[0.08] hover:border-[#FF6B00]/40 text-xs font-mono text-white flex items-center gap-1.5 transition-colors shrink-0 ml-2 cursor-pointer"
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

            {/* Official Resume Card */}
            <SpotlightCard className="p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-white font-display">
                  Official SWE Resume (PDF)
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  RAIT Mumbai • CGPA 8.65 • Updated 2026
                </div>
              </div>
              <Magnetic strength={0.2} radius={60}>
                <a
                  href={PERSONAL_INFO.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playClick()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#FF8A00] text-black font-bold text-xs transition-colors shrink-0"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </Magnetic>
            </SpotlightCard>

            {/* Profiles Grid */}
            <SpotlightCard className="p-5 sm:p-6 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                Developer Profiles
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#05080F] hover:bg-white/[0.05] border border-white/[0.07] hover:border-[#FF8A00]/35 flex items-center justify-between transition-all group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white">{s.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        {s.handle}
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#FF8A00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </a>
                ))}
              </div>
            </SpotlightCard>

            {/* Location Card */}
            <SpotlightCard className="p-4 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF8A00]" />
                <span>Mumbai, India (IST)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Remote Ready</span>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Interactive Contact Form (Right 7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-7"
          >
            <SpotlightCard className="p-6 sm:p-8 h-full">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-14 space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Transmission Dispatched
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out, <strong className="text-white">{form.name}</strong>.
                    I&apos;ll follow up at{' '}
                    <strong className="text-[#00F0FF] font-mono">{form.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', message: '' });
                    }}
                    className="mt-4 px-4 py-2 rounded-lg text-xs font-mono text-[#FF9E2C] bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 border border-[#FF6B00]/35 transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      POST /api/contact/dispatch
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">200 READY</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="block text-[11px] font-mono text-slate-400 uppercase"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Alex Chen"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/[0.09] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF8A00]/60 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="block text-[11px] font-mono text-slate-400 uppercase"
                      >
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/[0.09] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF8A00]/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block text-[11px] font-mono text-slate-400 uppercase"
                    >
                      Message / Role / Project Scope
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Hi Asmit, saw your systems work and wanted to connect about..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/[0.09] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF8A00]/60 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <Magnetic strength={0.18} radius={65}>
                      <button
                        type="submit"
                        disabled={isSending}
                        className="px-6 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF8A00] text-black font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-[#FF6B00]/20"
                      >
                        {isSending ? (
                          <span>Dispatching...</span>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                    <span className="text-[11px] font-mono text-slate-500">
                      Typically replies within 24h
                    </span>
                  </div>
                </form>
              )}
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
