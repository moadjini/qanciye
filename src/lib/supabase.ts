import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bjnixmecthsiwzbtjjuq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbml4bWVjdGhzaXd6YnRqanVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NTAwMjksImV4cCI6MjEwMjIyNjAyOX0.n78M9hyOFY6C37rljf9CTkXK66F2TZ11CRHkF8hB22E'

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
