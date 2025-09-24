import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = (await request.json()) as { email: string; password: string; name: string }

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: '所有字段都是必填的' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    // 1) 先调用 Supabase Auth 注册（可能需要邮箱确认，session 为空但会返回 user.id）
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || '注册失败' },
        { status: 400 }
      )
    }

    const userId = authData.user.id

    // 2) 使用 service role（如提供）直接插入 public.users，绕过 RLS/会话
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    const dbClient = adminKey && supabaseUrl
      ? createClient(supabaseUrl, adminKey)
      : supabase

    const { data: userRow, error: insertError } = await dbClient
      .from('users')
      .insert({ id: userId, email, name, credits: 5 })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { success: false, error: insertError.message || '创建用户记录失败' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name,
        credits: userRow.credits,
        avatar: userRow.avatar_url,
        createdAt: userRow.created_at,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    )
  }
}