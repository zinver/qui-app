'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-3xl font-serif text-white mb-2">Qui</h1>
        <p className="text-neutral-400 mb-10">A quiet space for your raw self.</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
        >
          Continue with Google
        </button>
      </div>
    </main>
  )
}