import { NextRequest } from 'next/server';
import crypto from 'crypto';

// API密钥管理
const API_KEYS = new Map<string, { 
  userId: string; 
  rateLimit: { count: number; resetTime: number }; 
  maxRequests: number;
}>();

// 初始化API密钥
function initializeApiKeys() {
  const masterKey = process.env.MASTER_API_KEY;
  if (!masterKey) {
    // 在构建时提供默认值，避免构建失败
    console.warn('MASTER_API_KEY environment variable is not set, using default for build');
    return;
  }
  
  // 为不同用户生成API密钥
  const users = [
    { id: 'user1', maxRequests: 100 },
    { id: 'user2', maxRequests: 50 },
    { id: 'admin', maxRequests: 1000 }
  ];
  
  users.forEach(user => {
    const apiKey = crypto.createHash('sha256')
      .update(`${masterKey}-${user.id}-${Date.now()}`)
      .digest('hex')
      .substring(0, 32);
    
    API_KEYS.set(apiKey, {
      userId: user.id,
      rateLimit: { count: 0, resetTime: Date.now() + 3600000 }, // 1小时重置
      maxRequests: user.maxRequests
    });
  });
}

// 验证API密钥
export function validateApiKey(request: NextRequest): { valid: boolean; userId?: string; error?: string } {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }
  
  const apiKey = authHeader.substring(7);
  const keyData = API_KEYS.get(apiKey);
  
  if (!keyData) {
    return { valid: false, error: 'Invalid API key' };
  }
  
  // 检查频率限制
  const now = Date.now();
  if (now > keyData.rateLimit.resetTime) {
    keyData.rateLimit.count = 0;
    keyData.rateLimit.resetTime = now + 3600000; // 重置为1小时后
  }
  
  if (keyData.rateLimit.count >= keyData.maxRequests) {
    return { valid: false, error: 'Rate limit exceeded' };
  }
  
  // 增加计数
  keyData.rateLimit.count++;
  
  return { valid: true, userId: keyData.userId };
}

// 生成新的API密钥
export function generateApiKey(userId: string, maxRequests: number = 100): string {
  const masterKey = process.env.MASTER_API_KEY || 'demo-master-key-12345';
  
  const apiKey = crypto.createHash('sha256')
    .update(`${masterKey}-${userId}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 32);
  
  API_KEYS.set(apiKey, {
    userId,
    rateLimit: { count: 0, resetTime: Date.now() + 3600000 },
    maxRequests
  });
  
  return apiKey;
}

// 初始化API密钥
initializeApiKeys();
