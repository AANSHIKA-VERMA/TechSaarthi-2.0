import { Link } from 'react-router-dom'

// TODO: replace with your real Instagram handle once the page has a few
// posts up — see the note in the chat about why an empty account undercuts
// the "follow me" ask.
const INSTAGRAM_URL = 'https://instagram.com/your-handle'

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

        <div className="flex flex-wrap gap-x-12 gap-y-8 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          <div className="flex flex-col gap-2">
            <span style={{ color: '#5B5A73' }}>Product</span>
            <a href="#opportunities" className="hover:text-white transition-colors">Opportunities</a>
            <a href="#offer" className="hover:text-white transition-colors">What We Offer</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex flex-col gap-2">
            <span style={{ color: '#5B5A73' }}>Community</span>
            <Link to="/blog" className="hover:text-white transition-colors">Stories</Link>
            <Link to="/dashboard/contribute" className="hover:text-white transition-colors">Contribute</Link>
            
            <a
              href="https://www.instagram.com/tech.anshika9?igsi=MWt4N2p5aTE5YWpudw=="
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >Instagram</a>
          </div>
          <div className="flex flex-col gap-2">
            <span style={{ color: '#5B5A73' }}>Account</span>
            <Link to="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign up</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs" style={{ color: '#4B4A5F' }}>
        <span>© {new Date().getFullYear()} TechSaarthi. Built by one student. Kept growing by many.</span>
        <a href="https://www.instagram.com/tech.anshika9?igsi=MWt4N2p5aTE5YWpudw==" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          Follow the build on Instagram →
        </a>
      </div>
    </footer>
  )
}
