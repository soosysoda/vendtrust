// src/app/leaderboard/low-trust/page.js

import LowTrustList from "@/app/components/LowTrustList"

export const metadata = {
  title: 'Lowest Trust Lenders — VendTrust',
  description: 'List of lenders with the lowest trust scores (for admin / community view).',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Lowest-trust lenders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Public view of lenders with low trust scores. Use filters to triage and review.
          </p>
        </header>

        <section>
          <LowTrustList />
        </section>
      </main>
    </div>
  )
}
