import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ variant = 'public' }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b" style={{ borderColor: 'var(--line)', background: 'rgba(11,15,31,0.85)' }}>
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-60 group-hover:animate-ping" style={{ background: 'var(--gold)' }} />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: 'var(--gold)' }} />
          </span>
          <span className="font-display font-semibold text-lg tracking-tight text-white">
            TechSaarthi
          </span>
        </Link>

        {variant === 'public' && (
          <div className="hidden md:flex items-center gap-8 font-mono text-[13px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            <a href="#opportunities" className="hover:text-white transition-colors">Opportunities</a>
            <a href="#offer" className="hover:text-white transition-colors">What We Offer</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {variant === 'public' && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium px-4 py-2 rounded-full transition-transform hover:-translate-y-0.5"
                  style={{ background: 'var(--gold)', color: 'var(--ink)' }}
                >
                  Dashboard
                </Link>
              )}
              {variant === 'dashboard' && (
                <Link
                  to="/dashboard/saved"
                  className="text-sm font-medium px-4 py-2 rounded-full border transition-colors hover:text-white"
                  style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
                >
                  Saved
                </Link>
              )}
              {variant === 'dashboard' && (
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium px-4 py-2 rounded-full border transition-colors hover:text-white"
                  style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
                >
                  Sign out
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium hidden sm:inline-block"
                style={{ color: 'var(--muted)' }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium px-4 py-2 rounded-full transition-transform hover:-translate-y-0.5"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
