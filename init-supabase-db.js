#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🚀 Supabase数据库初始化助手');
console.log('============================\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ 请先配置Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStatus() {
  try {
    console.log('🔍 检查数据库状态...\n');
    
    // 检查users表
    console.log('1. 检查users表...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.log('   ❌ users表不存在:', usersError.message);
    } else {
      console.log('   ✅ users表已存在');
    }
    
    // 检查generations表
    console.log('\n2. 检查generations表...');
    const { data: gensData, error: gensError } = await supabase
      .from('generations')
      .select('count')
      .limit(1);
    
    if (gensError) {
      console.log('   ❌ generations表不存在:', gensError.message);
    } else {
      console.log('   ✅ generations表已存在');
    }
    
    // 总结
    console.log('\n📋 检查结果:');
    if (usersError || gensError) {
      console.log('❌ 数据库表未创建');
      console.log('\n🔧 请按照以下步骤操作：');
      console.log('1. 访问 https://drqzkiltgusbwyxpkmal.supabase.co');
      console.log('2. 登录到你的项目');
      console.log('3. 点击左侧菜单的 "SQL Editor"');
      console.log('4. 点击 "New query"');
      console.log('5. 复制并粘贴以下SQL脚本：\n');
      
      console.log('```sql');
      console.log('-- 创建users表');
      console.log('CREATE TABLE IF NOT EXISTS users (');
      console.log('  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),');
      console.log('  email VARCHAR(255) UNIQUE NOT NULL,');
      console.log('  name VARCHAR(255) NOT NULL,');
      console.log('  credits INTEGER DEFAULT 5,');
      console.log('  avatar_url TEXT,');
      console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
      console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
      console.log(');');
      console.log('');
      console.log('-- 创建generations表');
      console.log('CREATE TABLE IF NOT EXISTS generations (');
      console.log('  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),');
      console.log('  user_id UUID REFERENCES users(id) ON DELETE CASCADE,');
      console.log('  prompt TEXT NOT NULL,');
      console.log('  style VARCHAR(100) NOT NULL,');
      console.log('  pose VARCHAR(100) NOT NULL,');
      console.log('  result_url TEXT,');
      console.log('  status VARCHAR(20) DEFAULT \'pending\',');
      console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
      console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
      console.log(');');
      console.log('');
      console.log('-- 创建索引');
      console.log('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
      console.log('CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);');
      console.log('CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at);');
      console.log('');
      console.log('-- 插入测试数据');
      console.log('INSERT INTO users (id, email, name, credits) VALUES');
      console.log('  (\'00000000-0000-0000-0000-000000000001\', \'demo@example.com\', \'演示用户\', 10),');
      console.log('  (\'00000000-0000-0000-0000-000000000002\', \'test@example.com\', \'测试用户\', 5)');
      console.log('ON CONFLICT (email) DO NOTHING;');
      console.log('```');
      console.log('');
      console.log('6. 点击 "Run" 按钮执行脚本');
      console.log('7. 等待执行完成');
      console.log('8. 再次运行此脚本验证结果');
      
    } else {
      console.log('✅ 数据库表已创建');
      console.log('🎉 数据库配置完成！');
      console.log('\n📝 下一步：');
      console.log('1. 配置认证设置');
      console.log('2. 测试应用功能');
    }
    
  } catch (error) {
    console.log('❌ 检查失败:', error.message);
  }
}

checkDatabaseStatus();

