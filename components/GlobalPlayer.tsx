"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "@/context/MusicContext";

export default function GlobalPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 🌟 引入新方法 playNext 和播放列表 playlist
  const { currentTrack, isPlaying, playlist, togglePlay, playNext, playTrack } = useMusic();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 展开的播放列表 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-4 w-64 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[400px]"
          >
            {/* 封面与信息 */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
               {currentTrack.cover_url ? (
                 <img src={currentTrack.cover_url} alt="cover" className="w-10 h-10 rounded object-cover" />
               ) : (
                 <div className="w-10 h-10 bg-slate-100 rounded"></div>
               )}
               <div className="flex flex-col overflow-hidden">
                 <span className="text-sm font-semibold text-slate-900 truncate">{currentTrack.song_title}</span>
                 <span className="text-xs text-slate-500 truncate">{currentTrack.artist}</span>
               </div>
            </div>

            {/* 🌟 真实的滚动播放列表 */}
            <div className="p-2 flex flex-col gap-1 overflow-y-auto">
              {playlist.map((track) => {
                const isThisTrackPlaying = currentTrack.id === track.id;
                return (
                  <div 
                    key={track.id}
                    onClick={() => playTrack(track, playlist)}
                    className={`px-3 py-2 text-sm rounded cursor-pointer truncate transition-colors ${
                      isThisTrackPlaying 
                        ? 'bg-slate-100 text-slate-900 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isThisTrackPlaying && <span className="mr-2 text-xs">▶</span>}
                    {track.song_title} - <span className="text-xs opacity-70">{track.artist}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮胶囊控制条：褪去厚重，回归极简 */}
      <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-slate-200 p-2 pr-4 rounded-full shadow-sm hover:shadow-md transition-shadow">
        
        {/* 播放/暂停键 (平滑 SVG) */}
        <button 
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-9 h-9 rounded-full text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 shrink-0"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* 切歌键 (平滑 SVG) */}
        <button 
          onClick={(e) => { e.stopPropagation(); playNext(); }}
          className="w-9 h-9 rounded-full text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 shrink-0 mr-2"
          title="Next Track"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 4v16l11-8L5 4zm13 0v16h2V4h-2z"/>
          </svg>
        </button>

        {/* 歌曲信息 */}
        <div 
          className="flex flex-col cursor-pointer min-w-[100px] ml-2 mr-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm font-medium text-slate-800 truncate max-w-[120px]">
            {currentTrack.song_title}
          </span>
          {/* 去掉了省略号，让状态显示更干脆 */}
          <span className="text-[11px] text-slate-400 font-mono tracking-tight mt-[2px]">
            {isPlaying ? "Playing" : "Paused"}
          </span>
        </div>

        {/* 展开小箭头 */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-slate-400 hover:text-slate-900 ml-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
        >
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </motion.div>
        </button>
      </div>
    </div>
  );
}