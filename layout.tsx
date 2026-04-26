'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { CalendarDays, LayoutDashboard, Target, Lightbulb, Bell, LogOut, Sparkles, ChevronLeft, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import NotificationPanel from '@/components/dashboard/NotificationPanel'

const NAV = [
  { href: '/dashboard',            label: 'OVERVIEW',  icon: LayoutDashboard, color: '#00fff7' },
  { href: '/dashboard/calendar',   label: 'CALENDAR',  icon: CalendarDays,    color: '#bf00ff' },
  { href: '/dashboard/goals',      label: 'GOALS',     icon: Target,          color: '#39ff14' },
  { href: '/dashboard/insights',   label: 'INSIGHTS',  icon: Lightbulb,       color: '#ffee00' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, setUser, sidebarOpen, setSidebar, unread, setNotifications, notifications } = useStore()
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) setUser(d.user)
      else router.push('/auth/login')
    }).catch(() => router.push('/auth/login'))
  }, [])

  useEffect(() => {
    if (!user) return
    fetch('/api/notifications').then(r => r.json()).then(d => d.notifications && setNotifications(d.notifications))
  }, [user])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    toast.success('SESSION TERMINATED')
    router.push('/')
  }

  if (!user) return (
    <div className="min-h-screen bg-dark-950 grid-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border border-neon-cyan/60 flex items-center justify-center animate-pulse" style={{ boxShadow: '0 0 20px rgba(0,255,247,0.3)' }}>
          <Sparkles className="w-5 h-5 text-neon-cyan" style={{ color: '#00fff7' }} />
        </div>
        <p className="font-mono text-xs text-white/30 tracking-[0.2em] animate-pulse">LOADING SYSTEM...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* ── Sidebar ── */}
      <aside className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300',
        'border-r border-neon-cyan/8',
        sidebarOpen ? 'w-56' : 'w-14',
      )} style={{ background: 'rgba(7,7,16,0.95)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-neon-cyan/8">
          <div className="flex-shrink-0 w-8 h-8 border border-neon-cyan/50 flex items-center justify-center" style={{ boxShadow: '0 0 10px rgba(0,255,247,0.2)' }}>
            <span className="font-display text-xs font-bold" style={{ color: '#00fff7', textShadow: '0 0 8px #00fff7' }}>C</span>
          </div>
          {sidebarOpen && <span className="font-display text-xs tracking-[0.2em] gradient-text-chrona whitespace-nowrap">CHRONA AI</span>}
          <button onClick={() => setSidebar(!sidebarOpen)} className="ml-auto text-white/20 hover:text-neon-cyan transition-colors p-1">
            {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon, color }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link key={href} href={href}
                className={cn('flex items-center gap-3 px-2.5 py-2.5 rounded transition-all group', active ? 'bg-white/5' : 'hover:bg-white/3')}>
                <Icon className="w-4 h-4 flex-shrink-0 transition-all" style={{ color: active ? color : 'rgba(255,255,255,0.3)', filter: active ? `drop-shadow(0 0 4px ${color})` : 'none' }} />
                {sidebarOpen && (
                  <span className="font-mono text-xs tracking-widest transition-colors whitespace-nowrap"
                    style={{ color: active ? color : 'rgba(255,255,255,0.3)' }}>
                    {label}
                  </span>
                )}
                {active && <div className="absolute left-0 w-0.5 h-8 rounded-r" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-neon-cyan/8 space-y-1">
          <button onClick={logout} className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded text-white/25 hover:text-neon-pink transition-all hover:bg-white/3">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="font-mono text-xs tracking-widest">SIGN OUT</span>}
          </button>
        </div>

        {/* User */}
        {sidebarOpen && (
          <div className="px-3 py-3 border-t border-neon-cyan/8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center font-display text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #00fff7, #bf00ff)', color: '#030308' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/80 truncate">{user.name}</p>
                <p className="text-xs text-white/25 truncate font-mono">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <main className={cn('flex-1 min-h-screen transition-all duration-300', sidebarOpen ? 'ml-56' : 'ml-14')}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-neon-cyan/8 px-6 py-3 flex items-center justify-end"
          style={{ background: 'rgba(7,7,16,0.9)', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-white/30 hover:text-neon-cyan transition-colors">
            <Bell className="w-4 h-4" />
            {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#ff2d78', boxShadow: '0 0 6px #ff2d78' }} />}
          </button>
        </header>

        <div className="p-6">{children}</div>

        {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
      </main>
    </div>
  )
}
