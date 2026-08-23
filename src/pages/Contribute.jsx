import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { categoryMeta } from '../lib/opportunities'
import { submitOpportunity, getMySubmissions } from '../lib/contributions'
import { createPost, getMyPosts } from '../lib/posts'

const statusStyle = {
  pending: { bg: 'rgba(255,182,39,0.12)', color: '#8A6100' },
  approved: { bg: 'rgba(108,92,231,0.12)', color: 'var(--violet-deep)' },
  published: { bg: 'rgba(108,92,231,0.12)', color: 'var(--violet-deep)' },
  rejected: { bg: 'rgba(255,99,99,0.1)', color: '#C24B4B' },
}

function StatusBadge({ status }) {
  const s = statusStyle[status] || statusStyle.pending
  return (
    <span
      className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  )
}

export default function Contribute() {
  const { user } = useAuth()
  const [tab, setTab] = useState('opportunity') // 'opportunity' | 'story'

  return (
    <div>
      <Navbar variant="dashboard" />

      <section className="py-14 md:py-16" style={{ background: 'var(--ink)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Contribute
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white">
            Help other students find their route
          </h1>
          <p className="mt-4 max-w-xl text-sm md:text-base" style={{ color: 'var(--muted)' }}>
            Suggest an opportunity you've come across, or share what an application,
            internship, or hackathon was actually like. Everything is reviewed before
            it goes live — nothing publishes automatically.
          </p>

          <div className="mt-8 flex gap-2">
            <button
              onClick={() => setTab('opportunity')}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
              style={
                tab === 'opportunity'
                  ? { background: 'var(--gold)', color: 'var(--ink)' }
                  : { background: 'var(--ink-soft)', color: 'var(--muted)' }
              }
            >
              Suggest an opportunity
            </button>
            <button
              onClick={() => setTab('story')}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
              style={
                tab === 'story'
                  ? { background: 'var(--gold)', color: 'var(--ink)' }
                  : { background: 'var(--ink-soft)', color: 'var(--muted)' }
              }
            >
              Share your experience
            </button>
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: 'var(--paper)' }}>
        <div className="max-w-3xl mx-auto px-6">
          {tab === 'opportunity' ? <SuggestOpportunityForm userId={user.id} /> : <SharePostForm user={user} />}
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ============================================================ opportunity form
function SuggestOpportunityForm({ userId }) {
  const [form, setForm] = useState({
    title: '', organization: '', category: 'internships', deadline: '', deadline_text: '',
    tags: '', apply_link: '', reference_video: '', notion_link: '', submitter_note: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mine, setMine] = useState([])
  const [loadingMine, setLoadingMine] = useState(true)

  const loadMine = () => {
    setLoadingMine(true)
    getMySubmissions(userId)
      .then(setMine)
      .catch(() => {})
      .finally(() => setLoadingMine(false))
  }

  useEffect(loadMine, [userId])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.organization.trim()) {
      setError('Title and organization are required.')
      return
    }
    setSubmitting(true)
    try {
      await submitOpportunity(userId, {
        ...form,
        deadline: form.deadline || null,
        deadline_text: form.deadline_text || null,
      })
      setSuccess(true)
      setForm({
        title: '', organization: '', category: 'internships', deadline: '', deadline_text: '',
        tags: '', apply_link: '', reference_video: '', notion_link: '', submitter_note: '',
      })
      loadMine()
    } catch {
      setError('Something went wrong submitting this — try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    background: 'white', borderColor: 'var(--paper-dim)', color: 'var(--ink)',
  }
  const inputClass =
    'w-full rounded-lg px-4 py-2.5 text-sm outline-none border focus:border-[var(--gold)] transition-colors'

  return (
    <div>
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 border space-y-4" style={{ background: 'white', borderColor: 'var(--paper-dim)' }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Title *</label>
            <input className={inputClass} style={inputStyle} value={form.title} onChange={update('title')} placeholder="Google STEP Internship" />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Organization *</label>
            <input className={inputClass} style={inputStyle} value={form.organization} onChange={update('organization')} placeholder="Google" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Category</label>
            <select className={inputClass} style={inputStyle} value={form.category} onChange={update('category')}>
              {categoryMeta.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Tags (comma-separated)</label>
            <input className={inputClass} style={inputStyle} value={form.tags} onChange={update('tags')} placeholder="Remote, Paid, 2nd year" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Deadline (if known)</label>
            <input type="date" className={inputClass} style={inputStyle} value={form.deadline} onChange={update('deadline')} />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Or describe it (e.g. "Rolling")</label>
            <input className={inputClass} style={inputStyle} value={form.deadline_text} onChange={update('deadline_text')} placeholder="Rolling admissions" />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Apply link</label>
          <input className={inputClass} style={inputStyle} value={form.apply_link} onChange={update('apply_link')} placeholder="https://..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Reference video (optional)</label>
            <input className={inputClass} style={inputStyle} value={form.reference_video} onChange={update('reference_video')} placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Detail page link (optional)</label>
            <input className={inputClass} style={inputStyle} value={form.notion_link} onChange={update('notion_link')} placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>
            Why are you suggesting this? (optional, helps review)
          </label>
          <textarea
            className={inputClass} style={{ ...inputStyle, minHeight: 80 }}
            value={form.submitter_note} onChange={update('submitter_note')}
            placeholder="I applied to this last semester and thought more people should know about it..."
          />
        </div>

        {error && (
          <p className="text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(255,99,99,0.1)', color: '#C24B4B' }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--violet-deep)' }}>
            Thanks — this is in the review queue now.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: 'var(--ink)', color: 'white' }}
        >
          {submitting ? 'Submitting…' : 'Submit for review'}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--ink)' }}>Your submissions</h2>
        {loadingMine && <p className="text-sm font-mono" style={{ color: '#6B6A85' }}>Loading…</p>}
        {!loadingMine && mine.length === 0 && (
          <p className="text-sm font-mono" style={{ color: '#6B6A85' }}>Nothing submitted yet.</p>
        )}
        <div className="space-y-2">
          {mine.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg px-4 py-3 border" style={{ background: 'white', borderColor: 'var(--paper-dim)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{s.title}</p>
                <p className="text-xs" style={{ color: '#6B6A85' }}>{s.organization}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ==================================================================== post form
function SharePostForm({ user }) {
  const [form, setForm] = useState({
    title: '', body: '', is_anonymous: false,
    author_display_name: user?.user_metadata?.full_name || '',
    author_linkedin: '', related_category: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mine, setMine] = useState([])
  const [loadingMine, setLoadingMine] = useState(true)

  const loadMine = () => {
    setLoadingMine(true)
    getMyPosts(user.id)
      .then(setMine)
      .catch(() => {})
      .finally(() => setLoadingMine(false))
  }

  useEffect(loadMine, [user.id])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and story are required.')
      return
    }
    setSubmitting(true)
    try {
      await createPost(user.id, {
        title: form.title,
        body: form.body,
        is_anonymous: form.is_anonymous,
        author_display_name: form.is_anonymous ? null : (form.author_display_name || null),
        author_linkedin: form.is_anonymous ? null : (form.author_linkedin || null),
        related_category: form.related_category || null,
      })
      setSuccess(true)
      setForm((f) => ({ ...f, title: '', body: '' }))
      loadMine()
    } catch {
      setError('Something went wrong publishing this — try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = { background: 'white', borderColor: 'var(--paper-dim)', color: 'var(--ink)' }
  const inputClass = 'w-full rounded-lg px-4 py-2.5 text-sm outline-none border focus:border-[var(--gold)] transition-colors'

  return (
    <div>
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 border space-y-4" style={{ background: 'white', borderColor: 'var(--paper-dim)' }}>
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Title *</label>
          <input className={inputClass} style={inputStyle} value={form.title} onChange={update('title')} placeholder="What I learned applying to 12 internships" />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Your story * (markdown supported)</label>
          <textarea
            className={inputClass} style={{ ...inputStyle, minHeight: 220, fontFamily: 'var(--font-mono)' }}
            value={form.body} onChange={update('body')}
            placeholder={'Write freely — headings, **bold**, and lists all work.\n\nWhat was the process like? What surprised you? What would you tell someone about to do the same thing?'}
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Related category (optional)</label>
          <select className={inputClass} style={inputStyle} value={form.related_category} onChange={update('related_category')}>
            <option value="">None in particular</option>
            {categoryMeta.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--ink)' }}>
          <input
            type="checkbox"
            checked={form.is_anonymous}
            onChange={(e) => setForm((f) => ({ ...f, is_anonymous: e.target.checked }))}
            className="w-4 h-4"
          />
          Publish this anonymously
        </label>

        {!form.is_anonymous && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>Display name</label>
              <input className={inputClass} style={inputStyle} value={form.author_display_name} onChange={update('author_display_name')} placeholder="Your name" />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: '#6B6A85' }}>LinkedIn (optional)</label>
              <input className={inputClass} style={inputStyle} value={form.author_linkedin} onChange={update('author_linkedin')} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(255,99,99,0.1)', color: '#C24B4B' }}>{error}</p>
        )}
        {success && (
          <p className="text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--violet-deep)' }}>
            Thanks — your story is in the review queue now.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: 'var(--ink)', color: 'white' }}
        >
          {submitting ? 'Submitting…' : 'Submit for review'}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--ink)' }}>Your stories</h2>
        {loadingMine && <p className="text-sm font-mono" style={{ color: '#6B6A85' }}>Loading…</p>}
        {!loadingMine && mine.length === 0 && (
          <p className="text-sm font-mono" style={{ color: '#6B6A85' }}>Nothing shared yet.</p>
        )}
        <div className="space-y-2">
          {mine.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg px-4 py-3 border" style={{ background: 'white', borderColor: 'var(--paper-dim)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{p.title}</p>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
