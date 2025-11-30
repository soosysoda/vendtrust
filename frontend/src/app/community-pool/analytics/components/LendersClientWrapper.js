'use client'
import dynamic from 'next/dynamic'
const LendersList = dynamic(() => import('./LendersList'), { ssr: false })

export default function LendersClientWrapper(props) {
  return <LendersList {...props} />
}
