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
      {/* 顶部英雄区 */}
      <Hero />
      
      {/* 项目展示区：将获取到的数据传递给客户端组件 */}
      <div id="projects" className="w-full scroll-mt-24">
        <Projects projectsData={projects || []} />
      </div>
      
      {/* 数字花园 (Digital Garden) 预览模块 */}
      <section className="w-full max-w-4xl px-6 py-16 border-t border-gray-100 mt-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">Latest Thoughts </h2>
            <p className="text-gray-500 mt-2 text-sm">记录关于技术、语言学习与成长的深度思考</p>
          </div>
          {/* 动效 1：给“查看全部”增加了 inline-block 和 hover:translate-x-1，鼠标放上去箭头会优雅地向右滑一下 */}
          <Link href="/blog" className="text-sm font-medium text-gray-400 hover:text-black hover:translate-x-1 transition-all duration-300 inline-block">
            查看全部 →
          </Link>
        </div>

        {/* 动效 2：核心预览区。增加了 hover:-translate-y-1 (整体轻微上浮) 和 duration-500 (让动画更舒缓) */}
        <div className="group border-l-2 border-gray-200 pl-6 py-1 hover:border-black hover:-translate-y-1 transition-all duration-500 ease-out">
          <Link href="/blog/01-digital-garden" className="block outline-none">
            {/* 标题颜色渐变 */}
            <h3 className="text-xl font-semibold text-black group-hover:text-blue-600 transition-colors duration-300">
              欢迎来到我的数字花园：逻辑、语言与自我重塑
            </h3>
            {/* 描述文字在 Hover 时微微变深，增加聚焦感 */}
            <p className="text-gray-500 mt-3 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Exploring the intersection of logic and emotion.
            </p>
            {/* 底部标签在 Hover 时也会有极其微妙的颜色呼应 */}
            <div className="flex items-center gap-3 mt-4 text-sm text-gray-400 font-mono transition-colors duration-300">
              <span>March 3, 2026</span>
              <span>•</span>
              <span>5 min read</span>
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs ml-2 group-hover:bg-slate-100 group-hover:text-slate-700 transition-colors duration-300">Mindset</span>
            </div>
          </Link>
        </div>
      </section>
      {/* 🚀 居中和谐版 Contact Section */}
      <section id="contact" className="w-full max-w-4xl px-6 py-32 border-t border-gray-100 mt-10 flex flex-col items-center text-center scroll-mt-24">
        <div className="max-w-2xl flex flex-col items-center">
          {/* 标题居中 */}
          <h2 className="text-3xl font-bold tracking-tight text-black mb-10">Let's Connect / 联系我</h2>
          
          <div className="space-y-8 text-gray-500 leading-relaxed flex flex-col items-center">
            {/* 英文段落 - 居中排版建议字号大一点点，增加视觉张力 */}
            <p className="text-base md:text-lg text-slate-600">
              I am actively seeking development chances. Whether you want to discuss system logic, 
              language learning, share life stories, or just say hi, my inbox is always open.
            </p>
            
            {/* 中文段落 */}
            <p className="text-sm md:text-base">
              目前正在积极寻找任何与开发相关的机会。无论你想探讨底层逻辑、交流语言学习，
              分享人生故事，或是纯粹路过打个招呼，收件箱随时为你敞开。
            </p>

            {/* 动作区：垂直居中排列 */}
            <div className="pt-10 flex flex-col items-center gap-8">
              <a
                href="mailto:cy2468729484@gmail.com" 
                className="inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl font-medium"
              >
                Say Hello   →
              </a>
              
              {/* 社交链接矩阵 */}
              <div className="flex gap-8 text-sm text-gray-400 font-mono">
                <a href="https://github.com/maggiecycy" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">GitHub</a>
                <a href="https://instagram.com/shmilyblue_" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Instagram</a>
                <a href="https://www.xiaohongshu.com/user/profile/616834f8000000000102604e" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Rednote</a>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权标识 - 居中对齐 */}
        <div className="mt-32 pt-8 border-t border-gray-50 w-full text-center text-xs text-gray-300 font-mono uppercase tracking-widest">
          © 2026 Maggie Cao · Built with Next.js & Passion
        </div>
      </section>
    </main>
  );
}