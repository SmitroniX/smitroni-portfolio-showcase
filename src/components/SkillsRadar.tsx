import React from 'react';
import { Layout, Server, Cloud, Shield, Database, Terminal, Cpu, Code2 } from 'lucide-react';
import { TECH_STACK } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

export const SkillsRadar: React.FC = () => {
  const categories = [
    {
      title: 'Frontend Engineering',
      desc: 'Modern reactive interfaces & WebGL',
      icon: <Layout className="w-5 h-5 text-cyan-400" />,
      items: TECH_STACK.frontend,
      accent: 'border-cyan-500/20'
    },
    {
      title: 'Systems & Native Core',
      desc: 'C/C++, Java 21 & graphics bridges',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      items: [
        { name: 'Java (21 LTS)', tag: 'Systems & OOP', exp: 'Mastery' },
        { name: 'C / C++', tag: 'Native Bridges', exp: 'Proficient' },
        { name: 'Android NDK', tag: 'Mobile Core', exp: 'Advanced' },
        { name: 'GL4ES & LWJGL3', tag: 'OpenGL Translation', exp: 'Advanced' },
        { name: 'Linux Kernel & Shell', tag: 'SysAdmin', exp: 'Advanced' },
        { name: 'JVM Garbage Collection', tag: 'Tuning & GC', exp: 'Advanced' },
      ],
      accent: 'border-purple-500/20'
    },
    {
      title: 'Backend & Microservices',
      desc: 'High-throughput APIs & concurrency',
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      items: [
        { name: 'Node.js / Express', tag: 'REST Microservices', exp: 'Advanced' },
        { name: 'Python', tag: 'Scripting & AI', exp: 'Advanced' },
        { name: 'WebSockets', tag: 'Real-time Chat', exp: 'Proficient' },
        { name: 'Redis', tag: 'In-Memory Cache', exp: 'Intermediate' },
        { name: 'MongoDB & MySQL', tag: 'Databases', exp: 'Advanced' },
        { name: 'Discord.js', tag: 'Bot Engine', exp: 'Mastery' },
      ],
      accent: 'border-emerald-500/20'
    },
    {
      title: 'Cloud, DevOps & Security',
      desc: 'Docker, AWS & offensive security',
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      items: [
        { name: 'Docker & Compose', tag: 'Containerization', exp: 'Intermediate' },
        { name: 'AWS (EC2, S3)', tag: 'Infrastructure', exp: 'Intermediate' },
        { name: 'Cloudflare', tag: 'Edge & CDN', exp: 'Advanced' },
        { name: 'WebAuthn / Passkeys', tag: 'Cryptographic Auth', exp: 'Advanced' },
        { name: 'Burp Suite Pro', tag: 'App Security', exp: 'Proficient' },
        { name: 'Binary Exploitation', tag: 'CTF Captaincy', exp: 'Active Practice' },
      ],
      accent: 'border-amber-500/20'
    }
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-semibold">
              // Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Tech Stack &amp; Core Disciplines
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0 leading-relaxed">
            The programming languages, native frameworks, and cloud infrastructure I employ daily to build reliable software.
          </p>
        </div>

        {/* 4 Bento Quadrants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <SpotlightCard key={cat.title} className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{cat.title}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{cat.desc}</p>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-2 pt-2">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-xs transition-colors"
                    >
                      <span className="font-medium text-slate-200">{item.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                    </div>
                  ))}
                </div>

              </div>
            </SpotlightCard>
          ))}
        </div>

      </div>
    </section>
  );
};
