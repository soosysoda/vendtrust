// src/app/dashboard/components/RepaymentStatus.js
'use client'
export default function RepaymentStatus({ items = [], role = 'investor' }) {
  // items: [{id,ts,amount,status}]
  if (!items || items.length === 0) {
    return <div className="text-sm text-slate-500">No recent repayments/commitments</div>
  }

  return (
    <div className="space-y-2">
      {items.map(it => {
        const overdue = it.status === 'overdue'
        return (
          <div key={it.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">₹{Number(it.amount).toLocaleString('en-IN')}</div>
              <div className="text-xs text-slate-500">{new Date(it.ts).toLocaleDateString()}</div>
            </div>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded text-xs ${overdue ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {overdue ? 'Overdue' : 'Paid'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
