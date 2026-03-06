"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Code2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 pt-24">
      {/* 状态徽章：一个带有呼吸灯效果的细节点缀 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-sm font-medium text-slate-600 mb-8 border border-slate-200 shadow-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        CS Student & Developer
      </motion.div>

      {/* 主标题：使用文字渐变凸显视觉中心 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6"
      >
        Hi, I'm{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
          Maggie
        </span>
      </motion.h1>

      {/* Slogan 简介：精准传递你的技术栈与目标 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
      >
        Exploring Tech world and building spiritual homeland. Always eager to write elegant code, have deep conversations, and embrace global opportunities.
      </motion.p>

      {/* 交互按钮区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <a
          href="#projects"
          className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <Code2 className="w-5 h-5" />
          View Projects
          {/* group-hover 配合平移，实现细腻的按钮 Hover 动画 */}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
        >
          <Github className="w-5 h-5" />
          GitHub
        </a>
      </motion.div>
    </section>
  );
}