import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// Keep the starter bootable without env vars so setup can happen incrementally.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

// Centralize the missing-config error so every helper explains the next step clearly.
function requireSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Copy env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before using auth or database helpers.'
    )
  }

  return supabase
}

// Auth helpers
export const auth = {
  signUp: async (
    email: string,
    password: string,
    options?: { data?: Record<string, unknown> }
  ) => {
    const client = requireSupabaseClient()

    return await client.auth.signUp({
      email,
      password,
      options,
    })
  },
  
  signIn: async (email: string, password: string) => {
    const client = requireSupabaseClient()

    return await client.auth.signInWithPassword({
      email,
      password,
    })
  },
  
  signOut: async () => {
    const client = requireSupabaseClient()

    return await client.auth.signOut()
  },
  
  getCurrentUser: async () => {
    const client = requireSupabaseClient()
    const { data: { user } } = await client.auth.getUser()

    return user
  },
  
  onAuthStateChange: (callback: (user: User | null) => void) => {
    const client = requireSupabaseClient()

    return client.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null)
    })
  },
}
