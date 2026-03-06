import { redirect } from "next/navigation";

export default function Page() {
  // 默认引导用户进入中文版路径，注意路径改为 03-internship-guide
  redirect("/blog/03-internship-guide/zh");
}