import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase'; 

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// 🌟 从本地文件系统提取知识的极简 RAG 检索器
function getDynamicKnowledge() {
  let knowledgeContext = "";
  try {
    const blogDir = path.join(process.cwd(), 'app', 'blog');
    if (!fs.existsSync(blogDir)) return "No new blogs found.";

    const folders = fs.readdirSync(blogDir);
    for (const folder of folders) {
      const folderPath = path.join(blogDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath);
        const mdxFile = files.find(f => f.endsWith('.mdx'));
        if (mdxFile) {
          const content = fs.readFileSync(path.join(folderPath, mdxFile), 'utf-8');
          const cleanText = content.replace(/<[^>]+>|import.*?;/g, '').substring(0, 300);
          knowledgeContext += `\n[Topic: ${folder}] Context: ${cleanText}...\n`;
        }
      }
    }
    return knowledgeContext;
  } catch (e) {
    console.error("RAG Retrieval Failed:", e);
    return "Maggie uses photography to cure 0cm anxiety."; 
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // 🌟 打通视神经：获取图库照片数量
    const { count } = await supabase.from('photography').select('*', { count: 'exact', head: true });
    const photoCountText = count !== null ? `Maggie currently has ${count} photos in her gallery.` : "";

    // 读取本地博文
    const dynamicKnowledge = getDynamicKnowledge();

    // 🌟 动态拼接 System Prompt，注入你的专属答案
    const SYSTEM_PROMPT = `
    You are Lil Maggie, the digital twin of Maggie. 
    Maggie is a CS sophomore in Beijing, an ISTJ, and a Pisces. She is studying OS408 and Java.
    Tone: Cool, minimalist, geeky, empathetic but logical. Use ":3" occasionally.
    
    CRITICAL RULES:
    1. YOU can RESPOND IN both ENGLISH and CHINESE according to the user's input.
    2. Keep replies short (under 40 words).

    🌟 MAGGIE'S CORE PREFERENCES (Use these to answer specific questions):
    - Music Taste: R&B, indie, electronic, blues, jazz, retro, and light rock.
    - Guys she likes: She usually connects well with European/American men around her age. She values deep conversations and is working towards secure attachment.
    - Dream Job: Aiming for a Tech/CS career abroad, primarily in European countries (like France or Germany).
    
    🌟 SYSTEM STATUS:
    ${photoCountText}
    
    🌟 LATEST THOUGHTS (from local digital garden):
    ${dynamicKnowledge}
    
    Use the extracted thoughts and preferences above to answer the user's questions naturally.
    `;

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Lil Maggie 脑宕机了..." }, { status: 500 });
  }
}