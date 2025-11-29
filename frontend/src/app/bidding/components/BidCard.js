// src/app/bidding/components/BidCard.js
'use client'
import { useEffect, useMemo, useState } from 'react'

export default function BidCard({ bid, onSelectInvestor }) {
  // bid: { id, borrower_id, amount, purpose, created_at, expires_at, participants: [] }
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const expiresAt = bid.expires_at ? new Date(bid.expires_at).getTime() : (new Date(bid.created_at).getTime() + 24*3600*1000)
  const remainingMs = Math.max(0, expiresAt - now)
  const remaining = useMemo(() => {
    const sec = Math.floor(remainingMs / 1000)
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }, [remainingMs])

  return (
    <div className="p-4 bg-white border rounded shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-slate-500">Bid amount</div>
          <div className="text-2xl font-semibold">₹ {Number(bid.amount).toLocaleString('en-IN')}</div>
          <div className="text-sm text-slate-500 mt-1">Purpose: {bid.purpose}</div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Expires in</div>
          <div className="font-mono mt-1">{remaining}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-slate-500">Active investors</div>
        <div className="mt-2 flex gap-2 flex-wrap">
          { (bid.participants || []).length === 0 ? (
            <div className="text-sm text-slate-500">No active investors yet</div>
          ) : (
            bid.participants.map(p => (
              <div key={p.id} className="px-2 py-1 bg-slate-50 rounded text-sm border">
                {p.maskedName} • Trust {p.trust}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onSelectInvestor && onSelectInvestor(bid)}
          className="px-3 py-2 bg-indigo-600 text-white rounded"
        >
          Choose investor
        </button>

        <button
          onClick={() => alert('Share / copy link')}
          className="px-3 py-2 border rounded"
        >Share</button>
      </div>
    </div>
  )
}
