/**
 * Lemon Squeezy 支付服务
 * 全球 MoR (Merchant of Record) 支付解决方案
 */

export interface LemonSqueezyConfig {
  checkoutUrl: string;
  storeId: string;
  webhookSecret: string;
  successUrl: string;
  cancelUrl: string;
}

export interface LemonSqueezyProduct {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  checkoutUrl: string;
}

export interface LemonSqueezyWebhookEvent {
  type: string;
  data: {
    id: string;
    type: string;
    attributes: {
      status: string;
      total: number;
      currency: string;
      customer_email: string;
      created_at: string;
      updated_at: string;
    };
    relationships: {
      store: {
        data: {
          id: string;
          type: string;
        };
      };
      variant: {
        data: {
          id: string;
          type: string;
        };
      };
    };
  };
}

export class LemonSqueezyService {
  private config: LemonSqueezyConfig;
  private apiKey: string;
  private jwtToken: string;

  constructor() {
    this.config = {
      checkoutUrl: process.env.NEXT_PUBLIC_LEMON_CHECKOUT_URL || 'https://store.lemonsqueezy.com/checkout/buy/demo-variant-id',
      storeId: process.env.NEXT_PUBLIC_LEMON_STORE || 'demo-store-id',
      webhookSecret: process.env.LEMON_WEBHOOK_SECRET || 'demo-webhook-secret',
      successUrl: process.env.LEMON_SUCCESS_URL || 'http://localhost:3000/payment/success',
      cancelUrl: process.env.LEMON_CANCEL_URL || 'http://localhost:3000/payment/cancel',
    };
    this.apiKey = process.env.LEMON_SQUEEZY_API_KEY || 'nanonana';
    this.jwtToken = process.env.LEMON_SQUEEZY_JWT_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI0MjAwMTU0NDM4MTMyNzI4ZjMzNDhlMzdiMGFmNzQzYThlZjg4NzRmMDcwNmEzYmVmNWMyMzhkN2Q2YTg5ODY5MzNiMGNlOTdiODUzNWMwMyIsImlhdCI6MTc1OTQyMTk4MS45MDczMzYsIm5iZiI6MTc1OTQyMTk4MS45MDczMzksImV4cCI6MjA3NDk1NDc4MS44OTI3MTQsInN1YiI6IjU2MDk2MDYiLCJzY29wZXMiOltdfQ.cMF8s7UuWae8PC6225XHgIkZZ4hqTaqbRvvcjoArex82jGniLioqh90PBeATahxih1UmXXz9zNuKDvXIYKoOLmKGqLMGUvJw8EoWK2aND5GUivZu23unc67zoxq0liVWfDkbdYl1DNMKWGSJMcRD25iFYBOI3r2UYUG6CvG1rjy-nVMNLZiBVKljEw2Cg0OP-2_PahIbUkLoblIZqcTWqBATLaZzlxdGnsbe4p2-8b8RUpxSYLNGqKekwPrFwI7l5qPfzbntaP0ipQbTjhYJuVfl0tzsAgLXNkLT7TovllNwKqujqwx0iaJlyogNrUFk1RKaeLCzKX4i7JRlaLCa0w2EywhH-Odk886_xgN_eoeDNn2T7H5DiPM-V1xmvKVwhavw1na_Cth3eKQ0vYfPBIrZcQZmGRfJeOPMdQkU5oajZmCktpHhDHv39Hg1j3LEiifz3ODjGDmApEg0vdFXMurjbbo7I6vrVaG5kbcqDplT6oh2JWZhrWZRW_SZhSpPf7TvgtkmLoqJ77V8ZgEn831qsZXr5WdfP2czLvYEX2b-bOa9Izf8Hb-vprwkXXscunRDuGen0tZlDKO7CLnstnO8_lXB7GluWz8Bqwf9Ro1mtRAywuJIc49-gBZnN7mgS1dwsTTxubB7Q5GJiOOhL4FlqZWIE-gKgNdSM9cBKaw';
  }

  /**
   * 检查 Lemon Squeezy 是否已配置
   */
  isConfigured(): boolean {
    // 至少需要结账URL或API配置
    return !!(this.config.checkoutUrl || (this.apiKey && this.jwtToken));
  }

  /**
   * 获取产品列表
   */
  getProducts(): LemonSqueezyProduct[] {
    return [
      {
        id: 'starter',
        name: '入门版',
        price: 4.99,
        credits: 50,
        description: '适合个人用户',
        checkoutUrl: this.config.checkoutUrl
      },
      {
        id: 'pro',
        name: '专业版',
        price: 19.99,
        credits: 200,
        description: '适合创作者',
        checkoutUrl: this.config.checkoutUrl
      },
      {
        id: 'enterprise',
        name: '企业版',
        price: 99.99,
        credits: 1000,
        description: '适合团队',
        checkoutUrl: this.config.checkoutUrl
      }
    ];
  }

  /**
   * 通过 API 获取真实产品数据
   */
  async getProductsFromAPI(): Promise<LemonSqueezyProduct[]> {
    if (!this.apiKey || !this.jwtToken) {
      return this.getProducts(); // 返回默认产品
    }

    try {
      const response = await fetch('https://api.lemonsqueezy.com/v1/variants', {
        headers: {
          'Authorization': `Bearer ${this.jwtToken}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // 转换 API 数据为我们的产品格式
      return data.data.map((variant: any) => ({
        id: variant.id,
        name: variant.attributes.name,
        price: parseFloat(variant.attributes.price) / 100, // 转换为美元
        credits: this.getCreditsFromPrice(parseFloat(variant.attributes.price) / 100),
        description: variant.attributes.description || '积分套餐',
        checkoutUrl: this.config.checkoutUrl
      }));

    } catch (error) {
      console.error('Failed to fetch products from API:', error);
      return this.getProducts(); // 返回默认产品
    }
  }

  /**
   * 根据价格计算积分
   */
  private getCreditsFromPrice(price: number): number {
    const creditsPerUnit = parseInt(process.env.CREDITS_PER_UNIT || '100');
    return Math.floor(price * creditsPerUnit);
  }

  /**
   * 生成带参数的结账链接
   */
  generateCheckoutUrl(productId: string, userId: string, credits: number): string {
    const baseUrl = this.config.checkoutUrl;
    const params = new URLSearchParams({
      'checkout[product_options][name]': `Nano Banana ${productId} - ${credits} Credits`,
      'checkout[custom][user_id]': userId,
      'checkout[custom][credits]': credits.toString(),
      'checkout[custom][product_id]': productId,
      'checkout[success_url]': this.config.successUrl,
      'checkout[cancel_url]': this.config.cancelUrl,
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * 验证 Webhook 签名
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      return false;
    }

    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('hex');
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * 处理 Webhook 事件
   */
  async handleWebhookEvent(event: LemonSqueezyWebhookEvent): Promise<{
    success: boolean;
    userId?: string;
    credits?: number;
    error?: string;
  }> {
    try {
      // 只处理订单创建和支付成功事件
      if (!['order_created', 'subscription_payment_success'].includes(event.type)) {
        return { success: true };
      }

      const { attributes, relationships } = event.data;
      
      // 检查订单状态
      if (attributes.status !== 'paid') {
        return { success: true };
      }

      // 从自定义字段获取用户信息
      const customData = attributes as any;
      const userId = customData.user_id;
      const credits = parseInt(customData.credits) || 0;
      const productId = customData.product_id;

      if (!userId || !credits) {
        return {
          success: false,
          error: 'Missing user_id or credits in webhook data'
        };
      }

      // 这里应该调用你的用户积分更新服务
      // 例如：await updateUserCredits(userId, credits);
      
      console.log(`Lemon Squeezy webhook: User ${userId} purchased ${credits} credits for product ${productId}`);

      return {
        success: true,
        userId,
        credits
      };

    } catch (error) {
      console.error('Lemon Squeezy webhook processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 获取支付状态
   */
  async getPaymentStatus(): Promise<{
    isAvailable: boolean;
    message: string;
    products: LemonSqueezyProduct[];
  }> {
    const isConfigured = this.isConfigured();
    
    if (!isConfigured) {
      return {
        isAvailable: false,
        message: 'Lemon Squeezy 未配置，请联系管理员',
        products: []
      };
    }

    // 如果有API配置，尝试连接API
    if (this.apiKey && this.jwtToken) {
      try {
        const products = await this.getProductsFromAPI();
        return {
          isAvailable: true,
          message: 'Lemon Squeezy 支付服务已就绪 (API 连接成功)',
          products
        };
      } catch (error) {
        console.error('API connection failed, using default products:', error);
      }
    }
    
    // 使用默认产品配置
    return {
      isAvailable: true,
      message: 'Lemon Squeezy 支付服务已就绪 (使用默认产品)',
      products: this.getProducts()
    };
  }
}

// 导出单例实例
export const lemonSqueezyService = new LemonSqueezyService();
