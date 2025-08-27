import { Github, Heart, Terminal, ArrowUp } from 'lucide-react';
import { TerminalButton } from '@/components/ui/terminal-button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-secondary border-t border-primary/20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Terminal className="w-6 h-6 text-primary" />
              <span className="font-display text-xl font-bold">
                <span className="neon-text-cyan">Asmit</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-foreground">dev</span>
              </span>
            </div>
            <p className="text-muted-foreground font-terminal text-sm leading-relaxed">
              Full-Stack Developer & Cloud Computing Enthusiast passionate about 
              creating innovative solutions and exploring cutting-edge technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg text-foreground">Quick Access</h4>
            <div className="space-y-2">
              {[
                { label: 'About Me', id: 'about' },
                { label: 'Projects', id: 'projects' },
                { label: 'Skills', id: 'skills' },
                { label: 'Contact', id: 'contact' }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="block font-terminal text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h4 className="font-display text-lg text-foreground">Connect</h4>
            <div className="space-y-3">
              <TerminalButton variant="ghost" size="sm" asChild>
                <a href="https://github.com/SmitroniX" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Profile
                </a>
              </TerminalButton>
              <div className="font-terminal text-sm text-muted-foreground">
                <span>ORCID:</span>
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

        {/* Terminal Status */}
        <div className="terminal-border rounded-lg p-4 mb-8">
          <div className="font-terminal text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-secondary">guest@asmit.dev:~$</span>
                <span className="text-muted-foreground">status</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-secondary">Online</span>
              </div>
            </div>
            <div className="mt-2 text-muted-foreground">
              System operational • Available for opportunities • Last updated: {currentYear}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <div className="flex items-center space-x-2 font-terminal text-sm text-muted-foreground mb-4 md:mb-0">
            <span>© {currentYear} Asmit Jogdand • Built with</span>
            <Heart className="w-4 h-4 text-accent" />
            <span>and lots of</span>
            <span className="neon-text-green">☕</span>
          </div>

          <TerminalButton
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="rounded-full"
          >
            <ArrowUp className="w-4 h-4" />
          </TerminalButton>
        </div>
      </div>
    </footer>
  );
};

export default Footer;