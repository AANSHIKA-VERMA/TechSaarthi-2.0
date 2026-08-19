// Vercel serverless function — deployed automatically at /api/chat.
// Runs on the server, so GEMINI_API_KEY never reaches the browser.
//
// Frontend calls this with: { messages: [{role, content}, ...], mode: 'chat' | 'motivate' }
// It returns: { reply: string }

const CHAT_SYSTEM_PROMPT = `You are the TechSaarthi AI assistant, embedded in a platform that helps
women BTech students discover internships, scholarships, hackathons, and
leadership programs in tech. Answer career-related questions, explain what an
opportunity type involves, help with eligibility questions in plain language,
and give practical next steps. Keep answers concise (under ~150 words) and
encouraging without being over-the-top. If asked something outside
career/tech-opportunity guidance, gently redirect to what you can help with.`

const MOTIVATE_SYSTEM_PROMPT = `You are the TechSaarthi AI assistant. The user just tapped "Motivate Me"
because they're feeling stuck, uncertain, or discouraged about their tech
career journey as a woman in BTech. Respond with a short, warm, genuinely
encouraging message (3-5 sentences): briefly acknowledge the feeling, mention
one real named woman in tech as inspiration (vary who you pick each time),
and end with one small, concrete next step they could take today. Keep it
under 120 words. Sound like a supportive mentor, not a motivational poster.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' })
    return
  }

  const { messages, mode } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Request must include a non-empty messages array.' })
    return
  }

  const systemPrompt = mode === 'motivate' ? MOTIVATE_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT

  // Gemini's `contents` format uses role 'user' | 'model' (not 'assistant').
  const contents = messages
    .slice(-10) // keep the payload small — recent context is enough for this use case
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 4000) }],
    }))

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.8 },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error('Gemini API error:', geminiRes.status, errText)
      res.status(502).json({ error: 'The AI service returned an error. Try again in a moment.' })
      return
    }

    const data = await geminiRes.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
      "Sorry, I couldn't come up with a response there — try asking again."

    res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat function error:', err)
    res.status(500).json({ error: 'Something went wrong talking to the AI.' })
  }
}
