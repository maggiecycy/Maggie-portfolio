import { supabase } from "@/lib/supabase";
import Link from "next/link";
// 引入刚刚建好的客户端组件
import ArchiveList from "@/components/ArchiveList";

export const revalidate = 0;

export default async function MusicArchive() {
  // 服务端抓取数据
  const { data: tracks, error } = await supabase
    .from("mood_board")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch tracks error:", error);
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-24 lg:px-8">
      {/* 页面头部 */}
      <div className="mb-16 border-b border-slate-100 pb-10">
        <Link href="/" className="text-sm font-mono text-gray-400 hover:text-black transition-colors mb-8 inline-block">
          ← Back to Terminal
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Music library / 音乐档案馆
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed text-sm">
          收录那些试图在现实与梦境之间寻找平衡的背景音。
        </p>
      </div>

      {/* 将数据传递给客户端组件渲染并处理点击播放 */}
      <ArchiveList tracks={tracks || []} />
      
    </main>
  );
}