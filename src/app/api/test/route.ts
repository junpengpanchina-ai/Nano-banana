import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    const lemonApiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const lemonJwt = process.env.LEMON_SQUEEZY_JWT_TOKEN;
    const payoneerApiKey = process.env.PAYONEER_API_KEY;
    const payoneerSecret = process.env.PAYONEER_API_SECRET;
    
    return NextResponse.json({
      success: true,
      message: 'API 测试成功',
      timestamp: new Date().toISOString(),
      environment: {
        lemonSqueezy: {
          apiKey: lemonApiKey ? '已配置' : '未配置',
          jwtToken: lemonJwt ? '已配置' : '未配置',
          storeId: process.env.NEXT_PUBLIC_LEMON_STORE || '未配置',
          checkoutUrl: process.env.NEXT_PUBLIC_LEMON_CHECKOUT_URL || '未配置'
        },
        payoneer: {
          apiKey: payoneerApiKey ? '已配置' : '未配置',
          secret: payoneerSecret ? '已配置' : '未配置'
        }
      }
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
