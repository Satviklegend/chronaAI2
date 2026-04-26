import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User { id: string; email: string; name: string; timezone: string }
export interface CalEvent { id: string; userId: string; title: string; description?: string; startTime: string; endTime: string; category: string; location?: string; priority: string; status: string; tags: string[]; aiAnalyzed: boolean; createdAt: string }
export interface Notification { id: string; title: string; message: string; type: string; read: boolean; createdAt: string }

interface Store {
  user: User | null; setUser: (u: User | null) => void
  view: 'month' | 'week' | 'day'; setView: (v: 'month'|'week'|'day') => void
  selectedDate: string; setSelectedDate: (d: string) => void
  modalOpen: boolean; editingEvent: CalEvent | null
  openModal: (e?: CalEvent) => void; closeModal: () => void
  aiLoading: boolean; setAiLoading: (l: boolean) => void
  lastInsight: any; setLastInsight: (i: any) => void
  notifications: Notification[]; setNotifications: (n: Notification[]) => void
  markRead: (id: string) => void; unread: number
  sidebarOpen: boolean; setSidebar: (o: boolean) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null, setUser: (user) => set({ user }),
      view: 'week', setView: (view) => set({ view }),
      selectedDate: new Date().toISOString(), setSelectedDate: (d) => set({ selectedDate: d }),
      modalOpen: false, editingEvent: null,
      openModal: (e) => set({ modalOpen: true, editingEvent: e || null }),
      closeModal: () => set({ modalOpen: false, editingEvent: null }),
      aiLoading: false, setAiLoading: (aiLoading) => set({ aiLoading }),
      lastInsight: null, setLastInsight: (lastInsight) => set({ lastInsight }),
      notifications: [],
      setNotifications: (notifications) => set({ notifications, unread: notifications.filter(n => !n.read).length }),
      markRead: (id) => set(s => {
        const notifications = s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        return { notifications, unread: notifications.filter(n => !n.read).length }
      }),
      unread: 0,
      sidebarOpen: true, setSidebar: (sidebarOpen) => set({ sidebarOpen }),
    }),
    { name: 'chrona-store', partialize: (s) => ({ view: s.view, sidebarOpen: s.sidebarOpen }) }
  )
)
