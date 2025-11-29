'use client'

// client component for live community events
import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

export default function LiveCommunity() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const socketRef = useRef(null)

  // Replace with your API base if needed
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

  useEffect(() => {
    let mounted = true

    async function fetchInitial() {
      try {
        const res = await fetch(`${API_BASE}/api/community/recent`)
        if (!res.ok) {
          setItems([])
          setLoading(false)
          return
        }
        const data = await res.json()
        if (!mounted) return
        setItems(data.items || [])
        setLoading(false)
      } catch (err) {
        console.warn('LiveCommunity fetch error', err)
        if (mounted) setLoading(false)
      }
    }

    fetchInitial()

    // connect socket.io
    try {
      const socket = io(API_BASE || undefined, { transports: ['websocket', 'polling'] })
      socketRef.current = socket

      socket.on('connect', () => {
        // subscribe to community room if needed
        socket.emit('subscribe_room', 'community_pool')
      })

      socket.on('rewardable_event', (ev) => {
        // new event arrives: prepend and keep unique by id
        setItems(prev => {
          const exists = prev.find(i => i.id === ev.id)
          if (exists) return prev
          return [ev, ...prev].slice(0, 200)
        })
      })

      // fallback channel
      socket.on('new_bid', (b) => {
        // ignore unless rewardable
      })

      socket.on('disconnect', () => {
        // console.debug('socket disconnected')
      })

      return () => {
        mounted = false
        try { socket.disconnect() } catch (e) {}
      }
    } catch (e) {
      // socket.io-client might not be present: rely on polling fallback
      console.warn('socket init failed, falling back to polling', e)
      const poll = setInterval(fetchInitial, 8000)
      return () => clearInterval(poll)
    }
  }, [])

  if (loading) {
    return <div className="py-8 text-center text-slate-500">Loading live events…</div>
  }

  if (!items || items.length === 0) {
    return <div className="py-8 text-center text-slate-500">No rewardable events yet.</div>
  }

  return (
    <div className="divide-y">
      {items.map(item => (
        <article key={item.id || `${item.type}-${item.timestamp}`} className="py-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">{item.title || (item.type === 'repayment' ? 'Repayment' : 'Payment')}</div>
                  <div className="text-xs text-slate-500">{item.user_name ? `by ${item.user_name}` : ''} • {new Date(item.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-sm font-semibold text-slate-800">₹{Number(item.amount).toLocaleString()}</div>
              </div>

              {item.note ? <p className="mt-1 text-sm text-slate-600">{item.note}</p> : null}

              {item.rewardable ? (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs bg-green-50 text-green-700">
                  Rewardable
                </div>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
