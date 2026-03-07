"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LilMaggie() {
  const [hunger, setHunger] = useState(100);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  
  // 状态与定时器
  const [currentFace, setCurrentFace] = useState("/pixel-cat.png");
  const faceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          role: "assistant", 
          content: "Digtal maggie connection stable now. :3\n\nYou can try asking me:\n1. What's her music taste?\n2. What type of boys she like?\n3. What's her fav book?" 
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // 监听 Supabase 状态
  useEffect(() => {
    supabase.from("lil_maggie_state").select("hunger_level").eq("id", 1).single()
      .then(({ data }) => { if (data) setHunger(data.hunger_level); });

    const channel = supabase.channel("maggie_state_changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "lil_maggie_state" }, 
      (payload) => { setHunger(payload.new.hunger_level); }).subscribe();

    return () => { 
      supabase.removeChannel(channel); 
      if (faceTimeoutRef.current) clearTimeout(faceTimeoutRef.current);
    };
  }, []);

  // 投喂逻辑
  const feedMaggie = async (type: "bug" | "coffee") => {
    const boost = type === "bug" ? 5 : 10;
    const newHunger = Math.min(100, hunger + boost);
    setHunger(newHunger);

    if (faceTimeoutRef.current) clearTimeout(faceTimeoutRef.current);
    setCurrentFace(type === "bug" ? "/face-bug.png" : "/face-coffee.png");

    faceTimeoutRef.current = setTimeout(() => {
      setCurrentFace("/pixel-cat.png");
    }, 2500);

    await supabase.from("lil_maggie_state").update({ hunger_level: newHunger }).eq("id", 1);
  };

  const patMaggie = async () => {
    // 1. 能量加 3，上限 100
    const newHunger = Math.min(100, hunger + 3);
    setHunger(newHunger);

    // 2. 触发变脸动效
    if (faceTimeoutRef.current) clearTimeout(faceTimeoutRef.current);
    setCurrentFace("/face-pat.png");

    faceTimeoutRef.current = setTimeout(() => {
      setCurrentFace("/pixel-cat.png");
    }, 2500);

    // 3. 异步写入云端数据库
    await supabase.from("lil_maggie_state").update({ hunger_level: newHunger }).eq("id", 1);
  };

  // 聊天逻辑
  const sendMessage = async () => {
    if (!input.trim()) return;

    // 🌟 1. 每次对话消耗 5 点 HP (模拟脑力消耗)
    const cost = 10; 
    const newHunger = Math.max(0, hunger - cost); // 最低降到 0
    setHunger(newHunger);
    
    // 异步更新云端状态，不阻塞聊天界面的渲染
    supabase.from("lil_maggie_state").update({ hunger_level: newHunger }).eq("id", 1).then();

    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);
    setInput("");

    const res = await fetch("/api/maggie-chat", {
      method: "POST",
      body: JSON.stringify({ messages: newMsgs })
    });
    const data = await res.json();
    setMessages([...newMsgs, { role: "assistant", content: data.reply }]);
  };

  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        style={{ touchAction: "none" }}
        className="fixed bottom-6 right-6 z-[60]"
      >
        <motion.button 
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-2 border-slate-100 overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <Image 
            src={currentFace} 
            alt="Maggie Avatar" 
            width={28} 
            height={28} 
            className="object-contain pointer-events-none select-none" 
          />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-24 right-6 z-[70] w-80 bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200 rounded-lg flex flex-col h-[420px] overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 select-none">
                  <Image src={currentFace} alt="Avatar" width={16} height={16} className="object-contain" />
                  Lil Maggie_OS
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">✕</button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest w-12">HP:{hunger}%</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div className="h-full bg-slate-900" animate={{ width: `${hunger}%` }} transition={{ ease: "easeOut" }} />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-200">
              {messages.length === 0 && (
                <div className="text-center italic mt-4 text-slate-400 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-sm select-none">
                  lil maggie connection stable now. <br/>Ready to chat?<br/>:3
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`px-3 py-2 rounded-md max-w-[85%] leading-relaxed shadow-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-800'}`}>
                    {m.content}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-3">
              <input 
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-400"
                placeholder="ask me anything about maggie..."
              />
              <div className="flex justify-between items-center px-1">
                {/* 修复后的整齐按钮布局 */}
                <div className="flex gap-4">
                  <button onClick={() => feedMaggie("bug")} className="text-[10px] font-mono font-bold text-slate-500 hover:text-cyan-600 transition-colors flex items-center gap-1">
                    Feed bugs <span className="text-slate-300 font-normal">(+5)</span>
                  </button>
                  <button onClick={() => feedMaggie("coffee")} className="text-[10px] font-mono font-bold text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1">
                    Feed coffee <span className="text-slate-300 font-normal">(+10)</span>
                  </button>
                </div>
                <button onClick={patMaggie} className="text-[10px] font-mono font-bold text-slate-500 hover:text-pink-500 transition-colors flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-sm border border-slate-100 hover:border-pink-200">
                  Pat <span className="text-slate-300 font-normal">(+3)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}