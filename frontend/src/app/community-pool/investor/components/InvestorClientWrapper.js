'use client'

import dynamic from 'next/dynamic'

// dynamic import allowed here because this file is a CLIENT component
const InvestorPanel = dynamic(() => import('./InvestorPanel'), {
  ssr: false
})

export default function InvestorClientWrapper() {
  return <InvestorPanel />
}
