import { WINE_TYPES } from '../utils/mockData'

const WineBottleIcon = ({ type }) => {
  const colors = {
    red: 'text-wine-700',
    white: 'text-amber-500',
    rose: 'text-pink-400',
    sparkling: 'text-yellow-500',
  }
  
  return (
    <svg viewBox="0 0 24 32" className={`w-8 h-12 ${colors[type] || 'text-oak-400'}`} fill="currentColor">
      <path d="M9 0h6v6l2 4v18c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4V10l2-4V0zm1 2v4h4V2h-4zm-1 6l-1.5 3v17c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V11L13 8H9z"/>
    </svg>
  )
}

export default function WineCard({ wine, onClick }) {
  const typeInfo = WINE_TYPES[wine.type] || { label: wine.type, badge: 'badge-red' }

  return (
    <article 
      onClick={onClick}
      className="card card-hover cursor-pointer group"
    >
      {/* Image or placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-cream-100 to-cream-200 overflow-hidden">
        {wine.photo ? (
          <img 
            src={wine.photo} 
            alt={wine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <WineBottleIcon type={wine.type} />
          </div>
        )}
        
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${typeInfo.badge}`}>
            {typeInfo.label}
          </span>
        </div>

        {/* Quantity badge */}
        {wine.quantity > 0 && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-oak-800/80 text-white backdrop-blur-sm">
              {wine.quantity} {wine.quantity === 1 ? 'bt' : 'bt'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-oak-900 leading-tight group-hover:text-wine-700 transition-colors">
          {wine.name}
        </h3>
        
        <p className="text-sm text-oak-600 mt-1">
          {wine.producer}
        </p>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-oak-100">
          <div className="flex items-center gap-3 text-sm text-oak-500">
            <span>{wine.vintage}</span>
            <span>·</span>
            <span>{wine.region}</span>
          </div>
          
          {wine.price > 0 && (
            <span className="text-sm font-medium text-oak-700">
              €{wine.price}
            </span>
          )}
        </div>

        {wine.position && (
          <p className="text-xs text-oak-400 mt-2 truncate">
            📍 {wine.position}
          </p>
        )}
      </div>
    </article>
  )
}
