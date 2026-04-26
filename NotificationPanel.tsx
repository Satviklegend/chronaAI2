'use client'
import { useStore } from '@/lib/store'
import { X, Bell, AlertTriangle, Lightbulb, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markRead, unread } = useStore()

  async function handleRead(id: string) {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    markRead(id)
  }

  const ICONS: Record<string, any> = { reminder: Clock, alert: AlertTriangle, insight: Lightbulb }
  const COLORS: Record<string, string> = { reminder: '#0066ff', alert: '#ffee00', insight: '#bf00ff' }

  return (
    <div className="fixed right-4 top-14 z-50 w-80 animate-slide-down">
      <div className="glass-bright rounded-lg overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(0,255,247,0.12)', boxShadow: '0 0 40px rgba(0,255,247,0.05)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" style={{ color: '#00fff7' }} />
            <span className="font-mono text-xs tracking-widest text-white/60">NOTIFICATIONS</span>
            {unread > 0 && <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,255,247,0.1)', color: '#00fff7', fontSize: '10px' }}>{unread}</span>}
          </div>
          <button onClick={onClose} className="p-1 text-white/20 hover:text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.1)' }} />
              <p className="font-mono text-xs text-white/20 tracking-widest">NO NOTIFICATIONS</p>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {notifications.map(n => {
                const Icon = ICONS[n.type] || Bell
                const color = COLORS[n.type] || '#888'
                return (
                  <div key={n.id} onClick={() => !n.read && handleRead(n.id)} className={`flex gap-3 p-4 cursor-pointer hover:bg-white/2 transition-colors ${n.read ? 'opacity-40' : ''}`}>
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded" style={{ background: color + '15', border: `1px solid ${color}25` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/80">{n.title}</p>
                      <p className="text-xs text-white/35 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="font-mono text-xs text-white/20 mt-1" style={{ fontSize: '10px' }}>
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }).toUpperCase()}
                      </p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#00fff7', boxShadow: '0 0 6px #00fff7' }} />}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
