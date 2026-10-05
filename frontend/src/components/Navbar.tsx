import { useAuth } from '../api/auth'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import {
  Shield,
  LogOut,
  User,
  HeartPulse,
  ClipboardList,
  CreditCard,
  Sun,
  Moon,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard/admin', label: 'Admin Console', icon: Shield, roles: ['admin'] },
  { path: '/dashboard/admin?tab=memberships', label: 'Memberships', icon: CreditCard, roles: ['admin'] },
  { path: '/dashboard/coach', label: 'Coach Hub', icon: ClipboardList, roles: ['coach', 'admin'] },
  { path: '/dashboard/athlete', label: 'My Hub', icon: User, roles: ['athlete'] },
  { path: '/dashboard/staff', label: 'Operations', icon: HeartPulse, roles: ['physiotherapist', 'staff', 'admin'] },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  const visibleNav = navItems.filter(item => item.roles.includes(user.role))

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-bg-surface/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link to={visibleNav[0]?.path || '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-500/20 group-hover:border-brand-500/30">
              <Shield className="w-4 h-4 text-brand-400" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-text-primary hidden sm:block">
              Sports Club
              <span className="text-text-tertiary font-normal ml-1">AI</span>
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleNav.map(item => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-bg-elevated text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg border border-border-subtle transition-all duration-200"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-warning-400" />
              ) : (
                <Moon className="w-4 h-4 text-brand-500" />
              )}
            </button>

            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-sm font-medium text-text-primary leading-tight">{user.full_name}</span>
              <span className="text-[11px] text-text-tertiary leading-tight capitalize">{user.role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-danger-400 hover:bg-danger-500/5 rounded-lg border border-transparent hover:border-danger-500/15 transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
