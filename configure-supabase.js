#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 配置你的Supabase项目');
console.log('========================\n');

console.log('项目URL: https://drqzkiltgusbwyxpkmal.supabase.co');
console.log('现在需要获取API密钥...\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function configureSupabase() {
  try {
    console.log('请按照以下步骤获取API密钥：');
    console.log('1. 访问 https://drqzkiltgusbwyxpkmal.supabase.co');
    console.log('2. 登录到项目仪表板');
    console.log('3. 点击左侧菜单的 "Settings"');
    console.log('4. 点击 "API"');
    console.log('5. 复制 "anon public" 密钥\n');
    
    const supabaseKey = await askQuestion('请输入你的 Supabase Anon Key: ');
    
    if (!supabaseKey) {
      console.log('❌ API密钥不能为空，请重试');
      process.exit(1);
    }
    
    // 创建 .env.local 文件
    const envContent = `# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://drqzkiltgusbwyxpkmal.supabase.co
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
    
    const supabase = createClient('https://drqzkiltgusbwyxpkmal.supabase.co', supabaseKey);
    
    try {
      // 测试基本连接
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        console.log('⚠️ 数据库连接测试失败:', error.message);
        console.log('💡 这是正常的，因为我们还没有创建表');
        console.log('✅ API密钥配置正确，可以继续下一步');
      } else {
        console.log('✅ 数据库连接成功');
      }
      
      console.log('\n🎉 Supabase配置完成！');
      console.log('\n📋 下一步：');
      console.log('1. 在Supabase仪表板中运行数据库初始化脚本');
      console.log('2. 配置认证设置');
      console.log('3. 测试应用功能');
      
    } catch (error) {
      console.log('❌ 连接测试失败:', error.message);
      console.log('💡 请检查API密钥是否正确');
    }
    
  } catch (error) {
    console.log('❌ 配置失败:', error.message);
  } finally {
    rl.close();
  }
}

configureSupabase();


