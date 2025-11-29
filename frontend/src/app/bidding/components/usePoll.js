// src/app/bidding/components/usePoll.js
'use client'
import { useEffect, useRef, useState } from 'react'

export default function usePoll(fn, interval = 5000) {
  const [data, setData] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        const res = await fn()
        if (!mounted) return
        setData(res)
      } catch (e) {
        // ignore
      }
    }
    run()
    timerRef.current = setInterval(run, interval)
    return () => {
      mounted = false
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [fn, interval])

  return data
}
