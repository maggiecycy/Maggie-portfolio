import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react"; // 1. 引入 Vercel Analytics 组件

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
        <Navbar />
        {children}
        <Analytics /> {/* 2. 将组件挂载在 body 内的最后面 */}
      </body>
    </html>
  );
}