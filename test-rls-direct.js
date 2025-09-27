#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testRLSDirect() {
  console.log('🧪 直接测试 RLS 问题');
  console.log('==================\n');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ 环境变量未配置');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('📋 测试步骤:');
    console.log('1. 尝试直接读取 users 表（应该被 RLS 阻止）');
    console.log('2. 登录后读取用户数据（应该成功）');
    
    console.log('\n🔐 步骤1: 匿名读取 users 表...');
    const { data: users, error: readError } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(1);
    
    if (readError) {
      console.log('❌ 匿名读取失败:', readError.message);
      if (readError.message.includes('row-level security')) {
        console.log('✅ 这是预期的 RLS 保护行为');
      }
    } else {
      console.log('✅ 匿名读取成功，找到', users.length, '个用户');
      if (users.length > 0) {
        console.log('⚠️  警告: RLS 策略可能过于宽松');
      }
    }
    
    console.log('\n🔐 步骤2: 尝试登录...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'tset123qq@example.com',
      password: '123123'
    });
    
    if (loginError) {
      console.log('❌ 登录失败:', loginError.message);
      console.log('\n💡 可能的原因:');
      console.log('1. 网络连接问题');
      console.log('2. Supabase 服务暂时不可用');
      console.log('3. 用户账户不存在或密码错误');
      return;
    }
    
    console.log('✅ 登录成功!');
    console.log('用户ID:', loginData.user.id);
    
    console.log('\n🔐 步骤3: 登录后读取用户数据...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', loginData.user.id)
      .single();
    
    if (userError) {
      console.log('❌ 登录后读取失败:', userError.message);
      if (userError.message.includes('row-level security')) {
        console.log('\n💡 这是 RLS 策略问题！');
        console.log('需要为 users 表添加适当的策略');
      }
    } else {
      console.log('✅ 登录后读取成功!');
      console.log('姓名:', userData.name);
      console.log('积分:', userData.credits);
    }
    
    console.log('\n📊 测试结果总结:');
    if (readError && readError.message.includes('row-level security')) {
      console.log('✅ RLS 策略正常工作 - 匿名用户被阻止');
    } else if (users && users.length === 0) {
      console.log('✅ RLS 策略正常工作 - 匿名用户看到空结果');
    } else {
      console.log('⚠️  RLS 策略可能过于宽松');
    }
    
    if (!userError) {
      console.log('✅ 认证用户数据访问正常');
      console.log('\n🎉 结论: RLS 策略工作正常，前端登录应该没问题！');
    } else {
      console.log('❌ 认证用户数据访问失败');
      console.log('\n💡 需要修复 RLS 策略');
    }
    
    // 清理
    await supabase.auth.signOut();
    console.log('\n✅ 已清理登录状态');
    
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    console.log('\n💡 这可能是网络问题，请稍后重试');
  }
}

testRLSDirect();
