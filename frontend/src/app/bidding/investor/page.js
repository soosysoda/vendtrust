// src/app/bidding/investor/page.js
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BidCard from '../components/BidCard'
import usePoll from '../components/usePoll'

export default function InvestorPage() {
  const router = useRouter()
  const [me, setMe] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        if (!res.ok) throw new Error('no api')
        const d = await res.json()
        if (!mounted) return
        setMe(d)
      } catch {
        setMe({ id: 'u-investor', name: 'You', trust_score: 420, available: 50000 })
      }
    })()
    return () => (mounted = false)
  }, [])

  const bids = usePoll(async () => {
    try {
      const res = await fetch('/api/bids/open', { cache: 'no-store' })
      if (!res.ok) throw new Error('no api')
      return await res.json()
    } catch (e) {
      // fallback mock list
      return [
        { id: 'b1', amount: 20000, purpose: 'Stock up tea leaves', created_at: new Date().toISOString(), participants: [] },
        { id: 'b2', amount: 15000, purpose: 'Buy new stove', created_at: new Date().toISOString(), participants: [] },
      ]
    }
  }, 5000) || []

  function canInvest() {
    return me && Number(me.trust_score) >= 400
  }

  if (!me) return <div className="p-6">Loading profile…</div>

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Open borrower bids</h1>
            <div className="text-sm text-slate-500">Your trust: {me.trust_score} • Available: ₹{(me.available || 0).toLocaleString('en-IN')}</div>
          </div>

          <div className="space-y-4">
            {bids.length === 0 ? (
              <div className="p-4 bg-white border rounded text-sm text-slate-500">No open bids</div>
            ) : bids.map(b => (
              <div key={b.id} className="bg-white border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">₹{Number(b.amount).toLocaleString('en-IN')}</div>
                    <div className="text-sm text-slate-500">{b.purpose}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/bidding/borrower/${b.id}`)} className="px-3 py-1 border rounded">View</button>
                    <button
                      onClick={async () => {
                        if (!canInvest()) return alert('Your trust score is too low to invest')
                        // join participants (mock)
                        alert('You committed (mock). In prod this would hit /api/bids/:id/join')
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                      Commit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="col-span-1">
          <div className="p-4 bg-white border rounded">
            <div className="text-sm text-slate-500">Investor Controls</div>
            <div className="mt-3">
              <div className="text-sm">Trust required: ≥ 400</div>
              <div className="text-sm mt-2">You can commit to open bids from this panel.</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white border rounded">
            <div className="text-sm text-slate-500">Active commitments</div>
            <div className="mt-2 text-sm">None (mock).</div>
          </div>
        </aside>
      </main>
    </div>
  )
}
