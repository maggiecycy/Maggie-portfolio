import Link from "next/link";
import GuestbookBoard from "@/components/GuestbookBoard";

export const revalidate = 0; // 确保每次刷新都能看到最新留言

export default function GuestbookPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-24 lg:px-8">
      {/* 🌟 头部区域：经典的留白与呼吸感 */}
      <div className="mb-16 border-b border-slate-100 pb-10">
        <Link href="/" className="text-sm font-mono text-gray-400 hover:text-black transition-colors mb-8 inline-block">
          ← Back 
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Guestbook 
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed text-sm">
          漫游至此，若觉得疲惫，不妨歇息片刻。留下你的思考、回声或只是一句简单的问候。在这座数字谷仓里，每一道痕迹都是独一无二的共鸣。
        </p>
         <p className="text-slate-500 max-w-2xl leading-relaxed text-sm">
        Tired of wandering? Leave your thoughts,advices, or just a simple greeting. In my digital garden, you are the guest and every trace you leave is a unique resonance.❤️</p>
      </div>

      {/* 🌟 核心互动区：交由客户端组件处理 */}
      <GuestbookBoard />
      
    </main>
  );
}