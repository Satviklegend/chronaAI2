'use client'
import { useState } from 'react'
import { X, Trash2, MapPin, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { CATEGORIES, cn } from '@/lib/utils'

interface Props { event?: any; defaultDate?: Date; onSave: (d: any) => void; onClose: () => void; onDelete?: () => void }

export default function EventModal({ event, defaultDate, onSave, onClose, onDelete }: Props) {
  const now = defaultDate || new Date()
  const rounded = new Date(Math.ceil(now.getTime() / (30 * 60000)) * (30 * 60000))
  const roundedEnd = new Date(rounded.getTime() + 60 * 60000)
  const fmt = (d: string | Date) => format(typeof d === 'string' ? new Date(d) : d, "yyyy-MM-dd'T'HH:mm")

  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startTime: event?.startTime ? fmt(event.startTime) : fmt(rounded),
    endTime: event?.endTime ? fmt(event.endTime) : fmt(roundedEnd),
    category: event?.category || 'personal',
    location: event?.location || '',
    priority: event?.priority || 'medium',
    tags: event?.tags?.join(', ') || '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ ...form, startTime: new Date(form.startTime).toISOString(), endTime: new Date(form.endTime).toISOString(), tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [] })
  }

  function onStartChange(v: string) {
    const s = new Date(v), e = new Date(s.getTime() + 60 * 60000)
    setForm({ ...form, startTime: v, endTime: fmt(e) })
  }

  const catCfg = CATEGORIES[form.category as keyof typeof CATEGORIES]
  const inputCls = "w-full px-3 py-2 rounded text-sm neon-input"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-bright rounded-lg w-full max-w-lg shadow-2xl animate-scale-in relative overflow-hidden" style={{ border: `1px solid ${catCfg.color}25` }}>
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: catCfg.color + '80' }} />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: catCfg.color + '80' }} />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: catCfg.color + '80' }} />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: catCfg.color + '80' }} />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/6">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-white/30">{event ? '// EDIT EVENT' : '// NEW EVENT'}</p>
          </div>
          <div className="flex items-center gap-1">
            {onDelete && <button onClick={onDelete} className="p-2 text-white/20 hover:text-neon-pink transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
            <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <input required autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Event title" className="w-full px-4 py-3 rounded text-base font-medium neon-input" />

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-xs text-white/30 tracking-widest block mb-1">START</label>
              <input type="datetime-local" required value={form.startTime} onChange={e => onStartChange(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="font-mono text-xs text-white/30 tracking-widest block mb-1">END</label>
              <input type="datetime-local" required value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className={inputCls} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="font-mono text-xs text-white/30 tracking-widest block mb-2">CATEGORY</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORIES).map(([k, c]) => (
                <button key={k} type="button" onClick={() => setForm({ ...form, category: k })}
                  className={cn('px-3 py-1.5 rounded font-mono text-xs tracking-widest transition-all border', form.category === k ? '' : 'border-transparent text-white/30 hover:text-white/60')}
                  style={form.category === k ? { background: c.color + '18', color: c.color, border: `1px solid ${c.color}40`, boxShadow: `0 0 8px ${c.color}30` } : {}}>
                  {c.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="font-mono text-xs text-white/30 tracking-widest block mb-2">PRIORITY</label>
            <div className="flex gap-2">
              {[{ v: 'low', c: '#39ff14' }, { v: 'medium', c: '#ffee00' }, { v: 'high', c: '#ff2d78' }].map(({ v, c }) => (
                <button key={v} type="button" onClick={() => setForm({ ...form, priority: v })}
                  className="flex-1 py-2 rounded font-mono text-xs uppercase tracking-widest transition-all border"
                  style={form.priority === v ? { background: c + '18', color: c, border: `1px solid ${c}40`, boxShadow: `0 0 8px ${c}30` } : { background: 'transparent', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Optional fields */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" className="flex-1 px-3 py-2 rounded text-sm neon-input" />
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags: focus, meeting, urgent" className="flex-1 px-3 py-2 rounded text-sm neon-input" />
            </div>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Notes (optional)" rows={2} className={inputCls + " resize-none"} />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded border border-white/8 text-white/40 font-mono text-xs tracking-widest hover:bg-white/3 transition-all">CANCEL</button>
            <button type="submit" className="flex-1 py-3 rounded font-mono text-xs tracking-widest transition-all"
              style={{ background: catCfg.color + '18', border: `1px solid ${catCfg.color}40`, color: catCfg.color, boxShadow: `0 0 15px ${catCfg.color}20` }}>
              {event ? 'SAVE CHANGES' : 'CREATE EVENT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
