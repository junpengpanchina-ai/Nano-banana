#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testCompleteLoginFlow() {
  console.log('🧪 测试完整登录流程');
  console.log('==================\n');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase环境变量未配置');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔐 步骤1: 测试用户登录...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'tset123qq@example.com',
      password: '123123'
    });
    
    if (loginError) {
      throw new Error(`登录失败: ${loginError.message}`);
    }
    
    console.log('✅ 登录成功!');
    console.log('用户ID:', loginData.user.id);
    console.log('邮箱:', loginData.user.email);
    
    console.log('\n📊 步骤2: 获取用户详细信息...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', loginData.user.id)
      .single();
    
    if (userError) {
      throw new Error(`获取用户信息失败: ${userError.message}`);
    }
    
    console.log('✅ 用户信息获取成功!');
    console.log('姓名:', userData.name);
    console.log('积分:', userData.credits);
    
    console.log('\n🎉 登录流程测试完成!');
    console.log('\n📝 现在可以测试前端:');
    console.log('1. 访问 http://localhost:3000/login');
    console.log('2. 使用测试账户登录');
    console.log('3. 登录成功后应该:');
    console.log('   - 显示"已登录成功"页面');
    console.log('   - 导航栏显示用户信息和积分');
    console.log('   - 可以正常访问其他页面');
    
    // 登出以清理状态
    await supabase.auth.signOut();
    console.log('\n✅ 测试完成，已清理登录状态');
    
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
  }
}

testCompleteLoginFlow();
