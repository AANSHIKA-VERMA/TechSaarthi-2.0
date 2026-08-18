import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { categoryMeta, getCategoryCounts } from '../lib/opportunities'

export default function OpportunitySection() {
  const { user } = useAuth()
  const [counts, setCounts] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    getCategoryCounts()
      .then((c) => !cancelled && setCounts(c))
      .catch(() => !cancelled && setError(true))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="opportunities" className="py-20 md:py-28" style={{ background: 'var(--paper)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--violet-deep)' }}>
              The route, mapped
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--ink)' }}>
              Four ways to move forward
            </h2>
          </div>
          <p className="max-w-sm text-sm" style={{ color: '#5B5A73' }}>
            Every listing is checked by hand and links to a full brief — organization,
            deadline, tags, and where to apply.
          </p>
        </div>

        {error && (
          <p className="text-sm mb-6 font-mono" style={{ color: '#B5455C' }}>
            Couldn't load live counts — check your Supabase env vars are set.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryMeta.map((cat, i) => {
            const to = user ? `/dashboard/opportunities/${cat.id}` : '/signup'
            const count = counts?.[cat.id]

            return (
              <Link
                key={cat.id}
                to={to}
                className="group relative rounded-2xl p-6 flex flex-col justify-between min-h-[190px] border transition-all hover:-translate-y-1"
                style={{
                  background: 'white',
                  borderColor: 'var(--paper-dim)',
                  boxShadow: '0 1px 2px rgba(11,15,31,0.04)',
                }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="font-mono text-xs px-2 py-1 rounded-full"
                    style={{ background: 'var(--paper-dim)', color: 'var(--violet-deep)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-2xl font-semibold" style={{ color: 'var(--ink)' }}>
                    {count ?? '—'}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>
                    {cat.label}
                  </h3>
                  <p className="text-sm leading-snug" style={{ color: '#6B6A85' }}>
                    {cat.blurb}
                  </p>
                </div>

                <span
                  className="mt-4 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1 transition-transform group-hover:translate-x-1"
                  style={{ color: 'var(--violet)' }}
                >
                  View list →
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
