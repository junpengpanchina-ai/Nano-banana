import { listRecentPayments } from '@/lib/mock-payment-gateways'

type PaymentRow = {
  _id: string
  provider: string
  user_id: string
  amount_cents: number
  currency?: string
  identifier?: string
  provider_order_id?: string
  created_at: string
}

export const dynamic = 'force-dynamic'

async function getRecentPayments(limit = 50): Promise<PaymentRow[]> {
  const payments = await listRecentPayments(limit)
  return payments.map(p => ({
    _id: p.id,
    provider: p.provider,
    user_id: p.user_id,
    amount_cents: p.amount_cents,
    currency: p.currency,
    identifier: p.identifier,
    provider_order_id: p.provider_order_id,
    created_at: p.created_at,
  }))
}

function formatAmount(cents: number, currency = 'USD') {
  const amount = (cents || 0) / 100
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export default async function AdminPaymentsPage() {
  const payments = await getRecentPayments()
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Recent Payments</h1>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Provider</th>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Identifier</th>
              <th className="text-left p-2">Order ID</th>
              <th className="text-left p-2">_id</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{new Date(p.created_at).toLocaleString()}</td>
                <td className="p-2">{p.provider}</td>
                <td className="p-2">
                  <a className="text-blue-600 hover:underline" href={`/admin/users/${encodeURIComponent(p.user_id)}`}>{p.user_id}</a>
                </td>
                <td className="p-2">{formatAmount(p.amount_cents, p.currency || 'USD')}</td>
                <td className="p-2">{p.identifier || '-'}</td>
                <td className="p-2">{p.provider_order_id || '-'}</td>
                <td className="p-2 text-gray-500">{p._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



