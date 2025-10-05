// 扩展测试Grsai API轮询功能
const testGrsaiPollingExtended = async () => {
  console.log('🔄 扩展测试Grsai API轮询功能...');
  console.log('');

  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  const prompt = 'cute magical girl character, anime figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure, anime style, cel-shaded, vibrant colors, manga style';

  try {
    console.log('📤 发送Grsai API请求...');
    console.log(`📝 提示词: ${prompt}`);
    
    const startTime = Date.now();
    
    // 第一步：提交任务
    const response = await fetch('https://grsai.dakka.com.cn/v1/draw/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'sora-image',
        prompt: prompt,
        size: '1:1',
        variants: 1,
        webHook: "-1", // 使用轮询模式
        shutProgress: false
      })
    });

    console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API调用失败:', errorText);
      return;
    }

    const responseData = await response.json();
    console.log('📄 初始响应:', responseData);

    if (responseData.code === 0 && responseData.data && responseData.data.id) {
      const taskId = responseData.data.id;
      console.log(`🆔 获取到任务ID: ${taskId}`);
      
      // 第二步：轮询结果 - 增加轮询次数和间隔
      console.log('🔄 开始轮询结果...');
      
      for (let attempt = 1; attempt <= 30; attempt++) {
        const attemptStartTime = Date.now();
        console.log(`📡 轮询尝试 ${attempt}/30...`);
        
        const pollResponse = await fetch('https://grsai.dakka.com.cn/v1/draw/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ id: taskId })
        });

        if (!pollResponse.ok) {
          console.log(`❌ 轮询请求失败: ${pollResponse.status} ${pollResponse.statusText}`);
          continue;
        }

        const pollData = await pollResponse.json();
        const attemptDuration = Date.now() - attemptStartTime;
        const totalDuration = Date.now() - startTime;
        
        console.log(`📊 轮询响应 (${attemptDuration}ms, 总计${Math.round(totalDuration/1000)}s):`, pollData);

        if (pollData.code === 0 && pollData.data) {
          const { status, results, progress } = pollData.data;
          console.log(`📈 任务进度: ${progress}%, 状态: ${status}`);
          
          if (status === 'succeeded' && results && results.length > 0) {
            const imageUrl = results[0].url;
            console.log('✅ 任务完成！');
            console.log(`🖼️ 图像URL: ${imageUrl}`);
            console.log(`⏱️ 总耗时: ${Math.round(totalDuration/1000)}秒`);
            return;
          } else if (status === 'failed') {
            console.log(`❌ 任务失败: ${pollData.data.failure_reason || pollData.data.error || '未知错误'}`);
            return;
          } else if (status === 'running') {
            console.log('⏳ 任务进行中，等待3秒后重试...');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        } else {
          console.log(`❌ 轮询失败: ${pollData.msg || '未知错误'}`);
        }
      }
      
      console.log('⏰ 轮询超时');
    } else {
      console.log('❌ 未获取到任务ID');
    }
  } catch (error) {
    console.log(`❌ 测试异常: ${error.message}`);
  }
};

// 运行测试
testGrsaiPollingExtended();
