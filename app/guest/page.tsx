'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GuestPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tab, setTab] = useState('active')
  const router = useRouter()

  const requireLogin = () => {
    router.push('/login')
  }

  const demoThought = {
    title: 'Your post here',
    content: 'This is what one of your thoughts will look like. Pin it, archive it, or delete it whenever you want.',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8 relative">
          <h1 className="text-2xl font-serif text-white">@guest</h1>

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
                  onClick={requireLogin}
                  className="block w-full text-left px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 transition"
                >
                  Sign in
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <button
          onClick={requireLogin}
          className="w-full mb-6 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition"
        >
          Copy your link
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
            onClick={requireLogin}
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
          {tab === 'active' ? (
            <div className="group bg-neutral-900 rounded-lg border border-neutral-800 p-4">
              <p className="text-white font-semibold mb-1">{demoThought.title}</p>
              <p className="text-white whitespace-pre-wrap">{demoThought.content}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-neutral-500">{demoThought.date}</span>
                <div className="flex gap-3">
                  <button
                    onClick={requireLogin}
                    className="text-xs text-neutral-400 hover:text-indigo-400 transition"
                  >
                    Pin
                  </button>
                  <button
                    onClick={requireLogin}
                    className="text-xs text-neutral-400 hover:text-white transition"
                  >
                    Archive
                  </button>
                  <button
                    onClick={requireLogin}
                    className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-neutral-500 text-sm py-8">Nothing archived.</p>
          )}
        </div>
      </div>
    </main>
  )
}