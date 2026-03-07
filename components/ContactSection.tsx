"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <motion.section 
      id="contact" 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 25, duration: 0.8 }}
      className="w-full max-w-4xl px-6 py-32 border-t border-gray-100 mt-10 flex flex-col items-center text-center scroll-mt-24"
    >
      <div className="max-w-2xl flex flex-col items-center">
        <h2 className="text-3xl font-bold tracking-tight text-black mb-10">Let's Connect / 联系我</h2>
        
        <div className="space-y-8 text-gray-500 leading-relaxed flex flex-col items-center">
          <p className="text-base md:text-lg text-slate-600">
            I am actively seeking develop opportunities and genuine connections. Whether you want to discuss system logic, 
            language learning, share stories, or just say hi, my inbox is always open.
          </p>
          
          <p className="text-sm md:text-base">
            目前正在积极寻找与开发相关的机会和真诚的人际关系。无论你想探讨底层逻辑、交流语言学习，
            分享人生故事，或是纯粹路过打个招呼，收件箱随时为你敞开。
          </p>

          <div className="pt-10 flex flex-col items-center gap-8">
            <a
              href="mailto:cy2468729484@gmail.com" 
              className="inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl font-medium active:scale-95"
            >
              Say Hello →
            </a>
            
            <div className="flex gap-8 text-sm text-gray-400 font-mono">
            <a href="https://github.com/maggiecycy" target="_blank" rel="noreferrer" className="hover:text-black transition-colors hover:underline underline-offset-4">GitHub</a>
            <a href="https://instagram.com/shmilyblue_" target="_blank" rel="noreferrer" className="hover:text-black transition-colors hover:underline underline-offset-4">Instagram</a>
            
            {/* 🌟 替代原有的 Rednote */}
            <button 
              onClick={() => {
                // 这里的 ID 换成你真正的微信号
                navigator.clipboard.writeText("CY_20050224MAGGIE"); 
                // 使用更低调的反馈方式，或者干脆不弹窗，直接改文字
                const btn = document.getElementById('wechat-btn');
                if (btn) {
                  const originalText = btn.innerText;
                  btn.innerText = "ID copied ☑️";
                  setTimeout(() => { btn.innerText = originalText; }, 2000);
                }
              }}
              id="wechat-btn"
              className="hover:text-black transition-colors hover:underline underline-offset-4 outline-none cursor-pointer text-left"
            >
              WeChat
            </button>
          </div>
          </div>
        </div>

        <div className="mt-32 pt-8 border-t border-gray-50 w-full text-center text-xs text-gray-300 font-mono uppercase tracking-widest">
          © 2026 Maggie Cao · Built with Next.js, ♥ and Passion
        </div>
        </div>
      </motion.section>
  );
}