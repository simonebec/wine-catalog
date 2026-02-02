import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WineCard from '../components/WineCard'
import WineModal from '../components/WineModal'
import EmptyState from '../components/EmptyState'
import { WINE_TYPES } from '../utils/mockData'

export default function Catalog({ 
  filteredWines, 
  searchQuery, 
  setSearchQuery, 
  typeFilter, 
  setTypeFilter,
  getWine,
  deleteWine,
  stats 
}) {
  const navigate = useNavigate()
  const [selectedWineId, setSelectedWineId] = useState(null)
  const selectedWine = selectedWineId ? getWine(selectedWineId) : null

  const handleEdit = (id) => {
    setSelectedWineId(null)
    navigate(`/edit/${id}`)
  }

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo vino?')) {
      deleteWine(id)
      setSelectedWineId(null)
    }
  }

  return (
    <div className="page-container pb-24 sm:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">MAGI cantina</h1>
        {stats.uniqueWines > 0 && (
          <p className="text-oak-600 mt-1">
            {stats.uniqueWines} vini · {stats.total} bottiglie · €{stats.value.toLocaleString('it-IT')} valore stimato
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-oak-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome, produttore, regione..."
            className="input pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-oak-400 hover:text-oak-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          <button
            onClick={() => setTypeFilter('all')}
            className={`btn whitespace-nowrap ${typeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Tutti
          </button>
          {Object.entries(WINE_TYPES).map(([value, { label }]) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={`btn whitespace-nowrap ${typeFilter === value ? 'btn-primary' : 'btn-secondary'}`}
            >
              {label}
              {stats.byType[value] > 0 && (
                <span className="ml-1 opacity-70">({stats.byType[value]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Wine grid */}
      {filteredWines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredWines.map((wine, index) => (
            <div 
              key={wine.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <WineCard wine={wine} onClick={() => setSelectedWineId(wine.id)} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title={searchQuery || typeFilter !== 'all' ? 'Nessun risultato' : 'Cantina vuota'}
          description={
            searchQuery || typeFilter !== 'all' 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Inizia aggiungendo il primo vino alla tua collezione!'
          }
          showAddButton={!searchQuery && typeFilter === 'all'}
        />
      )}

      {/* Wine detail modal */}
      {selectedWine && (
        <WineModal
          wine={selectedWine}
          onClose={() => setSelectedWineId(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
