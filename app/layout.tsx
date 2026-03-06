import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next"; // 1. 引入 Vercel Analytics 组件
import { MusicProvider } from "@/context/MusicContext";
import GlobalPlayer from "@/components/GlobalPlayer"; // 2. 引入全局音乐播放器组件

export const metadata: Metadata = {
  title: "Maggie | Personal Portfolio",
  description: "Full-stack developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <MusicProvider> {/* 1. 包裹整个应用，让音乐状态在全局可用 */}
          <Navbar />
          {children}
          <Analytics /> {/* 2. 将组件挂载在 body 内的最后面 */}
          <GlobalPlayer />
        </MusicProvider>
      </body>
    </html>
  );
}