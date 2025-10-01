import { supabase } from './supabase'
import { getNumberEnv } from './utils'

const CREDITS_PER_UNIT = getNumberEnv('CREDITS_PER_UNIT', 100)

export interface PaymentRecord {
  id: string
  provider: 'lemonsqueezy' | 'alipay' | 'stripe' | 'wechat' | 'yeepay'
  provider_order_id?: string
  identifier?: string
  user_id: string
  amount_cents: number
  currency?: string
  status: 'pending' | 'paid' | 'refunded' | 'failed'
  raw?: any
  created_at: string
  updated_at: string
}

export interface LedgerEntry {
  id: string
  user_id: string
  delta: number
  reason: string
  source: 'webhook' | 'admin' | 'system'
  ref?: string
  created_at: string
}

export async function recordLemonPaymentIdempotent(opts: {
  userId: string
  amountCents: number
  identifier?: string | null
  providerOrderId?: string | number | null
  currency?: string
  raw?: any
}): Promise<PaymentRecord> {
  const { data: existing } = await supabase
    .from('payments')
    .select('*')
    .eq('identifier', opts.identifier)
    .single()

  if (existing) {
    return existing as PaymentRecord
  }

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      provider: 'lemonsqueezy',
      provider_order_id: opts.providerOrderId?.toString(),
      identifier: opts.identifier || undefined,
      user_id: opts.userId,
      amount_cents: Math.max(0, Math.floor(opts.amountCents || 0)),
      currency: opts.currency || 'USD',
      status: 'paid',
      raw: opts.raw,
    })
    .select()
    .single()

  if (paymentError) {
    // 如果是唯一约束冲突，再次查询
    if (opts.identifier) {
      const { data: again } = await supabase
        .from('payments')
        .select('*')
        .eq('identifier', opts.identifier)
        .single()
      if (again) return again as PaymentRecord
    }
    throw paymentError
  }

  const credits = Math.floor((payment.amount_cents / 100) * CREDITS_PER_UNIT)
  if (credits > 0) {
    // 更新用户积分
    await supabase
      .from('users')
      .update({ 
        credits: payment.amount_cents, // 临时直接设置，实际应该累加
        updated_at: new Date().toISOString()
      })
      .eq('id', opts.userId)

    // 记录积分变更
    await supabase
      .from('ledger')
      .insert({
        user_id: opts.userId,
        delta: credits,
        reason: 'Lemon Squeezy payment',
        source: 'webhook',
        ref: payment.identifier || payment.id,
      })
  }

  return payment as PaymentRecord
}

export async function listRecentPayments(limit = 50): Promise<PaymentRecord[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as PaymentRecord[]
}

export async function getUserPayments(userId: string, limit = 50): Promise<PaymentRecord[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as PaymentRecord[]
}

export async function getLedgerEntries(userId: string, limit = 50): Promise<LedgerEntry[]> {
  const { data, error } = await supabase
    .from('ledger')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as LedgerEntry[]
}

export async function adjustUserCredits(
  userId: string, 
  delta: number, 
  reason: string, 
  adminKey: string
): Promise<{ credits: number }> {
  if (adminKey !== process.env.ADMIN_KEY) {
    throw new Error('Unauthorized')
  }

  // 更新用户积分
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single()

  if (userError) throw userError

  const newCredits = (user.credits || 0) + delta

  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      credits: newCredits,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (updateError) throw updateError

  // 记录积分变更
  await supabase
    .from('ledger')
    .insert({
      user_id: userId,
      delta,
      reason,
      source: 'admin',
      ref: `admin:${Date.now()}`,
    })

  return { credits: newCredits }
}



