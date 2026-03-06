"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState(""); // 🌟 新增：标题状态
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      alert("Please provide both a title and an image :3");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("user-submissions")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("user-submissions")
        .getPublicUrl(filePath);

      // 🌟 核心：将标题存入 caption 字段
      const { error: dbError } = await supabase
        .from("photography_submissions")
        .insert([{ 
          image_url: publicUrl, 
          caption: title, // 对应 SQL 里的 caption
          author_name: "Anonymous User", 
          is_approved: false 
        }]);

      if (dbError) throw dbError;

      setStatus("success");
      setPreview(null);
      setFile(null);
      setTitle(""); // 上传后清空标题
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-20 border-t border-slate-100 pt-12 max-w-xl">
      <h3 className="text-lg font-bold mb-4 tracking-tight">Submit your work</h3>
      <p className="text-sm text-slate-500 mb-8 font-mono italic">
        Upload your favorite film work here. It will be displayed after Maggie's review :3
      </p>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* 🌟 标题输入框 */}
        <input
          type="text"
          placeholder="[ Title / Description ]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-mono focus:outline-none focus:border-slate-900 transition-colors"
        />

        {/* 图片选择区域 */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-slate-100"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">[ Select Film ]</span>
          )}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        <button 
          disabled={!file || !title || uploading}
          className="w-full py-3 bg-slate-900 text-white text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-black disabled:bg-slate-100 transition-all"
        >
          {uploading ? "Transferring_Bits..." : "Execute_Upload"}
        </button>

        <AnimatePresence>
          {status === "success" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-mono text-cyan-600">
              {">"} Success: Maggie will review your work soon.
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}