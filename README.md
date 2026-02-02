# Wine Catalog - Frontend React

App per catalogare la tua collezione di vini con OCR e chat AI.

## Prerequisiti

- Node.js 18+ 
- npm o yarn

## Installazione

```bash
# Clona o copia il progetto, poi:
cd wine-catalog

# Installa le dipendenze
npm install
```

## Dipendenze richieste

Il progetto usa queste librerie (da installare):

```bash
npm install react react-dom react-router-dom
npm install -D vite @vitejs/plugin-react
npm install -D tailwindcss postcss autoprefixer
```

### Configurazione Tailwind

Dopo l'installazione, inizializza Tailwind:

```bash
npx tailwindcss init -p
```

## Struttura progetto

```
wine-catalog/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx          # Entry point
│   ├── App.jsx           # Router e layout principale
│   ├── index.css         # Stili globali + Tailwind
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── WineCard.jsx
│   │   ├── WineForm.jsx
│   │   ├── WineModal.jsx
│   │   ├── ChatPanel.jsx
│   │   ├── OCRCapture.jsx
│   │   └── EmptyState.jsx
│   ├── pages/
│   │   ├── Catalog.jsx
│   │   ├── AddWine.jsx
│   │   ├── EditWine.jsx
│   │   └── Chat.jsx
│   ├── hooks/
│   │   └── useWines.js   # Hook per gestione stato vini (mock)
│   └── utils/
│       └── mockData.js   # Dati di esempio
```

## Avvio development server

```bash
npm run dev
```

Apri http://localhost:5173

## Build produzione

```bash
npm run build
```

Output in `dist/` pronto per deploy su Vercel.

## Note implementazione

### Stato attuale (frontend only)

- **Dati**: mock locale in memoria, si resettano al refresh
- **OCR**: UI pronta, logica da collegare a Apple Vision (iOS) o API cloud
- **Chat AI**: UI pronta, da collegare a Groq via Supabase Edge Function
- **Auth**: non presente, da aggiungere con Supabase Auth

### Prossimi step per backend

1. Creare progetto Supabase
2. Configurare tabella `wines` con i campi
3. Abilitare Storage per le foto
4. Creare Edge Function per chat AI
5. Sostituire mock con chiamate Supabase client

## Funzionalità UI

- **Catalogo**: griglia responsive, filtri per tipologia, ricerca testo
- **Dettaglio vino**: modal con tutte le info e foto
- **Aggiungi/Modifica**: form con tutti i campi + OCR
- **Chat AI**: pannello conversazione per query sul catalogo
- **Responsive**: layout adattivo desktop/tablet/mobile
