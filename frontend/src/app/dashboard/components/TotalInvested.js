// src/app/dashboard/components/TotalInvested.js
'use client'
export default function TotalInvested({ data = 0 }) {
  return (
    <div>
      <div className="text-xs text-slate-500">Total invested</div>
      <div className="text-lg font-semibold mt-1">₹ {Number(data || 0).toLocaleString('en-IN')}</div>
    </div>
  )
}
