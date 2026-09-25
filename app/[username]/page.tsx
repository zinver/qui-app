import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { linkify } from '@/lib/linkify'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const result1 = await supabase
    .from('public_profiles')
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
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-serif text-white mb-1">{'@' + profile.username}</h1>
            <p className="text-sm text-neutral-500">a quiet space</p>
          </div>
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg border border-neutral-800 text-white hover:bg-neutral-900 transition"
          >
            Log in
          </Link>
        </div>

        {pinned ? (
          <div className="mb-8 border border-indigo-500 rounded-lg p-4">
            <span className="text-xs text-indigo-400 mb-2 block">Pinned</span>
            {pinned.title ? (
              <p className="text-white font-semibold text-center mb-2">{pinned.title}</p>
            ) : null}
            <p className="text-white whitespace-pre-wrap leading-relaxed font-serif text-lg">
              {linkify(pinned.content)}
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
                  {t.title ? (
                    <p className="text-white font-semibold text-center mb-2">{t.title}</p>
                  ) : null}
                  <p className="text-white whitespace-pre-wrap leading-relaxed font-serif text-lg">
                    {linkify(t.content)}
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