"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Newsletter from "@/components/Newsletter";

export default function BlogIndex() {
  return (
    <div className="not-prose max-w-3xl mx-auto py-12 px-6 lg:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Writing / Digital Garden
        </h1>
        <p className="text-gray-500 mt-2 text-sm mb-8">
          记录关于技术、语言学习与成长的深度思考
        </p>
      </motion.div>
      
      <div className="flex flex-col gap-12">
        {/* 🌟 04: 北京体感 (最新置顶) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group border-l-2 border-slate-100 pl-6 hover:border-slate-900 transition-all duration-300"
        >
          <Link href="/blog/04-beijing-life" className="block outline-none">
            <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors text-slate-900">
              04 · 返京症候：停不下来的 10 号线
            </h2>
            <p className="text-slate-500 mt-3 leading-relaxed">
              有些城市，不需要你上班，你的身体就已经开始加班了。
            </p>
            <div className="flex items-center gap-3 mt-4 text-sm text-slate-400 font-mono">
              <span>March 7, 2026</span>
              <span>•</span>
              <span>6 min read</span>
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-xs ml-2 font-medium">City/Observation</span>
            </div>
          </Link>
        </motion.div>

        {/* 03: 大厂实习投递指南 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group border-l-2 border-slate-100 pl-6 hover:border-slate-900 transition-all duration-300"
        >
          <Link href="/blog/03-internship-guide" className="block outline-none">
            <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors text-slate-900">
              03 · 大厂实习投递完全指南
            </h2>
            <p className="text-slate-500 mt-3 leading-relaxed">
              找实习不是考试，而是一场关于信息差、执行力和心态的博弈。
            </p>
            <div className="flex items-center gap-3 mt-4 text-sm text-slate-400 font-mono">
              <span>March 6, 2026</span>
              <span>•</span>
              <span>8 min read</span>
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-xs ml-2 font-medium">Career/Internship</span>
            </div>
          </Link>
        </motion.div>

        {/* 02: 距离战争 0cm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="group border-l-2 border-slate-100 pl-6 hover:border-slate-900 transition-all duration-300"
        >
          <Link href="/blog/02-zero-cm" className="block outline-none">
            <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors text-slate-900">
              02 · 距离战争 0cm
            </h2>
            <p className="text-slate-500 mt-3 leading-relaxed">
              世界的确定性正在坍塌。从中国到加沙 5765km，从我的眼睛到屏幕 50cm，而我们离战争的心理距离只有 0cm。
            </p>
            <div className="flex items-center gap-3 mt-4 text-sm text-slate-400 font-mono">
              <span>March 5, 2026</span>
              <span>•</span>
              <span>5 min read</span>
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-xs ml-2 font-medium">Mindset/Geopolitics</span>
            </div>
          </Link>
        </motion.div>

        {/* 01: 第一篇博文预览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="group border-l-2 border-slate-100 pl-6 hover:border-slate-900 transition-all duration-300"
        >
          <Link href="/blog/01-digital-garden" className="block outline-none">
            <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors text-slate-900">
              01 · 欢迎来到我的数字花园：逻辑、语言与自我重塑
            </h2>
            <p className="text-slate-500 mt-3 leading-relaxed">
              Exploring the intersection of logic and emotion. 
            </p>
            <div className="flex items-center gap-3 mt-4 text-sm text-slate-400 font-mono">
              <span>March 3, 2026</span>
              <span>•</span>
              <span>3 min read</span>
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-xs ml-2">Intro</span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* 保留底部的订阅框*/}
      <Newsletter />
    </div>
  );
}