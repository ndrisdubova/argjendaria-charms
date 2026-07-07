import { useCallback, useEffect, useState } from 'react'
import { loadPosts, addPost as addPostApi, updatePost as updatePostApi, deletePost as deletePostApi, subscribe } from '../data/blogStore'

export function useBlog() {
  const [posts, setPosts] = useState([])

  const refresh = useCallback(() => {
    loadPosts().then(setPosts)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const addPost = useCallback((post) => addPostApi(post), [])
  const updatePost = useCallback((id, updates) => updatePostApi(id, updates), [])
  const deletePost = useCallback((id) => deletePostApi(id), [])

  return { posts, addPost, updatePost, deletePost }
}
