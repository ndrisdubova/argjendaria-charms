import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-blog-updated')
export { subscribe }

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image || undefined,
    author: row.author,
    date: row.created_at,
  }
}

export async function loadPosts() {
  return dedupe('blog-posts', async () => {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at')
    if (error) throw error
    return data.map(mapRow)
  })
}

export async function addPost(post) {
  const { error } = await supabase.from('blog_posts').insert({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image || null,
    author: post.author,
  })
  if (error) throw error
  notify()
}

export async function updatePost(id, updates) {
  const patch = {}
  if (updates.title !== undefined) patch.title = updates.title
  if (updates.excerpt !== undefined) patch.excerpt = updates.excerpt
  if (updates.content !== undefined) patch.content = updates.content
  if (updates.image !== undefined) patch.image = updates.image
  if (updates.author !== undefined) patch.author = updates.author
  const { error } = await supabase.from('blog_posts').update(patch).eq('id', id)
  if (error) throw error
  notify()
}

export async function deletePost(id) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw error
  notify()
}
