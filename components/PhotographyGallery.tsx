"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Photo = {
  id: string;
  image_url: string;
  title: string | null;
  location: string | null;
  shot_at: string | null;
  likes_count: number;
};

// 🌟 动效基因：同步博文板块的轻盈感
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export default function PhotographyGallery({ photos: initialPhotos }: { photos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // 1. 初始化时从本地存储读取已点赞的记录
  useEffect(() => {
    const savedLikes = localStorage.getItem("maggie_garden_likes");
    if (savedLikes) setLikedIds(JSON.parse(savedLikes));
  }, []);

  // 2. 核心点赞逻辑：防刷 + 数据库同步
  const handleLike = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation(); // 防止触发侧边栏
    if (likedIds.includes(photo.id)) return; // 如果点过了，直接返回

    // 乐观 UI 更新
    const newLikedIds = [...likedIds, photo.id];
    setLikedIds(newLikedIds);
    localStorage.setItem("maggie_garden_likes", JSON.stringify(newLikedIds));

    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes_count: p.likes_count + 1 } : p));
    if (selectedPhoto?.id === photo.id) {
      setSelectedPhoto({ ...selectedPhoto, likes_count: selectedPhoto.likes_count + 1 });
    }

    // 写入数据库
    await supabase
      .from("photography")
      .update({ likes_count: photo.likes_count + 1 })
      .eq("id", photo.id);
  };

  return (
    <>
      {/* 🌟 瀑布流主视图：注入博客同款动画 */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6"
      >
        {photos?.map((photo) => (
          <motion.div 
            key={photo.id} 
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="break-inside-avoid relative overflow-hidden rounded-md bg-slate-100 cursor-pointer group"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative w-full" style={{ paddingBottom: "130%" }}>
              <Image
                src={photo.image_url}
                alt={photo.title || "Photography"}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-out opacity-0"
                sizes="(max-width: 768px) 100vw, 33vw"
                onLoad={(e) => (e.target as HTMLImageElement).classList.remove("opacity-0")}
              />
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end text-white">
              <span className="text-sm font-medium tracking-wide drop-shadow-md">{photo.title || "Untitled"}</span>
              <div 
                onClick={(e) => handleLike(e, photo)}
                className={`flex items-center gap-1 text-xs transition-colors ${likedIds.includes(photo.id) ? 'text-red-400' : 'text-white'}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={likedIds.includes(photo.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span>{photo.likes_count}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 🌟 侧拉栏：严格遵循你最初的留白与设计 */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-100 flex flex-col z-10"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900">{selectedPhoto.title || "Detail"}</h2>
                <button onClick={() => setSelectedPhoto(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">✕</button>
              </div>

              {/* 回归原始：Aspect-video 预览，给下面留出足够的空白 */}
              <div className="w-full bg-slate-50 aspect-video relative">
                <Image src={selectedPhoto.image_url} alt="preview" fill className="object-contain" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-sm text-slate-500 flex gap-4">
                    {selectedPhoto.location && <span>📍 {selectedPhoto.location}</span>}
                    {selectedPhoto.shot_at && <span className="font-mono">{selectedPhoto.shot_at}</span>}
                  </div>
                  <button 
                    onClick={(e) => handleLike(e, selectedPhoto)}
                    className={`flex items-center gap-2 transition-colors group ${likedIds.includes(selectedPhoto.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={likedIds.includes(selectedPhoto.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span className="font-mono text-sm group-hover:text-slate-900">{selectedPhoto.likes_count}</span>
                  </button>
                </div>

                {/* 核心：完整的评论区占位，保留那份“真实的回声” */}
                <div className="flex-1">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Comments / 留言</h3>
                  <div className="text-sm text-slate-500 italic border-l-2 border-slate-200 pl-3 leading-relaxed">
                    评论模块预留位置。只有打开这扇门，才能看到真实的回声。
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}