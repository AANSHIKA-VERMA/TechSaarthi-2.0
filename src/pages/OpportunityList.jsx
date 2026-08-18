import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OpportunityCard from '../components/OpportunityCard'
import { useAuth } from '../context/AuthContext'
import { categoryMeta, getOpportunitiesByCategory } from '../lib/opportunities'
import { getSavedIds, saveOpportunity, unsaveOpportunity } from '../lib/savedOpportunities'

export default function OpportunityList() {
  const { category } = useParams()
  const { user } = useAuth()
  const meta = categoryMeta.find((c) => c.id === category)

  const [opportunities, setOpportunities] = useState([])
  const [savedIds, setSavedIds] = useState(new Set())
  const [pendingId, setPendingId] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    Promise.all([getOpportunitiesByCategory(category), getSavedIds(user?.id)])
      .then(([opps, saved]) => {
        if (cancelled) return
        setOpportunities(opps)
        setSavedIds(saved)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
    }
  }, [category, user?.id])

  const handleToggleSave = async (opportunityId) => {
    if (!user) return
    setPendingId(opportunityId)
    const isSaved = savedIds.has(opportunityId)

    try {
      if (isSaved) {
        await unsaveOpportunity(user.id, opportunityId)
        setSavedIds((prev) => {
          const next = new Set(prev)
          next.delete(opportunityId)
          return next
        })
      } else {
        await saveOpportunity(user.id, opportunityId)
        setSavedIds((prev) => new Set(prev).add(opportunityId))
      }
    } catch {
      // silently ignore — button will just stay in its current state
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div>
      <Navbar variant="dashboard" />

      <section className="py-14 md:py-16" style={{ background: 'var(--ink)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <Link
            to="/dashboard"
            className="font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1 mb-6 hover:text-white transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            ← Back to dashboard
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white">
            {meta?.label ?? 'Opportunities'}
          </h1>
          {meta && (
            <p className="mt-3 max-w-xl text-sm md:text-base" style={{ color: 'var(--muted)' }}>
              {meta.blurb}
            </p>
          )}
        </div>
      </section>

      <section className="py-14" style={{ background: 'var(--paper)' }}>
        <div className="max-w-6xl mx-auto px-6">
          {status === 'loading' && (
            <p className="font-mono text-sm" style={{ color: '#6B6A85' }}>
              Loading opportunities…
            </p>
          )}

          {status === 'error' && (
            <p className="font-mono text-sm" style={{ color: '#B5455C' }}>
              Couldn't load this list. Check your Supabase connection and that the
              `opportunities` table has been created and seeded.
            </p>
          )}

          {status === 'ready' && opportunities.length === 0 && (
            <p className="font-mono text-sm" style={{ color: '#6B6A85' }}>
              No listings here yet — check back soon.
            </p>
          )}

          {status === 'ready' && opportunities.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  saved={savedIds.has(opp.id)}
                  savePending={pendingId === opp.id}
                  onToggleSave={() => handleToggleSave(opp.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
