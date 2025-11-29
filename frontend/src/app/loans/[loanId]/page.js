// src/app/loans/[loanId]/page.js
import BidCard from './components/BidCard'
import LiveFeed from '../../components/LiveFeed'

export const metadata = {
  title: 'Loan details — VendTrust',
  description: 'Loan detail and bidding dashboard',
}

export default function LoanPage({ params }) {
  const { loanId } = params
  // server component could fetch loan data; here we keep client-side BidCard
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-3 gap-6">
        <section className="col-span-2">
          <div className="p-4 bg-white border rounded mb-4">
            <h1 className="text-xl font-semibold">Loan — {loanId}</h1>
            <p className="text-sm text-slate-500 mt-2">Borrower details, purpose, repayment schedule (mock).</p>
          </div>

          <LiveFeed />
        </section>

        <aside className="col-span-1">
          <BidCard loanId={loanId} />
        </aside>
      </main>
    </div>
  )
}
