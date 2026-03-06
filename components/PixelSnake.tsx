"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

const SPEEDS = {
  EASY: 200,
  MEDIUM: 120,
  HARD: 70,
};

export default function PixelSnake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<keyof typeof SPEEDS>("MEDIUM");

  const directionRef = useRef(direction);

  const generateFood = useCallback(() => {
    let newX = 0, newY = 0, isValid = false;
    while (!isValid) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
      isValid = !snake.some((s) => s.x === newX && s.y === newY);
    }
    setFood({ x: newX, y: newY });
  }, [snake]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0); setGameOver(false); setIsPlaying(true);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === " " && (!isPlaying || gameOver)) { startGame(); return; }
      if (!isPlaying || gameOver) return;

      const { x, y } = directionRef.current;
      const key = e.key.toLowerCase();
      if ((key === "arrowup" || key === "w") && y !== 1) directionRef.current = { x: 0, y: -1 };
      else if ((key === "arrowdown" || key === "s") && y !== -1) directionRef.current = { x: 0, y: 1 };
      else if ((key === "arrowleft" || key === "a") && x !== 1) directionRef.current = { x: -1, y: 0 };
      else if ((key === "arrowright" || key === "d") && x !== -1) directionRef.current = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE || 
            prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true); setIsPlaying(false); return prev;
        }
        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1); generateFood();
        } else { newSnake.pop(); }
        return newSnake;
      });
    };
    const interval = setInterval(moveSnake, SPEEDS[difficulty]);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, generateFood, difficulty]);

  return (
    <div className="flex flex-col items-center">
      {!isPlaying && (
        <div className="flex gap-4 mb-6">
          {(Object.keys(SPEEDS) as Array<keyof typeof SPEEDS>).map((level) => (
            <button key={level} onClick={() => setDifficulty(level)}
              className={`text-[10px] font-mono px-2 py-1 transition-all ${difficulty === level ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
              {level}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between w-full max-w-[300px] mb-4 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
        <span>Bugs_Caught: {score}</span>
        <span>{difficulty}</span>
      </div>

      <motion.div className="p-2 bg-white border border-slate-200 shadow-sm relative rounded-sm">
        <div className="grid gap-[1px] bg-slate-100" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE, y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div key={i} className={`relative w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200
                ${isHead ? "bg-slate-900 z-10 scale-110 shadow-sm" : 
                  isBody ? "bg-slate-600" : 
                  isFood ? "bg-cyan-400/20" : "bg-slate-50"}`}>
                
                {/* 🌟 怪兽之眼：只在头部显示 */}
                {isHead && (
                  <div className="absolute inset-0 flex justify-around items-center px-[2px]">
                    <div className="w-[2px] h-[2px] bg-cyan-400 animate-pulse" />
                    <div className="w-[2px] h-[2px] bg-cyan-400 animate-pulse" />
                  </div>
                )}

                {/* 🌟 Bug 特效：带点霓虹感的闪烁 Bug */}
                {isFood && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-75" />
                    <div className="w-1.5 h-1.5 bg-cyan-600 absolute rotate-45" />
                    {/* 小触角 */}
                    <div className="absolute -top-1 w-[1px] h-1 bg-cyan-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {(!isPlaying || gameOver) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
              <p className="text-slate-900 font-bold mb-4 font-mono text-xs tracking-tighter uppercase">
                {gameOver ? "Debug_Session_Terminated" : "Initialize_Hunter.exe"}
              </p>
              <button onClick={startGame} className="px-6 py-2 bg-slate-900 text-white text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-cyan-950 transition-all">
                Execute Space
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}