import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const result = await supabase.auth.getUser()
  const user = result.data.user

  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const admin = createAdminClient()
  const deleteResult = await admin.auth.admin.deleteUser(user.id)

  if (deleteResult.error) {
    return NextResponse.json({ error: deleteResult.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}