#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 使用service role key来绕过RLS

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  try {
    console.log('🚀 创建测试用户...');
    console.log('邮箱: tset123qq.com');
    console.log('密码: 123123');
    
    // 1. 使用 Supabase Auth 创建用户
    console.log('\n1. 创建认证用户...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'tset123qq.com',
      password: '123123',
      email_confirm: true, // 直接确认邮箱
      user_metadata: {
        name: 'Test User'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️ 用户已存在，尝试登录...');
        
        // 尝试登录现有用户
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'tset123qq.com',
          password: '123123'
        });
        
        if (loginError) {
          console.log('❌ 登录失败:', loginError.message);
          return;
        }
        
        console.log('✅ 用户登录成功');
        authData = { user: loginData.user };
      } else {
        console.log('❌ 创建用户失败:', authError.message);
        return;
      }
    } else {
      console.log('✅ 认证用户创建成功');
    }

    // 2. 在 users 表中创建用户记录
    console.log('\n2. 创建用户记录...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: 'tset123qq.com',
        name: 'Test User',
        credits: 10, // 给测试用户10积分
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (userError) {
      console.log('❌ 创建用户记录失败:', userError.message);
      return;
    }

    console.log('✅ 用户记录创建成功');
    console.log('\n📋 用户信息:');
    console.log('ID:', userData.id);
    console.log('邮箱:', userData.email);
    console.log('姓名:', userData.name);
    console.log('积分:', userData.credits);
    console.log('创建时间:', userData.created_at);

    // 3. 测试登录功能
    console.log('\n3. 测试登录功能...');
    const { data: testLoginData, error: testLoginError } = await supabase.auth.signInWithPassword({
      email: 'tset123qq.com',
      password: '123123'
    });

    if (testLoginError) {
      console.log('❌ 登录测试失败:', testLoginError.message);
    } else {
      console.log('✅ 登录测试成功');
      console.log('用户ID:', testLoginData.user.id);
    }

    console.log('\n🎉 测试用户创建完成！');
    console.log('\n📝 现在可以使用以下信息登录:');
    console.log('邮箱: tset123qq.com');
    console.log('密码: 123123');
    console.log('\n🌐 访问 http://localhost:3000/login 进行测试');

  } catch (error) {
    console.log('❌ 创建用户失败:', error.message);
  }
}

createTestUser();
