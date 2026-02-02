import { Link } from 'react-router-dom'

export default function EmptyState({ 
  title = 'Nessun vino trovato',
  description = 'La tua cantina è vuota. Inizia aggiungendo il primo vino!',
  showAddButton = true 
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-200 flex items-center justify-center">
        <svg className="w-10 h-10 text-wine-400" viewBox="0 0 24 32" fill="currentColor">
          <path d="M9 0h6v6l2 4v18c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4V10l2-4V0zm1 2v4h4V2h-4zm-1 6l-1.5 3v17c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V11L13 8H9z"/>
        </svg>
      </div>
      
      <h3 className="font-display text-xl font-semibold text-oak-800">
        {title}
      </h3>
      
      <p className="text-oak-600 mt-2 max-w-sm mx-auto">
        {description}
      </p>
      
      {showAddButton && (
        <Link to="/add" className="btn btn-primary mt-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Aggiungi il primo vino
        </Link>
      )}
    </div>
  )
}
