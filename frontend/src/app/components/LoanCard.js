// src/app/loans/components/LoanCard.js
import Link from "next/link"

export default function LoanCard({ loan }) {
  const pct = Math.round((loan.current_funded_amount / loan.amount) * 100)

  return (
    <div className="p-4 bg-white border rounded flex items-center justify-between">
      <div>
        <div className="font-semibold">{loan.borrower_name}</div>
        <div className="text-sm text-slate-500">
          Amount: ₹{Number(loan.amount).toLocaleString("en-IN")}
        </div>
        <div className="text-xs text-slate-400 mt-1">Funded: {pct}%</div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/loans/${loan.id}`}
          className="px-4 py-2 border rounded text-sm"
        >
          View & Bid
        </Link>

        <div className="text-sm text-slate-600">
          Rewardable: {loan.rewardable ? "Yes" : "No"}
        </div>
      </div>
    </div>
  )
}
