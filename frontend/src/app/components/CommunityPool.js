// src/app/components/CommunityPool.jsx
'use client'
import React, { useEffect, useState } from 'react'

export default function CommunityPool() {
  const [pool, setPool] = useState(null)

  useEffect(() => {
    // mock fetch: replace with real API call to /api/v1/pool
    const timer = setTimeout(() => {
      const total = 524800
      setPool({
        total,
        available75: Math.round(total * 0.75),
        reserve25: Math.round(total * 0.25),
      })
    }, 350)
    return () => clearTimeout(timer)
  }, [])

  if (!pool) {
    return (
      <div className="p-6 border rounded-lg bg-white max-w-2xl">
        <div className="h-24 animate-pulse bg-slate-100 rounded" />
      </div>
    )
  }

  return (
    <div className="p-6 border rounded-lg bg-white max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Community Pool — Total</div>
          <div className="mt-1 text-3xl font-semibold">₹ {pool.total.toLocaleString('en-IN')}</div>
          <div className="mt-2 text-sm text-slate-600">Available for disbursal (75%): ₹ {pool.available75.toLocaleString('en-IN')}</div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Reserve (25%)</div>
          <div className="font-medium">₹ {pool.reserve25.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs text-slate-500">Recent public rewardable events</div>
        <ul className="mt-3 space-y-2">
          <li className="flex justify-between">
            <span className="text-sm">Repayment — Jyoti Tea Stall</span>
            <span className="text-sm font-semibold text-green-600">+₹1,200</span>
          </li>
          <li className="flex justify-between text-sm text-slate-600">
            <span>Funded — Local Grocer</span>
            <span className="font-semibold text-indigo-600">₹3,500</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
