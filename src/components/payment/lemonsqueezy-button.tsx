'use client';

import { useState } from 'react';

export default function LemonSqueezyButton(props: {
  userId: string;
  variantId?: string | number;
  quantity?: number;
  discountCode?: string;
  checkoutData?: Record<string, unknown>;
  className?: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const res = await fetch('/api/payment/lemonsqueezy/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
          variantId: props.variantId,
          quantity: props.quantity ?? 1,
          discountCode: props.discountCode,
          checkoutData: props.checkoutData,
        }),
      });
      const json = await res.json();
      if (!json?.success || !json?.url) throw new Error('Failed to create checkout');
      window.location.href = json.url as string;
    } catch (err) {
      console.error('[lemonsqueezy] create error', err);
      alert('创建结账失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className={props.className}>
      {loading ? 'Processing…' : props.children ?? 'Buy'}
    </button>
  );
}




