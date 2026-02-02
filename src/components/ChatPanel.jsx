import { useState, useRef, useEffect } from 'react'

export default function ChatPanel({ getCatalogText }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Ciao! Sono il tuo sommelier AI. Posso aiutarti a esplorare la tua cantina, suggerirti abbinamenti, o rispondere a domande sul mondo del vino. Cosa posso fare per te?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Mock AI response - in produzione sarà una chiamata a Groq via Edge Function
    await simulateAIResponse(userMessage.content, getCatalogText())
  }

  const simulateAIResponse = async (userQuery, catalogText) => {
    // Simula latenza API
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Mock responses basate su parole chiave
    let response = ''
    const query = userQuery.toLowerCase()

    if (query.includes('quant') && (query.includes('vino') || query.includes('bottigli'))) {
      response = 'Nella tua cantina hai attualmente 6 vini diversi per un totale di 22 bottiglie. Hai principalmente rossi (3 etichette), oltre a bianchi, rosé e spumanti.'
    } else if (query.includes('barolo') || query.includes('piemonte')) {
      response = 'Hai un Barolo Riserva 2016 di Giacomo Conterno - un\'etichetta eccezionale! Con 7 anni di affinamento, è pronto per essere aperto ma può evolvere ancora fino al 2040. Perfetto con brasato, tartufo o formaggi stagionati.'
    } else if (query.includes('abbina') || query.includes('cena') || query.includes('pesce') || query.includes('carne')) {
      response = 'Per un abbinamento ti consiglierei:\n\n• **Pesce/frutti di mare**: Cervaro della Sala 2021 - lo Chardonnay con note burrose si sposa bene con piatti di pesce\n• **Carne rossa**: Tignanello 2019 o Brunello 2017 per carni importanti\n• **Aperitivo**: Franciacorta Satèn di Ca\' del Bosco\n\nHai qualcosa di specifico in mente?'
    } else if (query.includes('valore') || query.includes('cost') || query.includes('prezzo')) {
      response = 'Il valore totale stimato della tua cantina è di circa €1.296 basato sui prezzi che hai inserito. Il vino più pregiato è il Barolo Riserva di Conterno (€180 a bottiglia).'
    } else if (query.includes('sugger') || query.includes('compra') || query.includes('manc')) {
      response = 'Guardando la tua collezione, noto che hai ottimi rossi toscani e piemontesi. Potresti considerare di aggiungere:\n\n• Un Amarone della Valpolicella per i rossi veneti\n• Un Riesling altoatesino per i bianchi aromatici\n• Uno Champagne per occasioni speciali\n\nVuoi che ti dia qualche produttore consigliato?'
    } else {
      response = 'Questa è una risposta di esempio. In produzione, la tua domanda verrà inviata a Llama 3.3 via Groq insieme al catalogo completo della tua cantina:\n\n```\n' + catalogText.substring(0, 300) + '...\n```\n\nL\'AI potrà così rispondere con informazioni precise sui tuoi vini!'
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: response
    }])
    setIsLoading(false)
  }

  const suggestedQuestions = [
    'Quante bottiglie ho in cantina?',
    'Cosa abbino a una cena di pesce?',
    'Parlami del mio Barolo',
    'Qual è il valore della cantina?',
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-wine-700 text-white rounded-br-md'
                  : 'bg-white shadow-soft text-oak-800 rounded-bl-md'
              }`}
            >
              <div className="prose prose-sm max-w-none">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={`${i > 0 ? 'mt-2' : ''} ${message.role === 'user' ? 'text-white' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-soft rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-wine-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-wine-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-wine-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (show only at start) */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-oak-500 mb-2">Prova a chiedere:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => setInput(question)}
                className="text-sm px-3 py-1.5 bg-cream-200 hover:bg-cream-300 text-oak-700 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-oak-100 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chiedi qualcosa sui tuoi vini..."
            className="input flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn btn-primary px-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
