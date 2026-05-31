"use client"

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ACCESS_TOKEN_KEY, AUTH_REDIRECT_MESSAGE_KEY, isTokenExpired, clearAuth, setAuthRedirectMessage } from '../lib/auth'

type AuthGuardProps = {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (!token || isTokenExpired(token)) {
      clearAuth()
      setAuthRedirectMessage('É necessário estar logado para acessar essa página')
      router.push('/')
      return
    }

    setAuthorized(true)
  }, [router])

  if (!authorized) {
    return null
  }

  return <>{children}</>
}
