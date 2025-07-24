import { supabase } from '@/lib/supabaseClient'

export async function getIntegrationCredentials(providerName: string) {
  const { data: provider } = await supabase
    .from('integration_providers')
    .select('id')
    .eq('name', providerName)
    .maybeSingle()

  if (!provider) return null

  const { data: creds } = await supabase
    .from('integration_credentials')
    .select('*')
    .eq('provider_id', provider.id)
    .maybeSingle()

  return creds || null
}

export async function logIntegrationEvent(providerId: string, event: string, status: string, response: any) {
  await supabase.from('integration_logs').insert({
    provider_id: providerId,
    event,
    status,
    response,
    created_at: new Date().toISOString()
  })
}