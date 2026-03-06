"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 450;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 20;
const INVADER_ROWS = 4;
const INVADER_COLS = 7;
const PIXEL_SIZE = 3;

// 像素侵略者矩阵 (8x8)
const INVADER_MATRIX = [
  [0,0,1,0,0,1,0,0],
  [0,0,0,1,1,0,0,0],
  [0,1,1,1,1,1,1,0],
  [1,1,0,1,1,0,1,1],
  [1,1,1,1,1,1,1,1],
  [0,0,1,0,0,1,0,0],
  [0,1,0,1,1,0,1,0],
  [1,0,1,0,0,1,0,1]
];

type Invader = { x: number; y: number; active: boolean };
type Bullet = { x: number; y: number };

export default function VoidInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const state = useRef({
    playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    invaders: [] as Invader[],
    bullets: [] as Bullet[],
    invaderDirection: 1, // 1 为向右，-1 为向左
    invaderMoveTimer: 0,
    lastFireTime: 0,
  });

  const initGame = useCallback(() => {
    const invaders: Invader[] = [];
    for (let r = 0; r < INVADER_ROWS; r++) {
      for (let c = 0; c < INVADER_COLS; c++) {
        invaders.push({
          x: 50 + c * 45,
          y: 50 + r * 35,
          active: true,
        });
      }
    }
    state.current.invaders = invaders;
    state.current.bullets = [];
    state.current.playerX = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    state.current.invaderDirection = 1;
    setScore(0); setGameOver(false); setWin(false); setIsPlaying(true);
  }, []);

  const fire = useCallback(() => {
    const now = Date.now();
    if (now - state.current.lastFireTime > 400) { // 射速限制
      state.current.bullets.push({
        x: state.current.playerX + PLAYER_WIDTH / 2,
        y: CANVAS_HEIGHT - 40,
      });
      state.current.lastFireTime = now;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") state.current.playerX = Math.max(0, state.current.playerX - 15);
      if (e.key === "ArrowRight" || e.key === "d") state.current.playerX = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.current.playerX + 15);
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        if (!isPlaying || gameOver || win) initGame();
        else fire();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, win, initGame, fire]);

  useEffect(() => {
    if (!isPlaying || gameOver || win) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const drawPixelObj = (ctx: CanvasRenderingContext2D, matrix: number[][], x: number, y: number, color: string) => {
      matrix.forEach((row, rIdx) => {
        row.forEach((pixel, cIdx) => {
          if (pixel === 1) {
            ctx.fillStyle = color;
            ctx.fillRect(x + cIdx * 3, y + rIdx * 3, 3, 3);
          }
        });
      });
    };

    const update = () => {
      const s = state.current;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 1. 移动敌群
      s.invaderMoveTimer++;
      if (s.invaderMoveTimer > 30) { // 每 30 帧移动一步
        let hitEdge = false;
        s.invaders.forEach(inv => {
          if (!inv.active) return;
          inv.x += 10 * s.invaderDirection;
          if (inv.x > CANVAS_WIDTH - 40 || inv.x < 10) hitEdge = true;
        });

        if (hitEdge) {
          s.invaderDirection *= -1;
          s.invaders.forEach(inv => { if (inv.active) inv.y += 10; });
        }
        s.invaderMoveTimer = 0;
      }

      // 2. 绘制并移动子弹
      s.bullets = s.bullets.filter(b => {
        b.y -= 5;
        ctx.fillStyle = "#22d3ee"; // 霓虹青子弹
        ctx.fillRect(b.x, b.y, 2, 6);
        
        // 子弹碰撞检测
        let hit = false;
        s.invaders.forEach(inv => {
          if (inv.active && b.x > inv.x && b.x < inv.x + 24 && b.y > inv.y && b.y < inv.y + 24) {
            inv.active = false;
            hit = true;
            setScore(prev => prev + 10);
          }
        });
        return !hit && b.y > 0;
      });

      // 3. 绘制玩家（逻辑探针）
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(s.playerX, CANVAS_HEIGHT - 30, PLAYER_WIDTH, 10);
      ctx.fillRect(s.playerX + PLAYER_WIDTH/2 - 2, CANVAS_HEIGHT - 35, 4, 5);

      // 4. 绘制侵略者并检查败北
      let activeCount = 0;
      s.invaders.forEach(inv => {
        if (!inv.active) return;
        activeCount++;
        drawPixelObj(ctx, INVADER_MATRIX, inv.x, inv.y, "#64748b");
        if (inv.y > CANVAS_HEIGHT - 60) setGameOver(true);
      });

      if (activeCount === 0) setWin(true);
      if (win || gameOver) setIsPlaying(false);

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, gameOver, win]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[400px] mb-4 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
        <span>Score: {score}</span>
        <span>{win ? "VOID_SECURED" : "INVASION_PROGRESS"}</span>
      </div>
      <div className="relative bg-white border border-slate-100 p-2 shadow-sm">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-slate-50/30" />
        {(!isPlaying || gameOver || win) && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
            <p className="text-slate-900 font-bold mb-4 font-mono text-xs italic uppercase">
              {win ? "Logic: Optimized" : gameOver ? "Core: Compromised" : "Accessing_Invaders"}
            </p>
            <button onClick={initGame} className="px-8 py-3 bg-slate-900 text-white text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-cyan-900 transition-all">
              Execute Space
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-[9px] font-mono text-slate-300">A/D to Move // Space to Fire</p>
    </div>
  );
}