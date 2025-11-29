// src/app/loans/components/LoanList.js
'use client'
import { useEffect, useState } from 'react'
import LoanCard from '../../components/LoanCard'

export default function LoanList() {
  const [loans, setLoans] = useState(null)
  useEffect(() => {
    let mounted = true
    async function fetchLoans() {
      try {
        const res = await fetch('/api/loans?limit=50', { cache: 'no-store' })
        if (!res.ok) throw new Error('api error')
        const data = await res.json()
        if (!mounted) return
        setLoans(data)
      } catch (e) {
        // fallback mock
        setLoans([
          { id: 'l1', borrower_name: 'Jyoti Tea Stall', amount: 20000, current_funded_amount: 5000, min_increment: 100, rewardable: true },
          { id: 'l2', borrower_name: 'Ram Provision', amount: 12000, current_funded_amount: 4000, min_increment: 100, rewardable: true },
          { id: 'l3', borrower_name: 'Suman Electronics', amount: 50000, current_funded_amount: 10000, min_increment: 500, rewardable: false },
        ])
      }
    }
    fetchLoans()
    return () => (mounted = false)
  }, [])

  if (!loans) return <div className="p-4">Loading loans…</div>

  return (
    <div className="space-y-4">
      {loans.map(loan => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  )
}
