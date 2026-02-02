# Wine Catalog

App per catalogare la tua collezione di vini con OCR e chat AI.

## Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend/Auth/DB**: Supabase
- **Hosting**: Vercel

## Funzionalità

- ✅ Autenticazione (login, registrazione, reset password)
- ✅ Catalogo vini con filtri per tipologia e ricerca testuale
- ✅ Dettaglio vino in modal
- ✅ Aggiungi/Modifica/Elimina vini
- ✅ Upload foto vini su Supabase Storage
- ✅ Responsive (desktop/tablet/mobile)
- 🚧 OCR etichette (UI pronta, da collegare a Apple Vision o API cloud)
- 🚧 Chat AI sommelier (UI pronta, da collegare a Groq/LLM)

## Setup locale

```bash
# Clona il repo
git clone git@github.com:simonebec/wine-catalog.git
cd wine-catalog

# Installa dipendenze
npm install

# Configura variabili d'ambiente
cp .env.example .env
# Modifica .env con le tue credenziali Supabase

# Avvia dev server
npm run dev
```

## Variabili d'ambiente

Crea un file `.env` nella root:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## Supabase Setup

### Tabella `wines`

```sql
create table wines (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  producer text not null,
  vintage integer,
  type text,
  region text,
  quantity integer default 1,
  price numeric,
  position text,
  notes text,
  photo_url text,
  created_at timestamp with time zone default now()
);

-- RLS: ogni utente vede solo i propri vini
alter table wines enable row level security;

create policy "Users can view own wines" on wines
  for select using (auth.uid() = user_id);

create policy "Users can insert own wines" on wines
  for insert with check (auth.uid() = user_id);

create policy "Users can update own wines" on wines
  for update using (auth.uid() = user_id);

create policy "Users can delete own wines" on wines
  for delete using (auth.uid() = user_id);
```

### Storage bucket `wine-photos`

1. Crea bucket `wine-photos` (public)
2. Aggiungi policy per upload/lettura per utenti autenticati

## Deploy su Vercel

1. Push su GitHub
2. Importa progetto su Vercel
3. Aggiungi env variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy

## Scripts

```bash
npm run dev      # Dev server (localhost:5173)
npm run build    # Build produzione (output: dist/)
npm run preview  # Preview build locale
```
