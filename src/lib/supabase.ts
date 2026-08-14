import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Admission {
  id: string
  full_name: string
  mother_name: string
  date_of_birth: string
  customer_number: string
  gender: 'Male' | 'Female'
  place_of_birth: string
  national_id: string
  address: string
  student_photo_url: string | null
  more_details: string | null
  created_at: string
  updated_at: string
}
