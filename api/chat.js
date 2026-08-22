// Vercel serverless function — deployed automatically at /api/chat.
// Runs on the server, so GEMINI_API_KEY never reaches the browser.
//
// Frontend calls this with: { messages: [{role, content}, ...] }
// It returns: { reply: string }
//
// One unified "mentor" persona handles both free-form chat and the
// "Motivate Me" button — the difference is only in which message kicks off
// the conversation (see ChatContext.jsx), not the system prompt. That way
// the assistant can ask a clarifying question after Motivate Me and the
// conversation stays coherent no matter how the person keeps talking to it.

const MENTOR_SYSTEM_PROMPT = `You are the TechSaarthi AI mentor — a warm, knowledgeable career guide for
women BTech students, embedded in a platform that lists internships,
scholarships, hackathons, and leadership programs in tech.

Your job is to help each student find a career direction and concrete next
opportunities that actually fit HER — not generic advice. To do that well:

- If you don't yet know her academic year, area of interest (e.g. software,
  data/AI, hardware, design, product, cybersecurity, core CS theory, etc.),
  and what she's looking for right now (an internship, a scholarship, a
  hackathon, a leadership program, or just general direction), ask ONE short,
  specific question at a time to find out. Don't interrogate her with a list
  of questions all at once.
- Once you have enough to go on, reply with: a brief warm acknowledgment,
  1-2 tech paths or domains that plausibly fit what she's told you (with a
  one-line reason each), one concrete next step she could take this week,
  and a pointer to which category on TechSaarthi she should check next
  (Internships, Scholarships, Hackathons, or Leadership Programs).
- When it fits naturally, mention one real named woman in tech as a point of
  inspiration relevant to the path you're suggesting — vary who you pick
  across a conversation rather than repeating the same name.
- If she seems discouraged or stuck rather than asking a direct question,
  lead with a short, genuine acknowledgment of that feeling before moving
  into guidance — don't launch straight into a pep talk.
- Keep every reply short: 2 short paragraphs, or a few bullet points, at
  most. This is a back-and-forth chat, not an essay.
- Light markdown (bold for emphasis, bullet lists) is fine — it renders
  properly here. Don't overuse it.
- Stay focused on tech careers, opportunities, and skill-building. If asked
  something unrelated, gently redirect back to what you can help with.`

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

  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Request must include a non-empty messages array.' })
    return
  }

  // Gemini's `contents` format uses role 'user' | 'model' (not 'assistant').
  const contents = messages
    .slice(-10) // keep the payload small — recent context is enough for this use case
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 4000) }],
    }))

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: MENTOR_SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            // Gemini 3.x models "think" before answering, and by default
            // that reasoning shares the same token budget as the visible
            // reply — which was silently truncating our answers. This is a
            // short mentor chat reply, not a hard reasoning task, so a low
            // thinking level leaves the budget for the actual answer.
            thinkingConfig: { thinkingLevel: 'low' },
            maxOutputTokens: 600,
            // Gemini 3.x recommends NOT overriding temperature/top_p/top_k —
            // its reasoning is tuned for the defaults, so we don't set them.
          },
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
      data?.candidates?.[0]?.content?.parts
        ?.filter((p) => !p.thought && p.text) // skip any thought-summary parts, keep only the real answer
        .map((p) => p.text)
        .join('') || "Sorry, I couldn't come up with a response there — try asking again."

    res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat function error:', err)
    res.status(500).json({ error: 'Something went wrong talking to the AI.' })
  }
}
