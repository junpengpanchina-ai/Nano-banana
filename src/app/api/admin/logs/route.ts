import { NextRequest, NextResponse } from 'next/server';
import { apiLogger } from '@/lib/api-logger';

export async function GET(request: NextRequest) {
  try {
    // 管理员验证
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');

    let logs;
    switch (type) {
      case 'errors':
        logs = apiLogger.getErrorLogs(limit);
        break;
      case 'stats':
        return NextResponse.json(apiLogger.getStats());
      default:
        logs = apiLogger.getLogs(limit);
    }

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length
    });

  } catch (error) {
    console.error('Get logs error:', error);
    return NextResponse.json(
      { error: '获取日志失败' },
      { status: 500 }
    );
  }
}
