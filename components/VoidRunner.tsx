"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// 🌟 核心调优：数值经过严密计算
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 180; // 稍微加高画布
const GRAVITY = 0.8;       // 增加重力感
const JUMP_FORCE = -9;     // 削弱初速度，单跳高度约 50px
const GROUND_Y = 150;
const DINO_X = 50;
const PIXEL_SIZE = 3;

const OBSTACLE_LIB = {
  // 1级：矮 Bug (单跳即过)
  BUG: {
    matrix: [[0,1,0],[1,1,1],[0,1,0]],
    isPit: false, isAir: false
  },
  // 2级：长地刺 (需要跳得准)
  LONG_SPIKES: {
    matrix: [[1,0,1,0,1],[1,1,1,1,1]],
    isPit: false, isAir: false
  },
  // 3级：巨型单体 (必须二段跳！高度 15行 * 3px = 45px)
  MEGA_WALL: {
    matrix: [
      [1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1],
      [1,0,1],[1,1,1],[1,0,1],[1,1,1],[1,0,1],
      [1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]
    ],
    isPit: false, isAir: false
  },
  // 4级：悬浮的“致命数据” (要从下面走，或者跳得极高)
  CYBER_BIRD: {
    matrix: [[1,0,1],[0,1,0],[1,0,1]],
    isPit: false, isAir: true // 悬浮高度在空中
  },
  // 5级：虚空深坑 (必须二段跳跨越)
  VOID_PIT: {
    matrix: [],
    isPit: true, width: 70 
  }
};

const CAT_FRAMES = [
  [[0,0,1,0,0,0,1,0],[0,1,1,1,1,1,1,0],[1,1,2,1,1,2,1,1],[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,0],[0,1,0,1,0,1,0,0],[0,1,0,1,0,1,0,0]],
  [[0,0,1,0,0,0,1,0],[0,1,1,1,1,1,1,0],[1,1,2,1,1,2,1,1],[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,0],[0,0,1,0,1,0,1,0],[0,0,1,0,1,0,1,0]]
];

type ObstacleType = keyof typeof OBSTACLE_LIB;
type Obstacle = { x: number; type: ObstacleType; width: number; height: number; isPit: boolean; isAir: boolean };

export default function VoidRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const state = useRef({
    dinoY: GROUND_Y,
    velocityY: 0,
    jumpCount: 0,
    obstacles: [] as Obstacle[],
    frame: 0,
    gameSpeed: 6,
  });

  const drawPixelObject = (ctx: CanvasRenderingContext2D, matrix: number[][], x: number, y: number, color1 = "#0f172a", color2 = "#22d3ee") => {
    matrix.forEach((row, rIdx) => {
      row.forEach((pixel, cIdx) => {
        if (pixel === 0) return;
        ctx.fillStyle = pixel === 1 ? color1 : color2;
        ctx.fillRect(x + cIdx * PIXEL_SIZE, y + rIdx * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      });
    });
  };

  const resetGame = useCallback(() => {
    state.current = { dinoY: GROUND_Y, velocityY: 0, jumpCount: 0, obstacles: [], frame: 0, gameSpeed: 6 };
    setScore(0); setGameOver(false); setIsPlaying(true);
  }, []);

  const jump = useCallback(() => {
    if (state.current.jumpCount < 2) {
      state.current.velocityY = JUMP_FORCE;
      state.current.jumpCount++;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ([" ", "ArrowUp", "w"].includes(e.key)) {
        e.preventDefault();
        if (!isPlaying || gameOver) resetGame(); else jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, resetGame, jump]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      const s = state.current;
      s.frame++;

      s.velocityY += GRAVITY;
      s.dinoY += s.velocityY;
      
      if (s.dinoY > GROUND_Y) {
        s.dinoY = GROUND_Y;
        s.velocityY = 0;
        s.jumpCount = 0;
      }

      // 障碍物生成频率加快
      if (s.frame % 80 === 0) {
        const keys = Object.keys(OBSTACLE_LIB) as ObstacleType[];
        const type = keys[Math.floor(Math.random() * keys.length)];
        const config = OBSTACLE_LIB[type];
        s.obstacles.push({
          x: CANVAS_WIDTH,
          type: type,
          isPit: config.isPit,
          isAir: config.isAir,
          width: config.isPit ? config.width : (config.matrix[0]?.length || 0) * PIXEL_SIZE,
          height: config.isPit ? 0 : (config.matrix.length || 0) * PIXEL_SIZE,
        });
      }

      s.obstacles = s.obstacles.filter((obs) => {
        obs.x -= s.gameSpeed;
        const catRect = { left: DINO_X + 6, right: DINO_X + 18, top: s.dinoY - 20, bottom: s.dinoY };
        
        // 🌟 动态计算障碍物的垂直位置
        const obsTop = obs.isAir ? GROUND_Y - 60 : GROUND_Y - obs.height;
        const obsBottom = obs.isAir ? GROUND_Y - 60 + obs.height : GROUND_Y;
        const obsRect = { left: obs.x, right: obs.x + obs.width, top: obsTop, bottom: obsBottom };

        if (obs.isPit) {
          if (catRect.right > obsRect.left && catRect.left < obsRect.right && s.dinoY >= GROUND_Y) {
            setGameOver(true); setIsPlaying(false);
          }
        } else {
          if (catRect.right > obsRect.left && catRect.left < obsRect.right && catRect.bottom > obsRect.top && catRect.top < obsRect.bottom) {
            setGameOver(true); setIsPlaying(false);
          }
        }
        return obs.x > -100;
      });

      if (s.frame % 400 === 0) s.gameSpeed += 0.4;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 动态地平线
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.beginPath();
      let curX = 0;
      s.obstacles.filter(o => o.isPit).sort((a,b) => a.x - b.x).forEach(pit => {
        ctx.moveTo(curX, GROUND_Y);
        ctx.lineTo(Math.max(curX, pit.x), GROUND_Y);
        curX = pit.x + pit.width;
      });
      ctx.moveTo(curX, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
      ctx.stroke();

      const currentFrame = Math.floor(s.frame / 8) % 2;
      drawPixelObject(ctx, CAT_FRAMES[currentFrame], DINO_X, s.dinoY - 24);

      s.obstacles.forEach((obs) => {
        if (!obs.isPit) {
          const drawY = obs.isAir ? GROUND_Y - 60 : GROUND_Y - obs.height;
          drawPixelObject(ctx, OBSTACLE_LIB[obs.type].matrix as number[][], obs.x, drawY, "#64748b");
        } else {
          ctx.fillStyle = "#f1f5f9";
          ctx.fillRect(obs.x, GROUND_Y, obs.width, 30);
        }
      });

      setScore(Math.floor(s.frame / 10));
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[600px] mb-4 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
        <span>Dist: {score}m</span>
        <span>{gameOver ? "VOID_CRASH" : "LOGIC_RUNNING"}</span>
      </div>
      <div className="relative bg-white border border-slate-100 p-2 shadow-sm rounded-sm">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-slate-50/20" />
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
            {gameOver && <p className="text-slate-900 font-bold mb-4 font-mono text-xs italic tracking-tighter">DATA_CORRUPTION_DETECTED</p>}
            <button onClick={resetGame} className="px-8 py-3 bg-slate-900 text-white text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-cyan-900 transition-all shadow-xl">
              {gameOver ? "Re-Boot" : "Start_Void"}
            </button>
            <p className="mt-4 text-[9px] text-slate-400 font-mono">Double Tap Space for High Jump</p>
          </div>
        )}
      </div>
    </div>
  );
}