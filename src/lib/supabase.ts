import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kbcpryinseisqxrsvrkl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn("Supabase Anon Key is missing! Check your .env file or environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || '');

// Types Helper
export type Profile = {
  id: string;
  full_name: string;
  role: 'admin' | 'monitor' | 'student';
  must_change_password: boolean;
  course_id?: string;
};
