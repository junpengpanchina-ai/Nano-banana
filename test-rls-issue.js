#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testRLSIssue() {
  console.log('🧪 测试 Supabase RLS 问题');
  console.log('========================\n');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ 环境变量未配置');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  
  try {
    console.log('🔐 测试1: 使用匿名密钥读取用户数据...');
    const { data: users, error: readError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (readError) {
      console.log('❌ 读取失败:', readError.message);
    } else {
      console.log('✅ 读取成功，找到', users.length, '个用户');
    }
    
    console.log('\n🔐 测试2: 使用服务角色密钥读取用户数据...');
    const { data: adminUsers, error: adminReadError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (adminReadError) {
      console.log('❌ 管理员读取失败:', adminReadError.message);
    } else {
      console.log('✅ 管理员读取成功，找到', adminUsers.length, '个用户');
    }
    
    console.log('\n🔐 测试3: 尝试登录...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'tset123qq@example.com',
      password: '123123'
    });
    
    if (loginError) {
      console.log('❌ 登录失败:', loginError.message);
    } else {
      console.log('✅ 登录成功:', loginData.user.email);
      
      console.log('\n🔐 测试4: 登录后读取用户数据...');
      const { data: userData, error: userReadError } = await supabase
        .from('users')
        .select('*')
        .eq('id', loginData.user.id)
        .single();
      
      if (userReadError) {
        console.log('❌ 登录后读取失败:', userReadError.message);
        console.log('这就是 RLS 策略问题！');
      } else {
        console.log('✅ 登录后读取成功:', userData.name);
      }
    }
    
    console.log('\n📋 问题诊断:');
    if (readError && readError.message.includes('row-level security')) {
      console.log('❌ 确认是 RLS 策略问题');
      console.log('\n💡 解决方案:');
      console.log('1. 访问 Supabase Dashboard');
      console.log('2. 进入 Authentication > Policies');
      console.log('3. 为 users 表添加以下策略:');
      console.log('   - SELECT: true (允许所有用户读取)');
      console.log('   - INSERT: auth.uid() = id (允许插入)');
      console.log('   - UPDATE: auth.uid() = id (允许更新)');
    }
    
    // 清理
    await supabase.auth.signOut();
    
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
  }
}

testRLSIssue();
