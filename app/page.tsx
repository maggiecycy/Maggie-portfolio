import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import { supabase } from "@/lib/supabase";

// 这是一个纯正的 Server Component，支持 async/await
export default async function Home() {
  // 从云端数据库抓取数据
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fetch error:", error);
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <Hero />
      {/* 将获取到的数据安全地传递给客户端组件 */}
      <Projects projectsData={projects || []} />
    </main>
  );
}