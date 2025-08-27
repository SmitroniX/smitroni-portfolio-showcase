import { useState } from 'react';
import { Mail, Github, Send, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { TerminalButton } from '@/components/ui/terminal-button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="terminal-border rounded-lg p-4 inline-block mb-6">
            <div className="font-terminal text-sm">
              <span className="text-secondary">guest@asmit.dev:~$</span>
              <span className="text-muted-foreground ml-2">curl -X POST /contact</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="neon-text-purple">Get</span> <span className="text-foreground">In Touch</span>
          </h2>
          <p className="text-muted-foreground font-terminal max-w-2xl mx-auto">
            Ready to collaborate on exciting projects or discuss opportunities? 
            Let's connect and build something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="terminal-border rounded-lg p-6">
              <h3 className="text-xl font-display text-primary mb-6">Connection Established</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-secondary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-terminal text-sm text-muted-foreground">Location</div>
                    <div className="text-foreground">Mumbai, Maharashtra, India</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-secondary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-terminal text-sm text-muted-foreground">Availability</div>
                    <div className="text-secondary">Open for opportunities</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-primary">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-terminal text-sm text-muted-foreground">GitHub</div>
                    <a 
                      href="https://github.com/SmitroniX" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary transition-colors neon-text-cyan"
                    >
                      @SmitroniX
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Connect */}
            <div className="terminal-border rounded-lg p-6">
              <h4 className="text-lg font-display text-foreground mb-4">Quick Connect</h4>
              <div className="flex flex-col space-y-3">
                <TerminalButton variant="neon" size="lg" asChild>
                  <a href="https://github.com/SmitroniX" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 mr-2" />
                    Follow on GitHub
                  </a>
                </TerminalButton>
                <TerminalButton variant="ghost" size="lg" asChild>
                  <a href="https://orcid.org/0009-0000-2876-7009" target="_blank" rel="noopener noreferrer">
                    <Mail className="w-5 h-5 mr-2" />
                    View ORCID Profile
                  </a>
                </TerminalButton>
              </div>
            </div>

            {/* Status */}
            <div className="terminal-border rounded-lg p-6">
              <div className="font-terminal text-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                  <span className="text-secondary">Status: Available</span>
                </div>
                <div className="text-muted-foreground">
                  Currently accepting new opportunities and collaborations.
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="terminal-border rounded-lg p-6">
            <h3 className="text-xl font-display text-primary mb-6">Send Message</h3>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h4 className="text-lg font-display text-secondary mb-2">Message Sent!</h4>
                <p className="text-muted-foreground font-terminal">
                  Thanks for reaching out. I'll get back to you soon!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-terminal text-muted-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-input border border-border rounded-md px-4 py-3 text-foreground font-terminal focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-terminal text-muted-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-input border border-border rounded-md px-4 py-3 text-foreground font-terminal focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-terminal text-muted-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-input border border-border rounded-md px-4 py-3 text-foreground font-terminal focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-terminal text-muted-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-input border border-border rounded-md px-4 py-3 text-foreground font-terminal focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                </div>

                <TerminalButton type="submit" variant="neon" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </TerminalButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;