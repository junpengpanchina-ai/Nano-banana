#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Supabase配置助手');
console.log('==================\n');

console.log('请按照以下步骤获取Supabase配置信息：');
console.log('1. 访问 https://supabase.com');
console.log('2. 创建新项目 "nano-banana"');
console.log('3. 在 Settings > API 中获取配置信息\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupSupabase() {
  try {
    const supabaseUrl = await askQuestion('请输入 Supabase Project URL: ');
    const supabaseKey = await askQuestion('请输入 Supabase Anon Key: ');
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ 配置信息不完整，请重试');
      process.exit(1);
    }
    
    // 创建 .env.local 文件
    const envContent = `# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}

# 其他配置
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Nano Banana
MASTER_API_KEY=demo-master-key-12345
ADMIN_KEY=demo-admin-key-12345
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
ENABLE_API_LOGGING=true
MAX_REQUEST_SIZE=10485760
`;
    
    fs.writeFileSync('.env.local', envContent);
    console.log('\n✅ .env.local 文件已创建');
    
    // 测试连接
    console.log('\n🔌 测试Supabase连接...');
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        console.log('❌ 数据库连接失败:', error.message);
        console.log('💡 请确保已运行数据库初始化脚本');
        return;
      }
      
      console.log('✅ 数据库连接成功');
      console.log('✅ Supabase配置完成！');
      console.log('\n🎉 现在可以访问 http://localhost:3001/login 测试登录功能');
      
    } catch (error) {
      console.log('❌ 连接测试失败:', error.message);
      console.log('💡 请检查配置信息是否正确');
    }
    
  } catch (error) {
    console.log('❌ 配置失败:', error.message);
  } finally {
    rl.close();
  }
}

setupSupabase();

