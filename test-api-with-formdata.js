// 使用 FormData 测试 API
const testApiWithFormData = async () => {
  console.log('🧪 使用 FormData 测试 API...');
  
  try {
    // 创建 FormData
    const formData = new FormData();
    formData.append('prompt', 'cute anime girl figure');
    formData.append('service', 'grsai');
    formData.append('options', JSON.stringify({
      style: 'anime',
      pose: 'standing'
    }));

    console.log('📤 发送 FormData 请求...');
    
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
      console.log('📊 响应数据:', JSON.stringify(data, null, 2));
      
      if (data.result_url || data.url) {
        const imageUrl = data.result_url || data.url;
        console.log(`🖼️ 生成的图像 URL: ${imageUrl}`);
        
        // 验证图像 URL
        try {
          const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
          if (imageResponse.ok) {
            console.log('✅ 图像 URL 可访问');
            console.log(`📊 图像类型: ${imageResponse.headers.get('content-type')}`);
            console.log(`📊 图像大小: ${imageResponse.headers.get('content-length') ? (parseInt(imageResponse.headers.get('content-length')) / 1024).toFixed(2) + ' KB' : '未知'}`);
          } else {
            console.log(`⚠️ 图像 URL 不可访问: ${imageResponse.status}`);
          }
        } catch (imageError) {
          console.log(`⚠️ 图像验证失败: ${imageError.message}`);
        }
      } else {
        console.log('⚠️ 未返回图像 URL');
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API 调用失败:', errorData);
    }
  } catch (error) {
    console.log('❌ 测试异常:', error.message);
  }
};

// 运行测试
testApiWithFormData();
