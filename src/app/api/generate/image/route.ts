import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limiter";

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

// Grsai API 图像生成
async function generateWithGrsai(prompt: string, options: any) {
  const response = await fetch(`${AI_SERVICES.grsai.baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AI_SERVICES.grsai.apiKey}`,
      "Content-Type": "application/json",
      "X-User-ID": AI_SERVICES.grsai.userId || "",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: `${prompt}, anime figure, 3d model, high quality, detailed`,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid",
      user: AI_SERVICES.grsai.username
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Grsai API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.data[0].url;
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
  try {
    // 1. API密钥验证
    const authResult = validateApiKey(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { error: "Unauthorized", message: authResult.error },
        { status: 401 }
      );
    }

    // 2. 频率限制检查
    const rateLimitResult = checkRateLimit(request, authResult.userId);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded", 
          message: rateLimitResult.error,
          remaining: rateLimitResult.remaining,
          resetTime: new Date(rateLimitResult.resetTime).toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // 3. 请求验证
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const prompt = form.get("prompt") as string;
    const service = form.get("service") as string || "grsai";
    const options = form.get("options") ? JSON.parse(form.get("options") as string) : {};

    // 4. 输入验证
    if (!file && !prompt) {
      return NextResponse.json({ error: "缺少文件或提示词" }, { status: 400 });
    }

    // 5. 服务白名单验证
    const allowedServices = ['grsai', 'stability', 'openai', 'replicate'];
    if (!allowedServices.includes(service)) {
      return NextResponse.json({ error: "不支持的服务" }, { status: 400 });
    }

    // 6. 提示词长度限制
    if (prompt && prompt.length > 1000) {
      return NextResponse.json({ error: "提示词过长" }, { status: 400 });
    }

    let imageUrl: string;
    let thumbnailUrl: string;

    try {
      // 根据选择的服务生成图像
      switch (service) {
        case "grsai":
          if (!AI_SERVICES.grsai.apiKey) {
            throw new Error("Grsai API key not configured");
          }
          imageUrl = await generateWithGrsai(prompt || "anime figure", options);
          break;
          
        case "stability":
          if (!AI_SERVICES.stability.apiKey) {
            throw new Error("Stability API key not configured");
          }
          const stabilityImage = await generateWithStability(prompt || "anime figure", options);
          imageUrl = `data:image/png;base64,${stabilityImage}`;
          break;
          
        case "openai":
          if (!AI_SERVICES.openai.apiKey) {
            throw new Error("OpenAI API key not configured");
          }
          imageUrl = await generateWithOpenAI(prompt || "anime figure", options);
          break;
          
        case "replicate":
          if (!AI_SERVICES.replicate.apiKey) {
            throw new Error("Replicate API key not configured");
          }
          imageUrl = await generateWithReplicate(prompt || "anime figure", options);
          break;
          
        default:
          throw new Error(`Unsupported service: ${service}`);
      }

      // 生成缩略图
      thumbnailUrl = imageUrl; // 简化处理，实际应该生成缩略图

    } catch (aiError) {
      console.error("AI service error:", aiError);
      // 记录错误但不暴露敏感信息
      const errorId = Math.random().toString(36).substring(2, 15);
      console.error(`Error ID: ${errorId}`, {
        userId: authResult.userId,
        service,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { 
          error: "AI服务暂时不可用", 
          errorId,
          message: "请稍后重试或联系管理员"
        }, 
        { status: 503 }
      );
    }

    const result = {
      id: Math.random().toString(36).slice(2),
      url: imageUrl,
      thumbnailUrl: thumbnailUrl,
      name: file?.name || "generated_image",
      size: file?.size || 0,
      type: file?.type || "image/png",
      service: service,
      prompt: prompt,
      options,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("image generate error", e);
    return NextResponse.json({ 
      error: "服务器内部错误", 
      message: "请稍后重试" 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "API服务运行中",
    version: "1.0.0",
    status: "healthy"
  });
}



