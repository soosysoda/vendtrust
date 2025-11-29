'use client'

// src/app/community-pool/components/LeftMenu.js
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LeftMenu() {
  const path = usePathname() || ''

  const linkClass = (p) => `block px-3 py-2 rounded-md text-sm ${path === p ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100'}`

  return (
    <nav className="sticky top-6 space-y-3">
      <div className="bg-white rounded-2xl shadow-sm p-3">
        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Menu</div>

        <Link href="/community-pool" className={linkClass('/community-pool')}>Overview</Link>
        <Link href="/community-pool/borrower" className={linkClass('/community-pool/borrower')}>Borrower Portal</Link>
        <Link href="/community-pool/investor" className={linkClass('/community-pool/investor')}>Investor Portal</Link>
        <Link href="/bids/open" className={linkClass('/bids/open')}>Open Bids</Link>

        <div className="mt-3 border-t pt-3">
          <div className="text-xs text-slate-500 mb-2">Integrations</div>
          <a className="flex items-center gap-2 px-2 py-1 rounded-md text-sm text-slate-700 hover:bg-slate-50" href="https://aws.amazon.com" target="_blank" rel="noreferrer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M2 12c3-5 9-6 12-6s9 1 10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            AWS Console
          </a>
        </div>
      </div>
    </nav>
  )
}
