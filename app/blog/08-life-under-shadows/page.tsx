import { redirect } from "next/navigation";

export default function Page() {
  // 默认引导用户进入中文版路径
  redirect("/blog/08-life-under-shadows/zh");
}
