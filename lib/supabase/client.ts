'use client';

import { createBrowserClient } from '@supabase/ssr';
import { supabasePublishableKey, supabaseUrl } from '@/lib/supabase/config';

export function createClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase is not configured. Add the variables from .env.example.');
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
