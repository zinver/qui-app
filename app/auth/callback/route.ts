import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const userResult = await supabase.auth.getUser()
    const user = userResult.data.user

    if (user) {
      const profileResult = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (profileResult.data) {
        return NextResponse.redirect(origin + '/dashboard')
      }
    }
  }

  return NextResponse.redirect(origin + '/onboarding')
}