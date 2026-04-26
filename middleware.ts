import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PROTECTED = ['/dashboard']
const AUTH_ONLY = ['/auth/login', '/auth/signup']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('chrona_token')?.value
  const isProtected = PROTECTED.some(r => pathname.startsWith(r))
  const isAuth = AUTH_ONLY.some(r => pathname.startsWith(r))

  if (isProtected) {
    if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))
    const user = await verifyToken(token)
    if (!user) {
      const res = NextResponse.redirect(new URL('/auth/login', req.url))
      res.cookies.delete('chrona_token')
      return res
    }
  }

  if (isAuth && token) {
    const user = await verifyToken(token)
    if (user) return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*', '/auth/:path*'] }
