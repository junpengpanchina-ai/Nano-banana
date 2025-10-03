import { NextRequest, NextResponse } from 'next/server';
import { payoneerService } from '@/lib/payoneer';

export async function GET(request: NextRequest) {
  try {
    const accountInfo = await payoneerService.getAccountInfo();
    
    if (!accountInfo) {
      return NextResponse.json(
        { error: 'Failed to get account info' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: accountInfo
    });

  } catch (error) {
    console.error('Payoneer account API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
