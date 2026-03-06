"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import CommentSection from "./CommentSection";

type Photo = {
  id: string;
  image_url: string;
  title: string | null;
  location: string | null;
  shot_at: string | null;
  likes_count: number;
  table_name?: string; // 🌟 建议在 Page.tsx 传入时标记表名，以便区分 myPhotos 和 guestPhotos
};

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

  // 1. 初始化读取本地点赞记录
  useEffect(() => {
    const savedLikes = localStorage.getItem("maggie_garden_likes");
    if (savedLikes) setLikedIds(JSON.parse(savedLikes));
  }, []);

  // 🌟 2. 核心修复：自动纠错逻辑 (Cache Self-Healing) [cite: 2026-03-06]
  // 如果数据库里的点赞数被 Maggie 清零了，自动清除本地对应的点赞记录
  useEffect(() => {
    if (photos.length > 0) {
      const validLikedIds = likedIds.filter(id => {
        const photo = photos.find(p => p.id === id);
        // 如果找到了照片但点赞数为0，说明后台已重置，该 ID 应该被踢出点赞列表
        return photo ? photo.likes_count > 0 : true;
      });

      if (validLikedIds.length !== likedIds.length) {
        setLikedIds(validLikedIds);
        localStorage.setItem("maggie_garden_likes", JSON.stringify(validLikedIds));
      }
    }
  }, [photos]);

  // 3. 点赞逻辑
  const handleLike = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    // 🌟 这里也要判断：如果 counts 已经是 0 了，说明后台重置过，允许再次点赞
    if (likedIds.includes(photo.id) && photo.likes_count > 0) return;

    const newLikedIds = Array.from(new Set([...likedIds, photo.id]));
    setLikedIds(newLikedIds);
    localStorage.setItem("maggie_garden_likes", JSON.stringify(newLikedIds));

    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes_count: p.likes_count + 1 } : p));
    if (selectedPhoto?.id === photo.id) {
      setSelectedPhoto({ ...selectedPhoto, likes_count: selectedPhoto.likes_count + 1 });
    }

    // 🌟 兼容性更新：根据照片来源更新对应的表 [cite: 2026-03-06]
    // 如果你在 Page.tsx 传数据时没加 table_name，这里默认用 photography
    const targetTable = photo.table_name || (photo.hasOwnProperty('caption') ? "photography_submissions" : "photography");

    await supabase
      .from(targetTable)
      .update({ likes_count: photo.likes_count + 1 })
      .eq("id", photo.id);
  };

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6"
      >
        {photos?.map((photo) => {
          // 🌟 核心修复：判定逻辑变更为 “本地有点赞记录” 且 “数据库计数大于0” [cite: 2026-03-06]
          const isActivelyLiked = likedIds.includes(photo.id) && photo.likes_count > 0;

          return (
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
                  onLoad={(e) => (e.target as HTMLImageElement).classList.remove("opacity-0")}
                />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end text-white">
                <span className="text-sm font-medium tracking-wide drop-shadow-md">{photo.title || "Untitled"}</span>
                <div 
                  onClick={(e) => handleLike(e, photo)}
                  className={`flex items-center gap-1 text-xs transition-colors ${isActivelyLiked ? 'text-red-400' : 'text-white'}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isActivelyLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  <span>{photo.likes_count}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-100 flex flex-col z-10"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900">{selectedPhoto.title || "Detail"}</h2>
                <button onClick={() => setSelectedPhoto(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">✕</button>
              </div>

              <div className="w-full bg-slate-50 aspect-video relative">
                <Image src={selectedPhoto.image_url} alt="preview" fill className="object-contain" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-sm text-slate-500 flex gap-4">
                    {selectedPhoto.location && <span>📍 {selectedPhoto.location}</span>}
                    {selectedPhoto.shot_at && <span className="font-mono">{selectedPhoto.shot_at}</span>}
                  </div>
                  {/* 侧边栏的点赞判断同步更新 */}
                  <button 
                    onClick={(e) => handleLike(e, selectedPhoto)}
                    className={`flex items-center gap-2 transition-colors group ${likedIds.includes(selectedPhoto.id) && selectedPhoto.likes_count > 0 ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={likedIds.includes(selectedPhoto.id) && selectedPhoto.likes_count > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span className="font-mono text-sm group-hover:text-slate-900">{selectedPhoto.likes_count}</span>
                  </button>
                </div>

                <div className="flex-1 mt-6">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">Comments / 留言</h3>
                  <div className="w-full">
                    <CommentSection photoId={selectedPhoto.id} />
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