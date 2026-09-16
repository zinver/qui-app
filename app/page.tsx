import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const result = await supabase.auth.getUser()
  const user = result.data.user
  redirect(user ? '/dashboard' : '/login')
}