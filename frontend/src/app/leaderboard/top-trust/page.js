// src/app/leaderboard/top-trust/page.js
import TopTrustList from './TopTrustList'

export const metadata = {
  title: 'Top Trust Lenders — VendTrust',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Top trust lenders</h1>
          <p className="text-sm text-slate-500 mt-1">Highest trust scores — community leaders.</p>
        </header>

        <section>
          <TopTrustList />
        </section>
      </main>
    </div>
  )
}
