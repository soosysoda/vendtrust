// src/app/page.jsx
import React from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import CommunityPool from './components/CommunityPool'
import FooterCTA from './components/FooterCTA'

export default function Home() {
  return (
    <div className="min-h-screen">
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
  )
}
