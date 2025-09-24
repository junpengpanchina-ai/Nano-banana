import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// AI服务配置
const AI_SERVICES = {
  grsai: {
    apiKey: process.env.GRSAI_API_KEY,
    userId: process.env.GRSAI_USER_ID,
    username: process.env.GRSAI_USERNAME,
    baseUrl: "https://api.grsai.com/v1",
  },
  stability: {
    apiKey: process.env.STABILITY_API_KEY,
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

// Grsai API 图像生成 (临时降级到Stability AI)
async function generateWithGrsai(prompt: string, options: any) {
  console.log('⚠️ Grsai API暂时不可用，降级到Stability AI');
  
  // 临时降级到Stability AI
  if (AI_SERVICES.stability.apiKey) {
    return await generateWithStability(prompt, options);
  }
  
  // 如果Stability AI也不可用，使用占位图
  throw new Error("Grsai API暂时不可用，且没有可用的备用服务");
}

// Stability AI 图像生成
async function generateWithStability(prompt: string, options: any) {
  const response = await fetch(`${AI_SERVICES.stability.baseUrl}/stable-diffusion-xl-1024-v1-0/text-to-image`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AI_SERVICES.stability.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
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
  
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const prompt = form.get("prompt") as string;
    const service = form.get("service") as string || "grsai";
    const options = form.get("options") ? JSON.parse(form.get("options") as string) : {};
    const userId = (form.get("userId") as string) || ""; // 可选：客户端传入，服务端用 service role 写库

    // 清理输入
    const cleanPrompt = prompt ? prompt.trim() : "";
    const cleanService = service || "grsai";

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
      switch (cleanService) {
        case "grsai":
          if (!AI_SERVICES.grsai.apiKey) {
            throw new Error("Grsai API key not configured");
          }
          imageUrl = await generateWithGrsai(cleanPrompt || "anime figure", options);
          break;
          
        case "stability":
          if (!AI_SERVICES.stability.apiKey) {
            throw new Error("Stability API key not configured");
          }
          const stabilityImage = await generateWithStability(cleanPrompt || "anime figure", options);
          imageUrl = `data:image/png;base64,${stabilityImage}`;
          break;
          
        case "openai":
          if (!AI_SERVICES.openai.apiKey) {
            throw new Error("OpenAI API key not configured");
          }
          imageUrl = await generateWithOpenAI(cleanPrompt || "anime figure", options);
          break;
          
        case "replicate":
          if (!AI_SERVICES.replicate.apiKey) {
            throw new Error("Replicate API key not configured");
          }
          imageUrl = await generateWithReplicate(cleanPrompt || "anime figure", options);
          break;
          
        default:
          throw new Error(`Unsupported service: ${cleanService}`);
      }

      // 生成缩略图
      thumbnailUrl = imageUrl; // 简化处理，实际应该生成缩略图

    } catch (aiError) {
      console.error("AI service error:", aiError);
      // 降级到占位图
      imageUrl = `https://picsum.photos/seed/${Date.now()}/512/512`;
      thumbnailUrl = `https://picsum.photos/seed/${Date.now() + 1}/400/400`;
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

    return NextResponse.json(result);
  } catch (e) {
    console.error("image generate error", e);
    const errorMessage = e instanceof Error ? e.message : "生成失败";
    return NextResponse.json({ error: "生成失败" }, { status: 500 });
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
