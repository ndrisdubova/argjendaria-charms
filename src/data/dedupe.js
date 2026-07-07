const inFlight = new Map()

export function dedupe(key, fetcher) {
  if (inFlight.has(key)) return inFlight.get(key)
  const promise = fetcher().finally(() => inFlight.delete(key))
  inFlight.set(key, promise)
  return promise
}
