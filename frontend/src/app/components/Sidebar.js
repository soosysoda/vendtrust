'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ active = '' }) {
  // auto-open if current path matches a group
  const pathname = usePathname()
  const [open, setOpen] = useState({
    bidding: false,
    community: false
  })

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/bidding')) setOpen(o => ({ ...o, bidding: true }))
    if (pathname.startsWith('/community-pool')) setOpen(o => ({ ...o, community: true }))
  }, [pathname])

  const toggle = (k) => setOpen(o => ({ ...o, [k]: !o[k] }))

  const itemClass = (isActive) =>
    `flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm ${
      isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100'
    }`

  const subClass = (isActive) =>
    `block w-full text-sm px-3 py-2 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`

  return (
    <nav className="sticky top-6 self-start">
      <div className="w-64 space-y-3">
        <div className="px-2">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Marketplace</div>

          {/* Bidding group */}
          <div>
            <button
              onClick={() => toggle('bidding')}
              className={itemClass(active === 'bidding' || pathname?.startsWith('/bidding'))}
              aria-expanded={open.bidding}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>
                Bidding
              </span>
              <svg className={`w-4 h-4 transform ${open.bidding ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path d="M6 6 L14 10 L6 14 Z" /></svg>
            </button>

            {open.bidding && (
              <div className="mt-2 space-y-1 pl-2">
                <Link href="/bidding/borrower/new" className={subClass(pathname === '/bidding/borrower/new')}>Borrower</Link>
                <Link href="/bidding/investor" className={subClass(pathname === '/bidding/investor')}>Investor</Link>
              </div>
            )}
          </div>

          {/* Community Pool group */}
          <div className="mt-2">
            <button
              onClick={() => toggle('community')}
              className={itemClass(active === 'community-pool' || pathname?.startsWith('/community-pool'))}
              aria-expanded={open.community}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM5 20v-1a4 4 0 014-4h6a4 4 0 014 4v1"/></svg>
                Community Pool
              </span>
              <svg className={`w-4 h-4 transform ${open.community ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path d="M6 6 L14 10 L6 14 Z" /></svg>
            </button>

            {open.community && (
              <div className="mt-2 space-y-1 pl-2">
                <Link href="/community-pool/borrower" className={subClass(pathname === '/community-pool/borrower')}>Borrower</Link>
                <Link href="/community-pool/investor" className={subClass(pathname === '/community-pool/investor')}>Investor</Link>
              </div>
            )}
          </div>

          {/* other nav items */}
          <div className="mt-4">
            <Link href="/loans" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100">Loans</Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 mt-1">Dashboard</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
