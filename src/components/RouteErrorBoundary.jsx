import { Component } from 'react'

const RELOAD_FLAG = 'charms-chunk-reload'

class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Route crashed:', error, info?.componentStack)
    const message = String(error?.message || '')
    const isChunkError = /dynamically imported module|Loading chunk|ChunkLoadError/i.test(message)
    if (isChunkError && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-crash">
          <div className="route-crash-inner">
            <h2>Something went wrong</h2>
            <p>This page hit an unexpected error. Reloading usually fixes it.</p>
            <button type="button" className="btn btn-solid" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default RouteErrorBoundary
