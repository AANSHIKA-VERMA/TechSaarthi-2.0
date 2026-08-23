import { supabase } from './supabaseClient'

export async function createPost(userId, post) {
  const { error } = await supabase.from('posts').insert({
    ...post,
    author_id: userId,
  })
  if (error) throw error
}

/**
 * A user's own posts regardless of status, most recent first.
 */
export async function getMyPosts(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * The public blog feed — published posts only, newest first.
 */
export async function getPublishedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}
