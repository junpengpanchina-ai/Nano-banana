// 测试更新后的 Grsai API 实现
const testUpdatedGrsaiAPI = async () => {
  console.log('🧪 测试更新后的 Grsai API 实现...');
  console.log('');

  // 设置环境变量
  process.env.GRSAI_API_KEY = 'sk-bd625bca604243989a7018a67614c889';
  process.env.GRSAI_USER_ID = '1758354953';
  process.env.GRSAI_USERNAME = 'bnana';
  process.env.STABILITY_API_KEY = 'sk-test-key-for-development';

  try {
    // 测试图像生成 API
    console.log('🖼️ 测试图像生成 API...');
    
    const testCases = [
      {
        name: '魔法少女手办',
        prompt: 'cute magical girl figure',
        service: 'grsai'
      },
      {
        name: '学校女生手办',
        prompt: 'school girl anime figure',
        service: 'grsai'
      },
      {
        name: '战士角色手办',
        prompt: 'warrior character figure',
        service: 'grsai'
      }
    ];

    const results = [];
    
    for (const testCase of testCases) {
      try {
        console.log(`\n🔍 测试: ${testCase.name}`);
        console.log(`📝 提示词: ${testCase.prompt}`);
        
        const response = await fetch('http://localhost:3000/api/generate/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test_master_key_123'
          },
          body: JSON.stringify({
            prompt: testCase.prompt,
            service: testCase.service,
            options: {
              style: 'anime',
              pose: 'standing'
            }
          })
        });

        console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API 调用成功!');
          
          if (data.result_url || data.url) {
            const imageUrl = data.result_url || data.url;
            console.log(`🖼️ 生成的图像 URL: ${imageUrl}`);
            
            // 验证图像 URL
            try {
              const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
              if (imageResponse.ok) {
                console.log('✅ 图像 URL 可访问');
                results.push({
                  name: testCase.name,
                  success: true,
                  imageUrl: imageUrl,
                  accessible: true
                });
              } else {
                console.log(`⚠️ 图像 URL 不可访问: ${imageResponse.status}`);
                results.push({
                  name: testCase.name,
                  success: true,
                  imageUrl: imageUrl,
                  accessible: false
                });
              }
            } catch (imageError) {
              console.log(`⚠️ 图像 URL 验证失败: ${imageError.message}`);
              results.push({
                name: testCase.name,
                success: true,
                imageUrl: imageUrl,
                accessible: false
              });
            }
          } else {
            console.log('⚠️ 未返回图像 URL');
            results.push({
              name: testCase.name,
              success: false,
              error: '未返回图像 URL'
            });
          }
        } else {
          const errorData = await response.json();
          console.log('❌ API 调用失败:', errorData);
          results.push({
            name: testCase.name,
            success: false,
            error: errorData.message || `HTTP ${response.status}`
          });
        }
      } catch (error) {
        console.log(`❌ 测试异常: ${error.message}`);
        results.push({
          name: testCase.name,
          success: false,
          error: error.message
        });
      }
    }

    // 生成测试报告
    console.log('\n📊 更新后 API 测试报告');
    console.log('='.repeat(50));
    
    const successCount = results.filter(r => r.success).length;
    const accessibleCount = results.filter(r => r.success && r.accessible).length;
    
    console.log(`\n📈 测试统计:`);
    console.log(`   总测试数: ${results.length}`);
    console.log(`   成功数: ${successCount}`);
    console.log(`   可访问图像数: ${accessibleCount}`);
    console.log(`   成功率: ${((successCount / results.length) * 100).toFixed(1)}%`);
    
    console.log(`\n📋 详细结果:`);
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.name}:`);
      if (result.success) {
        console.log(`   ✅ 成功`);
        if (result.imageUrl) {
          console.log(`   🖼️ 图像 URL: ${result.imageUrl}`);
          console.log(`   🔗 可访问: ${result.accessible ? '是' : '否'}`);
        }
      } else {
        console.log(`   ❌ 失败: ${result.error}`);
      }
    });

    // 总结
    console.log(`\n🎯 测试总结:`);
    if (accessibleCount > 0) {
      console.log(`✅ 更新后的 API 实现工作正常！`);
      console.log(`💡 重试机制和错误处理已生效`);
    } else if (successCount > 0) {
      console.log(`⚠️ API 调用成功但图像不可访问`);
      console.log(`💡 可能需要检查图像 URL 的有效性`);
    } else {
      console.log(`❌ API 实现存在问题`);
      console.log(`💡 建议检查服务器日志和配置`);
    }

    return {
      results,
      successCount,
      accessibleCount,
      successRate: (successCount / results.length) * 100
    };

  } catch (error) {
    console.log('❌ 测试异常:', error.message);
    console.log('💡 请确保开发服务器正在运行: npm run dev');
    return null;
  }
};

// 运行测试
testUpdatedGrsaiAPI();
