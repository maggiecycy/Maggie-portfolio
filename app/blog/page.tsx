"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogIndex() {
  return (
    <div className="not-prose max-w-3xl mx-auto py-12 px-6 lg:px-0">
      
      {/* 将标题和副标题打包在一个 motion.div 中，确保它们作为一个整体浮现 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Writing | Digital Garden
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          记录关于技术、语言学习与成长的深度思考
        </p>
      </motion.div>
      
      <div className="flex flex-col gap-12">
        {/* 卡片：原汁原味的 border-l-2 设计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group border-l-2 border-slate-100 pl-6 hover:border-slate-900 transition-all duration-300"
        >
          <Link href="/blog/01-digital-garden" className="block outline-none">
            <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors text-slate-900">
              欢迎来到我的数字花园：逻辑、语言与自我重塑
            </h2>
            <p className="text-slate-500 mt-3 leading-relaxed">
              Exploring the intersection of logic and emotion. 在逻辑和情绪之间，慢慢找到自己的位置。
            </p>
            <div className="flex items-center gap-3 mt-4 text-sm text-slate-400 font-mono">
              <span>March 5, 2026</span>
              <span>•</span>
              <span>5 min read</span>
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-xs ml-2">Mindset / Tri-lingual</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}