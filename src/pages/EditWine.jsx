import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import WineForm from '../components/WineForm'

export default function EditWine({ getWine, updateWine }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wine, setWine] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const foundWine = getWine(id)
    if (foundWine) {
      setWine(foundWine)
    } else {
      setNotFound(true)
    }
  }, [id, getWine])

  const handleSubmit = async (wineData) => {
    setIsLoading(true)
    
    // Simula latenza salvataggio
    await new Promise(resolve => setTimeout(resolve, 500))
    
    updateWine(id, wineData)
    navigate('/')
  }

  if (notFound) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <h2 className="text-xl font-display font-semibold text-oak-800">Vino non trovato</h2>
          <p className="text-oak-600 mt-2">Il vino richiesto non esiste nella tua cantina.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary mt-6">
            Torna al catalogo
          </button>
        </div>
      </div>
    )
  }

  if (!wine) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container pb-24 sm:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-ghost -ml-2 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Indietro
          </button>
          
          <h1 className="page-title">Modifica vino</h1>
          <p className="text-oak-600 mt-1">
            Aggiorna i dettagli di {wine.name}
          </p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <WineForm 
            wine={wine}
            onSubmit={handleSubmit} 
            onCancel={() => navigate(-1)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
