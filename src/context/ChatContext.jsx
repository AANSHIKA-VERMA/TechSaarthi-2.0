import { createContext, useCallback, useContext, useState } from 'react'

const ChatContext = createContext(undefined)
const MAX_HISTORY = 10

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const callApi = useCallback(async (nextMessages) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-MAX_HISTORY) }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setError("Couldn't reach the assistant — try again in a moment.")
    } finally {
      setLoading(false)
    }
  }, [])

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim()
      if (!trimmed) return
      setMessages((prev) => {
        const next = [...prev, { role: 'user', content: trimmed }]
        callApi(next)
        return next
      })
    },
    [callApi]
  )

  // Kicks off the same mentor conversation, just with an opening message
  // that nudges toward guidance/motivation rather than a direct question.
  // The system prompt (not this text) is what makes it act like a mentor —
  // see api/chat.js.
  const motivateMe = useCallback(() => {
    setIsOpen(true)
    setMessages((prev) => {
      const next = [
        ...prev,
        { role: 'user', content: "I could use some guidance and motivation on my path — can you help?" },
      ]
      callApi(next)
      return next
    })
  }, [callApi])

  const value = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    messages,
    loading,
    error,
    sendMessage,
    motivateMe,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (ctx === undefined) {
    throw new Error('useChat must be used inside a ChatProvider')
  }
  return ctx
}
