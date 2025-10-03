import { NextRequest, NextResponse } from 'next/server';
import { payoneerService } from '@/lib/payoneer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const transactions = await payoneerService.getTransactions(limit);
    
    return NextResponse.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error('Payoneer transactions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
