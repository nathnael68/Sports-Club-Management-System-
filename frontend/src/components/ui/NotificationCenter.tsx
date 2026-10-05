import { useState, useEffect, useRef } from 'react'
import { Bell, Check, Trash2, AlertTriangle, ShieldCheck, Calendar, Activity } from 'lucide-react'
import Badge from './Badge'

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  type: 'danger' | 'warning' | 'success' | 'info'
  read: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'High ACWR Workload Alert',
    message: 'Marcus Vance flagged for ACWR 1.55 (High Fatigue Spike). Volume reduction recommended.',
    timestamp: '10 min ago',
    type: 'danger',
    read: false,
  },
  {
    id: 'n2',
    title: 'Return-to-Play Clearance Ready',
    message: 'Liam Davies completed hamstrings rehabilitation protocol. Physio clearance pending.',
    timestamp: '1 hour ago',
    type: 'warning',
    read: false,
  },
  {
    id: 'n3',
    title: 'Training Session Scheduled',
    message: 'Squad Tactical & High-Velocity Sprint Conditioning added for tomorrow at 09:00 AM.',
    timestamp: '2 hours ago',
    type: 'info',
    read: true,
  },
  {
    id: 'n4',
    title: 'Membership Subscription Active',
    message: 'Elite First-Team Plan renewed for Dominic Scott ($150.00).',
    timestamp: '1 day ago',
    type: 'success',
    read: true,
  },
]

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('app_notifications')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return INITIAL_NOTIFICATIONS
  })

  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-danger-400 shrink-0 mt-0.5" />
      case 'warning':
        return <Activity className="w-4 h-4 text-warning-400 shrink-0 mt-0.5" />
      case 'success':
        return <ShieldCheck className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />
      default:
        return <Calendar className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
    }
  }

  return (
    <div className="relative inline-block z-50" ref={popupRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Notification Center"
        className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#12161f] border border-white/[0.12] shadow-2xl z-[9999] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06] bg-bg-base/60 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
              {unreadCount > 0 && <Badge variant="brand">{unreadCount} New</Badge>}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-text-tertiary hover:text-brand-400 flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-tertiary">
                No notifications right now.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    !n.read ? 'bg-brand-500/[0.04] hover:bg-brand-500/[0.08]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {getIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className={`text-xs font-semibold ${!n.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-text-muted shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-text-tertiary line-clamp-2 leading-relaxed">{n.message}</p>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      deleteNotification(n.id)
                    }}
                    className="text-text-muted hover:text-danger-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
