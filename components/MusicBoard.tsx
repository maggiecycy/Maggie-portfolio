"use client";

import { motion } from "framer-motion";
import Link from "next/link";
// 🌟 引入全局音乐大脑
import { useMusic } from "@/context/MusicContext";

type Track = {
  id: string;
  song_title: string;
  artist: string;
  mood_code: string | null;
  related_link: string | null;
  audio_url?: string | null;
  cover_url?: string | null;
};

export default function MusicBoard({ tracks }: { tracks: Track[] }) {
  // 🌟 从全局接管状态
  const { currentTrack, isPlaying, playTrack } = useMusic();

  // 核心逻辑：只取数组前 5 项进行预览展示
  const recentTracks = tracks.slice(0, 5);

  return (
    <section className="w-full max-w-4xl px-6 py-16 border-t border-gray-100 mt-10">
      <div className="flex justify-between items-end mb-10 pb-6 border-b border-slate-50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Resonance</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Heartbeat Frequency
          </p>
        </div>
        
        <Link 
          href="/music" 
          className="text-sm font-mono text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 group mb-1"
        >
          <span>Archive</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {recentTracks.map((track, index) => {
          // 状态比对：当前渲染的歌是否正在播放
          const isCurrentlyActive = currentTrack?.id === track.id;
          
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              // 🌟 点击时，将列表上下文设为 recentTracks，保证切歌逻辑在预览范围内
              onClick={() => playTrack(track, recentTracks)}
              className={`group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                isCurrentlyActive 
                  ? "border-slate-900 bg-slate-50/50 shadow-sm" 
                  : "border-transparent hover:border-slate-200 hover:bg-slate-50/30"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* 动态音柱指示器 */}
                <div className="w-6 flex justify-center items-end gap-[2px] h-4">
                  {isCurrentlyActive && isPlaying ? (
                    <>
                      <span className="w-1 bg-slate-800 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.1s]"></span>
                      <span className="w-1 bg-slate-800 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.3s] h-3"></span>
                      <span className="w-1 bg-slate-800 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.5s] h-4"></span>
                    </>
                  ) : (
                    <span className={`w-2 h-[2px] rounded-full transition-colors ${isCurrentlyActive ? "bg-slate-800" : "bg-slate-300"}`}></span>
                  )}
                </div>

                <div>
                  <h3 className={`font-semibold text-base transition-colors ${isCurrentlyActive ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                    {track.song_title}
                  </h3>
                  <p className="text-sm text-slate-500">{track.artist}</p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-2 pl-10 md:pl-0">
                {track.mood_code && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded">
                    {track.mood_code}
                  </span>
                )}
                
                {track.related_link && (
                  <Link 
                    href={track.related_link}
                    // 阻止事件冒泡，防止点击链接触发播放
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-500/70 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    关联记录 ↗
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}