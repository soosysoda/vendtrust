// src/app/components/LowTrustList.jsx
'use client'
import React, { useEffect, useState } from 'react'

export default function LowTrustList() {
  const [list, setList] = useState(null)

  useEffect(() => {
    // replace with real fetch to /api/leaderboard/low-trust
    const timer = setTimeout(() => {
      setList([
        { id: 'u1', maskedName: 'R. Singh', trust_score: 12, total_invested: 1200 },
        { id: 'u2', maskedName: 'M. Das', trust_score: 18, total_invested: 2000 },
        { id: 'u3', maskedName: 'P. Roy', trust_score: 22, total_invested: 800 },
      ])
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  if (!list) return <div>loading...</div>

  return (
    <div className="space-y-2 mt-4">
      {list.map((u) => (
        <div key={u.id} className="p-3 border rounded flex justify-between items-center bg-white">
          <div>
            <div className="font-medium">{u.maskedName}</div>
            <div className="text-sm text-slate-500">Invested: ₹{u.total_invested}</div>
          </div>
          <div className="text-red-600 font-semibold">{u.trust_score}</div>
        </div>
      ))}
    </div>
  )
}
