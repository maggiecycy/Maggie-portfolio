"use client"; // 声明为 Client Component

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // 监听滚动事件来切换背景透明度
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }} // 进场动画：从上方 100px 处滑入
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo 区域 */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Terminal className="w-5 h-5" />
          <span>Maggie.Dev</span>
        </div>

        {/* 导航链接 (示例) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-black transition-colors">About</a>
          <a href="#projects" className="hover:text-black transition-colors">Projects</a>
          <a href="#contact" className="hover:text-black transition-colors">Contact</a>
        </nav>
      </div>
    </motion.header>
  );
}