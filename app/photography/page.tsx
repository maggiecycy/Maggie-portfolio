import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PhotographyGallery from "@/components/PhotographyGallery";

export const revalidate = 0;

export default async function PhotographyArchive() {
  const { data: photos, error } = await supabase
    .from("photography")
    .select("*")
    .order("shot_at", { ascending: false });

  if (error) {
    console.error("Fetch photos error:", error);
  }

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-24 lg:px-8">
      
      <div className="mb-16 border-b border-slate-100 pb-10">
        <Link href="/" className="text-sm font-mono text-gray-400 hover:text-black transition-colors mb-8 inline-block">
          ← Back to Terminal
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Photography / 瞬间捕获
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed text-sm">
          世界偶尔会抛出难以理解的异常。在逻辑失效的时刻，退后一步，按下快门。
        </p>
      </div>

      {/* 接入全功能的客户端瀑布流组件 */}
      <PhotographyGallery photos={photos || []} />
      
    </main>
  );
}