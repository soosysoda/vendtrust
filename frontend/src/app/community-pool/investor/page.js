// src/app/community-pool/investor/page.js
export const metadata = {
  title: 'Community Pool — Investor',
  description: 'Investor view — see active borrower requests and commit funds.'
}

import InvestorClientWrapper from './components/InvestorClientWrapper'

async function fetchPool() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''
  if (!API_BASE) {
    // avoid calling fetch in dev when API base is not set — prevents bundler/noise
    return { total_amount: 0 }
  }

  try {
    const res = await fetch(`${API_BASE}/api/community/pool`, { cache: 'no-store' })
    if (!res.ok) return { total_amount: 0 }
    return await res.json()
  } catch (e) {
    // keep the log light — bundler may surface unrelated stack traces for dependency sourcemaps
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Community Pool — Investor</h1>
          <p className="text-sm text-slate-600 mt-1">
            Browse active borrower requests and commit funds to support the pool.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
          <main>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-lg font-medium">Active borrower requests</h2>
              <p className="text-sm text-slate-500 mt-1">
                Investors can commit to any request listed below.
              </p>

              <div className="mt-4">
                <InvestorClientWrapper />
              </div>
            </div>
          </main>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="text-sm text-slate-500">Pool totals</h4>
              <div className="mt-2">
                <div className="text-2xl font-bold">₹{total.toLocaleString()}</div>
                <div className="text-sm text-slate-600 mt-1">
                  Available for disbursement:{' '}
                  <span className="font-medium">₹{available.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
