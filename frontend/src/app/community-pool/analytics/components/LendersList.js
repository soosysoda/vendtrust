'use client'
import { useEffect, useState } from 'react'

export default function LendersList({ type = 'active', initial = [] }) {
  const [items, setItems] = useState(initial)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!API_BASE) return
      try {
        const res = await fetch(`${API_BASE}/api/community/lenders?type=${type}`)
        const json = await res.json()
        if (!mounted) return
        setItems(json.items || initial)
      } catch (e) {
        // ignore
      }
    }
    load()
    // poll every 12s
    const t = setInterval(load, 12000)
    return () => { mounted = false; clearInterval(t) }
  }, [API_BASE, type])

  if (!items || items.length === 0) {
    return <div className="py-4 text-sm text-slate-500">No lenders yet.</div>
  }

  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <div key={it.user_id || idx} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-700">
            { (it.name || 'U').slice(0,2).toUpperCase() }
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">{it.name || 'Unknown'}</div>
            <div className="text-xs text-slate-500">{type === 'active' ? `committed ₹${(it.amount||0).toLocaleString()}` : `invested ₹${(it.invested||0).toLocaleString()}`}</div>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">{it.trust || '-'}</div>
        </div>
      ))}
    </div>
  )
}
