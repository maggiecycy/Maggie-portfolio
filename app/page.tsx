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
      <section className="w-full max-w-4xl px-6 py-16 border-t border-gray-100">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">Latest Thoughts / 数字花园</h2>
            <p className="text-gray-500 mt-2">记录关于技术、语言学习与成长的深度思考</p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-gray-400 hover:text-black transition-colors">
            查看全部 →
          </Link>
        </div>

        {/* 文章预览卡片：使用了 group 类来实现细腻的悬停交互 */}
        <div className="group border-l-2 border-gray-100 pl-6 hover:border-black transition-all duration-300">
          <Link href="/blog" className="block">
            <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
              欢迎来到我的数字花园：逻辑、语言与自我重塑
            </h3>
            <p className="text-gray-500 mt-3 leading-relaxed">
              Exploring the intersection of logic and emotion. 记录我作为计科学生在向“安全型”成长过程中的心路历程。
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
              <span>March 4, 2026</span>
              <span>•</span>
              <span>5 min read</span>
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs">Mindset</span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}