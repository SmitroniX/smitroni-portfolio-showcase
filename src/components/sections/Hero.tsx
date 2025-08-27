import { useState, useEffect } from 'react';
import { Github, ExternalLink, ChevronDown } from 'lucide-react';
import { TerminalButton } from '@/components/ui/terminal-button';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Full-Stack Developer & Cloud Computing Enthusiast";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90" />
      </div>

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 z-10 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-primary text-xs animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        {/* Terminal Prompt */}
        <div className="terminal-border rounded-lg p-6 mb-8 font-terminal">
          <div className="flex items-center mb-4">
            <span className="text-secondary mr-2">guest@asmit.dev:~$</span>
            <span className="text-muted-foreground">whoami</span>
          </div>
          <div className="text-left">
            <div className="text-primary text-2xl mb-2">
              <span className="neon-text-cyan font-display font-bold text-4xl md:text-6xl mb-4 block">
                Asmit Jogdand
              </span>
              <span className="text-lg text-muted-foreground">@SmitroniX</span>
            </div>
          </div>
        </div>

        {/* Typing Animation */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-terminal">
            <span className="neon-text-green">&gt;</span> {text}
            {showCursor && <span className="animate-blink text-primary">█</span>}
          </h2>
        </div>

        {/* Location and Status */}
        <div className="terminal-border rounded-lg p-4 mb-8 font-terminal text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div>
              <span className="text-secondary">Location:</span>
              <div className="text-foreground">Mumbai, Maharashtra, India</div>
            </div>
            <div>
              <span className="text-secondary">Status:</span>
              <div className="text-secondary">Available for opportunities</div>
            </div>
            <div>
              <span className="text-secondary">Focus:</span>
              <div className="text-accent">B.Tech @ DY Patil Rait</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <TerminalButton variant="neon" size="lg" asChild>
            <a href="https://github.com/SmitroniX" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              View GitHub
            </a>
          </TerminalButton>
          <TerminalButton variant="ghost" size="lg" onClick={() => scrollToSection('projects')}>
            <ExternalLink className="w-5 h-5 mr-2" />
            Explore Projects
          </TerminalButton>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <TerminalButton
            variant="ghost"
            size="icon"
            onClick={() => scrollToSection('about')}
            className="rounded-full"
          >
            <ChevronDown className="w-6 h-6" />
          </TerminalButton>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-primary/30 rounded-full animate-float" />
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-secondary/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-20 w-12 h-12 border border-accent/30 rounded-full animate-float" style={{ animationDelay: '4s' }} />
    </section>
  );
};

export default Hero;