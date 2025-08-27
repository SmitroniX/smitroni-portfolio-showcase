import { Github, ExternalLink, Star, GitFork } from 'lucide-react';
import { TerminalButton } from '@/components/ui/terminal-button';

const Projects = () => {
  const projects = [
    {
      name: "Simple Steam Idler (Replit)",
      description: "24/7 Steam ingame time idler with Replit integration. Automated solution for maintaining game presence.",
      tech: ["JavaScript", "Node.js", "Replit", "Steam API"],
      github: "https://github.com/SmitroniX/simple-steam-idler-replit",
      stars: "⭐",
      type: "Automation Tool"
    },
    {
      name: "Nekos.life Discord Bot",
      description: "Interactive Discord bot using the Nekos.life API wrapper. Features anime-themed commands and community engagement.",
      tech: ["JavaScript", "Discord.js", "Nekos.life API", "Bot Development"],
      github: "https://github.com/SmitroniX/nekos.life-discord-bot",
      stars: "🎎",
      type: "Discord Bot"
    },
    {
      name: "Gemini Discord Bot",
      description: "AI-powered Discord bot leveraging Google's Gemini API for intelligent conversations and assistance.",
      tech: ["JavaScript", "Discord.js", "Gemini API", "AI Integration"],
      github: "https://github.com/SmitroniX/GeminiDiscordBot",
      stars: "🤖",
      type: "AI Bot"
    },
    {
      name: "DSA with Python",
      description: "Comprehensive collection of Data Structures and Algorithms implementations in Python. Learning journey documentation.",
      tech: ["Python", "Algorithms", "Data Structures", "Educational"],
      github: "https://github.com/SmitroniX/SmitroniX",
      stars: "📚",
      type: "Educational"
    },
    {
      name: "Personal Portfolio",
      description: "Futuristic terminal-inspired portfolio website built with React and modern web technologies.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      github: "#",
      live: "#",
      stars: "💼",
      type: "Portfolio"
    },
    {
      name: "Cloud Computing Projects",
      description: "Collection of cloud-based applications and infrastructure projects exploring AWS, Azure, and GCP services.",
      tech: ["Python", "AWS", "Docker", "Kubernetes", "CI/CD"],
      github: "#",
      stars: "☁️",
      type: "Cloud Infrastructure"
    }
  ];

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="terminal-border rounded-lg p-4 inline-block mb-6">
            <div className="font-terminal text-sm">
              <span className="text-secondary">guest@asmit.dev:~$</span>
              <span className="text-muted-foreground ml-2">ls -la ~/projects</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="neon-text-green">Featured</span> <span className="text-foreground">Projects</span>
          </h2>
          <p className="text-muted-foreground font-terminal max-w-2xl mx-auto">
            A collection of my latest work showcasing expertise in web development, 
            automation, AI integration, and cloud computing.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="terminal-border rounded-lg p-6 hover-glow group transition-all duration-300"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{project.stars}</span>
                  <div>
                    <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <span className="text-xs text-accent font-terminal">
                      {project.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4 font-terminal leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-2 py-1 text-xs font-terminal bg-card border border-primary/30 rounded text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <TerminalButton variant="ghost" size="sm" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </a>
                </TerminalButton>
                {project.live && (
                  <TerminalButton variant="link" size="sm" asChild>
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live
                    </a>
                  </TerminalButton>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* GitHub Stats */}
        <div className="mt-16 text-center">
          <div className="terminal-border rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-display text-primary mb-6">GitHub Analytics</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <img 
                  src="https://github-readme-stats.vercel.app/api?username=SmitroniX&show_icons=true&theme=dark&locale=en&hide_border=true&bg_color=0d1117&title_color=00ffff&text_color=ffffff&icon_color=00ff41"
                  alt="GitHub Stats"
                  className="w-full rounded border border-primary/30"
                />
              </div>
              <div className="space-y-4">
                <img 
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=SmitroniX&theme=dark&hide_border=true&layout=compact&bg_color=0d1117&title_color=00ffff&text_color=ffffff"
                  alt="Top Languages"
                  className="w-full rounded border border-primary/30"
                />
              </div>
            </div>
            <div className="mt-6">
              <TerminalButton variant="neon" asChild>
                <a href="https://github.com/SmitroniX" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  View Full GitHub Profile
                </a>
              </TerminalButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;