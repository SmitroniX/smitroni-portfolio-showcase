import { Code, Cloud, Database, Zap } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Computing",
      description: "Passionate about cloud technologies and infrastructure"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Full-Stack Development", 
      description: "Proficient in modern web technologies and frameworks"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Structures & Algorithms",
      description: "Strong foundation with curated Python repositories"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Python Enthusiast",
      description: "Captivated by Python's versatility and power"
    }
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="terminal-border rounded-lg p-4 inline-block mb-6">
            <div className="font-terminal text-sm">
              <span className="text-secondary">guest@asmit.dev:~$</span>
              <span className="text-muted-foreground ml-2">cat about.txt</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="neon-text-cyan">About</span> <span className="text-foreground">Me</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <div className="space-y-6">
            <div className="terminal-border rounded-lg p-6">
              <h3 className="text-xl font-display text-primary mb-4">console.log("Hello, World!");</h3>
              <div className="space-y-4 text-muted-foreground font-terminal">
                <p>
                  I'm <span className="text-primary">Asmit Jogdand</span>, a passionate B.Tech student at 
                  <span className="text-secondary"> DY Patil Rait, New Mumbai</span>, with a deep fascination 
                  for cloud computing and modern web development.
                </p>
                <p>
                  My journey in tech revolves around creating elegant solutions with 
                  <span className="text-accent"> Python</span>, building responsive web applications, 
                  and exploring the vast possibilities of cloud infrastructure.
                </p>
                <p>
                  When I'm not coding, you'll find me curating DSA repositories, 
                  experimenting with new technologies, or contributing to open-source projects 
                  that make a difference.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="terminal-border rounded-lg p-4 text-center">
                <div className="text-2xl font-display text-primary mb-1">2024</div>
                <div className="text-sm text-muted-foreground">Current Year</div>
              </div>
              <div className="terminal-border rounded-lg p-4 text-center">
                <div className="text-2xl font-display text-secondary mb-1">Mumbai</div>
                <div className="text-sm text-muted-foreground">Based In</div>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <div 
                key={index}
                className="terminal-border rounded-lg p-6 hover-glow transition-all duration-300 group"
              >
                <div className="text-primary mb-4 group-hover:text-secondary transition-colors">
                  {item.icon}
                </div>
                <h4 className="font-display text-lg mb-2 text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ORCID Section */}
        <div className="mt-12 text-center">
          <div className="terminal-border rounded-lg p-4 inline-block">
            <div className="font-terminal text-sm">
              <span className="text-muted-foreground">ORCID ID:</span>
              <a 
                href="https://orcid.org/0009-0000-2876-7009" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors ml-2 neon-text-cyan"
              >
                0009-0000-2876-7009
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;