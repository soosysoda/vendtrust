// src/app/leaderboard/page.js
import Link from 'next/link'

export const metadata = {
  title: 'Leaderboard — VendTrust',
  description: 'Top and low trust leaderboards',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Leaderboards</h1>
          <p className="text-sm text-slate-500 mt-1">Toggle between top & low trust lenders.</p>
        </header>

        <div className="flex gap-3 mb-6">
          <Link href="/leaderboard/top-trust"><a className="px-4 py-2 border rounded">Top trust</a></Link>
          <Link href="/leaderboard/low-trust"><a className="px-4 py-2 border rounded">Low trust</a></Link>
        </div>

        <div>
          <p className="text-sm text-slate-500">Select a view above.</p>
        </div>
      </main>
    </div>
  )
}
