"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 4;

export default function Void2048() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 辅助函数：旋转矩阵 (用于处理不同方向的移动)
  const rotateGrid = (matrix: number[][]) => {
    return matrix[0].map((_, index) => matrix.map(col => col[index]).reverse());
  };

  // 添加随机数字 (2 或 4)
  const addRandomTile = useCallback((currentGrid: number[][]) => {
    const emptyCells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentGrid;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }, []);

  const initGrid = useCallback(() => {
    let empty = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    empty = addRandomTile(empty);
    empty = addRandomTile(empty);
    setGrid(empty);
    setScore(0);
    setGameOver(false);
  }, [addRandomTile]);

  useEffect(() => { initGrid(); }, [initGrid]);

  // 核心合并逻辑
  const slideAndMerge = (row: number[]) => {
    let line = row.filter(num => num !== 0);
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i + 1]) {
        line[i] *= 2;
        setScore(prev => prev + line[i]);
        line.splice(i + 1, 1);
      }
    }
    while (line.length < GRID_SIZE) line.push(0);
    return line;
  };

  const move = (direction: string) => {
    if (gameOver) return;
    let tempGrid = grid.map(row => [...row]);
    let rotatedCount = 0;

    // 根据方向旋转矩阵，使其变为“向左移动”
    if (direction === "UP") { tempGrid = rotateGrid(rotateGrid(rotateGrid(tempGrid))); rotatedCount = 1; }
    else if (direction === "RIGHT") { tempGrid = rotateGrid(rotateGrid(tempGrid)); rotatedCount = 2; }
    else if (direction === "DOWN") { tempGrid = rotateGrid(tempGrid); rotatedCount = 3; }

    let changed = false;
    const newGrid = tempGrid.map(row => {
      const nextRow = slideAndMerge(row);
      if (JSON.stringify(nextRow) !== JSON.stringify(row)) changed = true;
      return nextRow;
    });

    if (changed) {
      // 还原旋转方向
      let finalGrid = newGrid;
      for (let i = 0; i < (4 - rotatedCount) % 4; i++) finalGrid = rotateGrid(finalGrid);
      const withNew = addRandomTile(finalGrid);
      setGrid(withNew);
      
      // 检查是否结束
      if (isGameOver(withNew)) setGameOver(true);
    }
  };

  const isGameOver = (g: number[][]) => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (g[r][c] === 0) return false;
        if (r < GRID_SIZE - 1 && g[r][c] === g[r + 1][c]) return false;
        if (c < GRID_SIZE - 1 && g[r][c] === g[r][c + 1]) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move("LEFT");
      if (e.key === "ArrowRight") move("RIGHT");
      if (e.key === "ArrowUp") move("UP");
      if (e.key === "ArrowDown") move("DOWN");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[280px] mb-4 font-mono text-xs text-slate-400">
        <span>Score: {score}</span>
        <span>{gameOver ? "CRASHED" : "2048_VOID"}</span>
      </div>
      <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2 rounded-sm relative">
        {grid.flat().map((num, i) => (
          <motion.div 
            key={`${i}-${num}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-sm font-mono rounded-sm transition-colors ${
              num === 0 ? "bg-white text-transparent" : "bg-slate-900 text-white"
            }`}
          >
            {num !== 0 && num}
          </motion.div>
        ))}
        {gameOver && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <p className="text-slate-900 font-bold mb-4 font-mono">GAME OVER</p>
            <button onClick={initGrid} className="px-4 py-2 bg-slate-900 text-white text-xs font-mono uppercase">Retry</button>
          </div>
        )}
      </div>
    </div>
  );
}