export const MAX_PERSONALIZATION_LENGTH = 20

export const FONT_OPTIONS = [
  { id: 'classic', label: 'Classic', stack: "'Cormorant Garamond', serif" },
  { id: 'modern', label: 'Modern', stack: "'Jost', sans-serif" },
  { id: 'script', label: 'Script', stack: "'Great Vibes', cursive" },
]

export const DEFAULT_FONT = FONT_OPTIONS[0].id

function findFont(id) {
  return FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0]
}

export function fontStack(id) {
  return findFont(id).stack
}

export function fontLabel(id) {
  return findFont(id).label
}

export function cleanPersonalization(text, font) {
  const trimmed = (text || '').trim().slice(0, MAX_PERSONALIZATION_LENGTH)
  if (!trimmed) return null
  return { text: trimmed, font: findFont(font).id }
}

export function samePersonalization(a, b) {
  const aText = a?.text || ''
  const bText = b?.text || ''
  if (aText !== bText) return false
  if (!aText) return true
  return (a?.font || '') === (b?.font || '')
}

export function personalizationKey(p) {
  return p?.text ? `${p.font}:${p.text}` : ''
}

export function describePersonalization(p) {
  return p?.text ? `“${p.text}” · ${fontLabel(p.font)}` : null
}
