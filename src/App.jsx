import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Catalog from './pages/Catalog'
import AddWine from './pages/AddWine'
import EditWine from './pages/EditWine'
import Chat from './pages/Chat'
import Auth from './pages/Auth'
import { useWines } from './hooks/useWines'

// Componente per proteggere le route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-oak-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

// Redirect se già loggato
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

// Contenuto principale dell'app (richiede auth)
function AppContent() {
  const {
    wines,
    filteredWines,
    loading,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    addWine,
    updateWine,
    deleteWine,
    getWine,
    stats,
    getCatalogText,
  } = useWines()

  return (
    <div className="min-h-screen bg-cream-50 texture-noise">
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Catalog
                filteredWines={filteredWines}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                getWine={getWine}
                deleteWine={deleteWine}
                stats={stats}
              />
            }
          />
          <Route
            path="/add"
            element={<AddWine addWine={addWine} />}
          />
          <Route
            path="/edit/:id"
            element={<EditWine getWine={getWine} updateWine={updateWine} />}
          />
          <Route
            path="/chat"
            element={<Chat getCatalogText={getCatalogText} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
