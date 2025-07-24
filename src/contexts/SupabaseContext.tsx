import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

interface SupabaseContextType {
  supabase: SupabaseClient | null
  isConnected: boolean
  connectionError: string | null
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isConnected: false,
  connectionError: null
})

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

interface SupabaseProviderProps {
  children: React.ReactNode
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Check if Supabase environment variables are available
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          setConnectionError('Supabase environment variables not found. Please connect to Supabase.')
          return
        }

        const client = createClient(supabaseUrl, supabaseAnonKey)
        
        // Test the connection
        const { error } = await client.from('test').select('*').limit(1)
        
        if (error && !error.message.includes('relation "test" does not exist')) {
          throw error
        }

        setSupabase(client)
        setIsConnected(true)
        setConnectionError(null)
      } catch (error) {
        console.error('Failed to initialize Supabase:', error)
        setConnectionError(error instanceof Error ? error.message : 'Failed to connect to Supabase')
        setIsConnected(false)
      }
    }

    initializeSupabase()
  }, [])

  return (
    <SupabaseContext.Provider value={{ supabase, isConnected, connectionError }}>
      {children}
    </SupabaseContext.Provider>
  )
}