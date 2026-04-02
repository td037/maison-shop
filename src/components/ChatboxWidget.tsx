'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
}

export default function ChatboxWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý của MAISON 👋 Bạn cần hỗ trợ gì không?',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    if (open) {
      scrollToBottom()
    }
  }, [open, messages])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages
            .concat(userMessage)
            .map(({ role, content }) => ({ role, content })),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.reply,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        console.error('API error:', data.error)
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#11111f] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[9998] w-[360px] overflow-hidden rounded-[24px] bg-white shadow-[0_25px_50px_rgba(0,0,0,0.15)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-[#11111f] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                  AI
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div>
                <p className="font-semibold text-white">MAISON Assistant</p>
                <p className="text-xs text-gray-400">Thường trả lời trong vài giây</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex max-h-[360px] flex-col gap-4 overflow-y-auto bg-gray-50 px-4 py-4"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[280px] rounded-[18px] px-4 py-3 ${
                    msg.role === 'user'
                      ? 'rounded-tr-[4px] bg-[#11111f] text-white'
                      : 'rounded-tl-[4px] bg-[#f3f0ed] text-[#1a1a2e]'
                  }`}
                >
                  <p className="break-words text-sm font-body leading-relaxed">{msg.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      msg.role === 'user' ? 'text-gray-300' : 'text-on-surface-muted'
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-[18px] rounded-tl-[4px] bg-[#f3f0ed] px-4 py-3 text-[#1a1a2e]">
                  <div className="flex gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#1a1a2e] animation-bounce"></span>
                    <span className="animation-bounce-delay1 inline-block h-2 w-2 rounded-full bg-[#1a1a2e]"></span>
                    <span className="animation-bounce-delay2 inline-block h-2 w-2 rounded-full bg-[#1a1a2e]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                placeholder="Nhắn tin cho MAISON..."
                className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-sm placeholder-gray-500 outline-none transition-colors disabled:opacity-50 focus:bg-gray-200"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11111f] text-white transition-all disabled:opacity-50 hover:scale-110"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7m0 0l-7 7m7-7H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
        .animation-bounce {
          animation: bounce 1.4s ease-in-out infinite;
        }
        .animation-bounce-delay1 {
          animation: bounce 1.4s ease-in-out infinite 0.2s;
        }
        .animation-bounce-delay2 {
          animation: bounce 1.4s ease-in-out infinite 0.4s;
        }
      `}</style>
    </>
  )
}
