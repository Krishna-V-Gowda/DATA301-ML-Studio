import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl } from '@/lib/supabase/config';
import { supabaseServerKey } from '@/lib/supabase/server-config';

export function createAdminClient() {
  if (!supabaseUrl || !supabaseServerKey) {
    throw new Error('Supabase server access is not configured. Add SUPABASE_SECRET_KEY to the server environment.');
  }

  return createClient(supabaseUrl, supabaseServerKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
