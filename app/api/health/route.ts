import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      geminiKey: !!process.env.GEMINI_API_KEY,
    },
    supabase: {
      connected: false,
      tablesExist: false,
      error: null as string | null,
    },
  };

  try {
    const supabase = await createClient();

    // Test Supabase connection
    const { data, error } = await supabase.from('ideas').select('count', { count: 'exact', head: true });

    if (error) {
      checks.supabase.error = error.message;
    } else {
      checks.supabase.connected = true;
      checks.supabase.tablesExist = true;
    }
  } catch (error: any) {
    checks.supabase.error = error.message;
  }

  return NextResponse.json(checks, {
    status: checks.supabase.connected ? 200 : 500,
  });
}
