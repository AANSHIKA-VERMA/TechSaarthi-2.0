import { supabase } from './supabaseClient'

// Static metadata for the 4 category cards — labels/blurbs rarely change,
// so no need to round-trip these through the database.
export const categoryMeta = [
  {
    id: 'internships',
    label: 'Internships',
    blurb: 'Paid & remote-friendly roles at startups and tech majors.',
  },
  {
    id: 'scholarships',
    label: 'Scholarships',
    blurb: 'Tuition and merit support, several women-only.',
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    blurb: 'Weekend builds, national finals, and campus-level sprints.',
  },
  {
    id: 'leadership',
    label: 'Leadership Programs',
    blurb: 'Fellowships and cohorts built for early-career women in tech.',
  },
]

/**
 * Returns { internships: 4, scholarships: 4, ... } from a single query.
 */
export async function getCategoryCounts() {
  const { data, error } = await supabase.from('opportunities').select('category')
  if (error) throw error

  const counts = Object.fromEntries(categoryMeta.map((c) => [c.id, 0]))
  for (const row of data) {
    counts[row.category] = (counts[row.category] ?? 0) + 1
  }
  return counts
}

/**
 * Formats a deadline for display and flags anything within 14 days as urgent.
 */
export function formatDeadline(dateString) {
  if (!dateString) return { label: 'Rolling / no fixed deadline', urgent: false }

  const deadline = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const msPerDay = 1000 * 60 * 60 * 24
  const daysLeft = Math.round((deadline - today) / msPerDay)

  const label = deadline.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (daysLeft < 0) return { label: `Closed · ${label}`, urgent: false, closed: true }
  if (daysLeft === 0) return { label: `Today · ${label}`, urgent: true }
  if (daysLeft <= 14) return { label: `${daysLeft}d left · ${label}`, urgent: true }
  return { label, urgent: false }
}

/**
 * All opportunities in one category, soonest deadline first.
 */
export async function getOpportunitiesByCategory(category) {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('category', category)
    .order('deadline', { ascending: true, nullsFirst: false })

  if (error) throw error
  return data
}
