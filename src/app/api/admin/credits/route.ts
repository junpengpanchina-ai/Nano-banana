import { NextRequest, NextResponse } from 'next/server'
import { adjustUserCredits } from '@/lib/supabase-payment-gateways'

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key') || ''
  if (!process.env.ADMIN_KEY || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({})) as { userId?: string; delta?: number; reason?: string }
  const userId = String(body.userId || '')
  const delta = Number(body.delta)
  const reason = String(body.reason || 'adjust')
  if (!userId || !Number.isFinite(delta) || delta === 0) {
    return NextResponse.json({ success: false, error: 'Invalid userId/delta' }, { status: 400 })
  }

  try {
    const result = await adjustUserCredits(userId, delta, reason, adminKey)
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


