// src/app/community-pool/borrower/page.js (server component)
export const metadata = {
  title: 'Community Pool — Borrower',
  description: 'Request funds from community pool (borrower view).'
}

import BorrowerForm from './components/BorrowerForm'

// replace existing fetchPool() with this — safe: only fetches when API base exists
async function fetchPool() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''
  if (!API_BASE) {
    // no backend configured for frontend dev — avoid fetch to prevent bundler/source-map noise
    return { total_amount: 0 }
  }

  try {
    const res = await fetch(`${API_BASE}/api/community/pool`, { cache: 'no-store' })
    if (!res.ok) return { total_amount: 0 }
    return await res.json()
  } catch (e) {
    // keep log small so bundler doesn't attach unrelated stack traces
    console.warn('fetchPool error (network):', e.message || e)
    return { total_amount: 0 }
  }
}


export default async function Page() {
  const pool = await fetchPool()
  const total = pool.total_amount ? Number(pool.total_amount) : 0
  const available = +(total * 0.75).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Community Pool — Borrower</h1>
          <p className="text-sm text-slate-600 mt-1">Request funds from the community pool. 75% of total pool is available for disbursement.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
          <main className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-lg font-medium">Request funds</h2>
              <p className="text-sm text-slate-500 mt-1">Fill the form to request disbursement. Server will enforce eligibility (trust checks) when you submit.</p>
              <div className="mt-4">
                <BorrowerForm />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-medium text-slate-700">How it works</h3>
              <ul className="list-disc pl-5 mt-2 text-sm text-slate-600">
                <li>Requests stay open for 24 hours — investors can commit during this period.</li>
                <li>Only rewardable/eligible investors will be shown in the live list.</li>
                <li>Make sure your KYC & trust score are up-to-date.</li>
              </ul>
            </div>
          </main>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="text-sm text-slate-500">Pool totals</h4>
              <div className="mt-2">
                <div className="text-2xl font-bold">₹{total.toLocaleString()}</div>
                <div className="text-sm text-slate-600 mt-1">Available for disbursement: <span className="font-medium">₹{available.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="text-sm text-slate-500">Tips</h4>
              <p className="text-sm text-slate-600">Requests with clearer purpose and repayment plan get more attention. Keep your profile updated.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
