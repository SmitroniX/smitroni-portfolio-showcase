import { useState } from 'react';
import { Gamepad2, Brain, Keyboard, Trophy } from 'lucide-react';
import { TerminalButton } from '@/components/ui/terminal-button';
import SnakeGame from '@/components/games/SnakeGame';
import MemoryGame from '@/components/games/MemoryGame';
import TypingGame from '@/components/games/TypingGame';

const Games = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'snake',
      name: 'Terminal Snake',
      icon: <Gamepad2 className="w-6 h-6" />,
      description: 'Classic snake game with a terminal twist',
      component: <SnakeGame />
    },
    {
      id: 'memory',
      name: 'Memory Matrix',
      icon: <Brain className="w-6 h-6" />,
      description: 'Test your memory with coding symbols',
      component: <MemoryGame />
    },
    {
      id: 'typing',
      name: 'Code Typing',
      icon: <Keyboard className="w-6 h-6" />,
      description: 'Improve your coding typing speed',
      component: <TypingGame />
    }
  ];

  return (
    <section id="games" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="terminal-border rounded-lg p-4 inline-block mb-6 animate-slide-in-up">
            <div className="font-terminal text-sm">
              <span className="text-secondary">guest@asmit.dev:~$</span>
              <span className="text-muted-foreground ml-2">./play_games.sh</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 animate-slide-in-up">
            <span className="neon-text-purple">Interactive</span> <span className="text-foreground">Games</span>
          </h2>
          <p className="text-muted-foreground font-terminal max-w-2xl mx-auto animate-slide-in-up">
            Take a break and test your skills with these fun, coding-themed mini-games.
            Built with React and pure JavaScript logic!
          </p>
        </div>

        {/* Game Selection */}
        {!activeGame && (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {games.map((game, index) => (
              <div 
                key={game.id}
                className="terminal-border rounded-lg p-6 hover-glow group transition-all duration-300 animate-slide-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="text-center">
                  <div className="text-primary mb-4 group-hover:text-secondary transition-colors animate-bounce-gentle">
                    {game.icon}
                  </div>
                  <h3 className="font-display text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 font-terminal">
                    {game.description}
                  </p>
                  <TerminalButton variant="ghost" size="sm">
                    Play Game
                  </TerminalButton>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Game */}
        {activeGame && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <TerminalButton 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveGame(null)}
                className="mb-4"
              >
                ← Back to Games
              </TerminalButton>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {games.find(game => game.id === activeGame)?.component}
            </div>
          </div>
        )}

        {/* High Score Placeholder */}
        {!activeGame && (
          <div className="mt-16">
            <div className="terminal-border rounded-lg p-8 text-center animate-slide-in-up">
              <div className="text-primary mb-4">
                <Trophy className="w-12 h-12 mx-auto animate-rotate-slow" />
              </div>
              <h3 className="text-2xl font-display text-foreground mb-4">
                Challenge Yourself!
              </h3>
              <p className="text-muted-foreground font-terminal max-w-md mx-auto">
                These games are designed to be fun while keeping your coding skills sharp.
                Each game tests different aspects of programming logic and problem-solving.
              </p>
            </div>
          </div>
        )}

        {/* Floating Game Elements */}
        <div className="absolute top-20 right-10 w-16 h-16 text-primary/20 animate-particle-float">
          <Gamepad2 className="w-full h-full" />
        </div>
        <div className="absolute bottom-32 left-20 w-12 h-12 text-secondary/20 animate-particle-float" style={{ animationDelay: '1s' }}>
          <Brain className="w-full h-full" />
        </div>
        <div className="absolute top-1/2 right-32 w-14 h-14 text-accent/20 animate-particle-float" style={{ animationDelay: '2s' }}>
          <Keyboard className="w-full h-full" />
        </div>
      </div>
    </section>
  );
};

export default Games;