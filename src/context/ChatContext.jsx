import { createContext, useCallback, useContext, useState } from 'react'

const ChatContext = createContext(undefined)
const MAX_HISTORY = 10

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const callApi = useCallback(async (nextMessages, mode) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-MAX_HISTORY), mode }),
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
        callApi(next, 'chat')
        return next
      })
    },
    [callApi]
  )

  const motivateMe = useCallback(() => {
    setIsOpen(true)
    setMessages((prev) => {
      const next = [...prev, { role: 'user', content: 'Motivate me' }]
      callApi(next, 'motivate')
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
