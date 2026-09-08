import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase variables missing. The app will run in limited mode.');
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
)
