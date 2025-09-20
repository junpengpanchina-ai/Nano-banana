import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limiter';

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
        { status: 429 }
      );
    }

    // 3. 请求验证
    const body = await request.json();
    const { description, style, pose } = body;

    if (!description) {
      return NextResponse.json(
        { error: '描述词不能为空' },
        { status: 400 }
      );
    }

    // 4. 输入长度限制
    if (description.length > 500) {
      return NextResponse.json(
        { error: '描述词过长' },
        { status: 400 }
      );
    }

    // 模拟AI生成过程
    // 在实际项目中，这里会调用AI服务
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟生成结果
    const result = {
      id: Math.random().toString(36).substr(2, 9),
      url: `https://picsum.photos/400/400?random=${Math.random()}`,
      name: '生成的手办模型',
      description,
      style: style || 'anime',
      pose: pose || 'standing',
      createdAt: new Date().toISOString(),
      credits: 2
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('生成失败:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'AI生成API服务运行中' });
}
