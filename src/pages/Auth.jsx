import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        navigate('/')
      } else {
        await signUp(email, password)
        setMessage('Controlla la tua email per confermare la registrazione!')
      }
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Inserisci la tua email per reimpostare la password')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await resetPassword(email)
      setMessage('Email di reset inviata! Controlla la tua casella.')
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-semibold text-wine-800">
            🍷 Wine Catalog
          </h1>
          <p className="text-oak-600 mt-2">
            {isLogin ? 'Accedi alla tua cantina' : 'Crea il tuo account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="tu@esempio.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Error/Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Caricamento...' : isLogin ? 'Accedi' : 'Registrati'}
            </button>

            {/* Forgot password */}
            {isLogin && (
              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full text-sm text-oak-600 hover:text-wine-700"
              >
                Password dimenticata?
              </button>
            )}
          </form>

          {/* Toggle login/signup */}
          <div className="mt-6 pt-6 border-t border-oak-100 text-center">
            <p className="text-oak-600">
              {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setMessage('')
                }}
                className="ml-2 text-wine-700 font-medium hover:text-wine-800"
              >
                {isLogin ? 'Registrati' : 'Accedi'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper per tradurre errori Supabase comuni
function translateError(message) {
  const errors = {
    'Invalid login credentials': 'Email o password non corretti',
    'Email not confirmed': 'Conferma la tua email prima di accedere',
    'User already registered': 'Questa email è già registrata',
    'Password should be at least 6 characters': 'La password deve avere almeno 6 caratteri',
    'Unable to validate email address: invalid format': 'Formato email non valido',
  }
  return errors[message] || message
}
