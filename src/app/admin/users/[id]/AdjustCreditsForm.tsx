'use client'

import { useState } from 'react'

export default function AdjustCreditsForm({ userId }: { userId: string }) {
  const [delta, setDelta] = useState(0)
  const [reason, setReason] = useState('manual adjust')
  const [adminKey, setAdminKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function submit() {
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ userId, delta: Number(delta), reason }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'failed')
      setMsg(`成功，当前积分：${json.data.credits}`)
    } catch (e: any) {
      setMsg(e.message || '请求失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="border rounded p-4">
      <div className="font-medium mb-2">Adjust Credits</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
        <div>
          <label className="text-sm">Delta</label>
          <input className="border rounded w-full p-2" type="number" value={delta} onChange={e => setDelta(Number(e.target.value))} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm">Reason</label>
          <input className="border rounded w-full p-2" value={reason} onChange={e => setReason(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">ADMIN_KEY</label>
          <input className="border rounded w-full p-2" value={adminKey} onChange={e => setAdminKey(e.target.value)} placeholder="输入 ADMIN_KEY" />
        </div>
        <div>
          <button className="border rounded px-4 py-2" onClick={submit} disabled={busy || !adminKey || !delta}>提交</button>
        </div>
      </div>
      {msg && <div className="text-sm mt-2">{msg}</div>}
    </div>
  )
}



