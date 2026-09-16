'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const clean = username.trim().toLowerCase()
    if (!/^[a-z0-9_]{3,}$/.test(clean)) {
      setError('Username must be 3+ characters: letters, numbers, underscores only.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .insert({ user_id: user.id, username: clean })

    setLoading(false)

    if (error) {
      if (error.code === '23505') setError('That username is taken. Try another.')
      else setError(error.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-2xl font-serif text-white mb-2">Choose your name</h1>
        <p className="text-neutral-400 mb-8">This becomes your link: yoursite.com/username</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="quiet_soul"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </main>
  )
}