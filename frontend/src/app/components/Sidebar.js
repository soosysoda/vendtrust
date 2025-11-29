// src/app/components/Sidebar.js
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Sidebar({ active = '' }) {
  // sidebar open on mobile
  const [open, setOpen] = useState(true)
  // auto-open bidding submenu when current active indicates bidding-related page
  const [biddingOpen, setBiddingOpen] = useState(active && active.toString().startsWith('bidding'))

  // unified nav: items may optionally have `children`
  const nav = [
    { key: 'dashboard', label: 'Dashboard', href: '/' },
    {
      key: 'bidding',
      label: 'Bidding',
      children: [
        { key: 'bidding:borrower:new', label: 'Borrower (create)', href: '/bidding/borrower/new' },
        { key: 'bidding:investor', label: 'Investor', href: '/bidding/investor' },
      ],
    },
    { key: 'leaderboard', label: 'Leaderboard', href: '/leaderboard' },
    { key: 'pool', label: 'Community Pool', href: '/' },
    { key: 'profile', label: 'Profile', href: '/auth/login' },
  ]

  return (
    <aside className="flex-shrink-0">
      {/* Mobile toggle */}
      <div className="md:hidden p-2">
        <button
          onClick={() => setOpen(v => !v)}
          className="px-3 py-2 rounded bg-slate-100 text-sm"
          aria-expanded={open}
        >
          {open ? 'Hide menu' : 'Show menu'}
        </button>
      </div>

      {/* Sidebar panel */}
      <div className={`${open ? 'block' : 'hidden'} md:block w-64`}>
        <div className="h-full border-r bg-white min-h-[calc(100vh-64px)] flex flex-col">
          <div className="p-4 border-b">
            <div className="font-semibold text-lg">VendTrust</div>
            <div className="text-xs text-slate-500 mt-1">Trust-driven lending</div>
          </div>

          <nav className="p-3 space-y-1" aria-label="Main navigation">
            {nav.map((item) => {
              const isActiveTop =
                item.key === active ||
                (item.children && item.children.some(c => c.key === active || (active && active.startsWith(item.key))))
              const wrapperCls = isActiveTop
                ? 'bg-indigo-50 border-l-4 border-indigo-600 text-indigo-700'
                : 'hover:bg-slate-50'

              return (
                <div key={item.key} className="space-y-1">
                  {/* top-level area */}
                  <div className={`flex items-center justify-between px-3 py-2 rounded ${wrapperCls}`}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`w-full text-left ${isActiveTop ? 'font-semibold' : 'font-medium'}`}
                        aria-current={isActiveTop ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      // toggler for items with children (like bidding)
                      <button
                        type="button"
                        onClick={() => setBiddingOpen(v => !v)}
                        className={`w-full text-left ${isActiveTop ? 'font-semibold' : 'font-medium'}`}
                        aria-expanded={item.key === 'bidding' ? biddingOpen : undefined}
                      >
                        {item.label}
                      </button>
                    )}

                    {/* show chevron/toggler for bidding item */}
                    {item.key === 'bidding' ? (
                      <button
                        onClick={() => setBiddingOpen(v => !v)}
                        aria-label={biddingOpen ? 'Collapse bidding' : 'Expand bidding'}
                        className="ml-2 p-1"
                      >
                        <svg
                          className={`w-4 h-4 transform transition-transform ${biddingOpen ? 'rotate-90' : ''}`}
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path d="M6 4L14 10L6 16V4Z" fill="currentColor" />
                        </svg>
                      </button>
                    ) : null}
                  </div>

                  {/* children (submenu) - always present in DOM to keep tree stable */}
                  {item.children && (
                    <div
                      className={`pl-4 mt-1 space-y-1 ${item.key === 'bidding' && !biddingOpen ? 'hidden' : ''}`}
                      aria-hidden={item.key === 'bidding' ? !biddingOpen : false}
                    >
                      {item.children.map(child => {
                        const childActive = active === child.key || (active && active.startsWith(child.key))
                        return (
                          <Link
                            key={child.key}
                            href={child.href}
                            className={`block px-3 py-2 rounded text-sm ${childActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-slate-100 text-slate-700'}`}
                            aria-current={childActive ? 'page' : undefined}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="mt-auto p-3 border-t text-sm text-slate-500">
            <div className="mb-2">Quick tips</div>
            <ul className="text-xs space-y-1">
              <li>Complete KYC to increase limits.</li>
              <li>Timely repayments boost trust score.</li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}
