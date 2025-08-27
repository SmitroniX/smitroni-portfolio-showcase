import { useState, useEffect, useRef } from 'react';
import { TerminalButton } from '@/components/ui/terminal-button';

const CODE_SNIPPETS = [
  "const greeting = 'Hello, World!';",
  "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
  "const array = [1, 2, 3].map(x => x * 2);",
  "if (condition) { return true; } else { return false; }",
  "const promise = new Promise((resolve) => resolve('Success'));",
  "class Developer { constructor(name) { this.name = name; } }",
  "const result = await fetch('/api/data').then(res => res.json());",
  "for (let i = 0; i < array.length; i++) { console.log(array[i]); }"
];

const TypingGame = () => {
  const [currentSnippet, setCurrentSnippet] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = () => {
    const randomSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    setCurrentSnippet(randomSnippet);
    setUserInput('');
    setStartTime(Date.now());
    setEndTime(null);
    setIsComplete(false);
    setErrors(0);
    setIsPlaying(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (value === currentSnippet) {
      setEndTime(Date.now());
      setIsComplete(true);
      setIsPlaying(false);
    }
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = currentSnippet.split(' ').length;
    return Math.round(wordsTyped / timeInMinutes);
  };

  const calculateAccuracy = () => {
    if (currentSnippet.length === 0) return 100;
    const correctChars = currentSnippet.length - errors;
    return Math.round((correctChars / currentSnippet.length) * 100);
  };

  const getCharacterStatus = (index: number) => {
    if (index >= userInput.length) return 'untyped';
    if (userInput[index] === currentSnippet[index]) return 'correct';
    return 'incorrect';
  };

  useEffect(() => {
    let errorCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== currentSnippet[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
  }, [userInput, currentSnippet]);

  return (
    <div className="terminal-border rounded-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-display text-primary mb-2">Code Typing Challenge</h3>
        <div className="font-terminal text-sm text-muted-foreground flex justify-center gap-4">
          {isComplete && (
            <>
              <span>WPM: <span className="text-secondary">{calculateWPM()}</span></span>
              <span>Accuracy: <span className="text-accent">{calculateAccuracy()}%</span></span>
            </>
          )}
        </div>
      </div>

      {currentSnippet && (
        <div className="mb-4">
          <div className="bg-card border border-primary/30 rounded p-4 font-mono text-sm mb-4 min-h-[100px] flex items-center">
            <div className="w-full">
              {currentSnippet.split('').map((char, index) => {
                const status = getCharacterStatus(index);
                return (
                  <span
                    key={index}
                    className={`
                      ${status === 'correct' ? 'text-secondary bg-secondary/20' : ''}
                      ${status === 'incorrect' ? 'text-red-400 bg-red-400/20' : ''}
                      ${status === 'untyped' ? 'text-muted-foreground' : ''}
                      ${index === userInput.length && isPlaying ? 'bg-primary/30 animate-blink' : ''}
                    `}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={!isPlaying}
            className="w-full bg-background border border-primary/30 rounded p-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
            placeholder={isPlaying ? "Start typing..." : "Click start to begin"}
          />
        </div>
      )}

      <div className="text-center space-y-2">
        {isComplete && (
          <div className="text-accent font-terminal text-sm mb-2 animate-neon-flicker">
            🎉 Completed! {calculateWPM()} WPM with {calculateAccuracy()}% accuracy!
          </div>
        )}
        
        <TerminalButton 
          variant={isPlaying ? "ghost" : "neon"} 
          size="sm" 
          onClick={startGame}
        >
          {currentSnippet ? 'New Challenge' : 'Start Challenge'}
        </TerminalButton>
      </div>
    </div>
  );
};

export default TypingGame;