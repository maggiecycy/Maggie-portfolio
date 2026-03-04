import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";
import Link from "next/link"; // 核心：引入路由组件

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
      <Projects projectsData={projects || []} />
      
      {/* 🚀 新增：数字花园 (Digital Garden) 预览模块 */}
      {/* 采用与 Lee Rob 类似的极简风格，通过 border-t 形成视觉分割 */}
      {/* 视觉对齐后的博客预览 */}
      <section className="w-full max-w-4xl px-6 py-20 border-t border-slate-100 mt-20">
        <h2 className="text-xl font-bold mb-8 text-left">Latest Thoughts / 数字花园</h2>
        
        <div className="flex flex-col gap-10 text-left">
          <Link href="/blog" className="group">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold group-hover:underline decoration-blue-500 underline-offset-4">
                欢迎来到我的数字花园：逻辑、语言与自我重塑
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                Exploring the intersection of logic and emotion. 记录我从“焦虑型”向“安全型”成长的点滴。 [cite: 2026-01-07]
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-2">
                <span>March 4, 2026</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span>5 min read</span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}