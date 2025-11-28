// src/app/layout.jsx
import './globals.css'
import React from 'react'

export const metadata = {
  title: 'VendTrust — Community lending built on trust',
  description: 'Fund small vendors, earn rewards, and grow your trust score.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className=''>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b">
          <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg px-3 py-1 bg-linear-to-r from-indigo-600 to-violet-500 text-white font-semibold">
                  VendTrust
                </div>
                <span className="text-sm text-slate-500">Community lending • trust-driven</span>
              </div>

              <div className="flex items-center gap-3">
                <a href="/leaderboard/low-trust" className="text-sm px-3 py-2 rounded hover:bg-slate-100">Low-trust Lenders</a>
                <a href="/loans" className="text-sm px-3 py-2 rounded bg-indigo-600 text-white hover:opacity-95">Browse Loans</a>
              </div>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="mt-16 border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
            © {new Date().getFullYear()} VendTrust — built for micro-vendors. Privacy-first. Aadhaar-safe.
          </div>
        </footer>
      </body>
    </html>
  )
}
