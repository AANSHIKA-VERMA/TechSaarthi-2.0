import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password, fullName)
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // If Supabase has email confirmations turned on, there's no session yet.
    if (!data.session) {
      setConfirmSent(true)
      return
    }

    navigate('/dashboard')
  }

  if (confirmSent) {
    return (
      <div className="min-h-screen grid place-items-center px-6" style={{ background: 'var(--ink)' }}>
        <div className="max-w-sm text-center">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Almost there
          </p>
          <h1 className="font-display text-2xl font-semibold text-white mb-3">Check your inbox</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            We sent a confirmation link to <span className="text-white">{email}</span>. Click it to
            activate your account, then log in.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 rounded-full text-sm font-medium"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}
          >
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background: 'var(--ink)' }}>
      <div className="hidden md:flex flex-col justify-between p-12" style={{ background: 'var(--ink-soft)' }}>
        <Link to="/" className="font-display font-semibold text-lg text-white">
          TechSaarthi
        </Link>
        <div>
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Start your route
          </p>
          <h2 className="font-display text-3xl font-semibold text-white max-w-sm leading-tight">
            Discover → Apply → Grow → Lead.
          </h2>
        </div>
        <p className="text-sm max-w-xs" style={{ color: 'var(--muted)' }}>
          Free forever for students. No spam, no cold DMs — just the opportunities.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Link to="/" className="font-display font-semibold text-lg text-white">
              TechSaarthi
            </Link>
          </div>

          <h1 className="font-display text-2xl font-semibold text-white mb-1">Create your account</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            Already with us?{' '}
            <Link to="/login" style={{ color: 'var(--gold)' }} className="hover:underline">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none border focus:border-[var(--gold)] transition-colors"
                style={{ background: 'var(--ink)', borderColor: 'var(--line)' }}
                placeholder="Ananya Sharma"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none border focus:border-[var(--gold)] transition-colors"
                style={{ background: 'var(--ink)', borderColor: 'var(--line)' }}
                placeholder="you@college.edu"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none border focus:border-[var(--gold)] transition-colors"
                style={{ background: 'var(--ink)', borderColor: 'var(--line)' }}
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(255,99,99,0.1)', color: '#FF8080' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
