import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const result1 = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  const profile = result1.data

  if (!profile) {
    notFound()
  }

  const result2 = await supabase
    .from('thoughts')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('archived', false)
    .order('created_at', { ascending: false })
  const thoughts = result2.data || []

  const pinned = thoughts.find(function (t) {
    return t.pinned
  })
  const rest = thoughts.filter(function (t) {
    return !t.pinned
  })

  return (
    <main className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-serif text-white mb-1">{'@' + profile.username}</h1>
        <p className="text-sm text-neutral-500 mb-10">a quiet space</p>

        {pinned ? (
          <div className="mb-8 border border-indigo-500 rounded-lg p-4">
            <span className="text-xs text-indigo-400 mb-2 block">Pinned</span>
            <p className="text-white whitespace-pre-wrap leading-relaxed font-serif text-lg">
              {pinned.content}
            </p>
            <span className="text-xs text-neutral-500 mt-3 block">
              {new Date(pinned.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        ) : null}

        <div className="space-y-6">
          {rest.length > 0 ? (
            rest.map(function (t) {
              return (
                <div key={t.id} className="border-b border-neutral-800 pb-6">
                  <p className="text-white whitespace-pre-wrap leading-relaxed font-serif text-lg">
                    {t.content}
                  </p>
                  <span className="text-xs text-neutral-500 mt-3 block">
                    {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )
            })
          ) : !pinned ? (
            <p className="text-center text-neutral-500 text-sm py-12">Nothing here yet.</p>
          ) : null}
        </div>
      </div>
    </main>
  )
}