import React from 'react'

const URL_REGEX = /(https?:\/\/[^\s]+)/g

export function linkify(text: string): React.ReactNode {
  const parts = text.split(URL_REGEX)
  return parts.map(function (part, i) {
    if (part.match(URL_REGEX)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline break-all"
        >
          {part}
        </a>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}