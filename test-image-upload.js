const fs = require('fs');
const FormData = require('form-data');

// 创建一个简单的测试图片（1x1像素的PNG）
const createTestImage = () => {
  // 这是一个1x1像素的PNG图片的base64数据
  const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  return pngData;
};

async function testImageUpload() {
  console.log('🧪 开始测试图片上传功能...');
  
  try {
    // 创建测试图片
    const testImage = createTestImage();
    fs.writeFileSync('test-image.png', testImage);
    console.log('✅ 创建测试图片: test-image.png');
    
    // 创建FormData
    const form = new FormData();
    form.append('prompt', 'beautiful woman, anime figure, based on uploaded image');
    form.append('service', 'grsai');
    form.append('options', JSON.stringify({
      style: 'anime',
      pose: 'standing'
    }));
    form.append('file', testImage, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    console.log('📤 发送请求到API...');
    
    // 发送请求
    const response = await fetch('http://localhost:3000/api/generate/image', {
      method: 'POST',
      body: form,
      headers: form.getHeaders() // 设置正确的Content-Type
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API请求失败:', response.status);
      console.error('错误详情:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ API响应成功:');
    console.log('  - 图片URL:', result.url);
    console.log('  - 提示词:', result.prompt);
    console.log('  - 服务:', result.service);
    console.log('  - 请求ID:', result.id);
    
    // 清理测试文件
    fs.unlinkSync('test-image.png');
    console.log('🧹 清理测试文件完成');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 检查是否安装了form-data
try {
  require('form-data');
  testImageUpload();
} catch (error) {
  console.log('📦 安装form-data依赖...');
  const { exec } = require('child_process');
  exec('npm install form-data', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ 安装失败:', err);
      return;
    }
    console.log('✅ 依赖安装完成');
    testImageUpload();
  });
}
