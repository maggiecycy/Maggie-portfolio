import { redirect } from "next/navigation";

export default function DefaultGardenPage() {
  // 核心逻辑：访问无语言前缀的路径时，直接重定向到中文版物理路径
  redirect("/blog/01-digital-garden/zh");
}