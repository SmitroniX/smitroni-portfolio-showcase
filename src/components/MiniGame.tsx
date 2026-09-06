import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Gamepad2, Volume2 } from 'lucide-react';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

export const MiniGame: React.FC = () => {
  const GRID_SIZE = 16;
  const INITIAL_SNAKE = [
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 8, y: 10 },
  ];

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 4, y: 4 });
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 0, y: -1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  const generateFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const collides = currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y);
      if (!collides) break;
    }
    return newFood;
  };

  const startGame = () => {
    sounds.playWarp();
    setSnake(INITIAL_SNAKE);
    setDir({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const restartGame = () => {
    startGame();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      if (['ArrowUp', 'KeyW'].includes(e.code) && dirRef.current.y === 0) {
        setDir({ x: 0, y: -1 });
        sounds.playKeyTick();
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && dirRef.current.y === 0) {
        setDir({ x: 0, y: 1 });
        sounds.playKeyTick();
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && dirRef.current.x === 0) {
        setDir({ x: -1, y: 0 });
        sounds.playKeyTick();
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && dirRef.current.x === 0) {
        setDir({ x: 1, y: 0 });
        sounds.playKeyTick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        head.x += dirRef.current.x;
        head.y += dirRef.current.y;

        // Collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          sounds.playClick();
          return prevSnake;
        }

        // Collision with self
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          sounds.playClick();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Ate food
        if (head.x === food.x && head.y === food.y) {
          sounds.playLaser();
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) setHighScore(nextScore);
            if (nextScore % 50 === 0) {
              confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
            }
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, highScore]);

  return (
    <section id="playground" className="py-24 relative overflow-hidden bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF9D] uppercase tracking-widest font-bold">
              <span>04 //</span> GAMING LAB & BREAK
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase mt-2">
              Cyber <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-emerald-400">Snake</span> Sandbox
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-mono mt-4 md:mt-0 max-w-md">
            &ldquo;Gaming inspires many of my side projects.&rdquo; Take a quick neural reboot and hit the highest score.
          </p>
        </div>

        {/* Game Arena Card */}
        <div className="max-w-xl mx-auto cyber-card rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(0,255,157,0.1)]">
          
          {/* Top HUD */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Gamepad2 className="w-4 h-4 text-[#00FF9D]" />
              <span>RETRO KERNEL // v1.0</span>
            </div>
            <div className="flex items-center gap-6 font-mono text-sm">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500 text-xs">SCORE:</span>
                <span className="text-[#00FF9D] font-bold text-base">{score}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-500 text-xs">BEST:</span>
                <span className="text-amber-400 font-bold text-base">{highScore}</span>
              </div>
            </div>
          </div>

          {/* Grid Canvas */}
          <div className="relative aspect-square w-full max-w-[380px] mx-auto bg-black/90 rounded-xl border border-slate-800 p-2 overflow-hidden shadow-inner">
            
            {/* Grid Cells */}
            <div
              className="grid w-full h-full gap-0.5"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);

                const isHead = snake[0].x === x && snake[0].y === y;
                const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={index}
                    className={`rounded-sm transition-colors duration-75 ${
                      isHead
                        ? 'bg-[#FF6B00] shadow-[0_0_8px_#FF6B00]'
                        : isBody
                        ? 'bg-[#00F0FF] shadow-[0_0_4px_#00F0FF]'
                        : isFood
                        ? 'bg-[#00FF9D] shadow-[0_0_10px_#00FF9D] animate-pulse'
                        : 'bg-slate-900/40'
                    }`}
                  />
                );
              })}
            </div>

            {/* Overlay if not playing */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                {gameOver ? (
                  <>
                    <p className="text-rose-500 font-mono text-sm tracking-widest uppercase mb-1 font-bold">
                      SYSTEM OVERLOAD // GAME OVER
                    </p>
                    <p className="text-3xl font-black text-white font-display mb-4">
                      Score: {score}
                    </p>
                    <button
                      onClick={restartGame}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-amber-500 text-black font-bold font-mono text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.5)] hover:scale-105 active:scale-95 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" /> Reboot Sandbox
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[#00FF9D] font-mono text-xs tracking-widest uppercase mb-2">
                      ARCADE PROTOCOL
                    </p>
                    <h3 className="text-2xl font-bold font-display text-white mb-2">
                      Ready, Player?
                    </h3>
                    <p className="text-slate-400 text-xs font-mono mb-6 max-w-xs">
                      Use W, A, S, D or Arrow Keys to navigate and capture the glowing data packets.
                    </p>
                    <button
                      onClick={startGame}
                      className="px-8 py-3 rounded-xl bg-[#00FF9D] hover:bg-emerald-400 text-black font-bold font-mono text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_25px_rgba(0,255,157,0.4)] hover:scale-105 active:scale-95 transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Game
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Controls hint & Mobile directional pad */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>CONTROLS:</span>
              <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">W</kbd>
              <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">A</kbd>
              <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">S</kbd>
              <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">D</kbd>
              <span>or Arrow Keys</span>
            </div>

            {/* Mobile virtual directional buttons */}
            <div className="sm:hidden grid grid-cols-3 gap-2 w-48">
              <div />
              <button
                onClick={() => {
                  if (dirRef.current.y === 0) setDir({ x: 0, y: -1 });
                }}
                className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-center font-bold"
              >
                ▲
              </button>
              <div />
              <button
                onClick={() => {
                  if (dirRef.current.x === 0) setDir({ x: -1, y: 0 });
                }}
                className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-center font-bold"
              >
                ◀
              </button>
              <button
                onClick={() => {
                  if (dirRef.current.y === 0) setDir({ x: 0, y: 1 });
                }}
                className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-center font-bold"
              >
                ▼
              </button>
              <button
                onClick={() => {
                  if (dirRef.current.x === 0) setDir({ x: 1, y: 0 });
                }}
                className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-center font-bold"
              >
                ▶
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
