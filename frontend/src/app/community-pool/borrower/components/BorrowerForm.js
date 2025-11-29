'use client'

// src/app/community-pool/borrower/components/BorrowerForm.js
import { useState } from 'react'

export default function BorrowerForm() {
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)

    const parsed = Number(amount)
    if (!parsed || parsed <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount' })
      return
    }
    if (!purpose || purpose.length < 4) {
      setMessage({ type: 'error', text: 'Add a short purpose (min 4 chars)' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ''}/api/community/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'me', amount: parsed, purpose }) // replace 'me' with actual user id from auth
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: json.error || 'Request failed' })
      } else {
        setMessage({ type: 'success', text: 'Request created — investors will see it in the live feed' })
        setAmount('')
        setPurpose('')
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`rounded-md p-2 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm text-slate-700 mb-1">Amount (₹)</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min="1" className="w-full rounded-md border px-3 py-2" placeholder="Enter amount" />
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-1">Purpose</label>
        <input value={purpose} onChange={e => setPurpose(e.target.value)} type="text" className="w-full rounded-md border px-3 py-2" placeholder="What is the loan for?" />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">
          {loading ? 'Requesting…' : 'Create Request'}
        </button>
        <button type="button" onClick={() => { setAmount(''); setPurpose(''); setMessage(null) }} className="px-3 py-2 border rounded-md text-sm">Reset</button>
      </div>
    </form>
  )
}
