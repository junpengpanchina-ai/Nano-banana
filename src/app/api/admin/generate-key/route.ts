import { NextRequest, NextResponse } from 'next/server';
import { generateApiKey } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 简单的管理员验证（生产环境应该使用更安全的认证）
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, maxRequests = 100 } = body;

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const apiKey = generateApiKey(userId, maxRequests);

    return NextResponse.json({
      success: true,
      apiKey,
      userId,
      maxRequests,
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Generate API key error:', error);
    return NextResponse.json(
      { error: '生成API密钥失败' },
      { status: 500 }
    );
  }
}
