// src/app/community-pool/analytics/page.js
export const metadata = {
  title: 'Community Pool Analytics — VendTrust',
  description: 'Pool analytics: active lenders, trends and bank vs VendTrust comparison.'
}

import LeftMenu from './components/LeftMenu'
import AnalyticsClientWrapper from './components/AnalyticsClientWrapper'
import LendersClientWrapper from './components/LendersClientWrapper'

async function fetchSummary() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''
  if (!API_BASE) {
    return {
      total_pool: 12500000,
      available: 9375000,
      lineSeries: [
        { ts: Date.now() - 30*24*3600*1000*5, value: 8_000_000 },
        { ts: Date.now() - 30*24*3600*1000*4, value: 9_200_000 },
        { ts: Date.now() - 30*24*3600*1000*3, value: 9_800_000 },
        { ts: Date.now() - 30*24*3600*1000*2, value: 11_000_000 },
        { ts: Date.now() - 30*24*3600*1000*1, value: 12_000_000 },
        { ts: Date.now(), value: 12_500_000 }
      ],
      lenders: {
        active: [
          { user_id: 'l1', name: 'Priya D.', trust: 820, amount: 50000 },
          { user_id: 'l2', name: 'Ramesh K.', trust: 780, amount: 25000 },
          { user_id: 'l3', name: 'Sana P.', trust: 760, amount: 10000 }
        ],
        top: [
          { user_id: 't1', name: 'Arun M.', trust: 950, invested: 800000 },
          { user_id: 't2', name: 'Nina S.', trust: 930, invested: 650000 },
          { user_id: 't3', name: 'Vikram R.', trust: 910, invested: 500000 }
        ]
      },
      comparison: {
        bank: { 6: 4200000, 9: 6300000, 12: 8200000, 18: 11000000 },
        vendtrust: { 6: 5200000, 9: 7600000, 12: 10200000, 18: 12500000 }
      }
    }
  }

  try {
    const res = await fetch(`${API_BASE}/api/community/analytics`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.warn('fetch summary (analytics) failed', e.message || e)
    return null
  }
}

export default async function Page() {
  const summary = (await fetchSummary()) || {}
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-6">
          {/* LEFT: Menu */}
          <div>
            <LeftMenu active="community-analytics" />
          </div>

          {/* CENTER: Analytics */}
          <main className="space-y-6">
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">Community Pool Analytics</h1>
                  <p className="text-sm text-slate-500 mt-1">Trends, active lenders and performance vs banks.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Total Pool</div>
                  <div className="text-lg font-bold">₹{(summary.total_pool || 0).toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-1">Available: ₹{(summary.available || 0).toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4">
                {/* client wrapper renders charts */}
                <AnalyticsClientWrapper serverData={summary} />
              </div>
            </section>
          </main>

          {/* RIGHT: Lenders lists */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm text-slate-600">Active Lenders</h3>
              <div className="mt-3">
                <LendersClientWrapper type="active" initial={summary?.lenders?.active || []} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm text-slate-600">Top Lenders</h3>
              <div className="mt-3">
                <LendersClientWrapper type="top" initial={summary?.lenders?.top || []} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
