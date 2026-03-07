"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DigitalTimeCapsule() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. 精确倒计时逻辑 (2026 -> 2036)
  useEffect(() => {
    const targetDate = new Date("2036-01-01T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="mt-24 border-t border-slate-100 pt-12 max-w-5xl mx-auto px-4 font-mono">
      {/* 🌟 极简微缩交互入口 */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center cursor-pointer group mb-6 p-3 border border-slate-100 hover:bg-white hover:opacity-60 transition-all duration-300 rounded-sm"
      >
        <div className="flex items-baseline gap-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950">
            Digital_Time_Capsule
          </h2>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest hidden md:inline">
            // a decade log: 2026 — 2036
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 uppercase tracking-[0.1em] group-hover:text-slate-900 transition-colors">
            {isExpanded ? 'Fold' : 'Unfold'}
          </span>
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }} 
            className="text-[10px] text-slate-300 group-hover:text-slate-900"
          >
            ▼
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-10 pb-6 flex flex-col items-center gap-12">
              
              {/* 🌟 视频与锁定的槽位 */}
              <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center">
                <div 
                  className="relative aspect-[9/16] w-full max-w-[280px] bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer group rounded-sm shadow-sm"
                  onClick={togglePlay}
                >
                  <video 
                    ref={videoRef}
                    src="/2026-seed.mp4" 
                    loop playsInline
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                      <span className="text-white text-3xl">▶</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-[9px] uppercase tracking-widest text-slate-900 font-bold border border-slate-100">
                    2026- / Discipline
                  </div>
                </div>

                <div className="relative aspect-[9/16] w-full max-w-[280px] bg-slate-50 border border-slate-200 overflow-hidden flex flex-col items-center justify-center rounded-sm shadow-inner">
                  <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
                    <svg className="w-6 h-6 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div className="text-[10px] text-slate-400 tracking-widest uppercase mb-3">
                      Encrypted_File
                    </div>
                    <div className="text-sm text-slate-900 font-bold bg-white px-4 py-2 rounded-sm border border-slate-100 shadow-sm tabular-nums">
                      {timeLeft.d}d : {format(timeLeft.h)}h : {format(timeLeft.m)}m : {format(timeLeft.s)}s
                    </div>
                    <p className="text-[10px] text-slate-300 mt-4 leading-relaxed">Wait for 31yrs old M to update :3</p>
                  </div>
                </div>
              </div>

              {/* 🌟 人生轨迹 Trajectory_ Roadmap - 改为过去发生的大事 */}
              <section className="w-full border-t border-slate-100 pt-16 mt-10">
                <div className="flex items-center gap-4 mb-10">
                  <h3 className="text-[11px] uppercase tracking-[0.4em] text-cyan-700 bg-cyan-50 px-2 py-1 font-bold">
                    M_Trajectory_Log / 真实轨迹
                  </h3>
                  <div className="h-[1px] flex-1 bg-cyan-100"></div>
                </div>
                <div className="space-y-8">
                    {[
                    { 
                      date: 'FEB 2026', 
                      title: 'The Great Reset: Year Zero', 
                      description: 'Breaking free from the external validation cycle. Figured out future path.',
                      status: 'Completed' 
                    },
                    { 
                      date: 'SEP 2023', 
                      title: 'Departure: Beijing & Beyond', 
                      description: 'Stepping into adulthood. Relocated to Beijing. Immerse in the logical rigor of CS and the pulse of the capital.',
                      status: 'Completed' 
                    },
                    { 
                      date: 'FEB 2005', 
                      title: 'System Launch: 2005.02.24', 
                      description: 'Origin point. The "Maggie" life program initialized in a small city in south china. A Pisces soul with a logic-driven core.',
                      status: 'Completed' 
                    },
                  ].map(step => (
                    <div key={step.title} className="flex gap-6 items-start group">
                      <div className="text-xs font-bold text-cyan-700 pt-1">{step.date}</div>
                      <div className="flex-1 border-b border-slate-100 pb-4 group-hover:border-slate-200 transition-colors">
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {step.title}
                          <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm tracking-tighter">SUCCESS</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed italic">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}