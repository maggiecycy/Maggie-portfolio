import Link from "next/link";
import PixelSnake from "@/components/PixelSnake";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* 404 提示信息 */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tighter text-slate-900">
            404
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            你似乎偏离了主航道，进入了无信号的深空。
            <br />
            You've wandered into the void.
          </p>
        </div>

        {/* 🌟 彩蛋：隐藏的游戏模块 */}
        <div className="py-8">
          <PixelSnake />
        </div>

        {/* 返回主页的退路 */}
        <div className="pt-8 border-t border-slate-100">
          <Link 
            href="/" 
            className="text-xs font-mono text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </main>
  );
}