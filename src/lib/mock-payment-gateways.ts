// 临时的内存存储，用于测试支付流程
let mockPayments: any[] = []
let mockLedger: any[] = []

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

const CREDITS_PER_UNIT = 100

export async function recordLemonPaymentIdempotent(opts: {
  userId: string
  amountCents: number
  identifier?: string | null
  providerOrderId?: string | number | null
  currency?: string
  raw?: any
}): Promise<PaymentRecord> {
  // 检查是否已存在
  const existing = mockPayments.find(p => p.identifier === opts.identifier)
  if (existing) {
    return existing
  }

  const payment: PaymentRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    provider: 'lemonsqueezy',
    provider_order_id: opts.providerOrderId?.toString(),
    identifier: opts.identifier || undefined,
    user_id: opts.userId,
    amount_cents: Math.max(0, Math.floor(opts.amountCents || 0)),
    currency: opts.currency || 'USD',
    status: 'paid',
    raw: opts.raw,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockPayments.push(payment)

  const credits = Math.floor((payment.amount_cents / 100) * CREDITS_PER_UNIT)
  if (credits > 0) {
    const ledgerEntry: LedgerEntry = {
      id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: opts.userId,
      delta: credits,
      reason: 'Lemon Squeezy payment',
      source: 'webhook',
      ref: payment.identifier || payment.id,
      created_at: new Date().toISOString(),
    }
    mockLedger.push(ledgerEntry)
  }

  console.log('✅ Mock payment recorded:', { payment, credits })
  return payment
}

export async function listRecentPayments(limit = 50): Promise<PaymentRecord[]> {
  return mockPayments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

export async function getUserPayments(userId: string, limit = 50): Promise<PaymentRecord[]> {
  return mockPayments
    .filter(p => p.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

export async function getLedgerEntries(userId: string, limit = 50): Promise<LedgerEntry[]> {
  return mockLedger
    .filter(l => l.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
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

  const ledgerEntry: LedgerEntry = {
    id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    delta,
    reason,
    source: 'admin',
    ref: `admin:${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  mockLedger.push(ledgerEntry)

  // 计算当前积分（简化版）
  const totalCredits = mockLedger
    .filter(l => l.user_id === userId)
    .reduce((sum, l) => sum + l.delta, 0)

  console.log('✅ Mock credits adjusted:', { userId, delta, reason, totalCredits })
  return { credits: totalCredits }
}



