import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const result = await supabase.auth.getUser()
  const user = result.data.user

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-black px-4 py-16 flex flex-col items-center">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-serif text-white mb-3">Qui</h1>
        <p className="text-neutral-400 mb-10">A quiet space for your raw self.</p>

        <div className="text-left space-y-6 mb-12">
          <div>
            <p className="text-white font-semibold mb-1">No feed. No likes. No view counts.</p>
            <p className="text-neutral-400 text-sm">
              You get one link. Post a thought, a poem, a quote, whatever is on your mind.
              You never know who reads it, so there is nothing to perform for.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Your account, your control.</p>
            <p className="text-neutral-400 text-sm">
              Archive or delete any post anytime. Delete your whole account whenever you want,
              no questions asked.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Sign in with Google.</p>
            <p className="text-neutral-400 text-sm">
              We only use your email to create your account. Nothing is ever posted on your
              behalf, and nothing you write is shared anywhere without your own link.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
          >
            Get started
          </Link>
          <Link
            href="/guest"
            className="block w-full py-3 rounded-lg border border-neutral-800 text-white font-medium hover:bg-neutral-900 transition"
          >
            Guest Mode
          </Link>
        </div>
      </div>
    </main>
  )
}