// src/app/page.jsx
import React from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import CommunityPool from './components/CommunityPool'
import FooterCTA from './components/FooterCTA'
import Sidebar from './components/Sidebar'

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <Sidebar active="bidding" />
          <div>
            <Hero />
            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <section className="mt-10">
                <Features />
              </section>

              <section className="mt-12">
                <CommunityPool />
              </section>

              <section className="mt-14">
                <FooterCTA />
              </section>
            </main>
          </div>
        </div>
      </div>
    </div >
  )
}
