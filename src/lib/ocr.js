import Tesseract from 'tesseract.js'

/**
 * Estrae testo da un'immagine usando Tesseract.js
 * @param {string} imageData - Data URL dell'immagine (base64)
 * @param {function} onProgress - Callback per il progresso (0-100)
 * @returns {Promise<string>} - Testo estratto
 */
export async function extractTextFromImage(imageData, onProgress = () => {}) {
  try {
    const result = await Tesseract.recognize(
      imageData,
      'ita+eng', // Italiano + Inglese per etichette
      {
        logger: (m) => {
          if (m.status === 'recognizing text' && m.progress) {
            onProgress(Math.round(m.progress * 100))
          }
        },
      }
    )
    
    return result.data.text
  } catch (error) {
    console.error('OCR Error:', error)
    throw new Error('Errore durante l\'estrazione del testo')
  }
}

/**
 * Parsing base del testo estratto per identificare campi comuni
 * Questo è un parsing euristico - l'LLM farà il lavoro pesante
 * @param {string} text - Testo estratto dall'OCR
 * @returns {object} - Campi parzialmente estratti
 */
export function parseWineLabel(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  
  const result = {
    rawText: text,
    name: '',
    producer: '',
    vintage: null,
    region: '',
    confidence: 'low', // low | medium | high
  }
  
  // Cerca anno (4 cifre tra 1900 e 2030)
  const yearMatch = text.match(/\b(19[0-9]{2}|20[0-2][0-9]|2030)\b/)
  if (yearMatch) {
    result.vintage = parseInt(yearMatch[1])
    result.confidence = 'medium'
  }
  
  // Cerca regioni italiane comuni
  const regioni = [
    'Piemonte', 'Toscana', 'Veneto', 'Friuli', 'Alto Adige', 'Südtirol',
    'Lombardia', 'Sicilia', 'Puglia', 'Campania', 'Sardegna', 'Umbria',
    'Marche', 'Abruzzo', 'Lazio', 'Trentino', 'Liguria', 'Calabria',
    'Basilicata', 'Valle d\'Aosta', 'Molise', 'Emilia', 'Romagna'
  ]
  
  for (const regione of regioni) {
    if (text.toLowerCase().includes(regione.toLowerCase())) {
      result.region = regione
      break
    }
  }
  
  // Cerca denominazioni (DOC, DOCG, IGT)
  const denomMatch = text.match(/\b(DOCG|DOC|IGT|DOP|IGP)\b/i)
  if (denomMatch) {
    result.denomination = denomMatch[1].toUpperCase()
  }
  
  // Cerca gradazione alcolica
  const alcoholMatch = text.match(/(\d{1,2}[,.]?\d?)\s*%\s*(vol)?/i)
  if (alcoholMatch) {
    result.alcohol = alcoholMatch[1].replace(',', '.')
  }
  
  // Prima riga non vuota spesso è il nome del vino
  if (lines.length > 0) {
    // Filtra linee che sembrano essere il nome (non troppo corte, non solo numeri)
    const potentialNames = lines.filter(line => 
      line.length > 3 && 
      !/^\d+$/.test(line) &&
      !line.match(/^(DOCG|DOC|IGT|vol|%|ml|cl|lt)/i)
    )
    
    if (potentialNames.length > 0) {
      result.name = potentialNames[0]
    }
    
    // Seconda riga potrebbe essere il produttore
    if (potentialNames.length > 1) {
      result.producer = potentialNames[1]
    }
  }
  
  return result
}

/**
 * Prepara il prompt per l'LLM con il testo OCR
 * @param {string} ocrText - Testo estratto dall'OCR
 * @returns {string} - Prompt formattato per l'LLM
 */
export function buildLLMPrompt(ocrText) {
  return `Analizza questo testo estratto da un'etichetta di vino e estrai le informazioni in formato JSON.

TESTO ETICHETTA:
"""
${ocrText}
"""

Rispondi SOLO con un oggetto JSON valido con questi campi (usa null se non trovi l'informazione):
{
  "name": "nome del vino",
  "producer": "nome del produttore/cantina", 
  "vintage": 2020,
  "type": "red|white|rose|sparkling",
  "region": "regione di produzione",
  "denomination": "DOC/DOCG/IGT se presente",
  "alcohol": "gradazione alcolica",
  "notes": "altre informazioni rilevanti"
}

JSON:`
}
