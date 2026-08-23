import { supabase } from './supabaseClient'

export async function submitOpportunity(userId, submission) {
  const { error } = await supabase.from('submitted_opportunities').insert({
    ...submission,
    submitted_by: userId,
  })
  if (error) throw error
}

/**
 * A user's own submissions, most recent first — so they can see whether
 * something they suggested was approved, rejected, or still pending.
 */
export async function getMySubmissions(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('submitted_opportunities')
    .select('*')
    .eq('submitted_by', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
