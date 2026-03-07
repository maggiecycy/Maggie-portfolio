import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    // 尝试插入数据
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    // 处理重复订阅的特定报错
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Subscribed successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
  }
}