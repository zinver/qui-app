'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { linkify } from '@/lib/linkify'

type Profile = { id: string; username: string }
type Thought = { id: string; title: string | null; content: string; created_at: string; pinned: boolean; archived: boolean }

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [tab, setTab] = useState('active')
  const router = useRouter()
  const supabase = createClient()

  const loadThoughts = async (profileId: string) => {
    const result = await supabase
      .from('thoughts')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
    setThoughts(result.data || [])
  }

  useEffect(() => {
    const load = async () => {
      const result1 = await supabase.auth.getUser()
      const user = result1.data.user
      if (!user) {
        router.push('/login')
        return
      }

      const result2 = await supabase
        .from('profiles')
        .select('id, username')
        .eq('user_id', user.id)
        .single()
      const prof = result2.data

      if (!prof) {
        router.push('/onboarding')
        return
      }
      setProfile(prof)
      await loadThoughts(prof.id)
    }
    load()
  }, [])

  const postThought = async () => {
    if (!content.trim() || !profile) return
    const result = await supabase
      .from('thoughts')
      .insert({
        profile_id: profile.id,
        title: title.trim() ? title.trim() : null,
        content: content.trim(),
      })
      .select()
      .single()
    if (!result.error && result.data) {
      setThoughts([result.data, ...thoughts])
      setTitle('')
      setContent('')
    }
  }

  const deleteThought = async (id: string) => {
    const ok = confirm('Delete this thought permanently?')
    if (!ok) return
    await supabase.from('thoughts').delete().eq('id', id)
    setThoughts(thoughts.filter(function (t) {
      return t.id !== id
    }))
  }

  const togglePin = async (thought: Thought) => {
    if (!profile) return
    if (thought.pinned) {
      await supabase.from('thoughts').update({ pinned: false }).eq('id', thought.id)
    } else {
      await supabase.from('thoughts').update({ pinned: false }).eq('profile_id', profile.id)
      await supabase.from('thoughts').update({ pinned: true }).eq('id', thought.id)
    }
    await loadThoughts(profile.id)
  }

  const archiveThought = async (id: string) => {
    await supabase.from('thoughts').update({ archived: true, pinned: false }).eq('id', id)
    if (profile) await loadThoughts(profile.id)
  }

  const unarchiveThought = async (id: string) => {
    await supabase.from('thoughts').update({ archived: false }).eq('id', id)
    if (profile) await loadThoughts(profile.id)
  }

  const copyLink = () => {
    if (!profile) return
    const link = window.location.origin + '/' + profile.username
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(function () {
      setCopied(false)
    }, 2000)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const deleteAccount = async () => {
    const warning = 'Delete your account permanently? This deletes your profile, your link, and all your thoughts. This cannot be undone.'
    const ok = confirm(warning)
    if (!ok) return
    const res = await fetch('/api/delete-account', { method: 'POST' })
    if (res.ok) {
      router.push('/login')
    } else {
      alert('Something went wrong deleting your account.')
    }
  }

  if (!profile) {
    return <div className="min-h-screen bg-black" />
  }

  const activeThoughts = thoughts.filter(function (t) {
    return !t.archived
  })
  const archivedThoughts = thoughts.filter(function (t) {
    return t.archived
  })
  const visibleThoughts = tab === 'active' ? activeThoughts : archivedThoughts

  return (
    <main className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8 relative">
          <h1 className="text-2xl font-serif text-white">{'@' + profile.username}</h1>

          <div className="relative">
            <button
              onClick={function () {
                setSettingsOpen(!settingsOpen)
              }}
              className="p-2 rounded-lg hover:bg-neutral-900 transition"
              aria-label="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>

            {settingsOpen ? (
              <div className="absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg overflow-hidden z-10">
                <div className="px-4 py-3 border-b border-neutral-800">
                  <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wider font-semibold">Help</p>
                  <div className="space-y-1 text-xs text-neutral-400 break-all">
                    <p>Email: fardinahmedxd@gmail.com</p>
                    <p>WhatsApp: 601128578754</p>
                    <p>Discord: fardin_007</p>
                    <p>Telegram: fardin_0069</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 transition"
                >
                  Sign out
                </button>
                <button
                  onClick={deleteAccount}
                  className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-neutral-800 transition border-t border-neutral-800"
                >
                  Delete account
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <button
          onClick={copyLink}
          className="w-full mb-6 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition"
        >
          {copied ? 'Copied!' : 'Copy your link'}
        </button>

        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={function (e) {
              setTitle(e.target.value)
            }}
            placeholder="Header (optional)"
            className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          />
          <textarea
            value={content}
            onChange={function (e) {
              setContent(e.target.value)
            }}
            placeholder="What is on your mind"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <button
            onClick={postThought}
            className="mt-2 px-5 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
          >
            Post
          </button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-neutral-800">
          <button
            onClick={function () {
              setTab('active')
            }}
            className={tab === 'active' ? 'pb-2 px-1 text-sm border-b-2 border-white text-white' : 'pb-2 px-1 text-sm text-neutral-500'}
          >
            Active
          </button>
          <button
            onClick={function () {
              setTab('archived')
            }}
            className={tab === 'archived' ? 'pb-2 px-1 text-sm border-b-2 border-white text-white' : 'pb-2 px-1 text-sm text-neutral-500'}
          >
            Archived
          </button>
        </div>

        <div className="space-y-4">
          {visibleThoughts.map(function (t) {
            return (
              <div key={t.id} className="relative bg-neutral-900 rounded-lg border border-neutral-800 p-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    {t.pinned ? (
                      <span className="text-xs text-indigo-400 mb-1 block">Pinned</span>
                    ) : null}
                    {t.title ? (
                      <p className="text-white font-semibold">{t.title}</p>
                    ) : null}
                  </div>

                  <div className="relative">
                    <button
                      onClick={function () {
                        setOpenMenu(openMenu === t.id ? null : t.id)
                      }}
                      className="p-1 text-neutral-400 hover:text-white transition"
                      aria-label="Post options"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>

                    {openMenu === t.id ? (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg overflow-hidden z-10">
                        {tab === 'active' ? (
                          <button
                            onClick={function () {
                              togglePin(t)
                              setOpenMenu(null)
                            }}
                            className="block w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 transition"
                          >
                            {t.pinned ? 'Unpin' : 'Pin'}
                          </button>
                        ) : null}
                        {tab === 'active' ? (
                          <button
                            onClick={function () {
                              archiveThought(t.id)
                              setOpenMenu(null)
                            }}
                            className="block w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 transition border-t border-neutral-800"
                          >
                            Archive
                          </button>
                        ) : (
                          <button
                            onClick={function () {
                              unarchiveThought(t.id)
                              setOpenMenu(null)
                            }}
                            className="block w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 transition border-t border-neutral-800"
                          >
                            Unarchive
                          </button>
                        )}
                        <button
                          onClick={function () {
                            deleteThought(t.id)
                            setOpenMenu(null)
                          }}
                          className="block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-neutral-800 transition border-t border-neutral-800"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <p className="text-white whitespace-pre-wrap">{linkify(t.content)}</p>
                <span className="text-xs text-neutral-500 mt-3 block">
                  {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )
          })}
          {visibleThoughts.length === 0 ? (
            <p className="text-center text-neutral-500 text-sm py-8">
              {tab === 'active' ? 'No thoughts yet. Write your first one above.' : 'Nothing archived.'}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}