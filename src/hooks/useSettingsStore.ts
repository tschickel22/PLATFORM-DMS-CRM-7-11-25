import { supabase } from '@/lib/supabaseClient'

export async function fetchCompanySettings(companyId: string) {
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle()
  return { data, error }
}

export async function updateCompanySettings(companyId: string, updates: any) {
  const { error } = await supabase
    .from('company_settings')
    .upsert({ company_id: companyId, ...updates }, { onConflict: 'company_id' })
  return { error }
}

export async function fetchPlatformSetting(key: string) {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  return { value: data?.value, error }
}

export async function updatePlatformSetting(key: string, value: any) {
  const { error } = await supabase
    .from('platform_settings')
    .upsert({ key, value }, { onConflict: 'key' })
  return { error }
}

export async function fetchCustomFields(companyId: string, module?: string) {
  let query = supabase
    .from('custom_fields')
    .select('*')
    .eq('company_id', companyId)
  
  if (module) {
    query = query.eq('module', module)
  }
  
  const { data, error } = await query.order('module', { ascending: true })
  return { data: data || [], error }
}

export async function createCustomField(companyId: string, fieldData: any) {
  const { data, error } = await supabase
    .from('custom_fields')
    .insert({ company_id: companyId, ...fieldData })
    .select()
    .single()
  return { data, error }
}

export async function updateCustomField(fieldId: string, updates: any) {
  const { data, error } = await supabase
    .from('custom_fields')
    .update(updates)
    .eq('id', fieldId)
    .select()
    .single()
  return { data, error }
}

export async function deleteCustomField(fieldId: string) {
  const { error } = await supabase
    .from('custom_fields')
    .delete()
    .eq('id', fieldId)
  return { error }
}

export async function fetchTenantSettings(tenantId: string) {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .maybeSingle()
  return { data, error }
}

export async function updateTenantSettings(tenantId: string, updates: any) {
  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', tenantId)
    .select()
    .single()
  return { data, error }
}