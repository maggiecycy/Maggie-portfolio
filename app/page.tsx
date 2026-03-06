import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";
import Link from "next/link"; 
import MusicBoard from "@/components/MusicBoard";
import Image from "next/image"; // 🌟 必须加上这一行！
import ContactSection from "@/components/ContactSection";

// 强制 Next.js 每次请求都实时拉取最新数据
export const revalidate = 0;

// 这是一个纯正的 Server Component，支持 async/await
export default async function Home() {
  // 1. 从云端数据库抓取项目数据
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  if (projectsError) {
    console.error("Fetch projects error:", projectsError);
  }

  // 2. 从云端数据库抓取音乐数据 (注意这里的表名是 mood_board)
  const { data: tracks, error: tracksError } = await supabase
    .from("mood_board")
    .select("*")
    .order("created_at", { ascending: false });

  if (tracksError) {
    console.error("Fetch tracks error:", tracksError);
  }

  //  3. 新增：抓取最近的 4 张摄影作品
  const { data: recentPhotos } = await supabase
    .from("photography")
    .select("*")
    .order("shot_at", { ascending: false })
    .limit(4);

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
            View all →
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

      {/* 4 摄影预览模块：放置在 MusicBoard 之前 */}
      <section className="w-full max-w-4xl px-6 py-16 border-t border-gray-100 mt-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">Moments </h2>
            <p className="text-gray-500 mt-2 text-sm">快门是抵抗虚无的唯一手段</p>
          </div>
          <Link 
            href="/photography" 
            className="text-sm font-mono text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 group"
          >
            <span>Gallery</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentPhotos?.map((photo) => (
            <Link 
              key={photo.id} 
              href="/photography" 
              className="relative aspect-square overflow-hidden rounded-sm bg-slate-100 group border border-slate-100"
            >
              <Image
                src={photo.image_url}
                alt="moment"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-110"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* 5 音乐与情绪面板模块 */}
      <MusicBoard tracks={tracks || []} />

      {/* 4. 居中和谐版 Contact Section */}
      <ContactSection />
    </main>
  );
}