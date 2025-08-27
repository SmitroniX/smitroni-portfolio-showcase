import { useState, useEffect } from 'react';
import { TerminalButton } from '@/components/ui/terminal-button';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = ['🚀', '💻', '⚡', '🎮', '🔥', '💎', '🌟', '🎯'];

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameWon(false);
    setIsPlaying(true);
  };

  const handleCardClick = (cardId: number) => {
    if (!isPlaying || flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard?.symbol === secondCard?.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches(prevMatches => prevMatches + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matches === 8) {
      setGameWon(true);
      setIsPlaying(false);
    }
  }, [matches]);

  return (
    <div className="terminal-border rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-display text-primary mb-2">Memory Matrix</h3>
        <div className="font-terminal text-sm text-muted-foreground flex justify-between">
          <span>Moves: <span className="text-secondary">{moves}</span></span>
          <span>Matches: <span className="text-accent">{matches}/8</span></span>
        </div>
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                aspect-square border border-primary/30 rounded cursor-pointer
                flex items-center justify-center text-2xl
                transition-all duration-300 hover:scale-105
                ${card.isFlipped || card.isMatched 
                  ? 'bg-card text-foreground' 
                  : 'bg-background hover:bg-card/50'
                }
                ${card.isMatched ? 'animate-glow-pulse' : ''}
              `}
              onClick={() => handleCardClick(card.id)}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </div>
          ))}
        </div>
      )}

      <div className="text-center space-y-2">
        {gameWon && (
          <div className="text-accent font-terminal text-sm mb-2 animate-neon-flicker">
            🎉 Congratulations! You won in {moves} moves!
          </div>
        )}
        
        <TerminalButton 
          variant={isPlaying ? "ghost" : "neon"} 
          size="sm" 
          onClick={initializeGame}
        >
          {cards.length === 0 ? 'Start Game' : 'New Game'}
        </TerminalButton>
      </div>
    </div>
  );
};

export default MemoryGame;