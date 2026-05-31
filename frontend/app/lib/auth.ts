export const ACCESS_TOKEN_KEY = 'access_token'
export const AUTH_REDIRECT_MESSAGE_KEY = 'authRedirectMessage'

export type JwtPayload = {
  exp?: number
  [key: string]: any
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=')
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true
  const payload = parseJwt(token)
  if (!payload) return true
  if (!payload.exp) return false
  return Math.floor(Date.now() / 1000) >= payload.exp
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  return !!token && !isTokenExpired(token)
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem('user_role')
}

export function setAuthRedirectMessage(message: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_REDIRECT_MESSAGE_KEY, message)
}

export function consumeAuthRedirectMessage(): string | null {
  if (typeof window === 'undefined') return null
  const message = localStorage.getItem(AUTH_REDIRECT_MESSAGE_KEY)
  if (message) {
    localStorage.removeItem(AUTH_REDIRECT_MESSAGE_KEY)
  }
  return message
}
