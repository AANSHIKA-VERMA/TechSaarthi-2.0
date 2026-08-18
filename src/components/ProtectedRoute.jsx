import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: 'var(--ink)' }}>
        <p className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
          Loading…
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
