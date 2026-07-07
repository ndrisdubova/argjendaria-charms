export function createBroadcaster(eventName) {
  return {
    notify: () => window.dispatchEvent(new CustomEvent(eventName)),
    subscribe: (callback) => {
      window.addEventListener(eventName, callback)
      return () => window.removeEventListener(eventName, callback)
    },
  }
}
