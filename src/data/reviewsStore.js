import defaultReviews from './reviews'

const STORAGE_KEY = 'charms_reviews'
const EVENT_NAME = 'charms-reviews-updated'

export function loadReviews() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    saveReviews(defaultReviews)
    return defaultReviews
  }
  try {
    return JSON.parse(raw)
  } catch {
    return defaultReviews
  }
};

export function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export function subscribe(callback) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener('storage', callback);
  }
}

export function makeId() {
  return `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
};
