import { Component } from 'react'

const RELOAD_FLAG = 'charms-chunk-reload'

class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    const message = String(error?.message || '')
    const isChunkError = /dynamically imported module|Loading chunk|ChunkLoadError/i.test(message)
    if (isChunkError && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default RouteErrorBoundary
