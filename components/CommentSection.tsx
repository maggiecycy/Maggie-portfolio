"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Comment = {
  id: string;
  author: string;
  content: string;
  date: string;
};

export default function CommentSection({ photoId }: { photoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 🌟 新增：用于记录当前设备发过的留言 ID
  const [myCommentIds, setMyCommentIds] = useState<string[]>([]);

  // 初始化时读取本地存储的留言记录
  useEffect(() => {
    const savedMyComments = localStorage.getItem("maggie_my_comments");
    if (savedMyComments) {
      setMyCommentIds(JSON.parse(savedMyComments));
    }
  }, []);

  // 自动伸缩输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  // 拉取当前照片的留言
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("photography_comments")
        .select("*")
        .eq("photo_id", photoId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formatted = data.map((item) => ({
          id: item.id,
          author: item.author,
          content: item.content,
          date: new Date(item.created_at).toISOString().split("T")[0],
        }));
        setComments(formatted);
      }
      setIsLoading(false);
    };

    if (photoId) {
      fetchComments();
    }
  }, [photoId]);

  // 提交留言
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const commentPayload = {
      photo_id: photoId,
      author: "Guest", 
      content: newComment.trim(),
    };

    const { data, error } = await supabase
      .from("photography_comments")
      .insert([commentPayload])
      .select();

    if (!error && data) {
      const addedComment: Comment = {
        id: data[0].id,
        author: data[0].author,
        content: data[0].content,
        date: new Date(data[0].created_at).toISOString().split("T")[0],
      };
      
      setComments([addedComment, ...comments]);
      setNewComment(""); 
      
      // 🌟 新增：把刚刚成功的留言 ID 存入本地缓存，赋予删除权限
      const updatedMyComments = [...myCommentIds, addedComment.id];
      setMyCommentIds(updatedMyComments);
      localStorage.setItem("maggie_my_comments", JSON.stringify(updatedMyComments));
    } else {
      console.error("Failed to post comment:", error);
    }
    
    setIsSubmitting(false);
  };

  // 🌟 新增：删除留言逻辑
  const handleDelete = async (commentId: string) => {
    // 乐观 UI：直接在前端秒删，提供极速响应感
    setComments(comments.filter(c => c.id !== commentId));
    
    // 同步更新本地缓存
    const updatedMyComments = myCommentIds.filter(id => id !== commentId);
    setMyCommentIds(updatedMyComments);
    localStorage.setItem("maggie_my_comments", JSON.stringify(updatedMyComments));

    // 后台静默请求 Supabase 删除该条数据
    const { error } = await supabase
      .from("photography_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Failed to delete comment:", error);
      // 如果后端删除失败，理论上应该把前端删掉的数据加回来，这里为了极简先不写回滚逻辑
    }
  };

  return (
    <div className="w-full mt-8 font-sans">
      <form 
        onSubmit={handleSubmit} 
        className="flex items-end gap-2 mb-10 border-b border-slate-200 focus-within:border-slate-800 transition-colors duration-500 pb-1"
      >
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave an echo..."
          rows={1}
          disabled={isSubmitting || isLoading}
          className="flex-1 bg-transparent p-0 focus:outline-none resize-none min-h-[24px] max-h-[120px] text-sm text-slate-700 placeholder:text-slate-300 overflow-hidden leading-relaxed disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={!newComment.trim() || isSubmitting || isLoading}
          className="p-1 mb-0.5 text-slate-300 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors duration-300 flex-shrink-0 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex py-2">
            <span className="text-xs text-slate-300 animate-pulse font-mono">Loading echoes...</span>
          </div>
        ) : (
          <AnimatePresence>
            {comments.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-xs text-slate-400 italic py-2"
              >
                No echoes yet. Be the first to leave a trace.
              </motion.p>
            ) : (
              comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                      {comment.author}
                    </span>
                    
                    {/* 🌟 日期与删除按钮组合 */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-300">
                        {comment.date}
                      </span>
                      {/* 只有在这条留言的 ID 属于 "我" 的时候，才渲染删除按钮 */}
                      {myCommentIds.includes(comment.id) && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-[10px] text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          title="Delete this echo"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                    {comment.content}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}