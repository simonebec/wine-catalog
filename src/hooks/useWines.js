import { useState, useCallback, useMemo, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useWines() {
  const { user } = useAuth()
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  // Carica vini dal database
  const fetchWines = useCallback(async () => {
    if (!user) {
      setWines([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('wines')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      
      // Mappa i campi da snake_case a camelCase per compatibilità col frontend
      const mappedData = data.map(wine => ({
        id: wine.id,
        name: wine.name,
        producer: wine.producer,
        vintage: wine.vintage,
        type: wine.type,
        region: wine.region,
        quantity: wine.quantity,
        price: wine.price,
        position: wine.position,
        notes: wine.notes,
        photo: wine.photo_url,
        createdAt: wine.created_at,
      }))
      
      setWines(mappedData)
    } catch (err) {
      console.error('Error fetching wines:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Carica al mount e quando cambia user
  useEffect(() => {
    fetchWines()
  }, [fetchWines])

  // Upload foto su Storage
  const uploadPhoto = async (photoFile) => {
    if (!photoFile || !user) return null

    // Se è già una URL (es. da edit), ritornala
    if (typeof photoFile === 'string' && photoFile.startsWith('http')) {
      return photoFile
    }

    // Se è un data URL (base64), convertilo in file
    let file = photoFile
    if (typeof photoFile === 'string' && photoFile.startsWith('data:')) {
      const res = await fetch(photoFile)
      const blob = await res.blob()
      const ext = blob.type.split('/')[1] || 'jpg'
      file = new File([blob], `photo.${ext}`, { type: blob.type })
    }

    const fileExt = file.name?.split('.').pop() || 'jpg'
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('wine-photos')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('wine-photos')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  // Aggiungi vino
  const addWine = useCallback(async (wineData) => {
    if (!user) throw new Error('Devi essere autenticato')

    try {
      // Upload foto se presente
      let photoUrl = null
      if (wineData.photo) {
        photoUrl = await uploadPhoto(wineData.photo)
      }

      const { data, error: insertError } = await supabase
        .from('wines')
        .insert({
          user_id: user.id,
          name: wineData.name,
          producer: wineData.producer,
          vintage: wineData.vintage,
          type: wineData.type,
          region: wineData.region,
          quantity: wineData.quantity,
          price: wineData.price,
          position: wineData.position,
          notes: wineData.notes,
          photo_url: photoUrl,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Aggiorna stato locale
      const newWine = {
        id: data.id,
        name: data.name,
        producer: data.producer,
        vintage: data.vintage,
        type: data.type,
        region: data.region,
        quantity: data.quantity,
        price: data.price,
        position: data.position,
        notes: data.notes,
        photo: data.photo_url,
        createdAt: data.created_at,
      }
      
      setWines(prev => [newWine, ...prev])
      return newWine
    } catch (err) {
      console.error('Error adding wine:', err)
      throw err
    }
  }, [user])

  // Aggiorna vino
  const updateWine = useCallback(async (id, wineData) => {
    if (!user) throw new Error('Devi essere autenticato')

    try {
      // Upload nuova foto se cambiata
      let photoUrl = wineData.photo
      if (wineData.photo && !wineData.photo.startsWith('http')) {
        photoUrl = await uploadPhoto(wineData.photo)
      }

      const { error: updateError } = await supabase
        .from('wines')
        .update({
          name: wineData.name,
          producer: wineData.producer,
          vintage: wineData.vintage,
          type: wineData.type,
          region: wineData.region,
          quantity: wineData.quantity,
          price: wineData.price,
          position: wineData.position,
          notes: wineData.notes,
          photo_url: photoUrl,
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Aggiorna stato locale
      setWines(prev => prev.map(wine =>
        wine.id === id ? { ...wine, ...wineData, photo: photoUrl } : wine
      ))
    } catch (err) {
      console.error('Error updating wine:', err)
      throw err
    }
  }, [user])

  // Elimina vino
  const deleteWine = useCallback(async (id) => {
    if (!user) throw new Error('Devi essere autenticato')

    try {
      const { error: deleteError } = await supabase
        .from('wines')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Aggiorna stato locale
      setWines(prev => prev.filter(wine => wine.id !== id))
    } catch (err) {
      console.error('Error deleting wine:', err)
      throw err
    }
  }, [user])

  // Ottieni singolo vino
  const getWine = useCallback((id) => {
    return wines.find(wine => wine.id === id)
  }, [wines])

  // Filtra vini
  const filteredWines = useMemo(() => {
    return wines.filter(wine => {
      if (typeFilter !== 'all' && wine.type !== typeFilter) {
        return false
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          wine.name?.toLowerCase().includes(query) ||
          wine.producer?.toLowerCase().includes(query) ||
          wine.region?.toLowerCase().includes(query) ||
          wine.notes?.toLowerCase().includes(query) ||
          wine.position?.toLowerCase().includes(query) ||
          wine.vintage?.toString().includes(query)
        )
      }

      return true
    })
  }, [wines, searchQuery, typeFilter])

  // Statistiche
  const stats = useMemo(() => {
    const total = wines.reduce((sum, w) => sum + (w.quantity || 0), 0)
    const value = wines.reduce((sum, w) => sum + ((w.quantity || 0) * (w.price || 0)), 0)
    const byType = {
      red: wines.filter(w => w.type === 'red').length,
      white: wines.filter(w => w.type === 'white').length,
      rose: wines.filter(w => w.type === 'rose').length,
      sparkling: wines.filter(w => w.type === 'sparkling').length,
    }
    return { total, value, byType, uniqueWines: wines.length }
  }, [wines])

  // Testo catalogo per chat AI
  const getCatalogText = useCallback(() => {
    if (wines.length === 0) return 'La cantina è vuota.'

    return wines.map(w => (
      `- ${w.name} (${w.producer}, ${w.vintage}) - ${w.type}, ${w.region}. ` +
      `Quantità: ${w.quantity}, Prezzo: €${w.price || 'N/D'}. ` +
      `Posizione: ${w.position || 'N/D'}. ` +
      `Note: ${w.notes || 'Nessuna'}`
    )).join('\n')
  }, [wines])

  return {
    wines,
    filteredWines,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    addWine,
    updateWine,
    deleteWine,
    getWine,
    stats,
    getCatalogText,
    refetch: fetchWines,
  }
}
