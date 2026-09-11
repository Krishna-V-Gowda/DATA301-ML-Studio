export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

function isPlaceholder(value: string | undefined) {
  return !value || value.includes('YOUR_PROJECT') || value.includes('YOUR_KEY');
}

export const isSupabaseConfigured = Boolean(
  !isPlaceholder(supabaseUrl)
  && !isPlaceholder(supabasePublishableKey),
);
