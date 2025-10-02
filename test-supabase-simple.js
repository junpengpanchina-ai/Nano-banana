// 简化的 Supabase 测试
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drqzkiltgusbwyxpkmal.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycXpraWx0Z3VzYnd5eHBrbWFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ1NjQ5OSwiZXhwIjoyMDc0MDMyNDk5fQ.LBN0LiHNVsT1Z6MyfMqsgozTyFywxquUPhNs0pYlR6k'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...')
    
    // 测试插入 payments
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        provider: 'lemonsqueezy',
        user_id: 'u_test',
        amount_cents: 1000,
        identifier: 'test-simple'
      })
      .select()
      .single()
    
    if (paymentError) {
      console.error('Payment insert error:', paymentError)
      return
    }
    
    console.log('Payment inserted:', payment)
    
    // 测试插入 ledger
    const { data: ledger, error: ledgerError } = await supabase
      .from('ledger')
      .insert({
        user_id: 'u_test',
        delta: 100,
        reason: 'test payment',
        source: 'webhook'
      })
      .select()
      .single()
    
    if (ledgerError) {
      console.error('Ledger insert error:', ledgerError)
      return
    }
    
    console.log('Ledger inserted:', ledger)
    
    // 测试查询
    const { data: payments, error: queryError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', 'u_test')
      .limit(5)
    
    if (queryError) {
      console.error('Query error:', queryError)
      return
    }
    
    console.log('Payments found:', payments.length)
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testSupabase()

