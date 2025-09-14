import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, style, pose } = body;

    if (!description) {
      return NextResponse.json(
        { error: '描述词不能为空' },
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
