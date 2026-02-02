import { useState, useEffect } from 'react'
import { WINE_TYPES, REGIONS } from '../utils/mockData'
import OCRCapture from './OCRCapture'

const initialFormState = {
  name: '',
  producer: '',
  vintage: new Date().getFullYear(),
  type: 'red',
  region: '',
  quantity: 1,
  price: '',
  position: '',
  notes: '',
  photo: null,
}

export default function WineForm({ wine, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(initialFormState)
  const [showOCR, setShowOCR] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (wine) {
      setFormData({
        ...initialFormState,
        ...wine,
        price: wine.price?.toString() || '',
      })
    }
  }, [wine])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }))
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOCRComplete = (extractedData) => {
    setFormData(prev => ({
      ...prev,
      ...extractedData,
      // Keep existing values if OCR didn't extract them
      name: extractedData.name || prev.name,
      producer: extractedData.producer || prev.producer,
      vintage: extractedData.vintage || prev.vintage,
      region: extractedData.region || prev.region,
    }))
    setShowOCR(false)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Nome richiesto'
    if (!formData.producer.trim()) newErrors.producer = 'Produttore richiesto'
    if (!formData.vintage || formData.vintage < 1900 || formData.vintage > new Date().getFullYear() + 1) {
      newErrors.vintage = 'Annata non valida'
    }
    if (formData.quantity < 0) newErrors.quantity = 'Quantità non valida'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...formData,
        price: formData.price ? Number(formData.price) : null,
      })
    }
  }

  if (showOCR) {
    return <OCRCapture onComplete={handleOCRComplete} onCancel={() => setShowOCR(false)} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* OCR Button */}
      <button
        type="button"
        onClick={() => setShowOCR(true)}
        className="w-full btn btn-secondary py-4 border-dashed border-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
        Scatta foto etichetta (OCR)
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="sm:col-span-2">
          <label className="input-label" htmlFor="name">Nome del vino *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            placeholder="es. Barolo Riserva"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Produttore */}
        <div className="sm:col-span-2">
          <label className="input-label" htmlFor="producer">Produttore *</label>
          <input
            type="text"
            id="producer"
            name="producer"
            value={formData.producer}
            onChange={handleChange}
            className={`input ${errors.producer ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            placeholder="es. Giacomo Conterno"
          />
          {errors.producer && <p className="text-red-600 text-sm mt-1">{errors.producer}</p>}
        </div>

        {/* Annata */}
        <div>
          <label className="input-label" htmlFor="vintage">Annata *</label>
          <input
            type="number"
            id="vintage"
            name="vintage"
            value={formData.vintage}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            className={`input ${errors.vintage ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
          />
          {errors.vintage && <p className="text-red-600 text-sm mt-1">{errors.vintage}</p>}
        </div>

        {/* Tipologia */}
        <div>
          <label className="input-label" htmlFor="type">Tipologia</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input"
          >
            {Object.entries(WINE_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Regione */}
        <div>
          <label className="input-label" htmlFor="region">Regione</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="input"
          >
            <option value="">Seleziona...</option>
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Quantità */}
        <div>
          <label className="input-label" htmlFor="quantity">Quantità (bottiglie)</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            className={`input ${errors.quantity ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
          />
          {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
        </div>

        {/* Prezzo */}
        <div>
          <label className="input-label" htmlFor="price">Prezzo (€)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input"
            placeholder="es. 45.00"
          />
        </div>

        {/* Posizione */}
        <div>
          <label className="input-label" htmlFor="position">Posizione in cantina</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="input"
            placeholder="es. Scaffale A, fila 2"
          />
        </div>

        {/* Note */}
        <div className="sm:col-span-2">
          <label className="input-label" htmlFor="notes">Note</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input resize-none"
            placeholder="Appunti, abbinamenti, finestra di bevibilità..."
          />
        </div>

        {/* Foto */}
        <div className="sm:col-span-2">
          <label className="input-label">Foto</label>
          <div className="flex items-start gap-4">
            {formData.photo && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-cream-100">
                <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                  className="absolute top-1 right-1 w-6 h-6 bg-oak-800/70 text-white rounded-full flex items-center justify-center hover:bg-oak-900"
                >
                  ×
                </button>
              </div>
            )}
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-oak-200 rounded-lg p-4 text-center hover:border-wine-400 hover:bg-cream-100 transition-colors">
                <svg className="w-8 h-8 mx-auto text-oak-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <p className="text-sm text-oak-500 mt-2">Carica foto</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
            Annulla
          </button>
        )}
        <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
          {isLoading ? 'Salvataggio...' : wine ? 'Salva modifiche' : 'Aggiungi vino'}
        </button>
      </div>
    </form>
  )
}
