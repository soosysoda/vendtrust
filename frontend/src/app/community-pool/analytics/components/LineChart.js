'use client'

// src/app/community-pool/components/LineChart.js
import React from 'react'

function niceNumber(n) {
  return Math.round(n)
}

export default function LineChart({ series = [], height = 200 }) {
  // flatten points (use first series for x-axis)
  const allPoints = (series[0] && series[0].points) || []
  const xs = allPoints.map(p => new Date(p.x).getTime())
  const ys = series.flatMap(s => (s.points || []).map(p => p.y))
  if (xs.length === 0) {
    return <div className="text-sm text-slate-500 py-8 text-center">No data</div>
  }
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const padY = (maxY - minY) * 0.12 || maxY * 0.12 || 10
  const chartMinY = Math.max(0, minY - padY)
  const chartMaxY = maxY + padY

  const width = 900 // viewbox width
  const viewbox = `0 0 ${width} ${height}`
  const marginLeft = 40
  const marginRight = 20
  const innerW = width - marginLeft - marginRight
  const toX = (t) => marginLeft + ((t - minX) / (maxX - minX || 1)) * innerW
  const toY = (v) => height - 20 - ((v - chartMinY) / (chartMaxY - chartMinY || 1)) * (height - 40)

  // build path(s)
  const paths = series.map((s, si) => {
    const pts = (s.points || []).map(p => `${toX(new Date(p.x).getTime())},${toY(p.y)}`)
    return pts.length ? `M ${pts.join(' L ')}` : ''
  })

  // y ticks
  const ticks = 4
  const ysTicks = Array.from({ length: ticks + 1 }).map((_, i) => {
    const v = chartMinY + (i / ticks) * (chartMaxY - chartMinY)
    return { v: Math.round(v), y: toY(v) }
  })

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={viewbox} width="100%" height={height} className="block">
        {/* y grid */}
        <g stroke="#e6e7eb" strokeWidth="1">
          {ysTicks.map((t, i) => (
            <line key={i} x1={marginLeft} x2={width - marginRight} y1={t.y} y2={t.y} />
          ))}
        </g>

        {/* y labels */}
        <g fill="#64748b" fontSize="11">
          {ysTicks.map((t, i) => (
            <text key={i} x={8} y={t.y + 4}>{niceNumber(t.v)}</text>
          ))}
        </g>

        {/* lines */}
        <g fill="none" strokeWidth="2">
          {paths.map((p, i) => (
            <path key={i} d={p} stroke={i === 0 ? '#4f46e5' : '#06b6d4'} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>

        {/* x labels */}
        <g fill="#94a3b8" fontSize="11">
          {allPoints.map((pt, i) => {
            const x = toX(new Date(pt.x).getTime())
            const date = new Date(pt.x)
            const label = `${date.getMonth()+1}/${String(date.getFullYear()).slice(-2)}`
            return <text key={i} x={x} y={height - 2} textAnchor="middle">{label}</text>
          })}
        </g>
      </svg>
    </div>
  )
}
