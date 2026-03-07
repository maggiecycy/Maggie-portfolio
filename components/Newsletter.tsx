"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    
    const data = await res.json();
    if (res.ok) {
      setStatus("success");
      setMsg("Subscription confirmed. Welcome to my digital garden.");
      setEmail("");
    } else {
      setStatus("error");
      setMsg(data.error);
    }
  };

  return (
    <div className="mt-16 border-t border-slate-100 pt-12 max-w-xl mx-auto font-mono">
      <h3 className="text-sm font-bold text-slate-900 mb-2">Subscribe / 订阅信件</h3>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        Leave your email to receive my latest thoughts!
      </p>
      
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === "loading" || status === "success"}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-slate-900 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-slate-900 text-white px-4 py-2 text-xs font-bold rounded-sm hover:bg-slate-800 transition-colors disabled:opacity-50 min-w-[100px]"
        >
          {status === "loading" ? "..." : status === "success" ? "Done" : "Subscribe"}
        </button>
      </form>
      
      {msg && (
        <p className={`mt-3 text-[10px] tracking-widest uppercase ${status === "error" ? "text-red-500" : "text-slate-400"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}