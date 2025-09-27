#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 测试智能认证系统');
console.log('====================\n');

console.log('📋 环境检查:');
console.log('Supabase URL:', supabaseUrl ? '✅ 已配置' : '❌ 未配置');
console.log('Supabase Key:', supabaseKey ? '✅ 已配置' : '❌ 未配置');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ 环境变量未配置，请检查 .env.local 文件');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  try {
    console.log('\n🔐 测试用户登录...');
    console.log('邮箱: tset123qq@example.com');
    console.log('密码: 123123');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'tset123qq@example.com',
      password: '123123'
    });

    if (error) {
      console.log('❌ 登录失败:', error.message);
      return false;
    }

    console.log('✅ 登录成功!');
    console.log('用户ID:', data.user.id);
    console.log('邮箱:', data.user.email);
    
    // 获取用户详细信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.log('⚠️ 获取用户信息失败:', userError.message);
    } else {
      console.log('📊 用户信息:');
      console.log('姓名:', userData.name);
      console.log('积分:', userData.credits);
      console.log('创建时间:', userData.created_at);
    }

    return true;
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  try {
    console.log('\n🔌 测试数据库连接...');
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ 数据库连接失败:', error.message);
      return false;
    }

    console.log('✅ 数据库连接正常');
    return true;
  } catch (error) {
    console.log('❌ 数据库测试失败:', error.message);
    return false;
  }
}

async function main() {
  const dbConnected = await testDatabaseConnection();
  
  if (dbConnected) {
    const loginSuccess = await testLogin();
    
    if (loginSuccess) {
      console.log('\n🎉 智能认证系统测试完成!');
      console.log('\n📝 下一步:');
      console.log('1. 访问 http://localhost:3000/login');
      console.log('2. 使用测试账户登录');
      console.log('3. 体验智能认证功能');
      console.log('\n✨ 特性:');
      console.log('• AI驱动的登录建议');
      console.log('• 实时行为分析');
      console.log('• 语音识别登录');
      console.log('• 生物识别支持');
      console.log('• 智能风险评估');
    } else {
      console.log('\n❌ 登录测试失败，请检查用户数据');
    }
  } else {
    console.log('\n❌ 数据库连接失败，请检查配置');
  }
}

main();
