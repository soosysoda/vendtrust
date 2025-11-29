// src/app/loans/[loanId]/components/BidCard.js
'use client'
import { useEffect, useState } from 'react'

export default function BidCard({ loanId }) {
  const [info, setInfo] = useState(null)
  const [amt, setAmt] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`/api/loans/${loanId}/bid-info`, { cache: 'no-store' })
        if (!res.ok) throw new Error('no api')
        const d = await res.json()
        if (!mounted) return
        setInfo(d)
      } catch (e) {
        // fallback mock
        setInfo({ user_trust: 68, user_available: 50000, max_bid: 2000, min_bid: 100 })
      }
    }
    load()
    return () => (mounted = false)
  }, [loanId])

  async function placeBid() {
    if (!info) return
    const amount = parseFloat(amt)
    if (isNaN(amount) || amount <= 0) return alert('Enter valid amount')
    if (amount > info.max_bid) return alert(`Bid exceeds your max allowed ₹${info.max_bid}`)
    if (amount > info.user_available) return alert('Insufficient available capital')
    setLoading(true)
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loan_id: loanId, amount }),
      })
      if (!res.ok) throw new Error(await res.text())
      alert('Bid placed!')
      setAmt('')
    } catch (e) {
      alert('Bid failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!info) return <div className="p-4">Loading bid info…</div>

  return (
    <div className="p-4 bg-white border rounded">
      <div className="text-sm">Your trust: <span className="font-semibold">{info.user_trust}</span></div>
      <div className="text-sm mt-1">Available: ₹{Number(info.user_available).toLocaleString('en-IN')}</div>
      <div className="text-sm mt-1">Max allowed: ₹{Number(info.max_bid).toLocaleString('en-IN')}</div>

      <div className="mt-3">
        <input
          value={amt}
          onChange={e => setAmt(e.target.value)}
          placeholder="Enter bid amount"
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2 mt-2">
          <button onClick={() => setAmt((info.max_bid * 0.25).toFixed(0))} className="px-3 py-1 border rounded">25%</button>
          <button onClick={() => setAmt((info.max_bid * 0.5).toFixed(0))} className="px-3 py-1 border rounded">50%</button>
          <button onClick={() => setAmt((info.max_bid).toFixed(0))} className="px-3 py-1 border rounded">100%</button>
        </div>

        <button
          onClick={placeBid}
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Placing…' : 'Place Bid'}
        </button>
      </div>
    </div>
  )
}
