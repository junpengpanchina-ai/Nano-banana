import { getDatabase } from './mongodb'
import { Payment } from './models'
import { getNumberEnv } from './utils'
import { incrementUserCredits } from './mongodb-auth'

const CREDITS_PER_UNIT = getNumberEnv('CREDITS_PER_UNIT', 100)

export async function recordLemonPaymentIdempotent(opts: {
  userId: string
  amountCents: number
  identifier?: string | null
  providerOrderId?: string | number | null
  currency?: string
  raw?: any
}) {
  const db = await getDatabase()
  const now = new Date()
  const payments = db.collection('payments')

  if (opts.identifier) {
    const existing = await payments.findOne({ identifier: opts.identifier })
    if (existing) return existing as Payment
  }

  const doc: Payment = {
    provider: 'lemonsqueezy',
    provider_order_id: opts.providerOrderId?.toString(),
    identifier: opts.identifier || undefined,
    user_id: opts.userId,
    amount_cents: Math.max(0, Math.floor(opts.amountCents || 0)),
    currency: opts.currency || 'USD',
    status: 'paid',
    raw: opts.raw,
    created_at: now,
    updated_at: now
  }

  try {
    await payments.insertOne(doc as any)
  } catch (e: any) {
    // Unique conflict on identifier: fetch and continue
    if (opts.identifier) {
      const again = await payments.findOne({ identifier: opts.identifier })
      if (again) return again as Payment
    }
    throw e
  }

  const credits = Math.floor((doc.amount_cents / 100) * CREDITS_PER_UNIT)
  if (credits > 0) {
    await incrementUserCredits(doc.user_id, credits)
  }

  return doc
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'alipay' | 'wechat';
  supportedRegions: string[];
  supportedCurrencies: string[];
  supportedMethods: PaymentMethod[];
  isAvailable: boolean;
  config: GatewayConfig;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank' | 'crypto';
  icon: string;
  description: string;
}

export interface GatewayConfig {
  publicKey?: string;
  clientId?: string;
  merchantId?: string;
  endpoint?: string;
  currency: string;
  locale: string;
}

// 支付网关配置
export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'stripe',
    supportedRegions: ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SG', 'JP', 'AU', 'NZ'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'SGD', 'CHF', 'SEK', 'NOK', 'DKK'],
    supportedMethods: [
      {
        id: 'card',
        name: '信用卡/借记卡',
        type: 'card',
        icon: 'CreditCard',
        description: 'Visa, MasterCard, American Express'
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        type: 'wallet',
        icon: 'Smartphone',
        description: '使用Apple设备快速支付'
      },
      {
        id: 'google_pay',
        name: 'Google Pay',
        type: 'wallet',
        icon: 'Smartphone',
        description: '使用Google账户快速支付'
      }
    ],
    isAvailable: true,
    config: {
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      currency: 'USD',
      locale: 'en'
    }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    supportedRegions: ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'AU', 'JP', 'SG', 'CN'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'SGD', 'CHF', 'SEK', 'NOK', 'DKK', 'CNY'],
    supportedMethods: [
      {
        id: 'paypal_account',
        name: 'PayPal账户',
        type: 'wallet',
        icon: 'Users',
        description: '使用PayPal账户支付'
      },
      {
        id: 'paypal_card',
        name: '信用卡',
        type: 'card',
        icon: 'CreditCard',
        description: '使用信用卡通过PayPal支付'
      }
    ],
    isAvailable: true,
    config: {
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      currency: 'USD',
      locale: 'en'
    }
  },
  {
    id: 'alipay',
    name: '支付宝',
    type: 'alipay',
    supportedRegions: ['CN', 'HK', 'TW', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN'],
    supportedCurrencies: ['CNY', 'USD', 'HKD', 'SGD', 'MYR', 'THB', 'IDR', 'PHP', 'VND'],
    supportedMethods: [
      {
        id: 'alipay_qr',
        name: '支付宝扫码',
        type: 'wallet',
        icon: 'QrCode',
        description: '使用支付宝扫码支付'
      },
      {
        id: 'alipay_app',
        name: '支付宝APP',
        type: 'wallet',
        icon: 'Smartphone',
        description: '使用支付宝APP支付'
      }
    ],
    isAvailable: true,
    config: {
      merchantId: process.env.NEXT_PUBLIC_ALIPAY_MERCHANT_ID || '',
      currency: 'CNY',
      locale: 'zh-CN'
    }
  }
];

// 根据用户地区获取可用的支付网关
export function getAvailableGateways(userRegion: string): PaymentGateway[] {
  return PAYMENT_GATEWAYS.filter(gateway => 
    gateway.isAvailable && 
    (gateway.supportedRegions.includes(userRegion) || gateway.supportedRegions.includes('US'))
  );
}

// 根据用户地区推荐支付方式
export function getRecommendedPaymentMethods(userRegion: string): PaymentMethod[] {
  const gateways = getAvailableGateways(userRegion);
  const methods: PaymentMethod[] = [];
  
  // 根据地区偏好排序
  switch (userRegion) {
    case 'CN':
      // 中国用户：支付宝优先
      const alipayGateway = gateways.find(g => g.type === 'alipay');
      if (alipayGateway) {
        methods.push(...alipayGateway.supportedMethods);
      }
      // 然后是其他方式
      gateways.filter(g => g.type !== 'alipay').forEach(gateway => {
        methods.push(...gateway.supportedMethods);
      });
      break;
      
    case 'US':
    case 'CA':
      // 北美用户：Stripe优先
      const stripeGateway = gateways.find(g => g.type === 'stripe');
      if (stripeGateway) {
        methods.push(...stripeGateway.supportedMethods);
      }
      gateways.filter(g => g.type !== 'stripe').forEach(gateway => {
        methods.push(...gateway.supportedMethods);
      });
      break;
      
    default:
      // 其他地区：按网关优先级
      gateways.forEach(gateway => {
        methods.push(...gateway.supportedMethods);
      });
  }
  
  return methods;
}

// 检测用户地区
export function detectUserRegion(): string {
  if (typeof window === 'undefined') return 'US';
  
  // 从浏览器语言检测
  const language = navigator.language || navigator.languages[0];
  const country = language.split('-')[1] || language.split('_')[1];
  
  // 从时区检测
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // 简单的地区映射
  if (language.includes('zh') || timezone.includes('Asia/Shanghai')) return 'CN';
  if (country === 'US' || country === 'CA') return country;
  if (country === 'GB') return 'GB';
  if (['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT'].includes(country)) return country;
  
  return 'US'; // 默认美国
}

// 获取支付网关的费率信息
export function getGatewayFees(gatewayId: string): {
  domestic: string;
  international: string;
  currencyConversion?: string;
} {
  const fees = {
    stripe: {
      domestic: '2.9% + $0.30 (US), 1.4% + €0.25 (EU)',
      international: '+1.5% for international cards',
      currencyConversion: '1% currency conversion fee'
    },
    paypal: {
      domestic: '2.9% + $0.30',
      international: '4.4% + fixed fee',
      currencyConversion: '2.5% currency conversion fee'
    },
    alipay: {
      domestic: '0.6% (China)',
      international: '0.6% - 1.0%',
      currencyConversion: 'Included'
    }
  };
  
  return fees[gatewayId as keyof typeof fees] || fees.stripe;
}

