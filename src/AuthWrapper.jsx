import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'

/* ─── Auth Context ─── */
const AuthContext = createContext(null)

/**
 * Hook to access the authenticated user's session, user object, and supabase client.
 * Returns { session, user, supabase } or null if not inside AuthWrapper.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthWrapper')
  return ctx
}

export default function AuthWrapper({ children }) {
  const [session, setSession]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  useEffect(() => {
    // Force validate session with Supabase server every time
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Extra check — verify session is still valid on server
        supabase.auth.getUser().then(({ data: { user }, error }) => {
          if (error || !user) {
            setSession(null) // Force logout if session invalid
          } else {
            setSession(session)
          }
          setLoading(false)
        })
      } else {
        setSession(null)
        setLoading(false)
      }
    })

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session)
      } else {
        setSession(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Route guards
  useEffect(() => {
    if (loading) return

    if (session) {
      // Logged in: redirect / and /login to /tracker
      if (currentPath === '/' || currentPath === '/login') {
        navigate('/tracker', { replace: true })
      }
    } else {
      // Not logged in: redirect /tracker to /
      if (currentPath === '/tracker') {
        navigate('/', { replace: true })
      }
    }
  }, [session, loading, currentPath, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate('/', { replace: true })
  }

  // Still checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-slate-400 text-sm">Loading your tracker...</p>
        </div>
      </div>
    )
  }

  // Route protection transitions (prevent flashes of unauthorized content)
  if (!session && currentPath === '/tracker') {
    return null
  }
  if (session && (currentPath === '/' || currentPath === '/login')) {
    return null
  }

  const user = session?.user || null
  const displayName = user
    ? (user.user_metadata?.full_name || user.user_metadata?.name || user.phone || user.email || 'User')
    : 'User'
  const avatar = user ? (user.user_metadata?.avatar_url || null) : null

  return (
    <AuthContext.Provider value={{ session, user, supabase }}>
      <div>
        {/* User bar at top - only visible on /tracker route */}
        {session && currentPath === '/tracker' && (
          <>
            <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    className="w-7 h-7 rounded-full ring-2 ring-indigo-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {displayName[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-white leading-tight">{displayName}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{user?.email || user?.phone}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
              >
                Sign out
              </button>
            </div>

            {/* Spacer so content doesn't hide under user bar */}
            <div className="h-11" />
          </>
        )}

        {/* Render child route component */}
        {children}
      </div>
    </AuthContext.Provider>
  )
}