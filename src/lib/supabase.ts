import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, options?: { data?: any }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options,
    })
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },
  
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },
  
  onAuthStateChange: (callback: (user: any) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  },
} 