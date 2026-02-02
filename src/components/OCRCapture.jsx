import { useState, useRef } from 'react'
import { extractTextFromImage, parseWineLabel } from '../lib/ocr'

export default function OCRCapture({ onComplete, onCancel }) {
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedData, setExtractedData] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleCapture = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Verifica dimensione (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Immagine troppo grande. Massimo 10MB.')
        return
      }
      
      setError('')
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedImage(reader.result)
        processImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const processImage = async (imageData) => {
    setIsProcessing(true)
    setProgress(0)
    setError('')
    
    try {
      // Estrai testo con Tesseract
      const text = await extractTextFromImage(imageData, setProgress)
      
      if (!text || text.trim().length < 5) {
        setError('Nessun testo rilevato. Prova con un\'immagine più nitida.')
        setIsProcessing(false)
        return
      }
      
      // Parsing base del testo
      const parsed = parseWineLabel(text)
      parsed.photo = imageData // Includi la foto
      
      setExtractedData(parsed)
    } catch (err) {
      console.error('OCR Error:', err)
      setError('Errore durante l\'analisi. Riprova.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirm = () => {
    if (extractedData) {
      onComplete({
        name: extractedData.name || '',
        producer: extractedData.producer || '',
        vintage: extractedData.vintage,
        region: extractedData.region || '',
        photo: extractedData.photo,
        // Passa anche il testo raw per eventuale uso futuro con LLM
        _ocrRawText: extractedData.rawText,
      })
    }
  }

  const handleRetry = () => {
    setCapturedImage(null)
    setExtractedData(null)
    setError('')
    setProgress(0)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-semibold text-oak-900">
          Scansiona etichetta
        </h3>
        <p className="text-oak-600 mt-1">
          Scatta una foto dell'etichetta per estrarre automaticamente le informazioni
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!capturedImage ? (
        <div className="space-y-4">
          {/* Camera capture button */}
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-wine-300 rounded-xl p-8 text-center hover:border-wine-500 hover:bg-wine-50/50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wine-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-wine-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <p className="font-medium text-wine-700">Scatta foto</p>
              <p className="text-sm text-oak-500 mt-1">
                Tocca per aprire la fotocamera
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
              className="hidden"
            />
          </label>

          {/* Or upload existing photo */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-oak-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-cream-50 text-oak-500">oppure</span>
            </div>
          </div>

          <label className="block cursor-pointer">
            <div className="btn btn-secondary w-full justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Carica da galleria
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCapture}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image preview */}
          <div className="relative rounded-xl overflow-hidden bg-oak-100">
            <img 
              src={capturedImage} 
              alt="Etichetta catturata" 
              className="w-full h-64 object-contain"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-oak-900/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <p className="font-medium">Analisi in corso...</p>
                  <p className="text-sm text-white/80 mt-1">{progress}%</p>
                </div>
              </div>
            )}
          </div>

          {/* Extracted data preview */}
          {extractedData && !isProcessing && (
            <div className="bg-cream-100 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-oak-700">Dati estratti:</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-oak-500">Nome:</span>
                  <p className="font-medium text-oak-800">{extractedData.name || '—'}</p>
                </div>
                <div>
                  <span className="text-oak-500">Produttore:</span>
                  <p className="font-medium text-oak-800">{extractedData.producer || '—'}</p>
                </div>
                <div>
                  <span className="text-oak-500">Annata:</span>
                  <p className="font-medium text-oak-800">{extractedData.vintage || '—'}</p>
                </div>
                <div>
                  <span className="text-oak-500">Regione:</span>
                  <p className="font-medium text-oak-800">{extractedData.region || '—'}</p>
                </div>
              </div>

              {/* Raw text collapsible */}
              <details className="text-xs">
                <summary className="text-oak-500 cursor-pointer hover:text-oak-700">
                  Mostra testo grezzo
                </summary>
                <pre className="mt-2 p-2 bg-white rounded text-oak-600 whitespace-pre-wrap overflow-auto max-h-32">
                  {extractedData.rawText}
                </pre>
              </details>

              <p className="text-xs text-oak-500 italic">
                💡 Potrai modificare i dati nel form prima di salvare
              </p>
            </div>
          )}

          {/* Actions */}
          {!isProcessing && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="btn btn-secondary flex-1"
              >
                Riprova
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!extractedData}
                className="btn btn-primary flex-1"
              >
                Usa questi dati
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancel */}
      <button
        type="button"
        onClick={onCancel}
        className="w-full text-center text-oak-500 hover:text-oak-700 text-sm"
      >
        Annulla e compila manualmente
      </button>
    </div>
  )
}
