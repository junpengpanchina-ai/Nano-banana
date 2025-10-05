#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🚀 数据库初始化助手');
console.log('==================\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ 请先配置Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initDatabase() {
  try {
    console.log('📋 准备创建数据库表...\n');
    
    // 检查当前用户权限
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ 认证失败:', authError.message);
      console.log('💡 请确保API密钥正确');
      return;
    }
    
    console.log('✅ 认证成功');
    
    // 尝试创建用户记录（如果表存在）
    console.log('\n🔍 检查数据库表状态...');
    
    try {
      // 尝试查询users表
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (usersError) {
        console.log('❌ users表不存在:', usersError.message);
        console.log('\n📝 需要手动创建数据库表');
        console.log('请按照以下步骤操作：');
        console.log('1. 访问 https://drqzkiltgusbwyxpkmal.supabase.co');
        console.log('2. 进入 SQL Editor');
        console.log('3. 运行以下SQL脚本：\n');
        
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
        console.log('-- 插入测试数据');
        console.log('INSERT INTO users (id, email, name, credits) VALUES');
        console.log('  (\'00000000-0000-0000-0000-000000000001\', \'demo@example.com\', \'演示用户\', 10),');
        console.log('  (\'00000000-0000-0000-0000-000000000002\', \'test@example.com\', \'测试用户\', 5)');
        console.log('ON CONFLICT (email) DO NOTHING;');
        console.log('```');
        
      } else {
        console.log('✅ users表已存在');
        
        // 检查generations表
        const { data: gensData, error: gensError } = await supabase
          .from('generations')
          .select('count')
          .limit(1);
        
        if (gensError) {
          console.log('❌ generations表不存在');
        } else {
          console.log('✅ generations表已存在');
          console.log('🎉 数据库表已创建完成！');
        }
      }
      
    } catch (error) {
      console.log('❌ 检查失败:', error.message);
    }
    
  } catch (error) {
    console.log('❌ 初始化失败:', error.message);
  }
}

initDatabase();














