/**
 * Payoneer 集成服务
 * 用于查询账户信息、交易记录等
 */

export interface PayoneerConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}

export interface PayoneerAccount {
  id: string;
  name: string;
  email: string;
  status: string;
  balance: {
    currency: string;
    amount: number;
  };
  bankAccounts: Array<{
    id: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: string;
  }>;
}

export interface PayoneerTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  date: string;
  type: 'credit' | 'debit';
}

export class PayoneerService {
  private config: PayoneerConfig;

  constructor() {
    this.config = {
      apiKey: process.env.PAYONEER_API_KEY || '',
      apiSecret: process.env.PAYONEER_API_SECRET || '',
      baseUrl: 'https://api.payoneer.com/v1'
    };
  }

  /**
   * 检查 Payoneer 是否已配置
   */
  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.apiSecret);
  }

  /**
   * 获取访问令牌
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.apiKey,
          client_secret: this.config.apiSecret
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Failed to get Payoneer access token:', error);
      throw error;
    }
  }

  /**
   * 获取账户信息
   */
  async getAccountInfo(): Promise<PayoneerAccount | null> {
    if (!this.isConfigured()) {
      throw new Error('Payoneer API not configured');
    }

    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/accounts/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get account info: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get Payoneer account info:', error);
      return null;
    }
  }

  /**
   * 获取交易记录
   */
  async getTransactions(limit: number = 50): Promise<PayoneerTransaction[]> {
    if (!this.isConfigured()) {
      throw new Error('Payoneer API not configured');
    }

    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/transactions?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get transactions: ${response.status}`);
      }

      const data = await response.json();
      return data.transactions || [];
    } catch (error) {
      console.error('Failed to get Payoneer transactions:', error);
      return [];
    }
  }

  /**
   * 获取账户余额
   */
  async getBalance(): Promise<{ currency: string; amount: number } | null> {
    try {
      const accountInfo = await this.getAccountInfo();
      return accountInfo?.balance || null;
    } catch (error) {
      console.error('Failed to get Payoneer balance:', error);
      return null;
    }
  }

  /**
   * 获取银行账户信息
   */
  async getBankAccounts(): Promise<Array<{
    id: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: string;
  }>> {
    try {
      const accountInfo = await this.getAccountInfo();
      return accountInfo?.bankAccounts || [];
    } catch (error) {
      console.error('Failed to get Payoneer bank accounts:', error);
      return [];
    }
  }

  /**
   * 检查支付状态
   */
  async getPaymentStatus(): Promise<{
    isAvailable: boolean;
    message: string;
    accountInfo?: PayoneerAccount;
  }> {
    if (!this.isConfigured()) {
      return {
        isAvailable: false,
        message: 'Payoneer API 未配置，请联系管理员'
      };
    }

    try {
      const accountInfo = await this.getAccountInfo();
      
      if (!accountInfo) {
        return {
          isAvailable: false,
          message: '无法获取 Payoneer 账户信息'
        };
      }

      return {
        isAvailable: true,
        message: 'Payoneer 收款服务已就绪',
        accountInfo
      };
    } catch (error) {
      return {
        isAvailable: false,
        message: `Payoneer 服务连接失败: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// 导出单例实例
export const payoneerService = new PayoneerService();
