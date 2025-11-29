// src/app/components/LiveFeed.js
'use client'
import { useEffect, useState } from 'react'

export default function LiveFeed() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let mounted = true
    // simple mock fetch, replace with WS or /api/live-feed
    const timer = setTimeout(() => {
      if (!mounted) return
      setItems([
        { id: 1, text: 'Repayment — Jyoti Tea Stall', amount: 1200, kind: 'repayment' },
        { id: 2, text: 'Funded — Local Grocer', amount: 3500, kind: 'fund' },
        { id: 3, text: 'Repayment — Ram Provision', amount: 850, kind: 'repayment' },
      ])
    }, 300)
    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="p-4 bg-white border rounded">
      <div className="font-medium">Live community feed</div>
      <ul className="mt-3 space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex justify-between">
            <span className="text-sm">{it.text}</span>
            <span className={`font-semibold ${it.kind === 'repayment' ? 'text-green-600' : 'text-indigo-600'}`}>₹{it.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
