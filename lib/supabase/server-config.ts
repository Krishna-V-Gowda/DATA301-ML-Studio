import 'server-only';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const supabaseServerKey = (
  process.env.SUPABASE_SECRET_KEY
  || process.env.SUPABASE_SERVICE_ROLE_KEY
)?.trim();

function isPlaceholder(value: string | undefined) {
  return !value || value.includes('YOUR_SECRET') || value.includes('YOUR_KEY');
}

export const isSupabaseServerConfigured = Boolean(
  isSupabaseConfigured
  && !isPlaceholder(supabaseServerKey),
);

export function describeSupabaseServerKey() {
  if (!supabaseServerKey) return 'missing';
  if (supabaseServerKey.startsWith('sb_secret_')) return 'secret key';
  if (supabaseServerKey.startsWith('eyJ')) return 'legacy service-role JWT';
  return 'unrecognized server key';
}
