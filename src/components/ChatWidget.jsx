import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'

// Assistant replies may use light markdown (bold, bullet lists) — render it
// properly instead of showing raw ** and * characters. Kept intentionally
// minimal: no headings/links/images/tables, since this is a small chat
// bubble, not a document viewer.
const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: '#FDF3DC' }}>
      {children}
    </strong>
  ),
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--gold)' }}>
      {children}
    </a>
  ),
}

export default function ChatWidget() {
  const { user } = useAuth()
  const { isOpen, open, close, messages, loading, error, sendMessage, motivateMe } = useChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  if (!user) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    sendMessage(input)
    setInput('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={open}
        aria-label="Open TechSaarthi AI assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full grid place-items-center shadow-lg transition-transform hover:-translate-y-0.5"
        style={{ background: 'var(--gold)', color: 'var(--ink)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] rounded-2xl flex flex-col overflow-hidden shadow-2xl border"
      style={{ background: 'var(--ink)', borderColor: 'var(--line)' }}
    >
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <p className="font-display font-semibold text-white text-sm">TechSaarthi AI</p>
          <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Your guide, on call
          </p>
        </div>
        <button
          onClick={close}
          aria-label="Close chat"
          className="w-8 h-8 rounded-full grid place-items-center hover:bg-white/5 transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          ✕
        </button>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Tell me your year and what part of tech interests you, or just tap
              below — I'll ask what I need to point you at the right
              opportunities.
            </p>
            <button
              onClick={motivateMe}
              className="text-xs font-medium px-4 py-2 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            >
              ✨ Motivate me
            </button>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={
                m.role === 'user'
                  ? { background: 'var(--gold)', color: 'var(--ink)' }
                  : { background: 'var(--ink-soft)', color: '#E5E1F7' }
              }
            >
              {m.role === 'user' ? (
                <span className="whitespace-pre-wrap">{m.content}</span>
              ) : (
                <ReactMarkdown components={markdownComponents}>{m.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--ink-soft)' }}>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: 'var(--muted)', animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(255,99,99,0.1)', color: '#FF8080' }}>
            {error}
          </p>
        )}
      </div>

      {/* input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: 'var(--line)' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          className="flex-1 rounded-full px-4 py-2.5 text-sm text-white outline-none border focus:border-[var(--gold)] transition-colors"
          style={{ background: 'var(--ink-soft)', borderColor: 'var(--line)' }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="w-10 h-10 rounded-full grid place-items-center shrink-0 disabled:opacity-40 transition-opacity"
          style={{ background: 'var(--gold)', color: 'var(--ink)' }}
        >
          →
        </button>
      </form>
    </div>
  )
}
