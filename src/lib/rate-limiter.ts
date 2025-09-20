import { NextRequest } from 'next/server';

// 内存存储（生产环境建议使用Redis）
const rateLimitStore = new Map<string, {
  count: number;
  resetTime: number;
  blocked: boolean;
}>();

// IP限流配置
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15分钟
  maxRequests: 50, // 每个IP最多50次请求
  blockDuration: 60 * 60 * 1000, // 封禁1小时
  burstLimit: 10, // 突发请求限制
  burstWindow: 60 * 1000, // 1分钟突发窗口
};

// 用户限流配置
const USER_RATE_LIMIT_CONFIG = {
  windowMs: 60 * 60 * 1000, // 1小时
  maxRequests: 100, // 每个用户最多100次请求
  blockDuration: 2 * 60 * 60 * 1000, // 封禁2小时
};

export function checkRateLimit(request: NextRequest, userId?: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
} {
  const ip = getClientIP(request);
  const key = userId ? `user:${userId}` : `ip:${ip}`;
  const config = userId ? USER_RATE_LIMIT_CONFIG : RATE_LIMIT_CONFIG;
  
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  // 如果没有记录或窗口已重置
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false
    });
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    };
  }
  
  // 如果被封禁
  if (record.blocked && now < record.resetTime) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      error: 'Too many requests, temporarily blocked'
    };
  }
  
  // 检查突发限制
  if (userId) {
    const burstKey = `burst:${key}`;
    const burstRecord = rateLimitStore.get(burstKey);
    
    if (!burstRecord || now > burstRecord.resetTime) {
      rateLimitStore.set(burstKey, {
        count: 1,
        resetTime: now + RATE_LIMIT_CONFIG.burstWindow,
        blocked: false
      });
    } else if (burstRecord.count >= RATE_LIMIT_CONFIG.burstLimit) {
      return {
        allowed: false,
        remaining: record.count,
        resetTime: record.resetTime,
        error: 'Burst limit exceeded, please slow down'
      };
    } else {
      burstRecord.count++;
    }
  }
  
  // 检查常规限制
  if (record.count >= config.maxRequests) {
    // 封禁用户/IP
    record.blocked = true;
    record.resetTime = now + config.blockDuration;
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      error: 'Rate limit exceeded, temporarily blocked'
    };
  }
  
  // 增加计数
  record.count++;
  
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime
  };
}

// 获取客户端IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// 清理过期记录
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 定期清理（每5分钟）
setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
