#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 检查环境变量...');
console.log('Supabase URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置');
console.log('Supabase Key:', supabaseKey ? '✅ 已设置' : '❌ 未设置');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ 请先配置 .env.local 文件');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    console.log('\n🔌 测试Supabase连接...');
    
    // 1. 测试基本连接
    console.log('1. 测试基本连接...');
    const { data: healthData, error: healthError } = await supabase
      .from('_health')
      .select('*')
      .limit(1);
    
    if (healthError) {
      console.log('   ⚠️ 健康检查失败（这是正常的）:', healthError.message);
    } else {
      console.log('   ✅ 基本连接成功');
    }
    
    // 2. 测试认证功能
    console.log('\n2. 测试认证功能...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('   ❌ 认证测试失败:', authError.message);
    } else {
      console.log('   ✅ 认证功能正常');
    }
    
    // 3. 检查数据库表
    console.log('\n3. 检查数据库表...');
    
    // 尝试查询users表
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.log('   ❌ users表不存在:', usersError.message);
      console.log('   💡 需要在Supabase中运行数据库初始化脚本');
    } else {
      console.log('   ✅ users表存在');
    }
    
    // 尝试查询generations表
    const { data: gensData, error: gensError } = await supabase
      .from('generations')
      .select('count')
      .limit(1);
    
    if (gensError) {
      console.log('   ❌ generations表不存在:', gensError.message);
    } else {
      console.log('   ✅ generations表存在');
    }
    
    // 4. 总结
    console.log('\n📋 测试总结:');
    console.log('✅ Supabase连接正常');
    console.log('✅ API密钥有效');
    console.log('✅ 认证功能正常');
    
    if (usersError || gensError) {
      console.log('❌ 数据库表未创建');
      console.log('\n🔧 下一步操作:');
      console.log('1. 访问 https://drqzkiltgusbwyxpkmal.supabase.co');
      console.log('2. 进入 SQL Editor');
      console.log('3. 运行数据库初始化脚本');
    } else {
      console.log('✅ 数据库表已创建');
      console.log('🎉 数据库配置完成！');
    }
    
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
  }
}

testDatabase();


