import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

type LemonEvent = {
  meta?: { event_name?: string };
  data?: {
    id?: string | number;
    attributes?: {
      status?: string;
      user_id?: string | number | null;
      // Amounts in cents
      subtotal?: number | null;
      total?: number | null;
      identifier?: string | null;
      custom_data?: Record<string, unknown> | null;
    };
  };
};

import { recordLemonPaymentIdempotent } from '@/lib/mock-payment-gateways'

function verifySignature(raw: string, signature: string | null) {
  const secret = process.env.LEMON_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(raw, 'utf8');
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(digest, 'utf8'));
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature');
    const raw = await request.text();

    if (!verifySignature(raw, signature)) {
      return new NextResponse('invalid signature', { status: 400 });
    }

    const event = JSON.parse(raw) as LemonEvent;
    const eventName = event.meta?.event_name || '';

    if (eventName === 'order_created' || eventName === 'order_refunded' || eventName === 'subscription_created' || eventName === 'subscription_payment_success') {
      const attrs = event.data?.attributes;
      const custom = (attrs?.custom_data || {}) as Record<string, unknown>;
      const userId = String(custom.userId ?? '');
      const total = Number(attrs?.total ?? 0);
      const identifier = String(attrs?.identifier ?? '') || undefined;
      const providerOrderId = event.data?.id ?? undefined;

      if (userId && total > 0 && (eventName === 'order_created' || eventName === 'subscription_payment_success')) {
        await recordLemonPaymentIdempotent({
          userId,
          amountCents: total,
          identifier,
          providerOrderId,
          raw: event,
        });
      }
      // For refunds, you could deduct credits accordingly
    }

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.error('lemonsqueezy webhook error', error);
    return new NextResponse('error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


