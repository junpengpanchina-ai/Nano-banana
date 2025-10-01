// 支付宝支付集成
// 基于支付宝开放平台 Web 支付接口

import { AlipaySdk } from 'alipay-sdk';
import crypto from 'crypto';

// 支付宝配置接口
export interface AlipayConfig {
  appId: string;
  privateKey: string;
  alipayPublicKey: string;
  gateway: string;
  charset: string;
  signType: string;
  version: string;
}

// 支付请求参数
export interface PaymentRequest {
  outTradeNo: string;        // 商户订单号
  totalAmount: number;       // 订单总金额
  subject: string;           // 订单标题
  body?: string;            // 订单描述
  timeoutExpress?: string;   // 超时时间
  productCode?: string;      // 产品码
  returnUrl?: string;        // 同步回调地址
  notifyUrl?: string;        // 异步回调地址
}

// 支付响应
export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  outTradeNo?: string;
  tradeNo?: string;
  error?: string;
}

// 支付宝支付服务类
export class AlipayPaymentService {
  private config: AlipayConfig;
  private alipaySdk: AlipaySdk;

  constructor(config: AlipayConfig) {
    this.config = config;
    this.alipaySdk = new AlipaySdk({
      appId: config.appId,
      privateKey: config.privateKey,
      alipayPublicKey: config.alipayPublicKey,
      gateway: config.gateway,
      charset: config.charset,
      signType: config.signType,
      version: config.version,
    });
  }

  /**
   * 创建支付订单
   * @param paymentRequest 支付请求参数
   * @returns 支付响应
   */
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const {
        outTradeNo,
        totalAmount,
        subject,
        body,
        timeoutExpress = '30m',
        productCode = 'FAST_INSTANT_TRADE_PAY',
        returnUrl,
        notifyUrl
      } = paymentRequest;

      // 构建支付参数
      const bizContent = {
        out_trade_no: outTradeNo,
        total_amount: totalAmount.toFixed(2),
        subject: subject,
        body: body || subject,
        timeout_express: timeoutExpress,
        product_code: productCode,
      };

      // 构建请求参数
      const params = {
        app_id: this.config.appId,
        method: 'alipay.trade.page.pay',
        charset: this.config.charset,
        sign_type: this.config.signType,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        version: this.config.version,
        notify_url: notifyUrl,
        return_url: returnUrl,
        biz_content: JSON.stringify(bizContent),
      };

      // 生成签名
      const sign = this.generateSign(params);
      params.sign = sign;

      // 构建支付URL
      const paymentUrl = this.buildPaymentUrl(params);

      return {
        success: true,
        paymentUrl,
        outTradeNo,
      };

    } catch (error) {
      console.error('创建支付订单失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建支付订单失败',
      };
    }
  }

  /**
   * 查询支付结果
   * @param outTradeNo 商户订单号
   * @returns 查询结果
   */
  async queryPayment(outTradeNo: string): Promise<PaymentResponse> {
    try {
      const bizContent = {
        out_trade_no: outTradeNo,
      };

      const params = {
        app_id: this.config.appId,
        method: 'alipay.trade.query',
        charset: this.config.charset,
        sign_type: this.config.signType,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        version: this.config.version,
        biz_content: JSON.stringify(bizContent),
      };

      const sign = this.generateSign(params);
      params.sign = sign;

      const response = await this.alipaySdk.exec('alipay.trade.query', {
        bizContent: bizContent,
      });

      if (response.code === '10000') {
        return {
          success: true,
          outTradeNo: response.out_trade_no,
          tradeNo: response.trade_no,
        };
      } else {
        return {
          success: false,
          error: response.msg || '查询支付结果失败',
        };
      }

    } catch (error) {
      console.error('查询支付结果失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '查询支付结果失败',
      };
    }
  }

  /**
   * 验证支付回调
   * @param callbackParams 回调参数
   * @returns 验证结果
   */
  verifyCallback(callbackParams: Record<string, string>): boolean {
    try {
      const { sign, ...params } = callbackParams;
      const signStr = this.buildSignString(params);
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(signStr, 'utf8');
      return verify.verify(this.config.alipayPublicKey, sign, 'base64');
    } catch (error) {
      console.error('验证支付回调失败:', error);
      return false;
    }
  }

  /**
   * 生成签名
   * @param params 请求参数
   * @returns 签名
   */
  private generateSign(params: Record<string, string>): string {
    const signStr = this.buildSignString(params);
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signStr, 'utf8');
    return sign.sign(this.config.privateKey, 'base64');
  }

  /**
   * 构建签名字符串
   * @param params 请求参数
   * @returns 签名字符串
   */
  private buildSignString(params: Record<string, string>): string {
    const sortedKeys = Object.keys(params).sort();
    const signStr = sortedKeys
      .filter(key => params[key] && key !== 'sign')
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return signStr;
  }

  /**
   * 构建支付URL
   * @param params 请求参数
   * @returns 支付URL
   */
  private buildPaymentUrl(params: Record<string, string>): string {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    return `${this.config.gateway}?${queryString}`;
  }
}

// 默认配置
export const defaultAlipayConfig: AlipayConfig = {
  appId: process.env.ALIPAY_APP_ID || '',
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
  gateway: process.env.ALIPAY_GATEWAY_URL || 'https://openapi.alipay.com/gateway.do',
  charset: 'utf-8',
  signType: 'RSA2',
  version: '1.0',
};

// 创建支付服务实例
export const alipayService = new AlipayPaymentService(defaultAlipayConfig);

// 使用示例
export async function createAlipayPayment(
  outTradeNo: string,
  totalAmount: number,
  subject: string,
  returnUrl?: string,
  notifyUrl?: string
): Promise<PaymentResponse> {
  return alipayService.createPayment({
    outTradeNo,
    totalAmount,
    subject,
    returnUrl,
    notifyUrl,
  });
}

// 查询支付结果
export async function queryAlipayPayment(outTradeNo: string): Promise<PaymentResponse> {
  return alipayService.queryPayment(outTradeNo);
}

// 验证支付回调
export function verifyAlipayCallback(callbackParams: Record<string, string>): boolean {
  return alipayService.verifyCallback(callbackParams);
}






