import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for stretches
export interface DatabaseStretch {
  id: number
  name: string
  description: string | null
  instructions: string[]
  pain_point: string
  difficulty: string
  duration_min: number | null
  duration_max: number | null
  media_url: string | null
  focus_tips: string[] | null
  created_at: string | null
}

// Transform database stretch to component format
export const transformStretch = (dbStretch: DatabaseStretch) => ({
  id: dbStretch.id,
  name: dbStretch.name,
  type: 'stretch' as const,
  category: 'quick-energy' as const, // Default category for stretches
  painPoint: dbStretch.pain_point,
  duration: dbStretch.duration_min || 30, // Use min duration as default
  difficulty: dbStretch.difficulty as 'beginner' | 'intermediate' | 'advanced',
  equipment: 'none' as const, // Most stretches don't require equipment
  instructions: dbStretch.instructions,
  description: dbStretch.description || '',
  mediaUrl: dbStretch.media_url || 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg',
  focusTips: dbStretch.focus_tips || []
})