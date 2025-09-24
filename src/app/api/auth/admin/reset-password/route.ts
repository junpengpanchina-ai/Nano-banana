import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json()
    if (!email || !newPassword) {
      return NextResponse.json({ success: false, error: 'email 和 newPassword 必填' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ success: false, error: '服务端未配置 SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey)

    // 通过业务库 users 表反查 auth 用户 id
    const { data: userRow, error: userErr } = await admin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userErr || !userRow?.id) {
      return NextResponse.json({ success: false, error: '未找到该邮箱对应的用户' }, { status: 404 })
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(userRow.id, { password: newPassword })
    if (updErr) {
      return NextResponse.json({ success: false, error: updErr.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : '服务器错误'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}


