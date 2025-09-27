#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testLoginSimple() {
  console.log('🧪 简化登录测试');
  console.log('==============\n');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ 环境变量未配置');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔐 测试登录...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'tset123qq@example.com',
      password: '123123'
    });
    
    if (loginError) {
      console.log('❌ 登录失败:', loginError.message);
      return;
    }
    
    console.log('✅ 登录成功!');
    console.log('用户ID:', loginData.user.id);
    console.log('邮箱:', loginData.user.email);
    
    console.log('\n📊 测试读取用户数据...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', loginData.user.id)
      .single();
    
    if (userError) {
      console.log('❌ 读取用户数据失败:', userError.message);
      if (userError.message.includes('row-level security')) {
        console.log('\n💡 这是 RLS 策略问题，需要修复策略');
      }
    } else {
      console.log('✅ 读取用户数据成功!');
      console.log('姓名:', userData.name);
      console.log('积分:', userData.credits);
      console.log('创建时间:', userData.created_at);
    }
    
    console.log('\n🎉 测试完成!');
    console.log('\n📝 结论:');
    if (!userError) {
      console.log('✅ RLS 策略正常工作');
      console.log('✅ 登录功能正常');
      console.log('✅ 用户数据读取正常');
      console.log('\n🌐 现在可以正常使用前端登录功能了!');
    } else {
      console.log('❌ 需要修复 RLS 策略');
      console.log('\n💡 手动修复步骤:');
      console.log('1. 访问 Supabase Dashboard');
      console.log('2. 进入 Authentication > Policies');
      console.log('3. 为 users 表添加策略:');
      console.log('   - SELECT: true');
      console.log('   - INSERT: auth.uid() = id');
      console.log('   - UPDATE: auth.uid() = id');
    }
    
    // 清理
    await supabase.auth.signOut();
    console.log('\n✅ 已清理登录状态');
    
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
  }
}

testLoginSimple();
