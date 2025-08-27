import { 
  Code, 
  Database, 
  Cloud, 
  Smartphone, 
  Globe, 
  Server, 
  GitBranch,
  Cpu,
  Terminal,
  Zap
} from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="w-6 h-6" />,
      skills: [
        { name: "Python", level: 90, color: "text-secondary" },
        { name: "JavaScript", level: 85, color: "text-primary" },
        { name: "TypeScript", level: 75, color: "text-accent" },
        { name: "Java", level: 70, color: "text-secondary" },
        { name: "Kotlin", level: 65, color: "text-primary" }
      ]
    },
    {
      title: "Web Development",
      icon: <Globe className="w-6 h-6" />,
      skills: [
        { name: "React.js", level: 85, color: "text-primary" },
        { name: "HTML5/CSS3", level: 90, color: "text-secondary" },
        { name: "Bootstrap", level: 80, color: "text-accent" },
        { name: "Tailwind CSS", level: 85, color: "text-primary" },
        { name: "Node.js", level: 75, color: "text-secondary" }
      ]
    },
    {
      title: "Database & Backend",
      icon: <Database className="w-6 h-6" />,
      skills: [
        { name: "MongoDB", level: 80, color: "text-secondary" },
        { name: "MySQL", level: 75, color: "text-primary" },
        { name: "Firebase", level: 85, color: "text-accent" },
        { name: "REST APIs", level: 80, color: "text-secondary" },
        { name: "Express.js", level: 70, color: "text-primary" }
      ]
    },
    {
      title: "Cloud & DevOps", 
      icon: <Cloud className="w-6 h-6" />,
      skills: [
        { name: "AWS", level: 70, color: "text-accent" },
        { name: "Docker", level: 65, color: "text-primary" },
        { name: "Git/GitHub", level: 90, color: "text-secondary" },
        { name: "CI/CD", level: 60, color: "text-accent" },
        { name: "Linux", level: 75, color: "text-primary" }
      ]
    },
    {
      title: "Specialized Skills",
      icon: <Zap className="w-6 h-6" />,
      skills: [
        { name: "Discord Bot Development", level: 85, color: "text-primary" },
        { name: "Steam API Integration", level: 80, color: "text-secondary" },
        { name: "AI/ML APIs", level: 70, color: "text-accent" },
        { name: "Minecraft Plugin Dev", level: 65, color: "text-primary" },
        { name: "Automation Scripts", level: 85, color: "text-secondary" }
      ]
    },
    {
      title: "Tools & Technologies",
      icon: <Terminal className="w-6 h-6" />,
      skills: [
        { name: "VS Code", level: 95, color: "text-primary" },
        { name: "Replit", level: 85, color: "text-secondary" },
        { name: "Postman", level: 80, color: "text-accent" },
        { name: "Chrome DevTools", level: 85, color: "text-primary" },
        { name: "NPM/Yarn", level: 80, color: "text-secondary" }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-background-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="terminal-border rounded-lg p-4 inline-block mb-6">
            <div className="font-terminal text-sm">
              <span className="text-secondary">guest@asmit.dev:~$</span>
              <span className="text-muted-foreground ml-2">npm list --depth=0</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="neon-text-purple">Tech</span> <span className="text-foreground">Stack</span>
          </h2>
          <p className="text-muted-foreground font-terminal max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
            across various technologies and frameworks.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className="terminal-border rounded-lg p-6 hover-glow transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-primary">
                  {category.icon}
                </div>
                <h3 className="text-xl font-display text-foreground">
                  {category.title}
                </h3>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`font-terminal text-sm ${skill.color}`}>
                        {skill.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-terminal">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-card rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                          skill.level >= 80 ? 'from-secondary to-primary' :
                          skill.level >= 60 ? 'from-primary to-accent' :
                          'from-accent to-muted'
                        }`}
                        style={{ 
                          width: `${skill.level}%`,
                          boxShadow: `0 0 10px hsl(var(--primary) / 0.3)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Code className="w-8 h-8" />, value: "10+", label: "Languages" },
            { icon: <Server className="w-8 h-8" />, value: "15+", label: "Frameworks" },
            { icon: <GitBranch className="w-8 h-8" />, value: "50+", label: "Repositories" },
            { icon: <Cpu className="w-8 h-8" />, value: "24/7", label: "Learning" }
          ].map((stat, index) => (
            <div key={index} className="terminal-border rounded-lg p-6 text-center hover-glow">
              <div className="text-primary mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-2xl font-display text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-terminal">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;