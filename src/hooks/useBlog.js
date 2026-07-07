import { useCallback, useEffect, useState } from 'react'
import { loadPosts, savePosts, subscribe, makeId } from '../data/blogStore'

export function useBlog() {
  const [posts, setPosts] = useState(() => loadPosts())

  useEffect(() => subscribe(() => setPosts(loadPosts())), [])

  const addPost = useCallback((post) => {
    const next = [...loadPosts(), { ...post, id: makeId(), date: new Date().toISOString() }]
    savePosts(next)
  }, [])

  const updatePost = useCallback((id, updates) => {
    const next = loadPosts().map((p) => (p.id === id ? { ...p, ...updates } : p))
    savePosts(next)
  }, [])

  const deletePost = useCallback((id) => {
    const next = loadPosts().filter((p) => p.id !== id)
    savePosts(next)
  }, [])

  return { posts, addPost, updatePost, deletePost }
}
