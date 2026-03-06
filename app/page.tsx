import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";
import Link from "next/link"; 

// 强制 Next.js 每次请求都实时拉取最新数据
export const revalidate = 0;

// 这是一个纯正的 Server Component，支持 async/await
export default async function Home() {
  // 1. 从云端数据库抓取项目数据
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fetch error:", error);
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* 1. 顶部英雄区 (已找回) */}
      <Hero />
      
      {/* 2. 项目展示区：增加 id 和滚动边距 */}
      <div id="projects" className="w-full scroll-mt-24">
        <Projects projectsData={projects || []} />
      </div>
      
      {/* 3. 数字花园 (Digital Garden) 预览模块 - 更新为最新的第 02 篇博文 */}
      <section className="w-full max-w-4xl px-6 py-16 border-t border-gray-100 mt-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">Latest Thoughts</h2>
            <p className="text-gray-500 mt-2 text-sm">记录关于技术、语言学习与成长的深度思考</p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-gray-400 hover:text-black hover:translate-x-1 transition-all duration-300 inline-block">
            查看全部/view all →
          </Link>
        </div>

        {/* 博文预览卡片：大厂实习投递指南 */}
        <div className="group border-l-2 border-gray-200 pl-6 py-1 hover:border-black hover:-translate-y-1 transition-all duration-500 ease-out">
          <Link href="/blog/03-internship-guide" className="block outline-none">
            <h3 className="text-xl font-semibold text-black group-hover:text-blue-600 transition-colors duration-300 text-left">
              03 · 大厂实习投递完全指南
            </h3>
            <div className="text-gray-500 mt-3 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-left space-y-1">
              <p>找实习不是考试，而是一场关于信息差、执行力和心态的博弈。</p>
            </div>
            <div className="flex items-center gap-3 mt-4 text-sm text-gray-400 font-mono transition-colors duration-300">
              <span>March 6, 2026</span>
              <span>•</span>
              <span>8 min read</span>
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs ml-2 group-hover:bg-slate-100 group-hover:text-slate-700 transition-colors duration-300">Career / Internship</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. 🚀 居中和谐版 Contact Section */}
      <section id="contact" className="w-full max-w-4xl px-6 py-32 border-t border-gray-100 mt-10 flex flex-col items-center text-center scroll-mt-24">
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
                className="inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl font-medium"
              >
                Say Hello →
              </a>
              
              <div className="flex gap-8 text-sm text-gray-400 font-mono">
                <a href="https://github.com/maggiecycy" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">GitHub</a>
                <a href="https://instagram.com/shmilyblue_" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Instagram</a>
                <a href="https://www.xiaohongshu.com/user/profile/616834f8000000000102604e" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Rednote</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-8 border-t border-gray-50 w-full text-center text-xs text-gray-300 font-mono uppercase tracking-widest">
          © 2026 Maggie Cao · Built with Next.js & Passion
        </div>
      </section>
    </main>
  );
}