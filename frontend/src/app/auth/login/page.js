// src/app/auth/login/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw }),
      })
      if (!res.ok) throw new Error(await res.text())
      router.push('/dashboard') // or redirect
    } catch (e) {
      alert('Login failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 border rounded">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mb-3" />
        <input value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded mb-3" />
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
