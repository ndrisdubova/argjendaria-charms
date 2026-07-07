import defaultPosts from './blogPosts'

const STORAGE_KEY = 'charms_blog_posts'
const EVENT_NAME = 'charms-blog-updated'

export function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    savePosts(defaultPosts)
    return defaultPosts
  }
  try {
    return JSON.parse(raw)
  } catch {
    return defaultPosts
  }
}

export function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function subscribe(callback) {
  window.addEventListener(EVENT_NAME, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT_NAME, callback)
    window.removeEventListener('storage', callback)
  }
}

export function makeId() {
  return `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
