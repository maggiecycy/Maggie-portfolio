"use client";

import { useState, useEffect, useCallback } from "react";

const SIZE = 10;
const MINES_COUNT = 15;

type Cell = { val: number | "M"; revealed: boolean; flagged: boolean };

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [status, setStatus] = useState<"PLAYING" | "WON" | "LOST">("PLAYING");

  const initBoard = useCallback(() => {
    let newBoard: Cell[][] = Array(SIZE).fill(null).map(() => 
      Array(SIZE).fill(null).map(() => ({ val: 0, revealed: false, flagged: false }))
    );

    // 1. 埋雷
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      if (newBoard[r][c].val !== "M") {
        newBoard[r][c].val = "M";
        minesPlaced++;
      }
    }

    // 2. 计算数字
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (newBoard[r][c].val === "M") continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (r + dr >= 0 && r + dr < SIZE && c + dc >= 0 && c + dc < SIZE) {
              if (newBoard[r + dr][c + dc].val === "M") count++;
            }
          }
        }
        newBoard[r][c].val = count;
      }
    }
    setBoard(newBoard);
    setStatus("PLAYING");
  }, []);

  useEffect(() => { initBoard(); }, [initBoard]);

  const reveal = (r: number, c: number) => {
    if (status !== "PLAYING" || board[r][c].revealed || board[r][c].flagged) return;
    
    let newBoard = board.map(row => row.map(cell => ({...cell})));
    
    if (newBoard[r][c].val === "M") {
      setStatus("LOST");
      newBoard.forEach(row => row.forEach(cell => { if (cell.val === "M") cell.revealed = true; }));
    } else {
      // 递归展开逻辑 (DFS)
      const flood = (row: number, col: number) => {
        if (row < 0 || row >= SIZE || col < 0 || col >= SIZE || newBoard[row][col].revealed || newBoard[row][col].flagged) return;
        newBoard[row][col].revealed = true;
        if (newBoard[row][col].val === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) flood(row + dr, col + dc);
          }
        }
      };
      flood(r, c);
      
      // 检查胜利
      const unrevealedSafe = newBoard.flat().filter(cell => !cell.revealed && cell.val !== "M").length;
      if (unrevealedSafe === 0) setStatus("WON");
    }
    setBoard(newBoard);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status !== "PLAYING" || board[r][c].revealed) return;
    let newBoard = board.map(row => row.map(cell => ({...cell})));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="mb-6 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
        Status: {status} // Mines: {MINES_COUNT}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}>
        {board.map((row, r) => row.map((cell, c) => (
          <div 
            key={`${r}-${c}`}
            onClick={() => reveal(r, c)}
            onContextMenu={(e) => toggleFlag(e, r, c)}
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] font-mono border transition-all cursor-crosshair
              ${cell.revealed 
                ? "bg-white border-slate-100 text-slate-900" 
                : "bg-slate-900 border-slate-800 text-transparent hover:bg-slate-800"}`}
          >
            {cell.flagged && !cell.revealed ? "🚩" : (cell.revealed && (cell.val === "M" ? "💣" : cell.val || ""))}
          </div>
        )))}
      </div>
      <button onClick={initBoard} className="mt-8 text-[10px] font-mono text-slate-400 hover:text-black uppercase underline decoration-dotted">Re-Initialize</button>
    </div>
  );
}