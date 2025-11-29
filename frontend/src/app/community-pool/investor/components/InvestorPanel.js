'use client'

// src/app/community-pool/investor/components/InvestorPanel.js
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export default function InvestorPanel() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [commitLoading, setCommitLoading] = useState(null) // id of request being committed
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/community/requests`)
        const json = await res.json()
        if (!mounted) return
        setRequests(json.items || [])
      } catch (e) {
        console.warn('load requests', e)
        if (mounted) setRequests([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    // socket live updates (optional)
    try {
      const socket = io(API_BASE || undefined)
      socket.on('connect', () => {
        socket.emit('subscribe_room', 'community_pool')
      })
      socket.on('new_request', (r) => {
        setRequests(prev => [r, ...prev].slice(0, 200))
      })
      socket.on('request_updated', (r) => {
        setRequests(prev => prev.map(p => p.id === r.id ? r : p))
      })
      return () => {
        mounted = false
        try { socket.disconnect() } catch (e) {}
      }
    } catch (e) {
      // ignore socket errors
    }
  }, [API_BASE])

  async function handleCommit(id) {
    const amount = prompt('Enter commitment amount (₹):')
    const parsed = Number(amount)
    if (!parsed || parsed <= 0) return alert('Invalid amount')
    setCommitLoading(id)
    try {
      const res = await fetch(`${API_BASE}/api/community/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id, investor_id: 'me', commitment: parsed }) // replace 'me' with actual user id
      })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || 'Commit failed')
      } else {
        alert('Committed — borrower will be notified')
        // optimistic update
        setRequests(prev => prev.map(r => r.id === id ? { ...r, commitments: (r.commitments || 0) + parsed } : r))
      }
    } catch (e) {
      alert('Network error')
    } finally {
      setCommitLoading(null)
    }
  }

  if (loading) return <div className="py-6 text-center text-slate-500">Loading requests…</div>
  if (!requests.length) return <div className="py-6 text-center text-slate-500">No open requests right now.</div>

  return (
    <div className="divide-y">
      {requests.map(r => (
        <div key={r.id} className="py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{r.title || r.purpose || 'Loan request'}</div>
                  <div className="text-xs text-slate-500">{r.user_name ? `by ${r.user_name}` : 'anonymous'} • {new Date(r.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-sm font-semibold">₹{Number(r.amount).toLocaleString()}</div>
              </div>

              {r.note ? <p className="mt-1 text-sm text-slate-600">{r.note}</p> : null}

              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => handleCommit(r.id)} disabled={commitLoading === r.id} className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">
                  {commitLoading === r.id ? 'Committing…' : 'Commit'}
                </button>
                <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(r))} className="px-3 py-1 rounded-md border text-sm">Copy</button>
                <div className="text-sm text-slate-500 ml-auto">Committed: ₹{Number(r.commitments || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
