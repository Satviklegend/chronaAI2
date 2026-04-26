'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { format, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns'
import { Sparkles, TrendingUp, Clock, Target, Zap, AlertTriangle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getCat, scoreColor, formatDur, getDur, fmtDate } from '@/lib/utils'

export default function DashboardPage() {
  const { user, aiLoading, setAiLoading, lastInsight, setLastInsight } = useStore()
  const [events, setEvents] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

  useEffect(() => {
    async function load() {
      try {
        const [er, gr, ir] = await Promise.all([
          fetch(`/api/events?start=${weekStart.toISOString()}&end=${weekEnd.toISOString()}`),
          fetch('/api/goals'),
          fetch('/api/insights?limit=1'),
        ])
        const [ed, gd, id] = await Promise.all([er.json(), gr.json(), ir.json()])
        setEvents(ed.events || [])
        setGoals(gd.goals || [])
        if (id.insights?.[0]) setLastInsight(id.insights[0])
      } finally { setLoading(false) }
    }
    load()
  }, [])

  async function runAnalysis() {
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: today.toISOString() }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLastInsight(data.insight)
      toast.success('ANALYSIS COMPLETE ⚡')
    } catch (err: any) {
      toast.error(err.message)
    } finally { setAiLoading(false) }
  }

  const todayEvents = events.filter(e => isSameDay(new Date(e.startTime), today))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i)
    const dayEvents = events.filter(e => isSameDay(new Date(e.startTime), day))
    const mins = dayEvents.reduce((s, e) => s + getDur(e.startTime, e.endTime), 0)
    return { day, count: dayEvents.length, mins, label: format(day, 'EEE') }
  })

  const score = lastInsight?.productivityScore || 0
  const sc = score >= 80 ? '#39ff14' : score >= 60 ? '#ffee00' : '#ff2d78'
  const totalHours = Math.round(events.reduce((s, e) => s + getDur(e.startTime, e.endTime) / 60, 0))

  const hour = today.getHours()
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] mb-1">{greeting}, OPERATOR</p>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider">
            <span className="gradient-text-chrona">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="font-mono text-xs text-white/20 mt-1">{format(today, 'EEEE · MMMM d, yyyy')}</p>
        </div>
        <button onClick={runAnalysis} disabled={aiLoading}
          className="btn-neon text-xs py-2.5 px-5 disabled:opacity-40 flex items-center gap-2">
          <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
          {aiLoading ? 'ANALYZING...' : 'RUN AI ANALYSIS'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'PRODUCTIVITY', val: score ? `${score}` : '—', unit: '/100', color: sc, sub: score >= 70 ? 'OPTIMAL' : score > 0 ? 'IMPROVABLE' : 'RUN SCAN', icon: TrendingUp },
          { label: "TODAY'S EVENTS", val: todayEvents.length, unit: '', color: '#00fff7', sub: `${todayEvents.filter(e => e.status === 'scheduled').length} UPCOMING`, icon: Clock },
          { label: 'ACTIVE GOALS', val: goals.filter(g => g.status === 'active').length, unit: '', color: '#39ff14', sub: `${goals.length} TOTAL`, icon: Target },
          { label: 'WEEK HOURS', val: totalHours, unit: 'h', color: '#ffee00', sub: `${events.length} EVENTS`, icon: Zap },
        ].map(({ label, val, unit, color, sub, icon: Icon }) => (
          <div key={label} className="glass-bright rounded-lg p-4 relative overflow-hidden" style={{ borderColor: color + '18' }}>
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-10" style={{ background: color, transform: 'translate(30%, -30%)' }} />
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
              <Icon className="w-3.5 h-3.5" style={{ color, filter: `drop-shadow(0 0 4px ${color})` }} />
            </div>
            <div className="font-display text-3xl font-bold" style={{ color, textShadow: `0 0 20px ${color}66` }}>
              {loading ? '—' : val}{unit}
            </div>
            <div className="font-mono text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Week bar chart */}
        <div className="md:col-span-2 glass-bright rounded-lg p-5" style={{ border: '1px solid rgba(0,255,247,0.08)' }}>
          <p className="font-mono text-xs text-white/30 tracking-[0.2em] mb-4">// WEEK ACTIVITY</p>
          <div className="flex items-end gap-2 h-28">
            {weekDays.map(({ day, mins, label }) => {
              const isToday = isSameDay(day, today)
              const pct = Math.min(100, (mins / 480) * 100)
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="font-mono text-xs" style={{ color: pct > 0 ? '#00fff7' : 'rgba(255,255,255,0.15)', fontSize: '9px' }}>
                    {mins > 0 ? `${Math.round(mins / 60)}h` : ''}
                  </span>
                  <div className="w-full rounded-sm overflow-hidden" style={{ height: '72px', background: 'rgba(255,255,255,0.04)' }}>
                    <div className="w-full rounded-sm transition-all duration-700"
                      style={{ height: `${pct}%`, marginTop: `${100 - pct}%`, background: isToday ? 'linear-gradient(to top, #00fff7, #00fff740)' : 'rgba(255,255,255,0.12)', boxShadow: isToday ? '0 0 8px rgba(0,255,247,0.4)' : 'none' }} />
                  </div>
                  <span className="font-mono" style={{ fontSize: '9px', color: isToday ? '#00fff7' : 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>{label.toUpperCase()}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Summary */}
        <div className="glass-bright rounded-lg p-5" style={{ border: '1px solid rgba(191,0,255,0.12)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#bf00ff', filter: 'drop-shadow(0 0 4px #bf00ff)' }} />
            <p className="font-mono text-xs tracking-[0.2em]" style={{ color: '#bf00ff' }}>// AI SUMMARY</p>
          </div>
          {lastInsight ? (
            <div className="space-y-3">
              <p className="text-sm text-white/50 leading-relaxed">{lastInsight.summary}</p>
              {lastInsight.overloadWarning && (
                <div className="flex items-center gap-2 p-2 rounded text-xs font-mono" style={{ background: 'rgba(255,238,0,0.06)', border: '1px solid rgba(255,238,0,0.15)', color: '#ffee00' }}>
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  OVERLOAD DETECTED
                </div>
              )}
              <Link href="/dashboard/insights" className="flex items-center gap-1 font-mono text-xs transition-colors" style={{ color: 'rgba(191,0,255,0.6)' }}>
                FULL REPORT <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="font-mono text-xs text-white/20 mb-3 tracking-widest">NO DATA YET</p>
              <button onClick={runAnalysis} disabled={aiLoading} className="font-mono text-xs tracking-widest transition-colors" style={{ color: '#bf00ff' }}>
                {aiLoading ? 'SCANNING...' : 'RUN FIRST SCAN →'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Today */}
        <div className="glass-bright rounded-lg p-5" style={{ border: '1px solid rgba(0,255,247,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs text-white/30 tracking-[0.2em]">// TODAY</p>
            <Link href="/dashboard/calendar" className="font-mono text-xs tracking-widest transition-colors" style={{ color: '#00fff7', fontSize: '10px' }}>OPEN CALENDAR →</Link>
          </div>
          {todayEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-mono text-xs text-white/20 tracking-widest mb-3">NO EVENTS TODAY</p>
              <Link href="/dashboard/calendar" className="font-mono text-xs" style={{ color: '#00fff7', fontSize: '10px' }}>+ ADD EVENT →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.slice(0, 5).map(event => {
                const cat = getCat(event.category)
                return (
                  <div key={event.id} className="flex items-center gap-3 p-2.5 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${cat.color}18` }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/80 truncate">{event.title}</p>
                      <p className="font-mono text-xs text-white/30">{format(new Date(event.startTime), 'h:mm a')} · {formatDur(getDur(event.startTime, event.endTime))}</p>
                    </div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: cat.color + '18', color: cat.color, fontSize: '10px' }}>{cat.label.toUpperCase()}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="glass-bright rounded-lg p-5" style={{ border: '1px solid rgba(57,255,20,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs text-white/30 tracking-[0.2em]">// GOALS</p>
            <Link href="/dashboard/goals" className="font-mono text-xs tracking-widest transition-colors" style={{ color: '#39ff14', fontSize: '10px' }}>MANAGE →</Link>
          </div>
          {goals.filter(g => g.status === 'active').length === 0 ? (
            <div className="text-center py-8">
              <p className="font-mono text-xs text-white/20 tracking-widest mb-3">NO ACTIVE GOALS</p>
              <Link href="/dashboard/goals" className="font-mono text-xs" style={{ color: '#39ff14', fontSize: '10px' }}>+ SET GOAL →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.filter(g => g.status === 'active').slice(0, 4).map(goal => (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/60 truncate">{goal.title}</span>
                    <span className="font-mono text-xs ml-2 flex-shrink-0" style={{ color: '#39ff14' }}>{goal.progress}%</span>
                  </div>
                  <div className="progress-neon">
                    <div className="progress-neon-fill" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      {lastInsight?.suggestions?.length > 0 && (
        <div className="glass-bright rounded-lg p-5" style={{ border: '1px solid rgba(0,255,247,0.08)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-3.5 h-3.5" style={{ color: '#ffee00', filter: 'drop-shadow(0 0 4px #ffee00)' }} />
            <p className="font-mono text-xs tracking-[0.2em]" style={{ color: '#ffee00' }}>// AI RECOMMENDATIONS</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lastInsight.suggestions.slice(0, 6).map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded" style={{ background: 'rgba(255,238,0,0.03)', border: '1px solid rgba(255,238,0,0.08)' }}>
                <span className="font-mono text-xs font-bold flex-shrink-0 mt-0.5" style={{ color: '#ffee00' }}>0{i + 1}</span>
                <p className="text-sm text-white/50 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
