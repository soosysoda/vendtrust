// src/app/community-pool/investor/page.js
export const metadata = {
  title: 'Community Pool — Investor',
  description: 'Investor view — analytics, active borrower requests and commit funds.'
}

import LeftMenu from '@/components/LeftMenu'
import AnalyticsClientWrapper from '../analytics/components/AnalyticsClientWrapper'
import InvestorClientWrapper from './components/InvestorClientWrapper'
import LendersClientWrapper from '../analytics/components/LendersClientWrapper'

async function fetchPool() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''
  if (!API_BASE) return { total_amount: 0 }
  try {
    const res = await fetch(`${API_BASE}/api/community/pool`, { cache: 'no-store' })
    if (!res.ok) return { total_amount: 0 }
    return await res.json()
  } catch (e) {
    console.warn('fetchPool error (network)', e.message || e)
    return { total_amount: 0 }
  }
}

export default async function Page() {
  const pool = await fetchPool()
  const total = pool.total_amount ? Number(pool.total_amount) : 0
  const available = +(total * 0.75).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Community Pool — Investor</h1>
          <p className="text-sm text-slate-600 mt-1">Analytics + active borrower requests — commit funds to support borrowers.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-6">
          {/* LEFT: Menu */}
          <div>
            <LeftMenu active="community" />
          </div>

          {/* CENTER: Analytics (top) + Investor panel (below) */}
          <main className="space-y-6">
            {/* Analytics panel */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Community Analytics</h2>
                  <p className="text-sm text-slate-500 mt-1">Pool trends and Bank vs VendTrust comparison.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Total Pool</div>
                  <div className="text-lg font-bold">₹{(total || 0).toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-1">Available: ₹{(available || 0).toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4">
                {/* client component renders charts */}
                <AnalyticsClientWrapper />
              </div>
            </section>

            {/* Investor panel (active borrower requests + commits) */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Active Borrower Requests</h3>
                  <p className="text-sm text-slate-500 mt-1">Browse open requests and commit funds to support a borrower.</p>
                </div>
                <div className="text-sm text-slate-500">Live • rewardable only</div>
              </div>

              <div className="mt-4">
                <InvestorClientWrapper />
              </div>
            </section>
          </main>

          {/* RIGHT: Lenders lists */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="text-sm text-slate-600">Active Lenders</h4>
              <div className="mt-3">
                <LendersClientWrapper type="active" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="text-sm text-slate-600">Top Lenders</h4>
              <div className="mt-3">
                <LendersClientWrapper type="top" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
