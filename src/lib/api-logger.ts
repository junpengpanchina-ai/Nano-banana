import { NextRequest, NextResponse } from 'next/server';

interface ApiLogEntry {
  timestamp: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  userId?: string;
  statusCode: number;
  responseTime: number;
  error?: string;
  requestSize: number;
}

class ApiLogger {
  private logs: ApiLogEntry[] = [];
  private maxLogs = 10000; // 最多保存10000条日志

  log(entry: Omit<ApiLogEntry, 'timestamp'>) {
    const logEntry: ApiLogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    this.logs.push(logEntry);

    // 保持日志数量在限制内
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // 在开发环境输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('API Log:', logEntry);
    }
  }

  getLogs(limit = 100): ApiLogEntry[] {
    return this.logs.slice(-limit);
  }

  getLogsByUser(userId: string, limit = 50): ApiLogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit);
  }

  getErrorLogs(limit = 50): ApiLogEntry[] {
    return this.logs
      .filter(log => log.statusCode >= 400)
      .slice(-limit);
  }

  getStats() {
    const total = this.logs.length;
    const errors = this.logs.filter(log => log.statusCode >= 400).length;
    const avgResponseTime = this.logs.reduce((sum, log) => sum + log.responseTime, 0) / total || 0;
    
    const statusCounts = this.logs.reduce((acc, log) => {
      acc[log.statusCode] = (acc[log.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      total,
      errors,
      errorRate: total > 0 ? (errors / total) * 100 : 0,
      avgResponseTime: Math.round(avgResponseTime),
      statusCounts
    };
  }
}

export const apiLogger = new ApiLogger();

export function logApiRequest(
  request: NextRequest,
  response: NextResponse,
  startTime: number,
  userId?: string,
  error?: string
) {
  const responseTime = Date.now() - startTime;
  const ip = getClientIP(request);
  
  apiLogger.log({
    method: request.method,
    url: request.url,
    ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
    userId,
    statusCode: response.status,
    responseTime,
    error,
    requestSize: parseInt(request.headers.get('content-length') || '0')
  });
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}
