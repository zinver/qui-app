'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoBox() {
  const [content, setContent] = useState('')
  const router = useRouter()

  const tryPost = () => {
    router.push('/login')
  }

  return (
    <div className="mb-10">
      <p className="text-xs text-neutral-500 mb-2 text-center">Try it out</p>
      <textarea
        value={content}
        onChange={function (e) {
          setContent(e.target.value)
        }}
        placeholder="What is on your mind"
        rows={3}
        className="w-full px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      <button
        onClick={tryPost}
        className="mt-2 w-full py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
      >
        Post
      </button>
      <p className="text-xs text-neutral-500 mt-2 text-center">
        You will need to sign in to actually post
      </p>
    </div>
  )
}