import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 严格检查环境变量：生产环境缺失则直接报错；开发环境缺失则使用演示配置继续运行
if (!supabaseUrl || !supabaseAnonKey) {
  const message = 'Supabase环境变量缺失：请在 .env.local 配置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY'
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message)
  } else {
    console.warn(`⚠️ ${message}（开发环境将使用演示配置，仅用于本地调试）`)
  }
}

const effectiveSupabaseUrl = supabaseUrl || 'https://demo-project.supabase.co'
const effectiveSupabaseAnonKey = supabaseAnonKey || 'demo-key-12345'

export const supabase = createClient(effectiveSupabaseUrl, effectiveSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 数据库表类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          credits: number
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          credits?: number
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          credits?: number
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          prompt: string
          style: string
          pose: string
          result_url?: string
          status: 'pending' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          style: string
          pose: string
          result_url?: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          style?: string
          pose?: string
          result_url?: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
