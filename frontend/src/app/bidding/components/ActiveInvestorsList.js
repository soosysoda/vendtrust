// src/app/bidding/components/ActiveInvestorsList.js
'use client'
export default function ActiveInvestorsList({ participants = [] }) {
  return (
    <div className="p-4 bg-white border rounded h-full">
      <h3 className="font-semibold mb-3">Active Participants</h3>
      <div className="space-y-2">
        {participants.length === 0 ? (
          <div className="text-sm text-slate-500">No participants yet</div>
        ) : participants.map(p => (
          <div key={p.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="font-medium">{p.maskedName}</div>
              <div className="text-xs text-slate-500">Trust: {p.trust}</div>
            </div>
            <div className="text-sm text-slate-600">₹{(p.commitment || 0).toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
