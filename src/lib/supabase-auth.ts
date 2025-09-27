import { supabase } from './supabase'
import { User } from '@/components/auth/auth-context'

export interface SupabaseUser {
  id: string
  email: string
  name: string
  credits: number
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface AuthResult {
  success: boolean
  user?: User | null
  error?: string
}

// 将Supabase用户转换为应用用户格式
export function transformSupabaseUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.name,
    credits: supabaseUser.credits,
    avatar: supabaseUser.avatar_url,
    createdAt: supabaseUser.created_at,
  }
}

// 用户认证服务
export class SupabaseAuthService {
  // 检查Supabase是否配置
  private static isSupabaseConfigured() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL && 
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
           process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo-project.supabase.co'
  }

  // 注册用户
  static async register(email: string, password: string, name: string): Promise<AuthResult> {
    // 如果Supabase未配置，使用模拟注册
    if (!this.isSupabaseConfigured()) {
      console.warn('⚠️ Supabase未配置，使用模拟注册')
      return this.mockRegister(email, password, name)
    }

    try {
      // 1. 使用Supabase Auth注册
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('注册失败')
      }

      // 2. 在users表中创建用户记录
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          name: name,
          credits: 5, // 新用户赠送5积分
        })
        .select()
        .single()

      if (userError) {
        throw new Error(userError.message)
      }

      return {
        success: true,
        user: transformSupabaseUser(userData)
      }
    } catch (error) {
      console.error('Register error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '注册失败'
      }
    }
  }

  // 模拟注册（用于开发测试）
  private static mockRegister(email: string, password: string, name: string): Promise<AuthResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: SupabaseUser = {
          id: `mock_${Date.now()}`,
          email,
          name,
          credits: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        resolve({
          success: true,
          user: transformSupabaseUser(mockUser)
        })
      }, 1000)
    })
  }

  // 登录用户
  static async login(email: string, password: string): Promise<AuthResult> {
    // 如果Supabase未配置，使用模拟登录
    if (!this.isSupabaseConfigured()) {
      console.warn('⚠️ Supabase未配置，使用模拟登录')
      return this.mockLogin(email, password)
    }

    try {
      // 1. 使用Supabase Auth登录
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('登录失败')
      }

      // 2. 获取用户详细信息（若不存在则补建）
      let { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError || !userData) {
        // 不存在则创建一条（开发期兜底）
        const { data: inserted, error: insertErr } = await supabase
          .from('users')
          .insert({ id: authData.user.id, email, name: authData.user.user_metadata?.name || email.split('@')[0], credits: 5 })
          .select('*')
          .single()
        if (insertErr || !inserted) {
          throw new Error((insertErr && insertErr.message) || '获取用户信息失败')
        }
        userData = inserted
      }

      return {
        success: true,
        user: transformSupabaseUser(userData)
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      }
    }
  }

  // 模拟登录（用于开发测试）
  private static mockLogin(email: string, password: string): Promise<AuthResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟测试账户
        const testUsers = [
          { email: 'demo@example.com', password: 'password', name: '演示用户', credits: 10 },
          { email: 'test@example.com', password: 'password', name: '测试用户', credits: 5 }
        ]
        
        const user = testUsers.find(u => u.email === email && u.password === password)
        
        if (user) {
          const mockUser: SupabaseUser = {
            id: `mock_${user.email}`,
            email: user.email,
            name: user.name,
            credits: user.credits,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          
          resolve({
            success: true,
            user: transformSupabaseUser(mockUser)
          })
        } else {
          resolve({
            success: false,
            error: '邮箱或密码错误'
          })
        }
      }, 1000)
    })
  }

  // 登出用户
  static async logout(): Promise<{ success: boolean; error?: string }> {
    // 如果Supabase未配置，使用模拟登出
    if (!this.isSupabaseConfigured()) {
      console.warn('⚠️ Supabase未配置，使用模拟登出')
      return { success: true }
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '登出失败'
      }
    }
  }

  // 更新用户积分
  static async updateUserCredits(userId: string, credits: number): Promise<AuthResult> {
    // 如果Supabase未配置，使用模拟更新
    if (!this.isSupabaseConfigured()) {
      console.warn('⚠️ Supabase未配置，使用模拟积分更新')
      return { success: true, user: null }
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          credits: credits,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        user: transformSupabaseUser(data)
      }
    } catch (error) {
      console.error('Update credits error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '更新积分失败'
      }
    }
  }

  // 获取当前用户
  static async getCurrentUser(): Promise<AuthResult> {
    // 如果Supabase未配置，返回空用户
    if (!this.isSupabaseConfigured()) {
      console.warn('⚠️ Supabase未配置，无法获取当前用户')
      return { success: false, user: null }
    }

    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        return { success: false, user: null }
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        user: transformSupabaseUser(userData)
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return {
        success: false,
        user: null,
        error: error instanceof Error ? error.message : '获取用户信息失败'
      }
    }
  }
}
