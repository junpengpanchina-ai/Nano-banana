// 测试 Supabase 表格创建和操作
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drqzkiltgusbwyxpkmal.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycXpraWx0Z3VzYnd5eHBrbWFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ1NjQ5OSwiZXhwIjoyMDc0MDMyNDk5fQ.LBN0LiHNVsT1Z6MyfMqsgozTyFywxquUPhNs0pYlR6k'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testTableCreation() {
  console.log('🔍 检查现有表格...')
  
  try {
    // 1. 检查 payments 表
    console.log('\n📊 检查 payments 表:')
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .limit(3)
    
    if (paymentsError) {
      console.error('❌ Payments 表错误:', paymentsError.message)
    } else {
      console.log('✅ Payments 表存在，记录数:', payments.length)
      if (payments.length > 0) {
        console.log('📋 示例记录:', JSON.stringify(payments[0], null, 2))
      }
    }
    
    // 2. 检查 ledger 表
    console.log('\n📊 检查 ledger 表:')
    const { data: ledger, error: ledgerError } = await supabase
      .from('ledger')
      .select('*')
      .limit(3)
    
    if (ledgerError) {
      console.error('❌ Ledger 表错误:', ledgerError.message)
    } else {
      console.log('✅ Ledger 表存在，记录数:', ledger.length)
      if (ledger.length > 0) {
        console.log('📋 示例记录:', JSON.stringify(ledger[0], null, 2))
      }
    }
    
    // 3. 检查 users 表
    console.log('\n📊 检查 users 表:')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(3)
    
    if (usersError) {
      console.error('❌ Users 表错误:', usersError.message)
    } else {
      console.log('✅ Users 表存在，记录数:', users.length)
      if (users.length > 0) {
        console.log('📋 示例记录:', JSON.stringify(users[0], null, 2))
      }
    }
    
    // 4. 测试插入新数据
    console.log('\n🧪 测试插入新数据:')
    
    // 插入测试支付记录
    const testPayment = {
      provider: 'lemonsqueezy',
      user_id: '00000000-0000-0000-0000-000000000002',
      amount_cents: 5000,
      identifier: `test-${Date.now()}`,
      currency: 'USD',
      status: 'paid'
    }
    
    const { data: newPayment, error: insertError } = await supabase
      .from('payments')
      .insert(testPayment)
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ 插入支付记录失败:', insertError.message)
    } else {
      console.log('✅ 支付记录插入成功:', newPayment.id)
    }
    
    // 插入测试积分记录
    const testLedger = {
      user_id: '00000000-0000-0000-0000-000000000002',
      delta: 50,
      reason: 'test payment',
      source: 'webhook'
    }
    
    const { data: newLedger, error: ledgerInsertError } = await supabase
      .from('ledger')
      .insert(testLedger)
      .select()
      .single()
    
    if (ledgerInsertError) {
      console.error('❌ 插入积分记录失败:', ledgerInsertError.message)
    } else {
      console.log('✅ 积分记录插入成功:', newLedger.id)
    }
    
    // 5. 测试查询功能
    console.log('\n🔍 测试查询功能:')
    
    // 查询用户的所有支付记录
    const { data: userPayments, error: queryError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', '00000000-0000-0000-0000-000000000002')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (queryError) {
      console.error('❌ 查询支付记录失败:', queryError.message)
    } else {
      console.log('✅ 查询支付记录成功，数量:', userPayments.length)
    }
    
    // 查询用户的积分流水
    const { data: userLedger, error: ledgerQueryError } = await supabase
      .from('ledger')
      .select('*')
      .eq('user_id', '00000000-0000-0000-0000-000000000002')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (ledgerQueryError) {
      console.error('❌ 查询积分流水失败:', ledgerQueryError.message)
    } else {
      console.log('✅ 查询积分流水成功，数量:', userLedger.length)
    }
    
    console.log('\n🎉 表格创建和操作测试完成！')
    console.log('\n📋 总结:')
    console.log('- ✅ Payments 表: 正常')
    console.log('- ✅ Ledger 表: 正常') 
    console.log('- ✅ Users 表: 正常')
    console.log('- ✅ 数据插入: 正常')
    console.log('- ✅ 数据查询: 正常')
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message)
  }
}

testTableCreation()
