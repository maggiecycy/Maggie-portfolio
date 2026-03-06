import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PhotographyGallery from "@/components/PhotographyGallery";
import PhotoUpload from "@/components/PhotoUpload";

export const revalidate = 0;

export default async function PhotographyArchive() {
  // 1. 获取 Maggie 的原创作品
  const { data: myPhotos, error: myError } = await supabase
    .from("photography")
    .select("*")
    .order("shot_at", { ascending: false });

  // 2. 获取访客投稿的作品
  const { data: guestPhotos, error: guestError } = await supabase
    .from("photography_submissions")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (myError) console.error("Fetch my photos error:", myError);
  if (guestError) console.error("Fetch guest photos error:", guestError);

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-24 lg:px-8">
      
      {/* 头部导航与标题 */}
      <div className="mb-16 border-b border-slate-100 pb-10">
        <Link href="/" className="text-sm font-mono text-gray-400 hover:text-black transition-colors mb-8 inline-block">
          ← Back 
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Photography / 瞬间捕获
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed text-sm">
          世界偶尔会抛出难以理解的异常。在逻辑失效的时刻，退后一步，按下快门。
        </p>
      </div>

      {/* 🌟 区块 01: Maggie 的原创系列 */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-400 bg-slate-50 px-2 py-1">
            01_Original_Works / 我的作品
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100"></div>
        </div>
        <PhotographyGallery photos={myPhotos || []} />
      </section>

      {/* 🌟 区块 02: 访客投稿系列 */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-600 bg-cyan-50/50 px-2 py-1">
            02_Community_Fragments / 访客投稿
          </h2>
          <div className="h-[1px] flex-1 bg-cyan-100/50"></div>
        </div>
        
        {guestPhotos && guestPhotos.length > 0 ? (
          <PhotographyGallery photos={guestPhotos.map(p => ({
            ...p,
            description: p.caption,
            author: p.author_name,
            // 🌟 核心修复：手动提供默认值，消灭 NaN
            likes_count: p.likes_count ?? 0 
          }))} />
        ) : (
          <p className="text-[10px] font-mono text-slate-300 italic ml-4">
            No community fragments captured yet. Be the first? :3
          </p>
        )}
      </section>

      {/* 上传入口 */}
      <div className="mt-32 border-t border-slate-100 pt-16">
        <PhotoUpload />
      </div>
      
    </main>
  );
}