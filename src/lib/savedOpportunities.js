import { supabase } from './supabaseClient'

/**
 * Returns a Set of opportunity_ids the given user has saved.
 */
export async function getSavedIds(userId) {
  if (!userId) return new Set()
  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('opportunity_id')
    .eq('user_id', userId)

  if (error) throw error
  return new Set(data.map((row) => row.opportunity_id))
}

export async function saveOpportunity(userId, opportunityId) {
  const { error } = await supabase
    .from('saved_opportunities')
    .insert({ user_id: userId, opportunity_id: opportunityId })

  if (error) throw error
}

export async function unsaveOpportunity(userId, opportunityId) {
  const { error } = await supabase
    .from('saved_opportunities')
    .delete()
    .eq('user_id', userId)
    .eq('opportunity_id', opportunityId)

  if (error) throw error
}

/**
 * All of a user's saved opportunities, with the full opportunity record
 * attached, most recently saved first. Used by the "Saved" page so users
 * can see everything they've bookmarked in one place, regardless of category.
 */
export async function getSavedOpportunities(userId) {
  if (!userId) return []

  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('opportunity_id, saved_at, opportunities (*)')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })

  if (error) throw error

  // Flatten: put the opportunity fields at the top level, keep saved_at.
  return data
    .filter((row) => row.opportunities) // guards against a since-deleted opportunity
    .map((row) => ({ ...row.opportunities, saved_at: row.saved_at }))
}
