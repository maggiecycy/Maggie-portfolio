"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CornerDownRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Comment = {
  id: string;
  parent_id: string | null;
  author: string;
  content: string;
  created_at: string;
  date: string;
};

export default function GuestbookBoard() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  
  // 🌟 回复专用的状态
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myCommentIds, setMyCommentIds] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 初始化读取本地缓存（用于删除权限控制）
  useEffect(() => {
    const saved = localStorage.getItem("maggie_guestbook_comments");
    if (saved) setMyCommentIds(JSON.parse(saved));
  }, []);

  // 主输入框高度自适应
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  // 回复输入框高度自适应
  useEffect(() => {
    if (replyTextareaRef.current) {
      replyTextareaRef.current.style.height = "auto";
      replyTextareaRef.current.style.height = `${replyTextareaRef.current.scrollHeight}px`;
    }
  }, [replyContent, replyingTo]);

  // 拉取所有留言
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("guestbook_comments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formatted = data.map((item) => ({
          id: item.id,
          parent_id: item.parent_id,
          author: item.author,
          content: item.content,
          created_at: item.created_at,
          date: new Date(item.created_at).toISOString().split("T")[0],
        }));
        setComments(formatted);
      }
      setIsLoading(false);
    };
    fetchComments();
  }, []);

  // 🌟 通用的提交逻辑（发主楼 or 发回复）
  const submitComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const content = parentId ? replyContent : newComment;
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      parent_id: parentId,
      author: "Guest",
      content: content.trim(),
    };

    const { data, error } = await supabase.from("guestbook_comments").insert([payload]).select();

    if (!error && data) {
      const added: Comment = {
        id: data[0].id,
        parent_id: data[0].parent_id,
        author: data[0].author,
        content: data[0].content,
        created_at: data[0].created_at,
        date: new Date(data[0].created_at).toISOString().split("T")[0],
      };
      
      setComments([added, ...comments]);

      // 赋予删除权限
      const updatedMyIds = [...myCommentIds, added.id];
      setMyCommentIds(updatedMyIds);
      localStorage.setItem("maggie_guestbook_comments", JSON.stringify(updatedMyIds));

      // 清空状态
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
    }
    setIsSubmitting(false);
  };

  // 删除逻辑
  const handleDelete = async (id: string) => {
    setComments(comments.filter(c => c.id !== id && c.parent_id !== id)); // 乐观UI：连带回复一起在前端抹除
    const updatedIds = myCommentIds.filter(myId => myId !== id);
    setMyCommentIds(updatedIds);
    localStorage.setItem("maggie_guestbook_comments", JSON.stringify(updatedIds));

    await supabase.from("guestbook_comments").delete().eq("id", id);
  };

  // 🌟 数据分层整理
  // 主楼：没有 parent_id，按时间倒序（最新的在最上面）
  const topLevelComments = comments
    .filter((c) => !c.parent_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // 找回复：通过 parent_id 匹配，按时间正序（盖楼顺序，先发的在上面）
  const getReplies = (parentId: string) => {
    return comments
      .filter((c) => c.parent_id === parentId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  return (
    <div className="w-full font-sans pb-20">
      {/* 发送主楼的输入区 */}
      <form 
        onSubmit={(e) => submitComment(e, null)} 
        className="flex items-end gap-3 mb-20 border-b border-slate-200 focus-within:border-slate-800 transition-colors duration-500 pb-2"
      >
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your thoughts... (Markdown supported)"
          rows={1}
          disabled={isSubmitting || isLoading}
          className="flex-1 bg-transparent p-0 focus:outline-none resize-none min-h-[28px] max-h-[200px] text-base text-slate-700 placeholder:text-slate-300 overflow-hidden leading-relaxed disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={!newComment.trim() || isSubmitting || isLoading}
          className="p-2 mb-0.5 text-slate-300 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors duration-300 flex-shrink-0 cursor-pointer"
        >
          {isSubmitting && !replyingTo ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : <Send className="w-5 h-5" />}
        </button>
      </form>

      {/* 留言列表 */}
      <div className="space-y-16">
        {isLoading ? (
          <div className="flex py-2">
            <span className="text-sm text-slate-300 animate-pulse font-mono">Connecting to the void...</span>
          </div>
        ) : (
          <AnimatePresence>
            {topLevelComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group flex flex-col gap-4"
              >
                {/* 🌟 主楼层 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      {comment.author}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-mono text-slate-300">{comment.date}</span>
                      {myCommentIds.includes(comment.id) && (
                        <button onClick={() => handleDelete(comment.id)} className="text-[10px] text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">✕</button>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed prose prose-sm prose-slate max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.content}</ReactMarkdown>
                  </div>
                  
                  {/* 唤起回复的按钮 */}
                  <button 
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="mt-3 text-[11px] font-mono uppercase tracking-wider text-slate-300 hover:text-slate-600 transition-colors flex items-center gap-1.5 opacity-0 group-hover:opacity-100"
                  >
                    <CornerDownRight className="w-3 h-3" /> Reply
                  </button>

                  {/* 🌟 展开的回复输入框 */}
                  <AnimatePresence>
                    {replyingTo === comment.id && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={(e) => submitComment(e, comment.id)}
                        className="mt-4 flex items-end gap-2 border-b border-slate-200 focus-within:border-slate-800 transition-colors duration-300 pb-1 overflow-hidden"
                      >
                        <textarea
                          ref={replyTextareaRef}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Reply to ${comment.author}...`}
                          rows={1}
                          disabled={isSubmitting}
                          className="flex-1 bg-transparent p-0 focus:outline-none resize-none min-h-[24px] max-h-[120px] text-sm text-slate-600 placeholder:text-slate-300 overflow-hidden leading-relaxed"
                        />
                        <div className="flex items-center gap-1 mb-0.5">
                          <button type="button" onClick={() => setReplyingTo(null)} className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                          <button type="submit" disabled={!replyContent.trim() || isSubmitting} className="p-1.5 text-slate-300 hover:text-slate-900 disabled:opacity-30 transition-colors">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <Send className="w-4 h-4" />}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* 🌟 嵌套的回复列表展示 */}
                {getReplies(comment.id).length > 0 && (
                  <div className="pl-6 md:pl-8 border-l-2 border-slate-100 space-y-6 mt-2">
                    {getReplies(comment.id).map((reply) => (
                      <div key={reply.id} className="group/reply">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                            {reply.author}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-slate-300">{reply.date}</span>
                            {myCommentIds.includes(reply.id) && (
                              <button onClick={() => handleDelete(reply.id)} className="text-[10px] text-slate-300 hover:text-red-400 opacity-0 group-hover/reply:opacity-100 transition-opacity" title="Delete">✕</button>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 leading-relaxed prose prose-sm prose-slate max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{reply.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}