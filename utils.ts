import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isSameDay } from 'date-fns'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export const CATEGORIES = {
  work:     { label: 'Work',     color: '#00fff7', bg: 'bg-cyan-400/15',   text: 'text-cyan-300',   border: 'border-cyan-400/30',   glow: '#00fff7' },
  school:   { label: 'School',   color: '#bf00ff', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30', glow: '#bf00ff' },
  fitness:  { label: 'Fitness',  color: '#39ff14', bg: 'bg-green-400/15',  text: 'text-green-300',  border: 'border-green-400/30',  glow: '#39ff14' },
  personal: { label: 'Personal', color: '#ffee00', bg: 'bg-yellow-400/15', text: 'text-yellow-300', border: 'border-yellow-400/30', glow: '#ffee00' },
  health:   { label: 'Health',   color: '#ff2d78', bg: 'bg-pink-500/15',   text: 'text-pink-300',   border: 'border-pink-500/30',   glow: '#ff2d78' },
  social:   { label: 'Social',   color: '#ff6600', bg: 'bg-orange-400/15', text: 'text-orange-300', border: 'border-orange-400/30', glow: '#ff6600' },
  learning: { label: 'Learning', color: '#0066ff', bg: 'bg-blue-500/15',   text: 'text-blue-300',   border: 'border-blue-500/30',   glow: '#0066ff' },
  other:    { label: 'Other',    color: '#888888', bg: 'bg-gray-500/15',   text: 'text-gray-300',   border: 'border-gray-500/30',   glow: '#888888' },
} as const

export type CategoryKey = keyof typeof CATEGORIES
export function getCat(c: string) { return CATEGORIES[c as CategoryKey] || CATEGORIES.other }

export function formatDur(mins: number) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60), m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function getDur(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
}

export function scoreColor(s: number) {
  if (s >= 80) return 'text-green-400'
  if (s >= 60) return 'text-yellow-400'
  return 'text-pink-400'
}

export function scoreGlow(s: number) {
  if (s >= 80) return '#39ff14'
  if (s >= 60) return '#ffee00'
  return '#ff2d78'
}

export function fmtDate(d: Date | string, f = 'MMM d, yyyy') {
  return format(typeof d === 'string' ? parseISO(d) : d, f)
}

export function isToday(d: Date | string) {
  return isSameDay(typeof d === 'string' ? parseISO(d) : d, new Date())
}

export async function api<T>(url: string, opts?: RequestInit): Promise<{ data?: T; error?: string }> {
  try {
    const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts })
    const j = await r.json()
    if (!r.ok) return { error: j.error || 'Request failed' }
    return { data: j }
  } catch { return { error: 'Network error' } }
}
