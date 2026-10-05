import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './api/auth'
import { ThemeProvider } from './context/ThemeContext'
import PageLoader from './components/ui/PageLoader'

const Login = lazy(() => import('./pages/Login'))
const CoachDashboard = lazy(() => import('./pages/CoachDashboard'))
const AthleteDashboard = lazy(() => import('./pages/AthleteDashboard'))
const StaffDashboard = lazy(() => import('./pages/StaffDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AthleteProfile = lazy(() => import('./pages/AthleteProfile'))

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />
    if (user.role === 'athlete') return <Navigate to="/dashboard/athlete" replace />
    if (user.role === 'physiotherapist' || user.role === 'staff') return <Navigate to="/dashboard/staff" replace />
    return <Navigate to="/dashboard/coach" replace />
  }

  return <>{children}</>
}

function RoleBasedHomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />
  if (user.role === 'athlete') return <Navigate to="/dashboard/athlete" replace />
  if (user.role === 'physiotherapist' || user.role === 'staff') return <Navigate to="/dashboard/staff" replace />
  return <Navigate to="/dashboard/coach" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/coach"
        element={
          <ProtectedRoute allowedRoles={['coach', 'admin']}>
            <CoachDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/athlete"
        element={
          <ProtectedRoute allowedRoles={['athlete']}>
            <AthleteDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/staff"
        element={
          <ProtectedRoute allowedRoles={['physiotherapist', 'staff', 'admin']}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/athlete/:id"
        element={
          <ProtectedRoute allowedRoles={['coach', 'admin', 'physiotherapist', 'staff']}>
            <AthleteProfile />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<RoleBasedHomeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Google OAuth Client ID loaded from environment variable or default fallback
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '366511984845-db5vr24h4tjnql2chkdqpre7e1ac8mph.apps.googleusercontent.com'

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}
