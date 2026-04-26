import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'chrona-fallback-secret-32chars!!')

export interface JWTPayload { userId: string; email: string; name: string }

export async function signToken(payload: JWTPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try { const { payload } = await jwtVerify(token, SECRET); return payload as unknown as JWTPayload }
  catch { return null }
}

export async function getCurrentUser(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get('chrona_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function getServerUser(): Promise<JWTPayload | null> {
  const token = cookies().get('chrona_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function authCookie(token: string) {
  return { name: 'chrona_token', value: token, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, maxAge: 604800, path: '/' }
}
