import React from 'react';
import { GitBranch, Star, Activity, GitFork, ExternalLink, Code, Terminal, Flame } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';

export const GitHubPulse: React.FC = () => {
  const topRepos = [
    {
      name: "DYPU-Connect",
      desc: "Campus social platform for DYPU students with real-time chat, clubs & confessions feed.",
      lang: "TypeScript",
      langColor: "#3178C6",
      url: "https://github.com/SmitroniX/DYPU-Connect",
      stars: 1
    },
    {
      name: "gemini-cli",
      desc: "Open-source AI terminal agent integrating Google Gemini models directly into CLI workflows.",
      lang: "TypeScript",
      langColor: "#3178C6",
      url: "https://github.com/SmitroniX/gemini-cli",
      stars: 1
    },
    {
      name: "AniPlex",
      desc: "Modern streaming & manga reader client inspired by OTT services with dynamic Consumet API.",
      lang: "React / JS",
      langColor: "#F7DF1E",
      url: "https://github.com/SmitroniX/AniPlex",
      stars: 1
    },
    {
      name: "shadow_api",
      desc: "High-throughput entertainment search & scraping microservice running on serverless nodes.",
      lang: "TypeScript",
      langColor: "#3178C6",
      url: "https://github.com/SmitroniX/shadow_api",
      stars: 0
    },
    {
      name: "SmiTriX",
      desc: "Interactive cyberpunk digital matrix simulation and developer audio-canvas sandbox.",
      lang: "JavaScript",
      langColor: "#F7DF1E",
      url: "https://github.com/SmitroniX/SmiTriX",
      stars: 1
    },
    {
      name: "CSI-Competitive-Programming-101",
      desc: "Hands-on resources, DSA algorithms, and challenges from CSI-RAIT CP workshop.",
      lang: "Java",
      langColor: "#b07219",
      url: "https://github.com/SmitroniX/CSI-Competitive-Programming-101",
      stars: 1
    }
  ];

  return (
    <section id="github-pulse" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B00] uppercase tracking-widest font-bold">
              <span>05 //</span> OPEN SOURCE TELEMETRY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase mt-2">
              GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-amber-400 to-[#00F0FF]">Pulse</span> & Activity
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#FF6B00] text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2 transition-all shadow-md"
            >
              <span>Follow @SmitroniX</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF6B00]" />
            </a>
          </div>
        </div>

        {/* Live GitHub Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sounds.playHover()}
              onClick={() => sounds.playClick()}
              className="cyber-card rounded-2xl p-6 border border-slate-800/80 hover:border-orange-500/50 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-slate-200 group-hover:text-[#FF6B00] transition-colors font-bold font-mono text-sm">
                    <GitBranch className="w-4 h-4 text-[#FF6B00]" />
                    <span>{repo.name}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4 font-sans">
                  {repo.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: repo.langColor }}
                  />
                  <span>{repo.lang}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{repo.stars}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Live GitHub Readme Badges Banner */}
        <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-orange-500/30 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase mb-4 font-bold">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>GLOBAL COMMIT GRID & STREAKS</span>
          </div>

          <p className="text-sm font-mono text-slate-300 max-w-xl mb-6">
            Real-time GitHub activity graph rendered dynamically from the GitHub API and contribution snake pipeline.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-4xl overflow-x-auto p-2">
            <img
              src="https://github-readme-stats.vercel.app/api?username=SmitroniX&show_icons=true&count_private=true&hide_border=true&bg_color=0D1117&title_color=FF6B00&text_color=FFFFFF&icon_color=FF6B00"
              alt="GitHub Stats"
              className="rounded-xl border border-slate-800/80 max-h-[160px] object-contain shadow-lg"
              loading="lazy"
            />
            <img
              src="https://github-readme-streak-stats.herokuapp.com?user=SmitroniX&background=0D1117&ring=FF6B00&fire=FF6B00&currStreakLabel=FFFFFF&hide_border=true"
              alt="GitHub Streak"
              className="rounded-xl border border-slate-800/80 max-h-[160px] object-contain shadow-lg"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
