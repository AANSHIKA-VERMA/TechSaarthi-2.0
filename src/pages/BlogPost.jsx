import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MarkdownContent from '../components/MarkdownContent'
import { useAuth } from '../context/AuthContext'
import { getPostById } from '../lib/posts'
import { categoryMeta } from '../lib/opportunities'

const labelByCategory = Object.fromEntries(categoryMeta.map((c) => [c.id, c.label]))

export default function BlogPost() {
  const { id } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    getPostById(id)
      .then((data) => {
        setPost(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [id])

  return (
    <div>
      <Navbar variant={user ? 'dashboard' : 'public'} />

      <article className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-6">
          <Link
            to="/blog"
            className="font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1 mb-8 hover:underline"
            style={{ color: 'var(--violet)' }}
          >
            ← All stories
          </Link>

          {status === 'loading' && (
            <p className="font-mono text-sm" style={{ color: '#6B6A85' }}>Loading…</p>
          )}
          {status === 'error' && (
            <p className="font-mono text-sm" style={{ color: '#B5455C' }}>
              This story isn't available &mdash; it may have been removed, or isn't published yet.
            </p>
          )}

          {status === 'ready' && post && (
            <>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {post.related_category && (
                  <span
                    className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--paper-dim)', color: 'var(--violet-deep)' }}
                  >
                    {labelByCategory[post.related_category]}
                  </span>
                )}
                <span className="text-xs font-mono" style={{ color: '#9C9BB0' }}>
                  {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-semibold mb-3" style={{ color: 'var(--ink)' }}>
                {post.title}
              </h1>

              <p className="text-sm font-mono mb-10" style={{ color: '#6B6A85' }}>
                {post.is_anonymous ? 'Anonymous' : (post.author_display_name || 'A TechSaarthi student')}
                {!post.is_anonymous && post.author_linkedin && (
                  <>
                    {' · '}
                    <a href={post.author_linkedin} target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--violet)' }}>
                      LinkedIn
                    </a>
                  </>
                )}
              </p>

              <MarkdownContent>{post.body}</MarkdownContent>
            </>
          )}
        </div>
      </article>

      <Footer />
    </div>
  )
}
