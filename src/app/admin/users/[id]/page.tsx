import { getUserPayments, getLedgerEntries } from '@/lib/mock-payment-gateways'
import AdjustCreditsForm from './AdjustCreditsForm'

export const dynamic = 'force-dynamic'

async function getUser(id: string) {
  // Mock user for testing
  return {
    id,
    email: 'test@example.com',
    name: 'Test User',
    credits: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

async function getUserPaymentsData(id: string, limit = 50) {
  const payments = await getUserPayments(id, limit)
  return payments.map(p => ({
    _id: p.id,
    amount_cents: p.amount_cents,
    currency: p.currency || 'USD',
    created_at: p.created_at,
    provider: p.provider,
    identifier: p.identifier,
    provider_order_id: p.provider_order_id,
  }))
}

async function getLedgerData(id: string, limit = 50) {
  const ledger = await getLedgerEntries(id, limit)
  return ledger.map(l => ({
    _id: l.id,
    delta: l.delta,
    reason: l.reason,
    source: l.source,
    ref: l.ref,
    created_at: l.created_at,
  }))
}

function fmtAmount(cents: number, currency = 'USD') {
  const amount = (cents || 0) / 100
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  if (!user) return <div className="p-6">User not found</div>
  const [payments, ledger] = await Promise.all([
    getUserPaymentsData(params.id),
    getLedgerData(params.id)
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">User Detail</h1>
        <div className="text-sm text-gray-600">ID: {user._id}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <div className="font-medium mb-2">Profile</div>
          <div>Email: {user.email}</div>
          <div>Name: {user.name}</div>
          <div>Credits: {user.credits}</div>
          <div>Created: {new Date(user.created_at).toLocaleString()}</div>
          <div>Updated: {new Date(user.updated_at).toLocaleString()}</div>
        </div>

        <div className="border rounded p-4">
          <div className="font-medium mb-2">Recent Payments</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Time</th>
                  <th className="p-2">Provider</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Identifier</th>
                  <th className="p-2">Order ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-b">
                    <td className="p-2">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="p-2">{p.provider}</td>
                    <td className="p-2">{fmtAmount(p.amount_cents, p.currency)}</td>
                    <td className="p-2">{p.identifier || '-'}</td>
                    <td className="p-2">{p.provider_order_id || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="border rounded p-4">
        <div className="font-medium mb-2">Credits Changes</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Time</th>
                <th className="p-2">Delta</th>
                <th className="p-2">Source</th>
                <th className="p-2">Reason</th>
                <th className="p-2">Ref</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map(l => (
                <tr key={l._id} className="border-b">
                  <td className="p-2">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="p-2">{l.delta > 0 ? `+${l.delta}` : l.delta}</td>
                  <td className="p-2">{l.source}</td>
                  <td className="p-2">{l.reason}</td>
                  <td className="p-2">{l.ref || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdjustCreditsForm userId={user._id} />
    </div>
  )
}


