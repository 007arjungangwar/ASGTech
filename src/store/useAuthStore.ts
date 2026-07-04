import { create } from 'zustand'
import { supabase, ASG_SUPABASE_CONFIG } from '@/lib/supabaseClient'
import { Profile } from '@/types'

interface AuthState {
  user: any | null
  profile: Profile | null
  loading: boolean
  isInitialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updatePassword: (password: string) => Promise<void>
  resetPasswordForEmail: (email: string) => Promise<void>
  initialize: () => () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  isInitialized: false,

  signIn: async (email, password) => {
    set({ loading: true })
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    })
    if (error) {
      set({ loading: false })
      throw error
    }
    // Session state change will trigger the profile fetch via the auth state change listener
  },

  register: async (email, password, name) => {
    set({ loading: true })
    const normalizedEmail = email.trim().toLowerCase()
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name: name.trim() }
      }
    })
    if (error) {
      set({ loading: false })
      throw error
    }

    if (data.user) {
      // If auto-confirm is enabled in Supabase, the user session will be ready.
      // Otherwise, the student gets registered but need confirmation or we can cache their details.
      const isAdmin = ASG_SUPABASE_CONFIG.adminEmails.map(e => e.toLowerCase()).includes(normalizedEmail)
      const role = isAdmin ? 'admin' : 'student'
      
      const newProfile = {
        id: data.user.id,
        name: name.trim(),
        email: normalizedEmail,
        role: role as 'admin' | 'student',
        join_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'id' })

      if (upsertError) {
        console.warn('Could not save user profile in DB:', upsertError.message)
      }
    }
    set({ loading: false })
  },

  signOut: async () => {
    set({ loading: true })
    const { error } = await supabase.auth.signOut()
    if (error) {
      set({ loading: false })
      throw error
    }
    set({ user: null, profile: null, loading: false })
    sessionStorage.removeItem('currentUser')
  },

  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  },

  resetPasswordForEmail: async (email) => {
    const currentPath = window.location.origin
    const redirectTo = `${currentPath}/login?mode=reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo
    })
    if (error) throw error
  },

  initialize: () => {
    // Initial session load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user || null
      if (user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, name, email, role, join_date, updated_at')
            .eq('id', user.id)
            .single()
          
          if (profile) {
            set({ user, profile: profile as Profile, loading: false, isInitialized: true })
            sessionStorage.setItem('currentUser', JSON.stringify(profile))
            return
          }
        } catch (e) {
          console.warn('Could not read user profile:', e)
        }
      }
      set({ user, profile: null, loading: false, isInitialized: true })
    })

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user || null
        if (user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, name, email, role, join_date, updated_at')
              .eq('id', user.id)
              .single()

            if (profile) {
              set({ user, profile: profile as Profile, loading: false })
              sessionStorage.setItem('currentUser', JSON.stringify(profile))
              return
            } else {
              // If profile doesn't exist, create it (e.g. social logins or quick register cases)
              const email = user.email || ''
              const isAdmin = ASG_SUPABASE_CONFIG.adminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())
              const role = isAdmin ? 'admin' : 'student'
              const name = user.user_metadata?.name || user.user_metadata?.full_name || email.split('@')[0] || 'Student'
              
              const newProfile = {
                id: user.id,
                name,
                email: email.toLowerCase(),
                role: role as 'admin' | 'student',
                join_date: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              await supabase.from('profiles').upsert(newProfile, { onConflict: 'id' })
              set({ user, profile: newProfile as Profile, loading: false })
              sessionStorage.setItem('currentUser', JSON.stringify(newProfile))
              return
            }
          } catch (e) {
            console.warn('Error syncing profile:', e)
          }
        }
        set({ user, profile: null, loading: false })
        sessionStorage.removeItem('currentUser')
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }
}))
