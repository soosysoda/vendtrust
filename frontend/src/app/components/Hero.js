// src/app/components/Hero.jsx
import React from 'react'

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Fund micro-vendors. Earn rewards. Grow trust.
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl">
              VendTrust is a community-first lending platform where trust score drives who can bid and how much.
              Transparent leaderboard, live community pool, and rewardable repayments — made simple.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/loans"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-white text-sm font-medium shadow-sm hover:opacity-95"
              >
                Browse loans
              </a>

              <a
                href="/leaderboard/low-trust"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View low-trust leaderboard
              </a>
            </div>

            <div className="mt-6 text-xs text-slate-500">
              Pro tip: increase your trust score by timely repayments, completing KYC, and active funding.
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Community pool (live)</div>
                <div className="mt-1 text-2xl font-semibold">₹ 5,24,800</div>
                <div className="text-sm text-slate-500">Available for disbursal: 75%</div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-xs text-slate-400">Top investor</div>
                <div className="mt-1 font-medium">A. Banerjee</div>
                <div className="text-xs text-slate-500">Trust 92</div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="text-sm text-slate-600">Live rewardable repayments</div>
              <ul className="mt-3 space-y-2 max-h-36 overflow-auto">
                <li className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                  <div className="text-sm">Repayment — Jyoti Tea Stall</div>
                  <div className="text-sm font-semibold text-green-600">₹ 1,200</div>
                </li>
                <li className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                  <div className="text-sm">Repayment — Ram Provision</div>
                  <div className="text-sm font-semibold text-green-600">₹ 850</div>
                </li>
                <li className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                  <div className="text-sm">Funded — Suman Electronics</div>
                  <div className="text-sm font-semibold text-indigo-600">₹ 5,000</div>
                </li>
              </ul>
            </div>

            <div className="mt-6 text-xs text-slate-400">
              Only rewardable transactions are shown publicly. Sensitive info is masked.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
