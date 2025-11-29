// src/app/auth/signup/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [cpw, setCpw] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (pw !== cpw){
      setError('Passwords do not match')
      return
    }

    if (pw.length < 8){
      setError('Password length must be greater than 8');
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pw }),
      })
      if (!res.ok) throw new Error(await res.text())
      router.push('/auth/login')
    } catch (e) {
      alert('Signup failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = () => {
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 border rounded">
        <h2 className="text-xl font-semibold mb-4">Create account</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded mb-3" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mb-3" />
        <input value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded mb-3" />
        <input value={cpw} onChange={e=>setCpw(e.target.value)} placeholder="Confirm Password" type="password" className="w-full p-2 border rounded mb-3" />
        <div className='flex gap-2'>
          <button type='submit' disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading ? 'Creating…' : 'Create account'}</button>
          <button type='button' onClick={handleChange} disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading ? 'loading…' : "Have an account? sign in"}</button>
        </div>
      </form>
    </div>
  )
}
