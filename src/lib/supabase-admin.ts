import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 严格检查：生产环境必须配置；开发环境警告并回退到演示配置
if (!supabaseUrl || !serviceRoleKey) {
  const message = 'Supabase Admin 环境未完整配置：需要 NEXT_PUBLIC_SUPABASE_URL 与 SUPABASE_SERVICE_ROLE_KEY'
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message)
  } else {
    console.warn(`⚠️ ${message}（开发环境将使用演示配置，仅用于本地调试）`)
  }
}

const effectiveAdminUrl = supabaseUrl || 'https://demo-project.supabase.co'
const effectiveServiceKey = serviceRoleKey || 'demo-service-role-key'

export const supabaseAdmin = createClient(effectiveAdminUrl, effectiveServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      apikey: effectiveServiceKey,
      Authorization: `Bearer ${effectiveServiceKey}`,
    },
  },
})

export type AdminActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  total?: number
}


