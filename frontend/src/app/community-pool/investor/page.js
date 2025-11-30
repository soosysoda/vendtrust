// src/app/community-pool/investor/page.js
export const metadata = {
  title: 'Community Pool — Investor (Analytics)',
  description: 'Investor analytics view for the community pool.'
}

import AnalyticsClientWrapper from '../analytics/components/AnalyticsClientWrapper'

async function fetchSummary() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''
  if (!API_BASE) {
    // fallback sample data for dev
    return {
      total_pool: 12500000,
      available: 9375000,
      lineSeries: [
        { ts: Date.now() - 30*24*3600*1000*5, value: 8000000 },
        { ts: Date.now() - 30*24*3600*1000*4, value: 9200000 },
        { ts: Date.now() - 30*24*3600*1000*3, value: 9800000 },
        { ts: Date.now() - 30*24*3600*1000*2, value: 11000000 },
        { ts: Date.now() - 30*24*3600*1000*1, value: 12000000 },
        { ts: Date.now(), value: 12500000 }
      ],
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
    console.warn('fetchSummary error (network)', e.message || e)
    return null
  }
}

export default async function Page() {
  const summary = (await fetchSummary()) || {}
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Community Pool — Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Trends and bank vs VendTrust comparison for investors.</p>
        </header>

        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Analytics</h2>
              <p className="text-sm text-slate-500 mt-1">Line chart and comparative bar chart.</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-500">Total Pool</div>
              <div className="text-lg font-bold">₹{(summary.total_pool || 0).toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Available: ₹{(summary.available || 0).toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-4">
            {/* client wrapper (renders charts) — passes server data for immediate render */}
            <AnalyticsClientWrapper serverData={summary} />
          </div>
        </section>
      </div>
    </div>
  )
}
