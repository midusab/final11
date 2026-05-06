import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please update your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Database helper functions
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase Error [${context}]:`, error.message || error);
  return null;
};
