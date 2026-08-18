import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const milestones = [
  { x: 60, y: 210, label: 'Discover' },
  { x: 330, y: 90, label: 'Apply' },
  { x: 630, y: 260, label: 'Grow' },
  { x: 920, y: 110, label: 'Lead' },
]

export default function Hero() {
  const { user } = useAuth()

  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--ink)' }}>
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10 md:pt-28 md:pb-16">
        <p className="font-mono text-xs tracking-[0.25em] uppercase mb-6 rise-in" style={{ color: 'var(--gold)' }}>
          साक्षी • guide • charioteer
        </p>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] text-white max-w-3xl rise-in" style={{ animationDelay: '0.05s' }}>
          Every great journey needs a saarthi.
          <br />
          <span style={{ color: 'var(--gold)' }}>Yours starts here.</span>
        </h1>

        <p
          className="mt-6 text-base sm:text-lg max-w-xl rise-in"
          style={{ color: 'var(--muted)', animationDelay: '0.15s' }}
        >
          TechSaarthi maps out internships, hackathons, scholarships and leadership
          programs for women in BTech — one guided route, instead of forty open tabs.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4 rise-in" style={{ animationDelay: '0.25s' }}>
          <Link
            to={user ? '/dashboard' : '/signup'}
            className="px-6 py-3 rounded-full font-medium text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}
          >
            {user ? 'Go to your dashboard' : 'Start your route — it’s free'}
          </Link>
          <a
            href="#opportunities"
            className="px-6 py-3 rounded-full font-medium text-sm border transition-colors hover:text-white"
            style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
          >
            See what's on offer
          </a>
        </div>
      </div>

      {/* signature element: the guided route */}
      <div className="max-w-6xl mx-auto px-4 pb-6">
        <svg viewBox="0 0 1000 340" className="w-full h-auto" role="img" aria-label="A winding route connecting Discover, Apply, Grow and Lead">
          <path
            d="M 60 210 C 160 120, 230 40, 330 90 S 500 300, 630 260 S 830 60, 920 110"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="path-draw"
          />
          <defs>
            <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--gold)" />
              <stop offset="55%" stopColor="var(--violet)" />
              <stop offset="100%" stopColor="var(--gold)" />
            </linearGradient>
          </defs>

          {milestones.map((m, i) => (
            <g key={m.label} className="rise-in" style={{ animationDelay: `${1.6 + i * 0.18}s` }}>
              <circle cx={m.x} cy={m.y} r="7" fill="var(--ink)" stroke="var(--gold)" strokeWidth="2.5" />
              <circle cx={m.x} cy={m.y} r="2.5" fill="var(--gold)" />
              <text
                x={m.x}
                y={m.y - 20}
                textAnchor="middle"
                className="font-mono uppercase"
                fontSize="13"
                letterSpacing="1.5"
                fill="#E5E1F7"
              >
                {String(i + 1).padStart(2, '0')} · {m.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'var(--line)' }} />
    </section>
  )
}
