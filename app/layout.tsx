import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar"; // 引入 Navbar

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
        <Navbar /> {/* 挂载在主体内容上方 */}
        {children}
      </body>
    </html>
  );
}