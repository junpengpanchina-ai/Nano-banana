import { NextRequest, NextResponse } from 'next/server';
import { lemonSqueezyService } from '@/lib/lemon-squeezy';
import { SupabaseAuthService } from '@/lib/supabase-auth';

export async function POST(request: NextRequest) {
  try {
    // 获取请求体和签名
    const body = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // 验证签名
    if (!lemonSqueezyService.verifyWebhookSignature(body, signature)) {
      console.error('Invalid Lemon Squeezy webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 解析事件数据
    const event = JSON.parse(body) as any;
    console.log('Lemon Squeezy webhook received:', event.type);

    // 处理事件
    const result = await lemonSqueezyService.handleWebhookEvent(event);

    if (!result.success) {
      console.error('Webhook processing failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // 如果成功处理且包含用户信息，更新用户积分
    if (result.userId && result.credits) {
      try {
        // 这里应该调用你的积分更新服务
        // 由于我们使用 Supabase，这里需要根据你的用户表结构来更新
        console.log(`Updating user ${result.userId} with ${result.credits} credits`);
        
        // 示例：更新用户积分（需要根据你的数据库结构调整）
        // await updateUserCredits(result.userId, result.credits);
        
      } catch (error) {
        console.error('Failed to update user credits:', error);
        // 即使积分更新失败，也返回成功，避免重复处理
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 处理 GET 请求（用于测试）
export async function GET() {
  return NextResponse.json({
    message: 'Lemon Squeezy webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
