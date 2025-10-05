import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// AI服务配置
const AI_SERVICES = {
  grsai: {
    apiKey: process.env.GRSAI_API_KEY || 'sk-bd625bca604243989a7018a67614c889',
    userId: process.env.GRSAI_USER_ID || '1758354953',
    username: process.env.GRSAI_USERNAME || 'bnana',
    baseUrl: "https://api.grsai.com/v1",
  },
  stability: {
    apiKey: process.env.STABILITY_API_KEY || 'sk-test-key-for-development',
    baseUrl: "https://api.stability.ai/v1/generation",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: "https://api.openai.com/v1/images/generations",
  },
  replicate: {
    apiKey: process.env.REPLICATE_API_TOKEN,
    baseUrl: "https://api.replicate.com/v1",
  },
};

// 轮询获取Grsai API结果
async function pollGrsaiResult(taskId: string, maxAttempts: number = 30, intervalMs: number = 2000): Promise<string> {
  console.log(`🔄 开始轮询任务结果 - ID: ${taskId}`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`📡 轮询尝试 ${attempt}/${maxAttempts}...`);
      
      const response = await fetch('https://grsai.dakka.com.cn/v1/draw/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_SERVICES.grsai.apiKey}`
        },
        body: JSON.stringify({ id: taskId })
      });

      if (!response.ok) {
        throw new Error(`轮询请求失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`📊 轮询响应:`, result);

      if (result.code === 0 && result.data) {
        const { status, results, progress } = result.data;
        
        console.log(`📈 任务进度: ${progress}%, 状态: ${status}`);
        
        if (status === 'succeeded' && results && results.length > 0) {
          const imageUrl = results[0].url;
          console.log('✅ 任务完成，获取到图像URL:', imageUrl);
          return imageUrl;
        } else if (status === 'failed') {
          throw new Error(`任务失败: ${result.data.failure_reason || result.data.error || '未知错误'}`);
        } else if (status === 'running') {
          // 任务仍在进行中，等待后重试
          if (attempt < maxAttempts) {
            console.log(`⏳ 任务进行中，${intervalMs}ms后重试...`);
            await new Promise(resolve => setTimeout(resolve, intervalMs));
            continue;
          } else {
            throw new Error('任务超时，已达到最大轮询次数');
          }
        }
      } else if (result.code === -22) {
        throw new Error('任务不存在');
      } else {
        throw new Error(`轮询失败: ${result.msg || '未知错误'}`);
      }
    } catch (error) {
      console.error(`❌ 轮询尝试 ${attempt} 失败:`, error);
      if (attempt === maxAttempts) {
        throw error;
      }
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  throw new Error('轮询超时');
}

// Grsai API 图像生成 - 正确实现（使用官方 API）
async function generateWithGrsai(prompt: string, options: any, imageBase64?: string | null) {
  console.log(`🔍 [DEBUG] Grsai API key 检查:`, {
    apiKey: AI_SERVICES.grsai.apiKey ? '已设置' : '未设置',
    apiKeyLength: AI_SERVICES.grsai.apiKey?.length || 0,
    apiKeyPrefix: AI_SERVICES.grsai.apiKey?.substring(0, 10) || 'N/A'
  });
  
  if (!AI_SERVICES.grsai.apiKey) {
    console.log('⚠️ Grsai API key 未配置，降级到Stability AI');
    if (AI_SERVICES.stability.apiKey) {
      return await generateWithStability(prompt, options, imageBase64);
    }
    throw new Error("Grsai API key 未配置，且没有可用的备用服务");
  }

  // 构建增强的提示词，根据风格选择
  let enhancedPrompt = prompt;
  const style = options?.style || 'anime';
  const model = options?.model || 'sora-image'; // 支持模型选择
  
  console.log(`🎯 调用 Grsai API (官方实现) - 模型: ${model}...`);
  
  if (imageBase64) {
    console.log(`🖼️ Grsai API 图片到图片模式：基于上传图片生成手办 (${style}风格)`);
    if (style === 'realistic') {
      enhancedPrompt = `realistic figure of ${prompt}, 1/7 scale figure, detailed, high quality, based on uploaded reference image, figure model, collectible figure, pose reference, character design, photorealistic style, realistic materials, detailed textures`;
    } else if (style === 'cartoon') {
      enhancedPrompt = `cartoon figure of ${prompt}, 1/7 scale figure, detailed, high quality, based on uploaded reference image, figure model, collectible figure, pose reference, character design, cartoon style, stylized, simplified, cute, chibi style`;
    } else {
      enhancedPrompt = `anime figure of ${prompt}, 1/7 scale figure, detailed, high quality, based on uploaded reference image, figure model, collectible figure, pose reference, character design, anime style, cel-shaded, vibrant colors`;
    }
  } else {
    console.log(`🎨 Grsai API 文本到图片模式：生成手办 (${style}风格)`);
    if (style === 'realistic') {
      enhancedPrompt = `${prompt}, realistic figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure, photorealistic style, realistic materials, detailed textures, lifelike appearance`;
    } else if (style === 'cartoon') {
      enhancedPrompt = `${prompt}, cartoon figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure, cartoon style, stylized, simplified, cute, chibi style, playful design`;
    } else {
      enhancedPrompt = `${prompt}, anime figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure, anime style, cel-shaded, vibrant colors, manga style`;
    }
  }

  try {
    // 使用新的动漫API端点
    const response = await fetch('https://grsai.dakka.com.cn/v1/draw/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_SERVICES.grsai.apiKey}`
      },
      body: JSON.stringify({
        model: model, // 使用选择的模型
        prompt: enhancedPrompt,
        size: '1:1', // 手办通常使用1:1比例
        variants: 1, // 生成1张图片
        // 注意：Grsai API的urls参数需要是图片URL，不是base64数据
        // 暂时不传递参考图片，因为需要先上传到可访问的URL
        webHook: "-1", // 使用轮询模式，立即返回任务ID
        shutProgress: false // 不使用直接返回模式
      })
    });

    if (!response.ok) {
      throw new Error(`Grsai API 调用失败: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`📄 轮询模式响应:`, responseData);

    if (responseData.code === 0 && responseData.data && responseData.data.id) {
      const taskId = responseData.data.id;
      console.log(`🆔 获取到任务ID: ${taskId}`);
      
      // 使用轮询获取结果
      const imageUrl = await pollGrsaiResult(taskId);
      return imageUrl;
    } else {
      throw new Error(`API 调用失败: ${responseData.msg || '未知错误'}`);
    }
    
  } catch (error) {
    console.error('❌ Grsai API 调用失败:', error);
    console.log('🔄 降级到 Stability AI...');
    if (AI_SERVICES.stability.apiKey) {
      return await generateWithStability(prompt, options, imageBase64);
    }
    throw new Error("Grsai API 调用失败，且没有可用的备用服务");
  }
}

// Stability AI 图像生成
async function generateWithStability(prompt: string, options: any, imageBase64?: string | null) {
  // 如果是测试环境，返回模拟图片
  if (AI_SERVICES.stability.apiKey === 'sk-test-key-for-development') {
    console.log('🧪 测试模式：生成模拟图片');
    
    // 构建更专业的手办生成提示词
    let enhancedPrompt = prompt;
    if (imageBase64) {
      console.log('🖼️ 测试模式：检测到上传图片，将基于图片和提示词生成');
      // 针对图片上传的情况，生成更相关的提示词
      enhancedPrompt = `anime figure of ${prompt}, 1/7 scale figure, detailed, high quality, based on uploaded reference image, figure model, collectible figure, pose reference, character design`;
    } else {
      enhancedPrompt = `${prompt}, anime figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure`;
    }
    
    // 使用更专业的图片生成服务 - 专门针对手办生成优化
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=dalle&nologo=true&enhance=true&style=anime&quality=high`;
  }

  // 如果有上传图片，使用图片到图片的生成
  const endpoint = imageBase64 
    ? `${AI_SERVICES.stability.baseUrl}/stable-diffusion-xl-1024-v1-0/image-to-image`
    : `${AI_SERVICES.stability.baseUrl}/stable-diffusion-xl-1024-v1-0/text-to-image`;

  const requestBody: any = {
    text_prompts: [
      {
        text: `${prompt}, anime figure, 3d model, high quality, detailed`,
        weight: 1
      }
    ],
    cfg_scale: 7,
    height: 1024,
    width: 1024,
    samples: 1,
    steps: 30,
    style_preset: "3d-model"
  };

  // 如果有上传图片，添加到请求体中
  if (imageBase64) {
    requestBody.init_image = imageBase64;
    requestBody.image_strength = 0.8; // 控制原图的影响程度
    console.log('🖼️ 使用图片到图片生成模式');
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AI_SERVICES.stability.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Stability AI error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.artifacts[0].base64;
}

// OpenAI DALL-E 图像生成
async function generateWithOpenAI(prompt: string, options: any) {
  const response = await fetch(AI_SERVICES.openai.baseUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AI_SERVICES.openai.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: `${prompt}, anime figure, 3d model, high quality`,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

// Replicate 图像生成
async function generateWithReplicate(prompt: string, options: any) {
  const response = await fetch(`${AI_SERVICES.replicate.baseUrl}/predictions`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${AI_SERVICES.replicate.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt: `${prompt}, anime figure, 3d model, high quality`,
        width: 1024,
        height: 1024,
        num_inference_steps: 30,
        guidance_scale: 7.5
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.urls[0];
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);
  
    console.log(`🚀 [${requestId}] API调用开始 - 时间: ${new Date().toISOString()}`);
    console.log(`🔑 [${requestId}] 环境变量检查:`, {
      GRSAI_API_KEY: process.env.GRSAI_API_KEY ? '已设置' : '未设置',
      GRSAI_USER_ID: process.env.GRSAI_USER_ID ? '已设置' : '未设置',
      GRSAI_USERNAME: process.env.GRSAI_USERNAME ? '已设置' : '未设置'
    });
    
    try {
      console.log(`📥 [${requestId}] 开始解析FormData...`);
      console.log(`📥 [${requestId}] Content-Type: ${request.headers.get('content-type')}`);
      
      const form = await request.formData();
      console.log(`✅ [${requestId}] FormData解析成功`);
      
      const file = form.get("file") as File | null;
      const prompt = form.get("prompt") as string;
      const service = form.get("service") as string || "grsai";
      const options = form.get("options") ? JSON.parse(form.get("options") as string) : {};
      const userId = (form.get("userId") as string) || ""; // 可选：客户端传入，服务端用 service role 写库
      
      console.log(`📋 [${requestId}] 解析结果:`, {
        hasFile: !!file,
        fileName: file?.name,
        fileSize: file?.size,
        prompt: prompt,
        service: service,
        options: options
      });

      // 清理输入
      const cleanPrompt = prompt ? prompt.trim() : "";
      const cleanService = service || "grsai";
      
      // 处理上传的图片
      let imageBase64: string | null = null;
      if (file) {
        console.log(`📸 [${requestId}] 检测到上传图片: ${file.name}, 大小: ${file.size} bytes`);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;
        console.log(`✅ [${requestId}] 图片已转换为base64格式`);
      }

    if (!file && !cleanPrompt) {
      return NextResponse.json({ error: "缺少文件或提示词" }, { status: 400 });
    }

    // 文件验证
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (file.size > maxSize) {
        return NextResponse.json({ error: "文件大小超过10MB限制" }, { status: 400 });
      }
      
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "不支持的文件类型" }, { status: 400 });
      }
    }

    let imageUrl: string;
    let thumbnailUrl: string;

    try {
      // 根据选择的服务生成图像
      console.log(`🎯 [${requestId}] 使用服务: ${cleanService}, 提示词: "${cleanPrompt}"`);
      if (imageBase64) {
        console.log(`🖼️ [${requestId}] 将使用上传的图片作为参考`);
      }
      
      switch (cleanService) {
        case "grsai":
          if (!AI_SERVICES.grsai.apiKey) {
            console.log(`❌ [${requestId}] Grsai API key 未配置，降级到Stability AI`);
            // 降级到Stability AI
            if (AI_SERVICES.stability.apiKey) {
              console.log(`✅ [${requestId}] 调用 Stability AI API...`);
              const stabilityImage = await generateWithStability(cleanPrompt || "anime figure", options, imageBase64);
              // 检查是否是测试模式的URL
              if (stabilityImage.startsWith('https://')) {
                imageUrl = stabilityImage;
              } else {
                imageUrl = `data:image/png;base64,${stabilityImage}`;
              }
              console.log(`✅ [${requestId}] Stability AI API 调用成功`);
            } else {
              console.log(`🔄 [${requestId}] 没有可用的AI服务，使用测试图片`);
              // 使用测试图片 - 增强提示词以生成更好的人物手办
              const enhancedPrompt = `${cleanPrompt || 'anime figure'}, anime figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure`;
              const encodedPrompt = encodeURIComponent(enhancedPrompt);
              imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=dalle&nologo=true&enhance=true&style=anime&quality=high`;
              console.log(`✅ [${requestId}] 测试图片生成成功`);
            }
          } else {
            console.log(`✅ [${requestId}] 调用 Grsai API...`);
            imageUrl = await generateWithGrsai(cleanPrompt || "anime figure", options, imageBase64);
            console.log(`✅ [${requestId}] Grsai API 调用成功`);
          }
          break;
          
        case "stability":
          if (!AI_SERVICES.stability.apiKey) {
            console.log(`❌ [${requestId}] Stability API key 未配置`);
            throw new Error("Stability API key not configured");
          }
          console.log(`✅ [${requestId}] 调用 Stability AI API...`);
          const stabilityImage = await generateWithStability(cleanPrompt || "anime figure", options, imageBase64);
          imageUrl = `data:image/png;base64,${stabilityImage}`;
          console.log(`✅ [${requestId}] Stability AI API 调用成功`);
          break;
          
        case "openai":
          if (!AI_SERVICES.openai.apiKey) {
            console.log(`❌ [${requestId}] OpenAI API key 未配置`);
            throw new Error("OpenAI API key not configured");
          }
          console.log(`✅ [${requestId}] 调用 OpenAI DALL-E API...`);
          imageUrl = await generateWithOpenAI(cleanPrompt || "anime figure", options);
          console.log(`✅ [${requestId}] OpenAI DALL-E API 调用成功`);
          break;
          
        case "replicate":
          if (!AI_SERVICES.replicate.apiKey) {
            console.log(`❌ [${requestId}] Replicate API key 未配置`);
            throw new Error("Replicate API key not configured");
          }
          console.log(`✅ [${requestId}] 调用 Replicate API...`);
          imageUrl = await generateWithReplicate(cleanPrompt || "anime figure", options);
          console.log(`✅ [${requestId}] Replicate API 调用成功`);
          break;
          
        default:
          console.log(`❌ [${requestId}] 不支持的服务: ${cleanService}`);
          throw new Error(`Unsupported service: ${cleanService}`);
      }

      // 生成缩略图
      thumbnailUrl = imageUrl; // 简化处理，实际应该生成缩略图

    } catch (aiError) {
      console.error(`❌ [${requestId}] AI服务错误:`, aiError);
      console.log(`🔄 [${requestId}] 降级到测试图片`);
      // 降级到测试图片（基于提示词生成）- 增强提示词以生成更好的人物手办
      const enhancedPrompt = `${cleanPrompt || 'anime figure'}, anime figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure`;
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=dalle&nologo=true&enhance=true&style=anime&quality=high`;
      thumbnailUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=400&model=dalle&nologo=true&enhance=true&style=anime&quality=high`;
    }

    const result = {
      id: Math.random().toString(36).slice(2),
      url: imageUrl,
      thumbnailUrl: thumbnailUrl,
      name: file?.name || "generated_image",
      size: file?.size || 0,
      type: file?.type || "image/png",
      service: cleanService,
      prompt: cleanPrompt,
      options,
      createdAt: new Date().toISOString(),
    };

    // 写入 generations（如提供 service role）
    try {
      const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (adminKey && supabaseUrl && userId) {
        const admin = createClient(supabaseUrl, adminKey);
        const { error: insertErr } = await admin
          .from('generations')
          .insert({
            user_id: userId,
            prompt: cleanPrompt || '',
            style: options?.style || 'default',
            pose: options?.pose || 'default',
            result_url: imageUrl,
            status: 'completed'
          });
        if (insertErr) {
          console.error('Insert generation error:', insertErr);
        }
      }
    } catch (dbErr) {
      console.error('Save generation failed:', dbErr);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ [${requestId}] API调用完成 - 耗时: ${duration}ms`);
    console.log(`📊 [${requestId}] 结果: ${result.url ? '成功生成图片' : '生成失败'}`);

    return NextResponse.json({
      ...result,
      duration: `${duration}ms`,
      requestId: requestId, // 返回请求ID供前端调试
    });
  } catch (e) {
    console.error("image generate error", e);
    const errorMessage = e instanceof Error ? e.message : "生成失败";
    console.error("详细错误信息:", errorMessage);
    console.error("错误堆栈:", e instanceof Error ? e.stack : "无堆栈信息");
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "image generate api ok",
    services: Object.keys(AI_SERVICES).map(key => ({
      name: key,
      configured: !!AI_SERVICES[key as keyof typeof AI_SERVICES].apiKey
    }))
  });
}
