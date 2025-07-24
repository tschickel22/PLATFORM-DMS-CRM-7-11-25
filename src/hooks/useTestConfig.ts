import { supabase } from '@/lib/supabaseClient'

export async function getMfaKey() {
  const { data } = await supabase
    .from('api_keys')
    .select('*')
    .eq('usage', 'mfa')
    .maybeSingle()

  return data?.key || null
}

export async function getFeatureFlag(flag: string) {
  const { data } = await supabase
    .from('feature_flags')
    .select('value')
    .eq('key', flag)
    .maybeSingle()

  return data?.value ?? false
}