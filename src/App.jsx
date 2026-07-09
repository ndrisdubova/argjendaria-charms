import { Route, Routes, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import { useMaintenance } from './hooks/useMaintenance'
import { useButtonGlow } from './hooks/useButtonGlow'
import Maintenance from './pages/Maintenance'

const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Account = lazy(() => import('./pages/Account'))
const SizeGuide = lazy(() => import('./pages/SizeGuide'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Admin = lazy(() => import('./pages/Admin'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    sessionStorage.removeItem('charms-chunk-reload')
  }, [pathname])
  return null
}

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')
  const hideBackToTop = pathname === '/contact' || pathname === '/login' || pathname === '/my-orders'
  const { enabled: maintenanceOn } = useMaintenance()
  useButtonGlow()

  if (maintenanceOn && !isAdmin) {
    return (
      <>
        <ScrollToTop />
        <Maintenance />
      </>
    )
  }

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <ScrollProgress />}
      {!isAdmin && <AnnouncementBar />}
      {!isAdmin && <Navbar />}
      <main>
        <RouteErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account" element={<Account />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && !hideBackToTop && <BackToTop />}
    </>
  )
}

export default App
