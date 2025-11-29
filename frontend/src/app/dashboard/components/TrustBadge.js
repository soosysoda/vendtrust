// src/app/dashboard/components/TrustBadge.js
'use client'
export default function TrustBadge({ score = 0 }) {
  // show percent-like or scale highlight; you're using a 0-1000 scale in earlier code so normalize to 0-100
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
