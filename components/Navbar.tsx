"use client"; // 声明为 Client Component

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import Link from "next/link"; // 引入 Next.js 路由组件

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // 1. 抽离导航配置，方便未来扩展模块
  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "Writing", href: "/blog" }, 
    { name: "Music", href: "/music" }, 
    { name: "Photography", href: "/photography" }, 
    { name: "Contact", href: "/#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 🌟 Logo 区域：去掉了 opacity-80，改为极致克制的 slate 变色 */}
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold text-xl tracking-tighter text-black hover:text-slate-700 transition-colors duration-300"
        >
          <Terminal className="w-5 h-5" />
          <span>Maggie.Dev</span>
        </Link>

        {/* 动态渲染导航链接 */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-black transition-colors relative group"
            >
              {link.name}
              {/* 下划线动效，增加精致感 */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}