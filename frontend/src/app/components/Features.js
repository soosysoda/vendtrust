// src/app/components/Features.jsx
import React from 'react'

const Feature = ({ title, desc }) => (
  <div className="p-6 border rounded-lg bg-white">
    <h3 className="font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-slate-600">{desc}</p>
  </div>
)

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Feature
        title="Trust-driven bidding"
        desc="Bid limits are auto computed from your trust score — transparent and fair."
      />
      <Feature
        title="Live community pool"
        desc="See 75% of the pool available for disbursement & live rewardable activity."
      />
      <Feature
        title="KYC & privacy-first"
        desc="PAN / Aadhaar authentication via approved providers. We never store sensitive biometrics or OTPs."
      />
    </div>
  )
}
