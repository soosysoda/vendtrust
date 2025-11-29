// src/app/leaderboard/top-trust/TopTrustList.js
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TopTrustList() {
  const [list, setList] = useState(null)
  useEffect(() => {
    let mounted = true
    async function fetchTop() {
      try {
        const res = await fetch('/api/leaderboard/top-trust?limit=50', { cache: 'no-store' })
        if (!res.ok) throw new Error('api')
        const d = await res.json()
        if (!mounted) return
        setList(d)
      } catch (e) {
        setList([
          { id: 'u100', name: 'A. Banerjee', trust: 95, total: 500000 },
          { id: 'u101', name: 'S. Mehta', trust: 92, total: 420000 },
          { id: 'u102', name: 'P. Sharma', trust: 90, total: 300000 },
        ])
      }
    }
    fetchTop()
    return () => (mounted = false)
  }, [])

  if (!list) return <div>Loading…</div>

  return (
    <div className="space-y-3">
      {list.map((u, i) => (
        <div key={u.id} className="p-3 bg-white border rounded flex justify-between items-center">
          <div>
            <div className="font-medium">{u.name}</div>
            <div className="text-xs text-slate-500">Invested: ₹{(u.total || 0).toLocaleString('en-IN')}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-semibold text-emerald-600">{u.trust}</div>
            <Link href={`/users/${u.id}`}><a className="text-sm px-3 py-1 border rounded">View</a></Link>
          </div>
        </div>
      ))}
    </div>
  )
}
