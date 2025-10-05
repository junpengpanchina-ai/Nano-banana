// 测试三种风格：动漫、写实、卡通
const testThreeStyles = async () => {
  console.log('🎨 测试三种风格：动漫、写实、卡通...');
  console.log('');

  const styles = [
    { name: '动漫风格', value: 'anime' },
    { name: '写实风格', value: 'realistic' },
    { name: '卡通风格', value: 'cartoon' }
  ];

  for (const style of styles) {
    try {
      console.log(`\n🔍 测试: ${style.name}`);
      console.log(`📝 风格值: ${style.value}`);
      
      // 创建 FormData
      const formData = new FormData();
      formData.append('prompt', 'cute magical girl character');
      formData.append('service', 'grsai');
      formData.append('options', JSON.stringify({
        style: style.value,
        pose: 'standing'
      }));

      console.log('📤 发送请求...');
      
      const response = await fetch('http://localhost:3000/api/generate/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test_master_key_123'
        },
        body: formData
      });

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API 调用成功!');
        
        if (data.url) {
          console.log(`🖼️ 生成的图像 URL: ${data.url}`);
        } else {
          console.log('⚠️ 未返回图像 URL');
        }
      } else {
        const errorData = await response.json();
        console.log('❌ API 调用失败:', errorData);
      }
    } catch (error) {
      console.log(`❌ 测试异常: ${error.message}`);
    }
  }

  console.log('\n📊 三种风格测试完成！');
  console.log('💡 请检查生成的图像是否体现了不同的风格特点');
};

// 运行测试
testThreeStyles();
