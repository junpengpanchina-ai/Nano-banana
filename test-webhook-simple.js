// 简化的 Webhook 测试
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drqzkiltgusbwyxpkmal.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycXpraWx0Z3VzYnd5eHBrbWFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ1NjQ5OSwiZXhwIjoyMDc0MDMyNDk5fQ.LBN0LiHNVsT1Z6MyfMqsgozTyFywxquUPhNs0pYlR6k'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testWebhookLogic() {
  try {
    console.log('Testing webhook logic...')
    
    const opts = {
      userId: 'u_test',
      amountCents: 9999,
      identifier: 'order-unique-id-10',
      providerOrderId: 'ord_10',
      currency: 'USD',
      raw: { test: 'data' }
    }
    
    // 检查是否已存在
    const { data: existing } = await supabase
      .from('payments')
      .select('*')
      .eq('identifier', opts.identifier)
      .single()
    
    if (existing) {
      console.log('Payment already exists:', existing)
      return existing
    }
    
    // 插入新支付记录
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
      console.error('Payment insert error:', paymentError)
      return
    }
    
    console.log('Payment inserted:', payment)
    
    // 计算积分
    const CREDITS_PER_UNIT = 100
    const credits = Math.floor((payment.amount_cents / 100) * CREDITS_PER_UNIT)
    console.log('Credits to add:', credits)
    
    if (credits > 0) {
      // 更新用户积分
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          credits: payment.amount_cents, // Temporary direct setting
          updated_at: new Date().toISOString()
        })
        .eq('id', opts.userId)
      
      if (updateError) {
        console.error('User update error:', updateError)
        return
      }
      
      // 记录积分变更
      const { error: ledgerError } = await supabase
        .from('ledger')
        .insert({
          user_id: opts.userId,
          delta: credits,
          reason: 'Lemon Squeezy payment',
          source: 'webhook',
          ref: payment.identifier || payment.id,
        })
      
      if (ledgerError) {
        console.error('Ledger insert error:', ledgerError)
        return
      }
      
      console.log('Credits updated and ledger recorded')
    }
    
    console.log('Webhook logic completed successfully!')
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testWebhookLogic()
