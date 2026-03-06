"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 450;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 6;
const BRICK_HEIGHT = 15;
const BRICK_GAP = 6;

type Brick = { x: number; y: number; active: boolean };

export default function VoidBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const state = useRef({
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 30,
    dx: 3,
    dy: -3,
    paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    bricks: [] as Brick[],
  });

  // 初始化砖块
  const initBricks = useCallback(() => {
    const bricks: Brick[] = [];
    const totalBrickWidth = BRICK_COLS * ( (CANVAS_WIDTH - 40) / BRICK_COLS );
    const startX = (CANVAS_WIDTH - totalBrickWidth) / 2;
    
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: startX + c * (totalBrickWidth / BRICK_COLS),
          y: 40 + r * (BRICK_HEIGHT + BRICK_GAP),
          active: true,
        });
      }
    }
    state.current.bricks = bricks;
  }, []);

  const resetGame = useCallback(() => {
    state.current.ballX = CANVAS_WIDTH / 2;
    state.current.ballY = CANVAS_HEIGHT - 30;
    state.current.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
    state.current.dy = -3;
    state.current.paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    initBricks();
    setScore(0);
    setGameOver(false);
    setWin(false);
    setIsPlaying(true);
  }, [initBricks]);

  // 监听鼠标/触摸移动挡板
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
        state.current.paddleX = relativeX - PADDLE_WIDTH / 2;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver || win) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      const s = state.current;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 1. 绘制砖块
      s.bricks.forEach((b) => {
        if (!b.active) return;
        ctx.fillStyle = "#94a3b8"; // 砖块灰色
        ctx.fillRect(b.x + 1, b.y, (CANVAS_WIDTH - 40) / BRICK_COLS - 2, BRICK_HEIGHT);
      });

      // 2. 绘制挡板
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(s.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

      // 3. 绘制球
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#22d3ee"; // 霓虹青球心
      ctx.fill();
      ctx.closePath();

      // 4. 碰撞检测：墙壁
      if (s.ballX + s.dx > CANVAS_WIDTH - BALL_RADIUS || s.ballX + s.dx < BALL_RADIUS) s.dx = -s.dx;
      if (s.ballY + s.dy < BALL_RADIUS) s.dy = -s.dy;
      else if (s.ballY + s.dy > CANVAS_HEIGHT - BALL_RADIUS - 10) {
        // 碰撞检测：挡板
        if (s.ballX > s.paddleX && s.ballX < s.paddleX + PADDLE_WIDTH) {
          s.dy = -s.dy;
          // 根据击中位置改变反弹角度
          const hitPos = (s.ballX - (s.paddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
          s.dx = hitPos * 4;
        } else {
          setGameOver(true);
          setIsPlaying(false);
        }
      }

      // 5. 碰撞检测：砖块
      s.bricks.forEach((b) => {
        if (!b.active) return;
        const brickW = (CANVAS_WIDTH - 40) / BRICK_COLS;
        if (s.ballX > b.x && s.ballX < b.x + brickW && s.ballY > b.y && s.ballY < b.y + BRICK_HEIGHT) {
          s.dy = -s.dy;
          b.active = false;
          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore === BRICK_ROWS * BRICK_COLS) {
              setWin(true);
              setIsPlaying(false);
            }
            return newScore;
          });
        }
      });

      s.ballX += s.dx;
      s.ballY += s.dy;
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, gameOver, win]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[400px] mb-4 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
        <span>Bricks_Left: {BRICK_ROWS * BRICK_COLS - score}</span>
        <span>{win ? "SYSTEM_CLEARED" : "VOID_BREAKER"}</span>
      </div>
      
      <div className="relative bg-white border border-slate-100 p-2 shadow-sm rounded-sm overflow-hidden">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-slate-50/30" />
        
        {(!isPlaying || gameOver || win) && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
            <p className="text-slate-900 font-bold mb-4 font-mono text-xs uppercase tracking-tighter">
              {win ? "Success: Logic Restored" : gameOver ? "Error: Collision Failure" : "Initialize_Breaker"}
            </p>
            <button onClick={resetGame} className="px-8 py-3 bg-slate-900 text-white text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-cyan-900 transition-all">
              {gameOver || win ? "Re-Boot" : "Start_Session"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}