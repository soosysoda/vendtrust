// src/app/components/FooterCTA.jsx
import React from 'react'

export default function FooterCTA() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold">Ready to fund or borrow?</h2>
        <p className="mt-2 text-sm text-indigo-100 max-w-2xl mx-auto">
          Join the community. Your trust score determines your bidding power — increase it to unlock bigger bids.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/signup" className="px-6 py-3 bg-white text-indigo-600 font-medium rounded">Create account</a>
          <a href="/loans" className="px-6 py-3 border border-white/40 rounded">Browse loans</a>
        </div>
      </div>
    </div>
  )
}
