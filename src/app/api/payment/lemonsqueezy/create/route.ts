import { NextRequest, NextResponse } from 'next/server';

type CreatePayload = {
  userId?: string;
  variantId?: string | number;
  quantity?: number;
  discountCode?: string;
  checkoutData?: Record<string, unknown>;
  // Optional: use a direct "buy" link id instead of variant
  buyId?: string; // e.g. 8da29d6c-5fb9-45fc-8f4e-bbc7159c31d0
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as CreatePayload;
    const buyId = body.buyId?.trim();
    const variantId = String(body.variantId ?? process.env.NEXT_PUBLIC_LEMON_VARIANT_ID ?? '');
    const quantity = Number(body.quantity ?? 1);

    if (!process.env.NEXT_PUBLIC_LEMON_STORE_URL) {
      return NextResponse.json({ success: false, error: 'Missing NEXT_PUBLIC_LEMON_STORE_URL' }, { status: 500 });
    }
    if (!buyId && !variantId) {
      return NextResponse.json({ success: false, error: 'Missing buyId or variantId' }, { status: 400 });
    }
    if (!buyId && (!Number.isFinite(quantity) || quantity <= 0)) {
      return NextResponse.json({ success: false, error: 'Invalid quantity' }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_LEMON_STORE_URL.replace(/\/$/, '');
    const success = (process.env.LEMON_SUCCESS_URL || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`).replace(/\/$/, '');
    const cancel = (process.env.LEMON_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`).replace(/\/$/, '');

    const params = new URLSearchParams();
    if (success) params.set('success', success);
    if (cancel) params.set('cancel', cancel);
    if (body.userId) params.set('checkout[custom][userId]', body.userId);
    if (body.discountCode) params.set('discount', body.discountCode);
    if (body.checkoutData) {
      for (const [k, v] of Object.entries(body.checkoutData)) {
        params.set(`checkout[custom][${k}]`, String(v));
      }
    }

    let checkoutUrl: string;
    if (buyId) {
      // Direct buy link path
      checkoutUrl = `${base}/buy/${encodeURIComponent(buyId)}?${params.toString()}`;
    } else {
      // Classic variant-based checkout
      if (quantity && quantity !== 1) params.set('quantity', String(quantity));
      params.set('variant', String(variantId));
      checkoutUrl = `${base}/checkout?${params.toString()}`;
    }
    return NextResponse.json({ success: true, url: checkoutUrl });
  } catch (error) {
    console.error('Lemon create error', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


