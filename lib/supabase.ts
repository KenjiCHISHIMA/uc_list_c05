import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UC = {
  id: string
  name: string | null
  description: string | null
  status: string | null
}

export type WaveCycle = {
  id: string
  uc_id: string | null
  description: string | null
  start: string | null
  end: string | null
  cost: string | null
  takenaka_poc: string | null
  tcs_poc: string | null
}