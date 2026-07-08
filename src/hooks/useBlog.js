import { useCallback, useEffect, useState } from 'react'
import { loadPosts, addPost as addPostApi, updatePost as updatePostApi, deletePost as deletePostApi, subscribe } from '../data/blogStore'

export function useBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    loadPosts().then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const addPost = useCallback((post) => addPostApi(post), [])
  const updatePost = useCallback((id, updates) => updatePostApi(id, updates), [])
  const deletePost = useCallback((id) => deletePostApi(id), [])

  return { posts, loading, addPost, updatePost, deletePost }
}
