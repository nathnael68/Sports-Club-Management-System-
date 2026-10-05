import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../api/auth'
import { useTheme } from '../../context/ThemeContext'
import NotificationCenter from '../ui/NotificationCenter'
import {
  Shield,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

export interface SidebarNavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeVariant?: 'default' | 'brand' | 'danger' | 'warning' | 'success'
}

interface SidebarLayoutProps {
  navItems: SidebarNavItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  title: string
  subtitle?: string
  headerActions?: React.ReactNode
  children: React.ReactNode
}

export default function SidebarLayout({
  navItems,
  activeTab,
  onTabChange,
  title,
  subtitle,
  headerActions,
  children,
}: SidebarLayoutProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false)
  
  // Desktop collapsed sidebar state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  })

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar_collapsed', String(next))
      return next
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'bg-danger-500/15 text-danger-400 border border-danger-500/25'
      case 'warning':
        return 'bg-warning-500/15 text-warning-400 border border-warning-500/25'
      case 'success':
        return 'bg-success-500/15 text-success-400 border border-success-500/25'
      case 'brand':
        return 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
      default:
        return 'bg-bg-elevated text-text-secondary border border-border-subtle'
    }
  }

  const roleLabel = user?.role === 'physiotherapist' ? 'Physiotherapist' : user?.role || 'Member'

  return (
    <div className="min-h-screen bg-bg-base flex flex-col lg:flex-row text-text-primary">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-bg-surface border-b border-border-default sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-brand-400" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-text-primary">
            Sports Club <span className="text-text-tertiary">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-border-subtle transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-warning-400" /> : <Moon className="w-4 h-4 text-brand-500" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-text-secondary hover:text-danger-400 hover:bg-danger-500/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Vertical Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 h-screen bg-bg-surface border-r border-border-default z-50 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-64 xl:w-72'
        } ${
          mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className={`border-b border-border-subtle flex items-center justify-between ${isCollapsed ? 'p-3.5 justify-center' : 'p-5'}`}>
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-500/25">
              <Shield className="w-5 h-5 text-brand-400" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="text-[15px] font-bold tracking-tight text-text-primary flex items-center gap-1.5 truncate">
                  Sports Club <span className="text-brand-400 font-semibold">AI</span>
                </div>
                <div className="text-[11px] text-text-tertiary font-medium truncate">Performance & Recovery</div>
              </div>
            )}
          </Link>

          {/* Desktop Collapse / Expand Button inside sidebar */}
          <button
            onClick={toggleCollapsed}
            className={`hidden lg:flex p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors ${
              isCollapsed ? 'hidden' : ''
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-text-tertiary hover:text-text-primary rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsed Expand Toggle for Mini-Sidebar */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center pt-3 pb-1">
            <button
              onClick={toggleCollapsed}
              className="p-2 rounded-xl text-text-tertiary hover:text-brand-400 hover:bg-brand-500/10 border border-transparent hover:border-brand-500/20 transition-all"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1 custom-scrollbar">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
              Dashboard Navigation
            </div>
          )}
          {navItems.map(item => {
            const isActive = activeTab === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  setMobileOpen(false)
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isCollapsed
                    ? 'justify-center p-3'
                    : 'justify-between px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-xs shadow-brand-500/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent'
                }`}
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-brand-400' : 'text-text-tertiary group-hover:text-text-primary'
                  }`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyle(item.badgeVariant)}`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-400" />}
                  </div>
                )}

                {/* Badge Dot for mini collapsed mode */}
                {isCollapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger-400" />
                )}
              </button>
            )
          })}
        </div>

        {/* User Profile & Footer Controls */}
        <div className={`border-t border-border-subtle bg-bg-surface/50 space-y-2 ${isCollapsed ? 'p-2' : 'p-3'}`}>
          {/* User Card */}
          <div className={`rounded-xl bg-bg-elevated border border-border-subtle flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs uppercase">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-text-primary truncate">{user?.full_name || 'User'}</div>
                  <div className="text-[10px] text-text-tertiary capitalize truncate">{roleLabel}</div>
                </div>
              )}
            </div>

            {/* Theme Toggle in Expanded mode */}
            {!isCollapsed && (
              <button
                onClick={toggleTheme}
                className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-elevated-hover rounded-lg border border-transparent hover:border-border-subtle transition-all"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-warning-400" /> : <Moon className="w-3.5 h-3.5 text-brand-400" />}
              </button>
            )}
          </div>

          {/* Theme Toggle & Logout for Collapsed mode */}
          {isCollapsed ? (
            <div className="flex flex-col gap-1 items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-warning-400" /> : <Moon className="w-4 h-4 text-brand-400" />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-text-tertiary hover:text-danger-400 hover:bg-danger-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-text-secondary hover:text-danger-400 hover:bg-danger-500/10 rounded-lg border border-transparent hover:border-danger-500/20 transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Top Header */}
        <header className="relative z-40 px-6 lg:px-8 py-5 border-b border-border-default bg-bg-surface/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Quick Toggle Button in Header for Instant Access */}
            <button
              onClick={toggleCollapsed}
              className="hidden lg:flex p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-bg-elevated border border-border-subtle transition-all"
              title={isCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-brand-400" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">{title}</h1>
              {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            {headerActions}
          </div>
        </header>

        {/* View Dynamic Workspace Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
