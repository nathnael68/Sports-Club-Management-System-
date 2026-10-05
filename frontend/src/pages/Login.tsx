import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../api/auth'
import { useTheme } from '../context/ThemeContext'
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Zap,
  Trophy,
  Activity,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeRole, setActiveRole] = useState<'admin' | 'coach' | 'athlete' | 'physio' | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, loginWithGoogle } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const navigateByRole = (userRole?: string) => {
    if (userRole === 'admin') navigate('/dashboard/admin')
    else if (userRole === 'athlete') navigate('/dashboard/athlete')
    else if (userRole === 'physiotherapist' || userRole === 'staff') navigate('/dashboard/staff')
    else navigate('/dashboard/coach')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userObj = JSON.parse(storedUser)
        navigateByRole(userObj.role)
      } else {
        navigate('/dashboard/coach')
      }
    } catch (err: any) {
      setError('Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credential: string) => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle(credential)
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userObj = JSON.parse(storedUser)
        navigateByRole(userObj.role)
      } else {
        navigate('/dashboard/athlete')
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail
      if (typeof detail === 'string') {
        setError(detail)
      } else {
        setError('Failed to sign in with Google. Please check your credentials or configuration.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (roleKey: 'admin' | 'coach' | 'athlete' | 'physio', demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setActiveRole(roleKey)
    setError('')
  }

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-bg-base text-text-primary transition-colors duration-300">
      {/* Dynamic Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[130px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-accent-500/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-info-500/5 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(var(--color-brand-400) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Header Controls */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-lg text-text-primary">Sports Club <span className="text-brand-400">AI</span></span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white/[0.06] text-text-tertiary border border-white/[0.08]">v1.0 SaaS</span>
          </div>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl surface-elevated border border-white/[0.1] hover:border-brand-500/40 text-text-secondary hover:text-text-primary transition-all duration-200 shadow-md flex items-center gap-2 text-xs font-medium"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-warning-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-brand-400" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Main Login Card Container */}
      <main className="relative z-10 w-full max-w-[460px] mx-auto px-4 py-8 my-auto">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-text-secondary">
            Predictive Athletic Workload & Injury Risk Management
          </p>
        </div>

        {/* Card */}
        <div className="surface-elevated rounded-3xl border border-white/[0.1] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
          {/* Subtle Accent Glow Line Top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-info-500" />

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google One-Tap / SSO Login */}
          <div className="mb-5 flex flex-col items-center">
            <div className="w-full flex justify-center min-h-[44px]">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleSuccess(credentialResponse.credential)
                  }
                }}
                onError={() => {
                  setError('Google sign-in was cancelled or encountered an error.')
                }}
                theme={theme === 'dark' ? 'filled_black' : 'outline'}
                size="large"
                shape="rectangular"
                width="380"
                text="continue_with"
              />
            </div>

            {/* Divider */}
            <div className="relative w-full flex items-center justify-center my-4">
              <div className="w-full border-t border-white/[0.08]" />
              <span className="absolute px-3 surface-elevated text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-text-tertiary tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@club.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl input-human text-sm transition-all focus:ring-2 focus:ring-brand-500/30"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-text-tertiary tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl input-human text-sm transition-all focus:ring-2 focus:ring-brand-500/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-base w-full h-11 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl mt-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Roles */}
          <div className="mt-7 pt-6 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Quick Demo Accounts
              </span>
              <span className="text-[10px] text-text-tertiary">Click to autofill</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin', 'admin@example.com', 'admin123')}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${
                  activeRole === 'admin'
                    ? 'bg-brand-500/15 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-brand-500/30 hover:bg-white/[0.05] text-text-secondary'
                }`}
              >
                <Shield className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-semibold">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('coach', 'coach@example.com', 'coach123')}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${
                  activeRole === 'coach'
                    ? 'bg-brand-500/15 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-brand-500/30 hover:bg-white/[0.05] text-text-secondary'
                }`}
              >
                <Trophy className="w-4 h-4 text-warning-400" />
                <span className="text-xs font-semibold">Coach</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('athlete', 'athlete@example.com', 'athlete123')}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${
                  activeRole === 'athlete'
                    ? 'bg-accent-500/15 border-accent-500 text-accent-400 shadow-md shadow-accent-500/10'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-accent-500/30 hover:bg-white/[0.05] text-text-secondary'
                }`}
              >
                <Zap className="w-4 h-4 text-accent-400" />
                <span className="text-xs font-semibold">Athlete</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('physio', 'physio@example.com', 'physio123')}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${
                  activeRole === 'physio'
                    ? 'bg-info-500/15 border-info-500 text-info-400 shadow-md shadow-info-500/10'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-info-500/30 hover:bg-white/[0.05] text-text-secondary'
                }`}
              >
                <Activity className="w-4 h-4 text-info-400" />
                <span className="text-xs font-semibold">Physio</span>
              </button>
            </div>

            {/* Active Selected Role Helper Badge */}
            {activeRole && (
              <div className="mt-3 text-center animate-fade-in">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Autofilled {activeRole.toUpperCase()} credentials ({email})
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 text-center py-6 text-xs text-text-tertiary">
        <p>Sports Club AI Platform · Predictive Management System</p>
      </footer>
    </div>
  )
}
