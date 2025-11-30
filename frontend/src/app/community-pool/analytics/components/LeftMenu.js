'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LeftMenu({ active = '' }) {
  const pathname = usePathname() || ''
  const menu = [
    { id: 'aws', label: 'AWS', href: '/settings/aws' },
    { id: 'community', label: 'Community Pool', href: '/community-pool' },
    { id: 'bids', label: 'Bidding', href: '/bidding/open' },
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' }
  ]
  return (
    <nav className="sticky top-6">
      <div className="bg-white rounded-2xl p-3 shadow-sm space-y-2">
        {menu.map(m => {
          const isActive = pathname.startsWith(m.href) || active === m.id
          return (
            <Link key={m.id} href={m.href} className={`block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
              {m.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
