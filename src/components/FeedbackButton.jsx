const GOOGLE_FORM_URL = 'https://forms.gle/haM39qRdsDe4dCeb6'

export default function FeedbackButton() {
  return (
    
      href={GOOGLE_FORM_URL}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium shadow-lg transition-transform hover:-translate-y-0.5"
      style={{ background: 'var(--ink)', color: 'var(--gold)', border: '1px solid var(--line)' }}
    >
      💬 Give Feedback
    </a>
  )
}
