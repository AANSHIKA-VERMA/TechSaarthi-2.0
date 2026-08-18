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
