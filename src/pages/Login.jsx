import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background: 'var(--ink)' }}>
      {/* left: brand panel */}
      <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'var(--ink-soft)' }}>
        <Link to="/" className="font-display font-semibold text-lg text-white">
          TechSaarthi
        </Link>
        <div>
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Welcome back
          </p>
          <h2 className="font-display text-3xl font-semibold text-white max-w-sm leading-tight">
            Pick up your route right where you left it.
          </h2>
        </div>
        <p className="text-sm max-w-xs" style={{ color: 'var(--muted)' }}>
          Saved opportunities, deadlines and your AI guide — all waiting on your dashboard.
        </p>
      </div>

      {/* right: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Link to="/" className="font-display font-semibold text-lg text-white">
              TechSaarthi
            </Link>
          </div>

          <h1 className="font-display text-2xl font-semibold text-white mb-1">Log in</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            New here?{' '}
            <Link to="/signup" style={{ color: 'var(--gold)' }} className="hover:underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
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
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
