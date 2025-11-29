// src/app/bidding/borrower/[bidId]/page.js
'use client'
import { useEffect, useMemo, useState } from 'react'
import BidCard from '../../components/BidCard'
import ActiveInvestorsList from '../../components/ActiveInvestorsList'
import usePoll from '../../components/usePoll'
import { useRouter } from 'next/navigation'

export default function BorrowerBidPage({ params }) {
  const { bidId } = params
  const router = useRouter()
  const [bid, setBid] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [me, setMe] = useState(null)

  // load bid from backend OR sessionStorage fallback
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`/api/bids/${bidId}`, { cache: 'no-store' })
        if (res.ok) {
          const d = await res.json()
          if (!mounted) return
          setBid(d)
        } else {
          const stored = sessionStorage.getItem(`bid:${bidId}`)
          if (stored) {
            setBid(JSON.parse(stored))
          } else {
            // for demo redirect back
            router.push('/bidding/borrower/new')
          }
        }
      } catch (e) {
        const stored = sessionStorage.getItem(`bid:${bidId}`)
        if (stored) setBid(JSON.parse(stored))
      }
    }
    load()
    return () => (mounted = false)
  }, [bidId, router])

  // fetch me
  useEffect(() => {
    let mounted = true
    (async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        if (!res.ok) throw new Error('no api')
        const d = await res.json()
        if (!mounted) return
        setMe(d)
      } catch {
        setMe({ id: 'u-borrower', name: 'You', trust_score: 720 })
      }
    })()
    return () => (mounted = false)
  }, [])

  // poll participants for live updates (mock)
  const participants = usePoll(async () => {
    // replace with real: GET /api/bids/:id/participants
    try {
      const res = await fetch(`/api/bids/${bidId}/participants`, { cache: 'no-store' })
      if (!res.ok) throw new Error('no api')
      return await res.json()
    } catch (e) {
      // fallback demo: simulate arriving investor after some seconds
      const saved = sessionStorage.getItem(`bid:${bidId}`)
      const b = saved ? JSON.parse(saved) : bid
      if (!b) return []
      // simple simulation: after 8s add a mock participant if none
      const p = JSON.parse(sessionStorage.getItem(`participants:${bidId}`) || '[]')
      if (p.length === 0 && Math.random() > 0.6) {
        const mock = { id: `inv-${Date.now()}`, maskedName: 'R. Singh', trust: Math.floor(400 + Math.random()*300), commitment: Math.round(b.amount * (0.2 + Math.random()*0.6)) }
        p.push(mock)
        sessionStorage.setItem(`participants:${bidId}`, JSON.stringify(p))
      }
      return p
    }
  }, 4000) || []

  // whenever participants changes, update local bid and notify borrower
  useEffect(() => {
    if (!participants || !bid) return
    // set local bid participants
    setBid(prev => prev ? { ...prev, participants } : null)

    // notify on new joiners
    const prevIds = (bid && bid.participants || []).map(x => x.id)
    const newOnes = participants.filter(p => !prevIds.includes(p.id))
    if (newOnes.length > 0) {
      newOnes.forEach(p => pushNotification(`Investor joined: ${p.maskedName} (Trust ${p.trust})`))
    }
    // store current participants for next diff
    sessionStorage.setItem(`participants:${bidId}`, JSON.stringify(participants))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants])

  function pushNotification(text) {
    setNotifications(n => [{ id: Date.now(), text }, ...n].slice(0, 6))
    // try browser notifications
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('VendTrust', { body: text })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(p => p === 'granted' && new Notification('VendTrust', { body: text }))
      }
    }
  }

  function handleSelectInvestor(bidObj) {
    // borrower selects — ideally call backend to finalize; here we show confirm
    const pick = bidObj.participants && bidObj.participants[0]
    if (!pick) return alert('No investors to select')
    const ok = confirm(`Select ${pick.maskedName} to fund? This will lock funds and close the bid.`)
    if (!ok) return
    // call API to finalize selection (backend)
    alert(`Investor ${pick.maskedName} selected — (mock)`)
    // maybe redirect to borrower dashboard
    router.push('/bidding/borrower/new')
  }

  if (!bid) return <div className="p-6">Loading bid…</div>

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">
        {/* left: active participants */}
        <div className="col-span-1">
          <ActiveInvestorsList participants={bid.participants || participants} />
        </div>

        {/* main: live investor feed + bid card */}
        <div className="col-span-3 space-y-4">
          <div className="p-4 bg-white border rounded">
            <h2 className="font-semibold">Live investors willing to approve your pay</h2>
            <p className="text-sm text-slate-500 mt-1">Select an investor within 24 hours or the bid expires.</p>

            <div className="mt-4 space-y-2">
              {(bid.participants || participants || []).length === 0 ? (
                <div className="p-4 text-sm text-slate-500">No investors yet — waiting…</div>
              ) : ( (bid.participants || participants).map(inv => (
                <div key={inv.id} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{inv.maskedName}</div>
                    <div className="text-xs text-slate-500">Trust: {inv.trust}</div>
                    <div className="text-xs text-slate-500">Commitment: ₹{inv.commitment}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const ok = confirm(`Lock funds from ${inv.maskedName}? (mock)`)
                      if (ok) {
                        alert('Investor selected (mock).')
                      }
                    }} className="px-3 py-1 bg-indigo-600 text-white rounded">Select</button>
                  </div>
                </div>
              )) )
            }
            </div>
          </div>

          <BidCard bid={bid} onSelectInvestor={handleSelectInvestor} />

          <div>
            <h3 className="font-semibold mb-2">Notifications</h3>
            <div className="space-y-2">
              {notifications.length === 0 ? <div className="text-sm text-slate-500">No notifications yet</div> :
                notifications.map(n => <div key={n.id} className="text-sm bg-white p-2 border rounded">{n.text}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
