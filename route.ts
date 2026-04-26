import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
export async function GET(req: NextRequest) {
  const u = await getCurrentUser(req)
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ notifications: await prisma.notification.findMany({ where: { userId: u.userId }, orderBy: { createdAt: 'desc' }, take: 20 }) })
}
export async function PUT(req: NextRequest) {
  const u = await getCurrentUser(req)
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await prisma.notification.updateMany({ where: { id, userId: u.userId }, data: { read: true } })
  return NextResponse.json({ success: true })
}
