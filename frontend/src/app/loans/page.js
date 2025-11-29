export const metadata = {
  title: 'Loans — VendTrust',
  description: 'Browse loans to fund or bid on.',
}

import LoanListWrapper from "./LoanListWrapper"

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Available loans</h1>
          <p className="text-sm text-slate-500 mt-1">
            Filter, sort, and bid — your limit depends on trust score.
          </p>
        </header>

        <section>
          <LoanListWrapper />
        </section>
      </main>
    </div>
  )
}
