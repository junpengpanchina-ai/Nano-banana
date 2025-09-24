import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Simple admin guard using ADMIN_KEY header or cookie
function isAdmin(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY
  const header = req.headers.get('x-admin-key')
  const cookie = req.cookies.get('admin_key')?.value
  return !!adminKey && (header === adminKey || cookie === adminKey)
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Math.min(100, Number(searchParams.get('pageSize') || '20'))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // basic filter by email or name
  let query = supabaseAdmin.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  if (q) {
    query = query.or(`email.ilike.%${q}%,name.ilike.%${q}%`)
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data, total: count ?? 0 })
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { userId, credits, status, name } = body as { userId: string; credits?: number; status?: 'active' | 'suspended' | 'deleted'; name?: string }
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 })
    }

    const updates: any = { updated_at: new Date().toISOString() }
    if (typeof credits === 'number') updates.credits = credits
    if (typeof name === 'string') updates.name = name
    if (status) (updates as any).status = status

    const { data, error } = await supabaseAdmin.from('users').update(updates).eq('id', userId).select('*').single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 })
  }
}


