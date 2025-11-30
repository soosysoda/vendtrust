'use client'

// src/app/community-pool/components/DualBarChart.js
import React from 'react'

export default function DualBarChart({ data = [], height = 220 }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-slate-500 py-6 text-center">No comparative data</div>
  }

  const width = Math.max(600, data.length * 60)
  const viewbox = `0 0 ${width} ${height}`
  const marginLeft = 40
  const marginRight = 20
  const innerW = width - marginLeft - marginRight

  const maxVal = Math.max(...data.flatMap(d => [d.bank || 0, d.vend || 0])) || 1
  const barGroupW = innerW / data.length
  const bankBarW = Math.max(8, barGroupW * 0.35)
  const vendBarW = Math.max(8, barGroupW * 0.35)

  const toY = (v) => height - 30 - (v / maxVal) * (height - 60)

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={viewbox} width="100%" height={height} className="block">
        {/* y grid */}
        <g stroke="#e6e7eb">
          {[0,0.25,0.5,0.75,1].map((f,i) => {
            const y = toY(maxVal * f)
            return <line key={i} x1={marginLeft} x2={width - marginRight} y1={y} y2={y} strokeWidth="1" />
          })}
        </g>

        {/* bars */}
        <g>
          {data.map((d, i) => {
            const gx = marginLeft + i * barGroupW
            const bankH = d.bank || 0
            const vendH = d.vend || 0
            const bankY = toY(bankH)
            const vendY = toY(vendH)
            const bankX = gx + (barGroupW/2) - bankBarW - 4
            const vendX = gx + (barGroupW/2) + 4
            const labelX = gx + barGroupW/2
            return (
              <g key={i}>
                <rect x={bankX} y={bankY} width={bankBarW} height={height - 30 - bankY} rx="3" fill="#e11d48" />
                <rect x={vendX} y={vendY} width={vendBarW} height={height - 30 - vendY} rx="3" fill="#0066ff" />
                <text x={labelX} y={height - 8} textAnchor="middle" fontSize="11" fill="#475569">{d.period}</text>
              </g>
            )
          })}
        </g>

        {/* legend */}
        <g>
          <rect x={width - marginRight - 140} y={8} width={12} height={12} fill="#e11d48" rx="2" />
          <text x={width - marginRight - 120} y={18} fontSize="12" fill="#475569">Bank</text>

          <rect x={width - marginRight - 70} y={8} width={12} height={12} fill="#0066ff" rx="2" />
          <text x={width - marginRight - 48} y={18} fontSize="12" fill="#475569">VendTrust</text>
        </g>
      </svg>
    </div>
  )
}


