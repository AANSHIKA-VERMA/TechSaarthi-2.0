import { formatDeadline } from '../lib/opportunities'

export default function OpportunityCard({ opportunity, saved, onToggleSave, savePending }) {
  const deadline = formatDeadline(opportunity.deadline)

  return (
    <div
      className="rounded-2xl p-6 border flex flex-col gap-4"
      style={{ background: 'white', borderColor: 'var(--paper-dim)', boxShadow: '0 1px 2px rgba(11,15,31,0.04)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
            {opportunity.title}
          </h3>
          <p className="text-sm mt-0.5" style={{ color: '#6B6A85' }}>
            {opportunity.organization}
          </p>
        </div>

        <button
          onClick={onToggleSave}
          disabled={savePending}
          aria-label={saved ? 'Remove from saved' : 'Save this opportunity'}
          className="shrink-0 w-9 h-9 rounded-full grid place-items-center border transition-colors disabled:opacity-50"
          style={{
            borderColor: saved ? 'var(--gold)' : 'var(--paper-dim)',
            background: saved ? 'rgba(255,182,39,0.12)' : 'transparent',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'var(--gold)' : 'none'} stroke={saved ? 'var(--gold)' : '#9CA3C0'} strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div
        className="inline-flex w-fit items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full"
        style={{
          background: deadline.urgent ? 'rgba(255,99,99,0.1)' : 'var(--paper-dim)',
          color: deadline.urgent ? '#C24B4B' : 'var(--violet-deep)',
        }}
      >
        {deadline.label}
      </div>

      {opportunity.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {opportunity.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full border"
              style={{ borderColor: 'var(--paper-dim)', color: '#5B5A73' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1 mt-auto">
        {opportunity.apply_link && (
          <a
            href={opportunity.apply_link}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono uppercase tracking-wider hover:underline"
            style={{ color: 'var(--violet)' }}
          >
            Apply link ↗
          </a>
        )}
        {opportunity.reference_video && (
          <a
            href={opportunity.reference_video}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono uppercase tracking-wider hover:underline"
            style={{ color: 'var(--violet)' }}
          >
            Reference video ↗
          </a>
        )}

        <a
          href={opportunity.notion_link || '#'}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-xs font-medium px-4 py-2 rounded-full transition-transform hover:-translate-y-0.5"
          style={{ background: 'var(--ink)', color: 'white' }}
        >
          View details
        </a>
      </div>
    </div>
  )
}
