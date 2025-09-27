#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 调试智能认证系统');
console.log('==================\n');

console.log('📋 环境变量检查:');
console.log('Supabase URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置');
console.log('Supabase Key:', supabaseKey ? '✅ 已设置' : '❌ 未设置');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ 环境变量未配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuth() {
  try {
    console.log('\n🔐 测试 getCurrentUser...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('❌ getCurrentUser 错误:', error.message);
    } else if (user) {
      console.log('✅ 找到已登录用户:', user.email);
      
      // 测试用户表查询
      console.log('\n📊 测试用户表查询...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.log('❌ 用户表查询错误:', userError.message);
      } else {
        console.log('✅ 用户数据:', userData.name, userData.credits);
      }
    } else {
      console.log('ℹ️ 没有已登录的用户');
    }
    
    // 测试登录功能
    console.log('\n🔑 测试登录功能...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'tset123qq@example.com',
      password: '123123'
    });
    
    if (loginError) {
      console.log('❌ 登录测试失败:', loginError.message);
    } else {
      console.log('✅ 登录测试成功:', loginData.user.email);
      
      // 登出
      await supabase.auth.signOut();
      console.log('✅ 已登出');
    }
    
  } catch (error) {
    console.log('❌ 调试失败:', error.message);
  }
}

debugAuth();
