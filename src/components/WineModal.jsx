import { useEffect } from 'react'
import { WINE_TYPES } from '../utils/mockData'

const WineBottleIcon = ({ type }) => {
  const colors = {
    red: 'text-wine-700',
    white: 'text-amber-500',
    rose: 'text-pink-400',
    sparkling: 'text-yellow-500',
  }
  
  return (
    <svg viewBox="0 0 24 32" className={`w-16 h-24 ${colors[type] || 'text-oak-400'}`} fill="currentColor">
      <path d="M9 0h6v6l2 4v18c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4V10l2-4V0zm1 2v4h4V2h-4zm-1 6l-1.5 3v17c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V11L13 8H9z"/>
    </svg>
  )
}

export default function WineModal({ wine, onClose, onEdit, onDelete }) {
  const typeInfo = WINE_TYPES[wine?.type] || { label: wine?.type, badge: 'badge-red' }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!wine) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-oak-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full sm:max-w-lg max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-cream-100 to-cream-200">
          {wine.photo ? (
            <img 
              src={wine.photo} 
              alt={wine.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <WineBottleIcon type={wine.type} />
            </div>
          )}
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-oak-600 hover:text-oak-800 hover:bg-white transition-colors shadow-soft"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Type badge */}
          <div className="absolute bottom-4 left-4">
            <span className={`badge ${typeInfo.badge} text-sm`}>
              {typeInfo.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-14rem)] scrollbar-thin">
          <h2 className="font-display text-2xl font-semibold text-oak-900">
            {wine.name}
          </h2>
          <p className="text-lg text-oak-600 mt-1">
            {wine.producer}
          </p>

          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <InfoItem label="Annata" value={wine.vintage} />
            <InfoItem label="Regione" value={wine.region || '—'} />
            <InfoItem label="Quantità" value={`${wine.quantity} bottigli${wine.quantity === 1 ? 'a' : 'e'}`} />
            <InfoItem label="Prezzo" value={wine.price ? `€${wine.price}` : '—'} />
          </div>

          {/* Position */}
          {wine.position && (
            <div className="mt-6 p-4 bg-cream-100 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-sm font-medium text-oak-700">Posizione in cantina</p>
                  <p className="text-oak-600">{wine.position}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {wine.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-oak-700 mb-2">Note</h3>
              <p className="text-oak-600 whitespace-pre-wrap">{wine.notes}</p>
            </div>
          )}

          {/* Total value */}
          {wine.price && wine.quantity > 0 && (
            <div className="mt-6 pt-4 border-t border-oak-100">
              <div className="flex justify-between items-center">
                <span className="text-oak-600">Valore totale</span>
                <span className="text-lg font-semibold text-oak-800">
                  €{(wine.price * wine.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-oak-100 bg-cream-50 flex gap-3">
          <button onClick={() => onDelete(wine.id)} className="btn btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Elimina
          </button>
          <button onClick={() => onEdit(wine.id)} className="btn btn-primary flex-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Modifica
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-oak-500">{label}</p>
      <p className="font-medium text-oak-800">{value}</p>
    </div>
  )
}
