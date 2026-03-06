"use client";

import { useMusic } from "@/context/MusicContext";
import { motion, Variants } from "framer-motion"; // 🌟 引入动效库

type Track = {
  id: string;
  song_title: string;
  artist: string;
  mood_code: string | null;
  cover_url: string | null;
  audio_url: string | null;
  core_lyrics: string | null;
  description: string | null;
};

// 🌟 动效基因：同步博文和摄影板块的“呼吸感”
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }, // 列表逐个跳出的节奏
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100, damping: 20 } 
  },
};

export default function ArchiveList({ tracks }: { tracks: Track[] }) {
  const { currentTrack, isPlaying, playTrack } = useMusic();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-16"
    >
      {tracks?.map((track) => {
        const isActive = currentTrack?.id === track.id;

        return (
          <motion.article 
            key={track.id} 
            variants={itemVariants}
            className="group flex flex-col md:flex-row gap-8 lg:gap-12 items-start"
          >
            {/* 🌟 封面：注入“微震动”悬停动效 */}
            <motion.div 
              onClick={() => playTrack(track, tracks)}
              whileHover={{ 
                y: -6,           // 向上轻微漂浮
                scale: 1.02,     // 微微放大，产生“呼吸”视觉
                transition: { type: "spring", stiffness: 300, damping: 15 } 
              }}
              whileTap={{ scale: 0.98 }} // 点击时有物理反馈
              className={`relative w-full md:w-56 shrink-0 aspect-square overflow-hidden rounded-md bg-slate-100 border cursor-pointer transition-all duration-500 ${
                isActive ? "border-slate-800 shadow-xl" : "border-slate-100 hover:border-slate-300 shadow-sm"
              }`}
            >
              {track.cover_url ? (
                <img 
                  src={track.cover_url} 
                  alt={track.song_title}
                  className={`object-cover w-full h-full transition-all duration-700 ease-out ${
                    isActive ? "grayscale-0 scale-105" : "grayscale group-hover:grayscale-0 group-hover:scale-105"
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-slate-300 text-xs">
                  [No Cover]
                </div>
              )}
              
              {/* 播放状态遮罩 */}
              <div className={`absolute inset-0 transition-colors duration-500 flex items-center justify-center ${
                isActive ? "bg-black/20" : "bg-black/0 group-hover:bg-black/20"
              }`}>
                <div className={`w-12 h-12 rounded-full border border-white/70 flex items-center justify-center transition-all duration-500 backdrop-blur-sm ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                }`}>
                  {isActive && isPlaying ? (
                    <div className="flex gap-1 animate-pulse"> {/* 🌟 正在播放时微微闪烁 */}
                      <div className="w-[3px] h-[12px] bg-white"></div>
                      <div className="w-[3px] h-[12px] bg-white"></div>
                    </div>
                  ) : (
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* 文字信息部分 */}
            <div className="flex-1 flex flex-col w-full py-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div>
                  <h2 className={`text-xl font-semibold transition-colors duration-500 ${
                    isActive ? "text-blue-600" : "text-slate-900 group-hover:text-blue-600"
                  }`}>
                    {track.song_title}
                  </h2>
                  <p className="text-slate-500 mt-1 text-sm font-mono uppercase tracking-wider">{track.artist}</p>
                </div>
                
                {track.mood_code && (
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2 py-1 border border-slate-100 rounded-full self-start shrink-0">
                    {track.mood_code}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-5 mt-2">
                {track.core_lyrics && (
                  <blockquote className="font-mono text-sm text-slate-400 italic border-l-2 border-slate-200 pl-4 py-1 leading-relaxed">
                    "{track.core_lyrics}"
                  </blockquote>
                )}
                {track.description && (
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {track.description}
                  </p>
                )}
              </div>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}