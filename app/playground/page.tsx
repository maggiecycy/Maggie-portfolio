"use client";

import { useState } from "react";
import Link from "next/link";
import VoidSnake from "@/components/PixelSnake";
import VoidRunner from "@/components/VoidRunner";
import VoidBreaker from "@/components/VoidBreaker";
import Minesweeper from "@/components/Minesweeper";
import VoidInvaders from "@/components/VoidInvaders"; // 🌟 新成员

export default function PlaygroundPage() {
  const games = [
    { id: "SNAKE", name: "01_Snake", Component: VoidSnake },
    { id: "RUNNER", name: "02_Runner", Component: VoidRunner },
    { id: "BREAKER", name: "03_Breaker", Component: VoidBreaker },
    { id: "INVADERS", name: "04_Invaders", Component: VoidInvaders },
    { id: "MINES", name: "05_Mines", Component: Minesweeper },
  ];

  const [activeGame, setActiveGame] = useState("SNAKE");

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-24 lg:px-8">
      {/* 头部区域 */}
      <div className="mb-16 border-b border-slate-100 pb-10">
        <Link href="/" className="text-sm font-mono text-gray-400 hover:text-black transition-colors mb-8 inline-block">
          ← Back 
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-5 text-center sm:text-left">
          Playground 
        </h1>
        
        <div className="max-w-2xl flex flex-col gap-2">
          <p className="text-slate-600 leading-relaxed text-sm">
            低分辨率避难所。代码写累了？在这里停下，让思维在网格间游走 :3
          </p>
          <p className="text-slate-400 font-mono text-xs italic tracking-wide">
            A low-res sanctuary. Take a break from the void :3
          </p>
        </div>
      </div>

      {/* 🌟 游戏切换器：增强了窄屏滚动体验 */}
      <div className="flex gap-4 sm:gap-8 mb-12 border-b border-slate-100 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`text-[11px] font-mono tracking-widest transition-all pb-2 -mb-[18px] whitespace-nowrap uppercase ${
              activeGame === game.id 
              ? "text-slate-900 border-b-2 border-slate-900 font-bold" 
              : "text-slate-300 hover:text-slate-500"
            }`}
          >
            {game.name}
          </button>
        ))}
      </div>

      {/* 游戏渲染区 */}
      <div className="w-full py-12 bg-slate-50/50 rounded-sm border border-slate-100 flex flex-col items-center min-h-[550px] transition-all duration-500 shadow-inner">
        <div key={activeGame} className="w-full flex justify-center px-4">
          {activeGame === "SNAKE" && <VoidSnake />}
          {activeGame === "RUNNER" && <VoidRunner />}
          {activeGame === "BREAKER" && <VoidBreaker />}
          {activeGame === "INVADERS" && <VoidInvaders />}
          {activeGame === "MINES" && <Minesweeper />}
        </div>
      </div>

      <div className="mt-12 text-center opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.4em]">
          Total_Logic_Modules: 05 // Maggie's_Digital_Vault
        </p>
      </div>
    </main>
  );
}