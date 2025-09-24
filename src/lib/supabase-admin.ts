import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('⚠️ Supabase admin not fully configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.')
}

export const supabaseAdmin = createClient(supabaseUrl || 'https://demo-project.supabase.co', serviceRoleKey || 'demo-service-role-key', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      apikey: serviceRoleKey || 'demo-service-role-key',
      Authorization: `Bearer ${serviceRoleKey || 'demo-service-role-key'}`,
    },
  },
})

export type AdminActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  total?: number
}


