'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function AuthSuccessInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('clue_token', token)
    }
    // Redirect back to the main app
    router.replace('/')
  }, [searchParams, router])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#FF6347',
      color: '#fff',
      fontFamily: 'Space Grotesk, sans-serif',
    }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>●●●●●</div>
      <p style={{ fontSize: 18, fontWeight: 500 }}>signing you in...</p>
    </div>
  )
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#FF6347',
        color: '#fff',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>●●●●●</div>
        <p style={{ fontSize: 18, fontWeight: 500 }}>signing you in...</p>
      </div>
    }>
      <AuthSuccessInner />
    </Suspense>
  )
}
