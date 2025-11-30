'use client'
import dynamic from 'next/dynamic'
const AnalyticsPanel = dynamic(() => import('./AnalyticsPanel'), { ssr: false })

export default function AnalyticsClientWrapper({ serverData }) {
  // pass server-provided data into the client chart for immediate render
  return <AnalyticsPanel initialData={serverData} />
}
