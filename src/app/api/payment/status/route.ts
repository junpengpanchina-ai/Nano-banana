import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 检查支付服务状态
    const paymentServiceStatus = {
      isAvailable: false, // 支付服务暂未开通
      message: '支付服务正在开发中，请联系客服进行人工充值',
      contactInfo: {
        wechat: 'nano_banana_service',
        email: 'support@nano-banana.com',
        phone: '400-123-4567'
      },
      supportedMethods: [
        {
          id: 'alipay',
          name: '支付宝',
          available: false,
          message: '暂未开通'
        },
        {
          id: 'wechat',
          name: '微信支付',
          available: false,
          message: '暂未开通'
        },
        {
          id: 'bank',
          name: '银行卡',
          available: false,
          message: '暂未开通'
        }
      ],
      estimatedLaunch: '2024年第一季度'
    };

    return NextResponse.json({
      success: true,
      data: paymentServiceStatus
    });

  } catch (error) {
    console.error('检查支付服务状态失败:', error);
    return NextResponse.json({
      success: false,
      error: '检查支付服务状态失败'
    }, { status: 500 });
  }
}









