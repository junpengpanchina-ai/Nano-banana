import { NextRequest, NextResponse } from 'next/server';
import { createAlipayPayment, queryAlipayPayment, verifyAlipayCallback } from '@/lib/alipay-payment';

// 创建支付宝支付订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { outTradeNo, totalAmount, subject, returnUrl, notifyUrl } = body;

    // 验证必需参数
    if (!outTradeNo || !totalAmount || !subject) {
      return NextResponse.json({
        success: false,
        error: '缺少必需参数：outTradeNo, totalAmount, subject'
      }, { status: 400 });
    }

    // 验证金额
    if (totalAmount <= 0) {
      return NextResponse.json({
        success: false,
        error: '支付金额必须大于0'
      }, { status: 400 });
    }

    // 创建支付订单
    const result = await createAlipayPayment(
      outTradeNo,
      totalAmount,
      subject,
      returnUrl,
      notifyUrl
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          paymentUrl: result.paymentUrl,
          outTradeNo: result.outTradeNo,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('创建支付宝支付订单失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 });
  }
}

// 查询支付结果
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const outTradeNo = searchParams.get('outTradeNo');

    if (!outTradeNo) {
      return NextResponse.json({
        success: false,
        error: '缺少参数：outTradeNo'
      }, { status: 400 });
    }

    // 查询支付结果
    const result = await queryAlipayPayment(outTradeNo);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          outTradeNo: result.outTradeNo,
          tradeNo: result.tradeNo,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('查询支付宝支付结果失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 });
  }
}






