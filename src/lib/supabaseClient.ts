import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key when connected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
};

// Type definitions for database tables
export type Item = {
  id: string;
  name: string;
  cost: number;
  user_id: string;
  created_at?: string;
};

export type OtherCost = {
  id: string;
  description: string;
  amount: number;
  user_id: string;
  created_at?: string;
};