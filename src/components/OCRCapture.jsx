import { useState, useRef } from 'react'

export default function OCRCapture({ onComplete, onCancel }) {
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const fileInputRef = useRef(null)

  const handleCapture = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedImage(reader.result)
        simulateOCR(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Mock OCR - in produzione verrà sostituito con Apple Vision o API cloud
  const simulateOCR = async (imageData) => {
    setIsProcessing(true)
    
    // Simula latenza OCR
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock: in produzione qui ci sarà la vera estrazione
    // L'OCR estrarrà il testo dall'etichetta che l'utente potrà poi verificare
    const mockExtractedText = `[Testo estratto dall'etichetta]
    
Questo è un placeholder. In produzione:
- Su iOS: Apple Vision Framework estrarrà il testo
- Su Web: Google Cloud Vision o Tesseract.js

L'AI può poi analizzare il testo per identificare:
- Nome del vino
- Produttore
- Annata
- Regione
- Denominazione`

    setExtractedText(mockExtractedText)
    setIsProcessing(false)
  }

  const handleConfirm = () => {
    // Mock: parsing del testo estratto
    // In produzione l'AI (o regex avanzate) identificherà i campi
    const mockParsedData = {
      name: '',
      producer: '',
      vintage: null,
      region: '',
      // La foto verrà passata per essere salvata
      photo: capturedImage,
    }
    
    onComplete(mockParsedData)
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
                  <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-3 font-medium">Analisi in corso...</p>
                </div>
              </div>
            )}
          </div>

          {/* Extracted text */}
          {extractedText && !isProcessing && (
            <div className="bg-cream-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-oak-700 mb-2">Testo estratto:</h4>
              <pre className="text-sm text-oak-600 whitespace-pre-wrap font-sans">
                {extractedText}
              </pre>
            </div>
          )}

          {/* Actions */}
          {!isProcessing && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setCapturedImage(null)
                  setExtractedText('')
                }}
                className="btn btn-secondary flex-1"
              >
                Riprova
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn btn-primary flex-1"
              >
                Usa questa foto
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
