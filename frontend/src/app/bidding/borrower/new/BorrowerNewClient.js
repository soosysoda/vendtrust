// src/app/bidding/borrower/new/BorrowerNewClient.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BorrowerNewClient() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [loading, setLoading] = useState(false)
  const [me, setMe] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        if (!res.ok) throw new Error('no-api')
        const d = await res.json()
        if (!mounted) return
        setMe(d)
      } catch (e) {
        // dev fallback
        setMe({ id: 'u-borrower', name: 'You', trust_score: 720 })
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  function canOpenBid() {
    return me && Number(me.trust_score) > 700
  }

  async function submit(e) {
    e.preventDefault()
    setError(null)
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setError('Enter a valid amount')
    if (!purpose) return setError('Enter purpose')
    if (!canOpenBid()) return setError('Your trust score is too low to open a bid')

    setLoading(true)
    try {
      const payload = { amount: Number(amount), purpose }
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const bid = await res.json()
        router.push(`/bidding/borrower/${bid.id}`)
        return
      }

      // fallback when backend missing: create mock and push to session storage
      const mockId = `mock-${Date.now()}`
      const mockBid = {
        id: mockId,
        borrower_id: me?.id || 'u-borrower',
        amount: Number(amount),
        purpose,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        participants: [],
      }
      sessionStorage.setItem(`bid:${mockId}`, JSON.stringify(mockBid))
      router.push(`/bidding/borrower/${mockId}`)
    } catch (e) {
      // fallback path
      const mockId = `mock-${Date.now()}`
      const mockBid = {
        id: mockId,
        borrower_id: me?.id || 'u-borrower',
        amount: Number(amount),
        purpose,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        participants: [],
      }
      sessionStorage.setItem(`bid:${mockId}`, JSON.stringify(mockBid))
      router.push(`/bidding/borrower/${mockId}`)
    } finally {
      setLoading(false)
    }
  }

  if (!me) return <div className="p-6">Loading profile…</div>

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-3xl mx-auto">
        <div className="p-4 bg-white border rounded">
          <h1 className="text-xl font-semibold">Create a Borrower Bid</h1>
          <p className="text-sm text-slate-500 mt-1">Only allowed if trust score &gt; 700. Your trust: {me.trust_score}</p>

          {!canOpenBid() && (
            <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-300 text-amber-800">
              Your trust score is not high enough to create a bid.
            </div>
          )}

          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm">Amount (₹)</label>
              <input
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="text-sm">Purpose</label>
              <textarea
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                placeholder="What is this for?"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex gap-2">
              <button disabled={!canOpenBid() || loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                {loading ? 'Creating…' : 'Create Bid'}
              </button>

              <button type="button" onClick={() => { setAmount(''); setPurpose('') }} className="px-4 py-2 border rounded">
                Reset
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
