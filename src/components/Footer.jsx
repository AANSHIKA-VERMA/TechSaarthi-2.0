import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', borderTop: '1px solid var(--line)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between gap-8">
        <div>
          <p className="font-display font-semibold text-lg text-white mb-2">TechSaarthi</p>
          <p className="text-sm max-w-xs" style={{ color: 'var(--muted)' }}>
            A guided route through internships, hackathons, scholarships and
            leadership programs — for women in BTech.
          </p>
        </div>

        <div className="flex gap-12 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          <div className="flex flex-col gap-2">
            <span style={{ color: '#5B5A73' }}>Product</span>
            <a href="#opportunities" className="hover:text-white transition-colors">Opportunities</a>
            <a href="#offer" className="hover:text-white transition-colors">What We Offer</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex flex-col gap-2">
            <span style={{ color: '#5B5A73' }}>Account</span>
            <Link to="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign up</Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-8 text-xs" style={{ color: '#4B4A5F' }}>
        © {new Date().getFullYear()} TechSaarthi · Made by students, for students — and open to yours.
      </div>
    </footer>
  )
}
