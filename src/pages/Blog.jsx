import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { getPublishedPosts } from '../lib/posts'
import { categoryMeta } from '../lib/opportunities'

const labelByCategory = Object.fromEntries(categoryMeta.map((c) => [c.id, c.label]))

function excerpt(body, len = 160) {
  const plain = body.replace(/[#*_`>[\]]/g, '').replace(/\s+/g, ' ').trim()
  return plain.length > len ? plain.slice(0, len).trimEnd() + '…' : plain
}

export default function Blog() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    getPublishedPosts()
      .then((data) => {
        setPosts(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div>
      <Navbar variant={user ? 'dashboard' : 'public'} />

      <section className="py-16 md:py-20" style={{ background: 'var(--ink)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Experiences
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white max-w-2xl">
            Real stories from students who've been through it
          </h1>
          <p className="mt-4 max-w-xl text-sm md:text-base" style={{ color: 'var(--muted)' }}>
            Written by TechSaarthi students &mdash; some named, some anonymous. Have
            your own to add?{' '}
            <Link to={user ? '/dashboard/contribute' : '/signup'} className="underline" style={{ color: 'var(--gold)' }}>
              Share it here
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: 'var(--paper)' }}>
        <div className="max-w-4xl mx-auto px-6">
          {status === 'loading' && (
            <p className="font-mono text-sm" style={{ color: '#6B6A85' }}>Loading stories…</p>
          )}
          {status === 'error' && (
            <p className="font-mono text-sm" style={{ color: '#B5455C' }}>Couldn't load stories right now.</p>
          )}
          {status === 'ready' && posts.length === 0 && (
            <p className="font-mono text-sm" style={{ color: '#6B6A85' }}>
              No stories published yet &mdash; be the first.
            </p>
          )}

          <div className="space-y-4">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.id}`}
                className="block rounded-2xl p-6 border transition-all hover:-translate-y-0.5"
                style={{ background: 'white', borderColor: 'var(--paper-dim)', boxShadow: '0 1px 2px rgba(11,15,31,0.04)' }}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {p.related_category && (
                    <span
                      className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--paper-dim)', color: 'var(--violet-deep)' }}
                    >
                      {labelByCategory[p.related_category]}
                    </span>
                  )}
                  <span className="text-xs font-mono" style={{ color: '#9C9BB0' }}>
                    {new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                  {p.title}
                </h2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#5B5A73' }}>
                  {excerpt(p.body)}
                </p>
                <p className="text-xs font-mono" style={{ color: '#9C9BB0' }}>
                  {p.is_anonymous ? 'Anonymous' : p.author_display_name || 'A TechSaarthi student'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
