import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WineForm from '../components/WineForm'

export default function AddWine({ addWine }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (wineData) => {
    setIsLoading(true)
    
    // Simula latenza salvataggio (in produzione sarà la chiamata a Supabase)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addWine(wineData)
    navigate('/')
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
          
          <h1 className="page-title">Aggiungi vino</h1>
          <p className="text-oak-600 mt-1">
            Inserisci i dettagli del nuovo vino o scatta una foto dell'etichetta
          </p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <WineForm 
            onSubmit={handleSubmit} 
            onCancel={() => navigate(-1)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
