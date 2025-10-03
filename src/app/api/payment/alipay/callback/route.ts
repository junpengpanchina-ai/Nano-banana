import { NextRequest, NextResponse } from 'next/server';
import { verifyAlipayCallback } from '@/lib/alipay-payment';

// 支付宝支付回调处理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const callbackParams = body;

    // 验证回调签名
    const isValid = verifyAlipayCallback(callbackParams);

    if (!isValid) {
      console.error('支付宝回调签名验证失败:', callbackParams);
      return NextResponse.json({
        success: false,
        error: '签名验证失败'
      }, { status: 400 });
    }

    // 处理支付结果
    const { out_trade_no, trade_no, trade_status, total_amount } = callbackParams;

    console.log('支付宝支付回调:', {
      outTradeNo: out_trade_no,
      tradeNo: trade_no,
      tradeStatus: trade_status,
      totalAmount: total_amount,
    });

    // 根据支付状态处理业务逻辑
    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      // 支付成功，更新订单状态
      await handlePaymentSuccess(out_trade_no, trade_no, total_amount);
      
      return NextResponse.json({
        success: true,
        message: '支付成功'
      });
    } else if (trade_status === 'TRADE_CLOSED') {
      // 支付关闭
      await handlePaymentClosed(out_trade_no);
      
      return NextResponse.json({
        success: true,
        message: '支付已关闭'
      });
    } else {
      // 其他状态
      console.log('支付状态:', trade_status);
      
      return NextResponse.json({
        success: true,
        message: '支付状态更新'
      });
    }

  } catch (error) {
    console.error('处理支付宝回调失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 });
  }
}

// 处理支付成功
async function handlePaymentSuccess(outTradeNo: string, tradeNo: string, totalAmount: string) {
  try {
    // 这里应该更新数据库中的订单状态
    // 例如：更新用户积分、订单状态等
    
    console.log('支付成功处理:', {
      outTradeNo,
      tradeNo,
      totalAmount: parseFloat(totalAmount),
    });

    // TODO: 实现具体的业务逻辑
    // 1. 更新订单状态为已支付
    // 2. 增加用户积分
    // 3. 发送支付成功通知
    // 4. 记录支付日志

  } catch (error) {
    console.error('处理支付成功失败:', error);
    throw error;
  }
}

// 处理支付关闭
async function handlePaymentClosed(outTradeNo: string) {
  try {
    // 这里应该更新数据库中的订单状态
    // 例如：将订单标记为已关闭
    
    console.log('支付关闭处理:', { outTradeNo });

    // TODO: 实现具体的业务逻辑
    // 1. 更新订单状态为已关闭
    // 2. 释放库存
    // 3. 发送支付关闭通知

  } catch (error) {
    console.error('处理支付关闭失败:', error);
    throw error;
  }
}









