import { useState, useEffect } from 'react'
import SidebarLayout, { type SidebarNavItem } from '../components/layout/SidebarLayout'
import api from '../api/client'
import {
  StatCard,
  SectionHeader,
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableHeader,
  EmptyState,
  Card,
  Badge,
  WorkloadChart,
} from '../components/ui'
import {
  Zap,
  Calendar,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Shield,
  Dumbbell,
  BarChart3,
} from 'lucide-react'

interface PerformanceRecord {
  id: number
  recorded_at: string
  distance_km?: number
  top_speed_kmh?: number
  sprint_count?: number
  avg_heart_rate?: number
  max_heart_rate?: number
  training_load?: number
  vo2max_est?: number
  fitness_score?: number
}

interface TrainingSession {
  id: number
  title: string
  scheduled_at: string
  duration_min: number
  intensity: string
  focus?: string
  notes?: string
}

interface AthleteProfile {
  id: number
  jersey_number?: number
  playing_position?: string
  date_of_birth?: string
  height_cm?: number
  weight_kg?: number
  nationality?: string
  user?: {
    full_name: string
    email: string
  }
}

interface MLInsight {
  injury_risk_probability?: number
  risk_level?: string
  predicted_fitness_score?: number
  recommendations?: string[]
}

export default function AthleteDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [profile, setProfile] = useState<AthleteProfile | null>(null)
  const [performances, setPerformances] = useState<PerformanceRecord[]>([])
  const [trainings, setTrainings] = useState<TrainingSession[]>([])
  const [mlData, setMlData] = useState<MLInsight | null>(null)
  const [loading, setLoading] = useState(true)

  // RPE Modal
  const [rpeModalSession, setRpeModalSession] = useState<TrainingSession | null>(null)
  const [rpeVal, setRpeVal] = useState<number>(7)
  const [rpeMsg, setRpeMsg] = useState<{ text: string; isError: boolean } | null>(null)

  useEffect(() => {
    fetchAthleteData()
  }, [])

  const fetchAthleteData = async () => {
    setLoading(true)
    try {
      const [profileRes, perfRes, trainRes] = await Promise.all([
        api.get('/athletes/me').catch(() => null),
        api.get('/athletes/me/performance').catch(() => ({ data: [] })),
        api.get('/athletes/me/training').catch(() => ({ data: [] })),
      ])
      if (profileRes) setProfile(profileRes.data)
      setPerformances(perfRes.data)
      setTrainings(trainRes.data)

      if (profileRes?.data?.id) {
        try {
          const [injuryRes, perfPredRes, recRes] = await Promise.all([
            api.get(`/ml/predict/injury/${profileRes.data.id}`).catch(() => null),
            api.get(`/ml/predict/performance/${profileRes.data.id}`).catch(() => null),
            api.get(`/ml/recommendations/${profileRes.data.id}`).catch(() => null),
          ])
          setMlData({
            injury_risk_probability: injuryRes?.data?.injury_risk_probability,
            risk_level: injuryRes?.data?.risk_level,
            predicted_fitness_score: perfPredRes?.data?.predicted_fitness_score,
            recommendations: recRes?.data?.recommendations || [],
          })
        } catch (err) {}
      }
    } catch (err) {
      console.error('Failed to load athlete data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogRPE = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rpeModalSession || !profile) return
    setRpeMsg(null)
    try {
      await api.post('/attendance', {
        session_id: rpeModalSession.id,
        athlete_id: profile.id,
        status: 'present',
        rpe: rpeVal,
        minutes_late: 0,
      })
      setRpeMsg({ text: 'Perceived exertion & session load logged', isError: false })
      fetchAthleteData()
      setTimeout(() => {
        setRpeModalSession(null)
        setRpeMsg(null)
      }, 1200)
    } catch (err: any) {
      setRpeMsg({ text: err.response?.data?.detail || 'Failed to submit RPE', isError: true })
    }
  }

  const latestPerf = performances[0]
  const avgSpeed = performances.length
    ? (performances.reduce((acc, p) => acc + (p.top_speed_kmh || 0), 0) / performances.length).toFixed(1)
    : '—'
  const totalDistance = performances.reduce((acc, p) => acc + (p.distance_km || 0), 0).toFixed(1)

  // Navigation Items
  const navItems: SidebarNavItem[] = [
    { id: 'overview', label: 'My Readiness Hub', icon: Zap },
    { id: 'training', label: 'Training Sessions', icon: Dumbbell, badge: trainings.length, badgeVariant: 'brand' },
    { id: 'performance', label: 'Performance Telemetry', icon: BarChart3, badge: performances.length, badgeVariant: 'default' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-400 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <SidebarLayout
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={
        activeTab === 'overview' ? `Welcome Back, ${profile?.user?.full_name || 'Athlete'}` :
        activeTab === 'training' ? 'My Training Schedule & RPE' :
        'My Physical Performance Telemetry'
      }
      subtitle={
        activeTab === 'overview' ? `Jersey #${profile?.jersey_number || '10'} · ${profile?.playing_position || 'Forward'} · ${profile?.nationality || 'England'}` :
        activeTab === 'training' ? 'Review upcoming sessions and rate post-training exertion' :
        'Historical sprint velocity, distance covered, and heart rate trends'
      }
      headerActions={
        <div className="flex items-center gap-2.5 text-xs text-text-tertiary">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      }
    >
      {/* VIEW 1: OVERVIEW & READINESS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Predicted Fitness"
              value={mlData?.predicted_fitness_score ? mlData.predicted_fitness_score.toFixed(1) : '72.0'}
              unit="/100"
              icon={<TrendingUp className="w-4 h-4" />}
              variant="success"
            />
            <StatCard
              label="Cumulative Distance"
              value={totalDistance}
              unit="km"
              icon={<Activity className="w-4 h-4" />}
              variant="brand"
            />
            <StatCard
              label="Top Sprint Speed"
              value={latestPerf?.top_speed_kmh ? `${latestPerf.top_speed_kmh} km/h` : `${avgSpeed} km/h`}
              icon={<Zap className="w-4 h-4" />}
            />
            <StatCard
              label="Injury Risk State"
              value={mlData?.risk_level?.toUpperCase() || 'OPTIMAL'}
              icon={<Shield className="w-4 h-4" />}
              variant={mlData?.risk_level === 'high' ? 'danger' : mlData?.risk_level === 'moderate' ? 'warning' : 'default'}
            />
          </div>

          {/* ACWR Workload & Recovery Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <SectionHeader
                  title="ACWR Workload & Fatigue Status"
                  subtitle="7-day Acute Load vs 28-day Chronic Baseline"
                  icon={<Activity className="w-4 h-4" />}
                />
                <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-secondary">Workload Gauge</span>
                    <Badge variant={mlData?.risk_level === 'high' ? 'danger' : mlData?.risk_level === 'moderate' ? 'warning' : 'success'}>
                      {mlData?.risk_level ? mlData.risk_level.toUpperCase() : 'SWEET SPOT'}
                    </Badge>
                  </div>
                  <div className="w-full bg-bg-surface rounded-full h-3 overflow-hidden border border-border-subtle">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        mlData?.risk_level === 'high' ? 'bg-danger-500 w-[85%]' :
                        mlData?.risk_level === 'moderate' ? 'bg-warning-500 w-[60%]' : 'bg-success-500 w-[45%]'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-text-tertiary mt-1.5">
                    <span>Under-trained</span>
                    <span className="font-semibold text-text-secondary">Optimal (0.8 - 1.3)</span>
                    <span>High Risk (&gt;1.5)</span>
                  </div>
                </div>

                <div className="text-xs text-text-secondary">
                  <span className="font-semibold text-text-primary">AI Advisory: </span>
                  {mlData?.recommendations && mlData.recommendations.length > 0
                    ? mlData.recommendations[0]
                    : 'Your workload is well-balanced. Maintain normal hydration and recovery targets.'}
                </div>
              </div>
            </Card>

            {/* Next Training Session Card */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <SectionHeader
                  title="Next Scheduled Session"
                  subtitle="Upcoming tactical preparation"
                  icon={<Calendar className="w-4 h-4" />}
                />
                {trainings.length > 0 ? (
                  <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-text-primary">{trainings[0].title}</span>
                      <Badge variant="brand">{trainings[0].intensity.toUpperCase()}</Badge>
                    </div>
                    <div className="text-xs text-text-secondary flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                      <span>{new Date(trainings[0].scheduled_at).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-text-secondary flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                      <span>Duration: {trainings[0].duration_min} minutes · Focus: {trainings[0].focus || 'Tactical Matchplay'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle text-xs text-text-secondary">
                    No scheduled sessions today. Enjoy your rest and recovery.
                  </div>
                )}
              </div>
              {trainings.length > 0 && (
                <button
                  onClick={() => setRpeModalSession(trainings[0])}
                  className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold mt-4"
                >
                  <CheckCircle2 className="w-4 h-4" /> Rate Session RPE Exertion
                </button>
              )}
            </Card>
          </div>

          {/* Interactive Recharts Workload Curve */}
          <WorkloadChart
            title="My Workload & ACWR Progression"
            subtitle="7-Day Acute Load vs 28-Day Chronic Conditioning Baseline"
          />
        </div>
      )}

      {/* VIEW 2: TRAINING SESSIONS & RPE */}
      {activeTab === 'training' && (
        <Card className="p-5 animate-fade-in">
          <SectionHeader
            title="Squad Training Schedule"
            subtitle="Click on any completed session to submit your Rate of Perceived Exertion (RPE)"
            icon={<Dumbbell className="w-4 h-4" />}
          />
          {trainings.length === 0 ? (
            <EmptyState
              title="No training sessions scheduled"
              description="Your coaching staff will schedule upcoming drills here."
              icon={<Calendar className="w-5 h-5" />}
            />
          ) : (
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeader>Session Title</DataTableHeader>
                  <DataTableHeader>Scheduled Time</DataTableHeader>
                  <DataTableHeader numeric>Duration</DataTableHeader>
                  <DataTableHeader>Intensity</DataTableHeader>
                  <DataTableHeader>Action</DataTableHeader>
                </tr>
              </DataTableHead>
              <DataTableBody>
                {trainings.map(s => (
                  <DataTableRow key={s.id}>
                    <DataTableCell>
                      <div className="font-bold text-text-primary">{s.title}</div>
                      <div className="text-xs text-text-tertiary">Focus: {s.focus || 'Tactical Strategy'}</div>
                    </DataTableCell>
                    <DataTableCell>
                      <span className="text-xs text-text-secondary">{new Date(s.scheduled_at).toLocaleString()}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono font-bold text-text-primary">{s.duration_min} min</span>
                    </DataTableCell>
                    <DataTableCell>
                      <Badge variant={s.intensity === 'high' ? 'danger' : s.intensity === 'medium' ? 'brand' : 'default'}>
                        {s.intensity.toUpperCase()}
                      </Badge>
                    </DataTableCell>
                    <DataTableCell>
                      <button
                        onClick={() => setRpeModalSession(s)}
                        className="btn-base h-7 px-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                      >
                        Rate RPE
                      </button>
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          )}
        </Card>
      )}

      {/* VIEW 3: PERFORMANCE ANALYTICS */}
      {activeTab === 'performance' && (
        <Card className="p-5 animate-fade-in">
          <SectionHeader
            title="My Historical Performance Telemetry"
            subtitle={`${performances.length} recorded match & training entries`}
            icon={<BarChart3 className="w-4 h-4" />}
          />
          {performances.length === 0 ? (
            <EmptyState
              title="No telemetry records logged yet"
              description="Your performance data will populate after your next logged session."
              icon={<Activity className="w-5 h-5" />}
            />
          ) : (
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeader>Recorded Date</DataTableHeader>
                  <DataTableHeader numeric>Distance (km)</DataTableHeader>
                  <DataTableHeader numeric>Top Speed (km/h)</DataTableHeader>
                  <DataTableHeader numeric>Sprints</DataTableHeader>
                  <DataTableHeader numeric>Training Load</DataTableHeader>
                  <DataTableHeader numeric>Max HR</DataTableHeader>
                </tr>
              </DataTableHead>
              <DataTableBody>
                {performances.map(p => (
                  <DataTableRow key={p.id}>
                    <DataTableCell>
                      <span className="font-semibold text-text-primary">{p.recorded_at}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono font-bold text-brand-400">{p.distance_km || '—'} km</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono font-bold text-accent-400">{p.top_speed_kmh || '—'}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono text-text-primary">{p.sprint_count || '—'}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono text-text-primary">{p.training_load || '—'}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono text-text-tertiary">{p.max_heart_rate || '—'} bpm</span>
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          )}
        </Card>
      )}

      {/* RPE Exertion Rating Modal */}
      {rpeModalSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-bg-surface border border-border-default rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text-primary">Rate Session Exertion (RPE)</h3>
              <button
                onClick={() => setRpeModalSession(null)}
                className="text-text-tertiary hover:text-text-primary text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Session: <span className="font-semibold text-text-primary">{rpeModalSession.title}</span>
            </p>

            {rpeMsg && (
              <div className={`p-2.5 rounded-lg text-sm font-medium ${rpeMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                {rpeMsg.text}
              </div>
            )}

            <form onSubmit={handleLogRPE} className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-text-tertiary">Perceived Exertion (1 - 10)</span>
                  <span className="font-mono text-brand-400 text-base">{rpeVal} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rpeVal}
                  onChange={e => setRpeVal(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-[10px] text-text-tertiary mt-1">
                  <span>1 (Very Easy)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Maximal Effort)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRpeModalSession(null)}
                  className="btn-base h-9 px-4 bg-bg-elevated hover:bg-bg-elevated-hover text-text-secondary text-xs font-semibold flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-base h-9 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex-1"
                >
                  Submit RPE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  )
}
