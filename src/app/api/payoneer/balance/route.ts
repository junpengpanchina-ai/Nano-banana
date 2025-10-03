import { NextRequest, NextResponse } from 'next/server';
import { payoneerService } from '@/lib/payoneer';

export async function GET(request: NextRequest) {
  try {
    const balance = await payoneerService.getBalance();
    
    if (!balance) {
      return NextResponse.json(
        { error: 'Failed to get balance' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: balance
    });

  } catch (error) {
    console.error('Payoneer balance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
