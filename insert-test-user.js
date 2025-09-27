#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTestUser() {
  try {
    console.log('🚀 插入测试用户到数据库...');
    console.log('邮箱: tset123qq.com');
    console.log('密码: 123123');
    
    // 生成一个UUID作为用户ID
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    
    // 直接插入到users表
    console.log('\n1. 插入用户记录...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: 'tset123qq.com',
        name: 'Test User',
        credits: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (userError) {
      console.log('❌ 插入用户记录失败:', userError.message);
      return;
    }

    console.log('✅ 用户记录插入成功');
    console.log('\n📋 用户信息:');
    console.log('ID:', userData.id);
    console.log('邮箱:', userData.email);
    console.log('姓名:', userData.name);
    console.log('积分:', userData.credits);
    console.log('创建时间:', userData.created_at);

    // 查询验证
    console.log('\n2. 验证用户是否存在...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'tset123qq.com')
      .single();

    if (verifyError) {
      console.log('❌ 验证失败:', verifyError.message);
    } else {
      console.log('✅ 用户验证成功');
      console.log('找到用户:', verifyData.name);
    }

    console.log('\n🎉 测试用户插入完成！');
    console.log('\n📝 用户信息:');
    console.log('邮箱: tset123qq.com');
    console.log('密码: 123123');
    console.log('积分: 10');
    console.log('\n⚠️ 注意: 这个用户没有认证信息，只能通过应用注册流程创建完整用户');

  } catch (error) {
    console.log('❌ 插入用户失败:', error.message);
  }
}

insertTestUser();
