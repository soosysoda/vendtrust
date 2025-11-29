'use client'

// src/app/community-pool/components/AnalyticsPanel.js
import { useEffect, useState } from 'react'
import LineChart from './LineChart'
import DualBarChart from './DualBarChart'

const PERIODS = [6, 9, 12, 18]

export default function AnalyticsPanel({ apiBase = '' }) {
  const [period, setPeriod] = useState(12) // months
  const [loading, setLoading] = useState(true)
  const [series, setSeries] = useState([]) // { label, points: [{x: dateIso, y: num}]}
  const [bankVsVend, setBankVsVend] = useState([]) // { periodLabel, bank, vend }

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        // If apiBase not set, generate mock data for dev
        if (!apiBase) {
          const now = new Date()
          const months = period
          const s = {
            label: 'Pool Volume',
            points: Array.from({ length: months }).map((_, i) => {
              const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
              return { x: d.toISOString(), y: Math.round(20000 + Math.random() * 40000) }
            })
          }
          const bv = Array.from({ length: months }).map((_, i) => {
            const label = `${months - (months - 1 - i)}m`
            return { period: label, bank: Math.round(10000 + Math.random() * 30000), vend: Math.round(8000 + Math.random() * 35000) }
          })
          if (!mounted) return
          setSeries([s])
          setBankVsVend(bv)
          setLoading(false)
          return
        }

        // Real API requests (expect endpoints that return required shape)
        const [sRes, bvRes] = await Promise.all([
          fetch(`${apiBase}/api/community/analytics?months=${period}`),
          fetch(`${apiBase}/api/community/bank-vs-vend?months=${period}`)
        ])
        const sjson = sRes.ok ? await sRes.json() : { series: [] }
        const bvjson = bvRes.ok ? await bvRes.json() : { data: [] }
        if (!mounted) return
        setSeries(sjson.series || [])
        setBankVsVend(bvjson.data || [])
      } catch (err) {
        console.warn('analytics load error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [period, apiBase])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium">Pool activity</h3>
          <div className="text-sm text-slate-500">(last {period} months)</div>
        </div>

        <div className="flex items-center gap-2">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-md text-sm ${p === period ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {p}m
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-3 rounded-md border">
        {loading ? <div className="py-10 text-center text-slate-500">Loading chart…</div> : (
          <>
            <LineChart series={series} height={220} />
            <div className="mt-6">
              <DualBarChart data={bankVsVend} height={220} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
