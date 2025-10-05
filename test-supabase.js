// Supabase连接测试脚本
// 运行: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 检查环境变量...');
console.log('Supabase URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置');
console.log('Supabase Key:', supabaseKey ? '✅ 已设置' : '❌ 未设置');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ 请先配置 .env.local 文件');
  console.log('参考 ENV_SETUP.md 文件进行配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔌 测试Supabase连接...');
    
    // 测试数据库连接
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ 数据库连接失败:', error.message);
      return false;
    }
    
    console.log('✅ 数据库连接成功');
    
    // 测试认证功能
    console.log('\n🔐 测试认证功能...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ 认证测试失败:', authError.message);
      return false;
    }
    
    console.log('✅ 认证功能正常');
    console.log('✅ Supabase配置完成！');
    
    return true;
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 现在可以访问 http://localhost:3000/login 测试登录功能');
  } else {
    console.log('\n💡 请检查Supabase配置并重试');
  }
});













