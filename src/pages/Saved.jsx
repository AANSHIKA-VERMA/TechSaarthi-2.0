import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OpportunityCard from '../components/OpportunityCard'
import { useAuth } from '../context/AuthContext'
import { categoryMeta } from '../lib/opportunities'
import { getSavedOpportunities, unsaveOpportunity } from '../lib/savedOpportunities'

const labelByCategory = Object.fromEntries(categoryMeta.map((c) => [c.id, c.label]))

export default function Saved() {
  const { user } = useAuth()
  const [saved, setSaved] = useState([])
  const [pendingId, setPendingId] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getSavedOpportunities(user?.id)
      .then((data) => {
        if (cancelled) return
        setSaved(data)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
    }
  }, [user?.id])

  const handleRemove = async (opportunityId) => {
    setPendingId(opportunityId)
    try {
      await unsaveOpportunity(user.id, opportunityId)
      setSaved((prev) => prev.filter((o) => o.id !== opportunityId))
    } catch {
      // leave it in place if the delete failed
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
            Saved opportunities
          </h1>
          <p className="mt-3 max-w-xl text-sm md:text-base" style={{ color: 'var(--muted)' }}>
            Everything you've bookmarked, across every category, in one place.
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: 'var(--paper)' }}>
        <div className="max-w-6xl mx-auto px-6">
          {status === 'loading' && (
            <p className="font-mono text-sm" style={{ color: '#6B6A85' }}>
              Loading your saved list…
            </p>
          )}

          {status === 'error' && (
            <p className="font-mono text-sm" style={{ color: '#B5455C' }}>
              Couldn't load your saved opportunities. Check your Supabase connection.
            </p>
          )}

          {status === 'ready' && saved.length === 0 && (
            <div>
              <p className="font-mono text-sm mb-4" style={{ color: '#6B6A85' }}>
                Nothing saved yet.
              </p>
              <Link
                to="/dashboard"
                className="inline-block text-sm font-medium px-5 py-2.5 rounded-full transition-transform hover:-translate-y-0.5"
                style={{ background: 'var(--ink)', color: 'white' }}
              >
                Browse opportunities
              </Link>
            </div>
          )}

          {status === 'ready' && saved.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {saved.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  saved
                  savePending={pendingId === opp.id}
                  onToggleSave={() => handleRemove(opp.id)}
                  categoryLabel={labelByCategory[opp.category]}
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
