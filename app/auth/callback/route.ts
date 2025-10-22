import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    // Exchange code for session to verify the email
    await supabase.auth.exchangeCodeForSession(code)
    // Immediately sign out so they see the confirmation page without being logged in
    await supabase.auth.signOut()
  }

  // Redirect to confirmation page
  return NextResponse.redirect(`${requestUrl.origin}/auth/confirmed`)
}
