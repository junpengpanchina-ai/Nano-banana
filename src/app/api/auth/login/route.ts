import { NextRequest, NextResponse } from 'next/server'
import { SupabaseAuthService } from '@/lib/supabase-auth'

import type { AuthResult } from '@/lib/supabase-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // 使用 Supabase 登录
    const result = await SupabaseAuthService.login(email, password)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || '登录失败' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      // Supabase基于会话/Cookie，这里不返回自定义token
    })
  } catch (error) {
    console.error('Login error:', error)
    const detail = process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : '服务器错误'
    return NextResponse.json(
      { success: false, error: detail },
      { status: 500 }
    )
  }
}