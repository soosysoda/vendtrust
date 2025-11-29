// src/app/dashboard/DashboardClient.js
'use client'
import { useEffect, useState } from 'react'

export default function DashboardClient() {
  const [me, setMe] = useState(null)
  const [dash, setDash] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [meRes, dashRes] = await Promise.allSettled([
          fetch('/api/me', { cache: 'no-store' }),
          fetch('/api/dashboard', { cache: 'no-store' }),
        ])

        let meData = null
        let dashData = null

        if (meRes.status === 'fulfilled' && meRes.value.ok) {
          meData = await meRes.value.json()
        }
        if (dashRes.status === 'fulfilled' && dashRes.value.ok) {
          dashData = await dashRes.value.json()
        }

        if (!meData) {
          meData = {
            id: 'u1',
            name: 'Archo',
            role: Math.random() > 0.5 ? 'borrower' : 'investor',
            trust_score: Math.floor(300 + Math.random() * 700),
          }
        }
        if (!dashData) {
          dashData = mockDashboard(meData.role)
        }

        if (!mounted) return
        setMe(meData)
        setDash(dashData)
      } catch (e) {
        if (!mounted) return
        setError('Failed to load dashboard — using demo data')
        const meData = { id: 'u1', name: 'Archo', role: 'investor', trust_score: 420 }
        setMe(meData)
        setDash(mockDashboard(meData.role))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-6">Loading dashboard…</div>

  const isBorrower = me && me.role === 'borrower'
  const isInvestor = me && me.role === 'investor'

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="col-span-1 space-y-4">
          <div className="p-4 bg-white border rounded">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                {me.name ? me.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="font-semibold">{me.name || 'User'}</div>
                <div className="text-xs text-slate-500">{me.role}</div>
              </div>
            </div>

            <div className="mt-4">
              <TrustBadge score={me.trust_score} />
            </div>

            <div className="mt-4 text-sm space-y-2">
              {isInvestor && <TotalInvested data={dash.total_invested} />}
              {isBorrower && <div className="text-sm">Active loans: <strong>{dash.active_loans?.length || 0}</strong></div>}
              <div className="text-xs text-slate-500 mt-2">Last updated: {new Date(dash.last_updated).toLocaleString()}</div>
            </div>
          </div>

          <div className="p-4 bg-white border rounded">
            <h3 className="font-medium">Quick actions</h3>
            <div className="mt-3 space-y-2">
              {isBorrower ? (
                <>
                  <a href="/bidding/borrower/new" className="block w-full text-center px-3 py-2 bg-indigo-600 text-white rounded">Create Bid</a>
                  <a href="/bidding/borrower" className="block w-full text-center px-3 py-2 border rounded">My bids</a>
                </>
              ) : (
                <>
                  <a href="/bidding/investor" className="block w-full text-center px-3 py-2 bg-indigo-600 text-white rounded">Browse borrower bids</a>
                  <a href="/loans" className="block w-full text-center px-3 py-2 border rounded">Browse loans</a>
                </>
              )}
            </div>
          </div>
        </aside>

        <main className="col-span-1 lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 bg-white border rounded">
              <h3 className="font-medium mb-2">Activity (last 14 days)</h3>
              <AnalyticsCharts series={dash.activity} />
            </div>

            <div className="p-4 bg-white border rounded">
              <h3 className="font-medium mb-2">Repayments / Commitments</h3>
              <div className="mb-3 text-sm text-slate-500">Overview of recent repayments and open commitments</div>
              <RepaymentStatus items={dash.repayments} role={me.role} />
            </div>
          </div>

          <div className="p-4 bg-white border rounded">
            <h3 className="font-medium mb-2">Recent activity</h3>
            <ul className="space-y-2">
              {(dash.recent || []).slice(0,6).map((ev, i) => (
                <li key={i} className="flex justify-between items-start">
                  <div>
                    <div className="text-sm">{ev.title}</div>
                    <div className="text-xs text-slate-500">{new Date(ev.ts).toLocaleString()}</div>
                  </div>
                  <div className="text-sm font-semibold">{ev.amount ? `₹${Number(ev.amount).toLocaleString('en-IN')}` : ''}</div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ---------------- small in-file components ---------------- */

function TrustBadge({ score = 0 }) {
  const norm = Math.max(0, Math.min(100, Math.round((score / (score > 100 ? 10 : 1)))))
  const colorClass = norm >= 85 ? 'bg-emerald-100 text-emerald-800' : norm >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'

  return (
    <div className={`p-4 rounded-lg ${colorClass} flex items-center justify-between`}>
      <div>
        <div className="text-xs">Trust score</div>
        <div className="text-2xl font-semibold">{score}</div>
      </div>
      <div className="text-sm text-slate-700">
        <div className="text-xs">Level</div>
        <div className="font-medium">{norm >= 85 ? 'Top' : norm >= 70 ? 'Good' : 'At risk'}</div>
      </div>
    </div>
  )
}

function AnalyticsCharts({ series = [] }) {
  const width = 360
  const height = 120
  const padding = 8
  const max = Math.max(1, ...series.map(s => s.value || 0))
  const points = series.map((s, i) => {
    const x = padding + (i / Math.max(1, series.length - 1)) * (width - padding * 2)
    const y = padding + (1 - ((s.value || 0) / max)) * (height - padding * 2)
    return `${x},${y}`
  }).join(' ')

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="160" className="block">
        <polyline fill="rgba(99,102,241,0.08)" stroke="none" points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`} />
        <polyline fill="none" stroke="#6366F1" strokeWidth="2" points={points} />
        {series.map((s,i)=> {
          const x = padding + (i / Math.max(1, series.length - 1)) * (width - padding * 2)
          const y = padding + (1 - ((s.value || 0) / max)) * (height - padding * 2)
          return <circle key={i} cx={x} cy={y} r="2.5" fill="#6366F1" />
        })}
      </svg>
      <div className="mt-2 text-xs text-slate-500">Activity volume (last 14 days)</div>
    </div>
  )
}

function RepaymentStatus({ items = [] }) {
  if (!items || items.length === 0) return <div className="text-sm text-slate-500">No recent repayments/commitments</div>

  return (
    <div className="space-y-2">
      {items.map(it => {
        const overdue = it.status === 'overdue'
        return (
          <div key={it.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">₹{Number(it.amount).toLocaleString('en-IN')}</div>
              <div className="text-xs text-slate-500">{new Date(it.ts).toLocaleDateString()}</div>
            </div>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded text-xs ${overdue ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {overdue ? 'Overdue' : 'Paid'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TotalInvested({ data = 0 }) {
  return (
    <div>
      <div className="text-xs text-slate-500">Total invested</div>
      <div className="text-lg font-semibold mt-1">₹ {Number(data || 0).toLocaleString('en-IN')}</div>
    </div>
  )
}

/* ---------------- mock ---------------- */
function mockDashboard(role = 'investor') {
  const now = Date.now()
  const activity = Array.from({length:14}).map((_,i)=>({
    day: i,
    value: Math.floor(Math.random()*10 + (role === 'investor' ? 5 : 2))
  }))
  const repayments = Array.from({length:6}).map((_,i)=>({
    id: `r${i}`,
    ts: new Date(now - i*86400*1000).toISOString(),
    amount: Math.round(500 + Math.random()*5000),
    status: (Math.random() > 0.8) ? 'overdue' : 'paid'
  }))
  const recent = repayments.map(r=>({ title: r.status==='paid' ? 'Repayment received' : 'Repayment overdue', ts: r.ts, amount: r.amount }))
  return {
    last_updated: new Date().toISOString(),
    activity,
    repayments,
    recent,
    total_invested: role === 'investor' ? Math.round(100000 + Math.random()*500000) : 0,
    active_loans: role === 'borrower' ? [{ id:'L1', amount:20000 }] : [],
  }
}
