// src/app/community-pool/page.js
export const metadata = {
  title: 'Community Pool — Analytics',
  description: 'Community pool analytics, active lenders and comparisons.'
}

import AnalyticsPanel from './components/AnalyticsPanel'
import LeftMenu from './components/LeftMenu'
import LendersList from './components/LendersList'

async function fetchPool() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''
  if (!API_BASE) return { total_amount: 0 }
  try {
    const res = await fetch(`${API_BASE}/api/community/pool`, { cache: 'no-store' })
    if (!res.ok) return { total_amount: 0 }
    return await res.json()
  } catch (e) {
    console.warn('fetchPool error', e.message || e)
    return { total_amount: 0 }
  }
}

async function fetchLenders() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''
  if (!API_BASE) return { active: [], top: [] }
  try {
    const [activeRes, topRes] = await Promise.all([
      fetch(`${API_BASE}/api/leaderboard/active?limit=8`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/leaderboard/top?limit=8`, { cache: 'no-store' })
    ])
    const active = activeRes.ok ? await activeRes.json() : { items: [] }
    const top = topRes.ok ? await topRes.json() : { items: [] }
    return { active: active.items || [], top: top.items || [] }
  } catch (e) {
    console.warn('fetchLenders error', e.message || e)
    return { active: [], top: [] }
  }
}

export default async function Page() {
  const pool = await fetchPool()
  const lenders = await fetchLenders()
  const total = pool.total_amount ? Number(pool.total_amount) : 0
  const available = +(total * 0.75).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_320px] gap-6">
          {/* Left menu */}
          <aside>
            <LeftMenu />
          </aside>

          {/* Center analytics */}
          <main>
            <header className="mb-4">
              <h1 className="text-2xl font-semibold">Community Pool Analytics</h1>
              <p className="text-sm text-slate-500 mt-1">Pool total: <span className="font-medium">₹{total.toLocaleString()}</span> — Available: <span className="font-medium">₹{available.toLocaleString()}</span></p>
            </header>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <AnalyticsPanel apiBase={process.env.NEXT_PUBLIC_API_BASE || ''} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-lg font-medium mb-2">Bank vs VendTrust — Comparative (period)</h3>
                <p className="text-sm text-slate-500 mb-4">Compare transaction volumes over selected period (months).</p>
                <div>
                  {/* Dual bar chart is inside AnalyticsPanel. (keeps center focused) */}
                </div>
              </div>
            </div>
          </main>

          {/* Right lists */}
          <aside>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h4 className="text-sm text-slate-600">Active lenders</h4>
                <LendersList list={lenders.active} emptyText="No active lenders" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h4 className="text-sm text-slate-600">Top lenders</h4>
                <LendersList list={lenders.top} emptyText="No top lenders" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
