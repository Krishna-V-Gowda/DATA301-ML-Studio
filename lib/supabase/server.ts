import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabasePublishableKey, supabaseUrl } from '@/lib/supabase/config';

export async function createClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase is not configured. Add the variables from .env.example.');
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components may read cookies but cannot always write them.
          // Session refresh is handled by proxy.ts.
        }
      },
    },
  });
}
