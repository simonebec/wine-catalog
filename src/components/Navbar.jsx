import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  return (
    <nav className="bg-white border-b border-oak-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍷</span>
            <span className="font-display text-xl font-semibold text-oak-900 hidden sm:block">
              Wine Catalog
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className={`btn btn-ghost text-sm ${
                location.pathname === '/' ? 'bg-cream-200' : ''
              }`}
            >
              <svg className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="hidden sm:inline">Cantina</span>
            </Link>

            <Link
              to="/add"
              className={`btn btn-ghost text-sm ${
                location.pathname === '/add' ? 'bg-cream-200' : ''
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="hidden sm:inline">Aggiungi</span>
            </Link>

            <Link
              to="/chat"
              className={`btn btn-ghost text-sm ${
                location.pathname === '/chat' ? 'bg-cream-200' : ''
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span className="hidden sm:inline">Chat AI</span>
            </Link>

            {/* User menu */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-oak-200">
              <span className="text-xs text-oak-500 hidden md:block truncate max-w-[150px]">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="btn btn-ghost text-sm text-oak-600 hover:text-red-600"
                title="Esci"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="hidden sm:inline">Esci</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
