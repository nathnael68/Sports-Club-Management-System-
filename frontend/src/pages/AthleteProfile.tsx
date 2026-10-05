import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SidebarLayout, { type SidebarNavItem } from '../components/layout/SidebarLayout'
import api from '../api/client'
import {
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
  ArrowLeft,
  User,
  Mail,
  Globe,
  Ruler,
  Weight,
  Cake,
  Zap,
  TrendingUp,
  Activity,
  AlertTriangle,
  BrainCircuit,
  Clock,
} from 'lucide-react'

interface AthleteOut {
  id: number
  user_id: number
  full_name: string
  email: string
  jersey_number?: number
  playing_position?: string
  date_of_birth?: string
  height_cm?: number
  weight_kg?: number
  nationality?: string
}

interface PerformanceOut {
  id: number
  athlete_id: number
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

interface MLPredictions {
  injury_risk_probability?: number
  risk_level?: string
  predicted_fitness_score?: number
  recommendations?: string[]
}

export default function AthleteProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [athlete, setAthlete] = useState<AthleteOut | null>(null)
  const [performances, setPerformances] = useState<PerformanceOut[]>([])
  const [predictions, setPredictions] = useState<MLPredictions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    fetchProfileData(id)
  }, [id])

  const fetchProfileData = async (athleteId: string) => {
    setLoading(true)
    setError('')
    try {
      const [athRes, perfRes] = await Promise.all([
        api.get(`/athletes/${athleteId}`),
        api.get(`/athletes/${athleteId}/performance`).catch(() => ({ data: [] })),
      ])
      setAthlete(athRes.data)
      setPerformances(perfRes.data)

      try {
        const [injRes, perfPredRes, recRes] = await Promise.all([
          api.get(`/ml/predict/injury/${athleteId}`).catch(() => null),
          api.get(`/ml/predict/performance/${athleteId}`).catch(() => null),
          api.get(`/ml/recommendations/${athleteId}`).catch(() => null),
        ])
        setPredictions({
          injury_risk_probability: injRes?.data?.injury_risk_probability,
          risk_level: injRes?.data?.risk_level,
          predicted_fitness_score: perfPredRes?.data?.predicted_fitness_score,
          recommendations: recRes?.data?.recommendations || [],
        })
      } catch (err) {}
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load athlete profile')
    } finally {
      setLoading(false)
    }
  }

  const navItems: SidebarNavItem[] = [
    { id: 'profile', label: 'Athlete Telemetry', icon: User },
    { id: 'back', label: 'Back to Roster', icon: ArrowLeft },
  ]

  const handleTabChange = (tabId: string) => {
    if (tabId === 'back') {
      navigate(-1)
    }
  }

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

  if (error || !athlete) {
    return (
      <SidebarLayout
        navItems={navItems}
        activeTab="profile"
        onTabChange={handleTabChange}
        title="Athlete Profile"
        subtitle="Detailed player records"
      >
        <Card className="p-8 text-center max-w-xl mx-auto my-12">
          <AlertTriangle className="w-10 h-10 text-danger-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">Profile Not Found</h2>
          <p className="text-sm text-text-secondary mb-6">{error || 'This athlete does not exist.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-base h-9 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roster
          </button>
        </Card>
      </SidebarLayout>
    )
  }

  const latestPerf = performances.length > 0 ? performances[0] : null

  return (
    <SidebarLayout
      navItems={navItems}
      activeTab="profile"
      onTabChange={handleTabChange}
      title={`${athlete.full_name}`}
      subtitle={`Jersey #${athlete.jersey_number || '—'} · ${athlete.playing_position || 'Forward'} · ${athlete.nationality || 'Squad Member'}`}
      headerActions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-base h-8 px-3 text-xs bg-bg-elevated hover:bg-bg-elevated-hover text-text-secondary hover:text-text-primary border border-border-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Profile Card */}
        <div className="relative overflow-hidden rounded-2xl surface-elevated border border-white/[0.06] p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/[0.03] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-3xl font-bold text-brand-400 shrink-0">
              {athlete.jersey_number || '—'}
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-text-primary">{athlete.full_name}</h1>
                <Badge variant="brand">{athlete.playing_position || 'N/A'}</Badge>
                {predictions?.risk_level && (
                  <Badge
                    variant={
                      predictions.risk_level === 'high'
                        ? 'danger'
                        : predictions.risk_level === 'moderate'
                        ? 'warning'
                        : 'success'
                    }
                  >
                    Risk: {predictions.risk_level.toUpperCase()}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-6 text-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-text-tertiary" />
                  {athlete.email}
                </span>
                {athlete.nationality && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-text-tertiary" />
                    {athlete.nationality}
                  </span>
                )}
                {athlete.height_cm && (
                  <span className="flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-text-tertiary" />
                    {athlete.height_cm} cm
                  </span>
                )}
                {athlete.weight_kg && (
                  <span className="flex items-center gap-1.5">
                    <Weight className="w-4 h-4 text-text-tertiary" />
                    {athlete.weight_kg} kg
                  </span>
                )}
                {athlete.date_of_birth && (
                  <span className="flex items-center gap-1.5">
                    <Cake className="w-4 h-4 text-text-tertiary" />
                    {athlete.date_of_birth}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI & Telemetry Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 flex flex-col justify-between">
            <SectionHeader
              title="Injury Risk Prediction"
              subtitle="Machine Learning Classifier"
              icon={<BrainCircuit className="w-4 h-4 text-brand-400" />}
            />
            <div className="text-center py-3">
              <div
                className={`text-3xl font-extrabold font-mono ${
                  predictions?.risk_level === 'high'
                    ? 'text-danger-400'
                    : predictions?.risk_level === 'moderate'
                    ? 'text-warning-400'
                    : 'text-success-400'
                }`}
              >
                {predictions?.injury_risk_probability !== undefined
                  ? `${(predictions.injury_risk_probability * 100).toFixed(1)}%`
                  : '—'}
              </div>
              <div className="text-xs font-semibold text-text-tertiary uppercase mt-1 tracking-wider">
                {predictions?.risk_level || 'Normal Risk'}
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <SectionHeader
              title="Predicted Match Fitness"
              subtitle="Gradient Boosting Regressor"
              icon={<TrendingUp className="w-4 h-4 text-success-400" />}
            />
            <div className="text-center py-3">
              <div className="text-3xl font-extrabold font-mono text-brand-400">
                {predictions?.predicted_fitness_score !== undefined
                  ? `${predictions.predicted_fitness_score.toFixed(1)} / 100`
                  : '—'}
              </div>
              <div className="text-xs font-semibold text-text-tertiary uppercase mt-1 tracking-wider">
                Optimal Readiness Score
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <SectionHeader
              title="Latest GPS Telemetry"
              subtitle={latestPerf ? latestPerf.recorded_at : 'No telemetry recorded'}
              icon={<Zap className="w-4 h-4 text-accent-400" />}
            />
            <div className="grid grid-cols-2 gap-2 text-center py-1">
              <div>
                <div className="text-xl font-bold font-mono text-text-primary">
                  {latestPerf?.distance_km !== undefined ? `${latestPerf.distance_km} km` : '—'}
                </div>
                <div className="text-[10px] text-text-tertiary uppercase">Distance</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-text-primary">
                  {latestPerf?.top_speed_kmh !== undefined ? `${latestPerf.top_speed_kmh} km/h` : '—'}
                </div>
                <div className="text-[10px] text-text-tertiary uppercase">Top Speed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Recommendations */}
        {predictions?.recommendations && predictions.recommendations.length > 0 && (
          <Card className="p-5">
            <SectionHeader
              title="AI Recovery Recommendations"
              subtitle="Automated directives based on ACWR workload analysis"
              icon={<BrainCircuit className="w-4 h-4 text-brand-400" />}
            />
            <ul className="space-y-2">
              {predictions.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-bg-elevated text-xs text-text-secondary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Interactive Recharts Workload Curve */}
        <WorkloadChart
          title={`${athlete.full_name}'s Workload & ACWR Progression`}
          subtitle="7-Day Acute Load vs 28-Day Chronic Baseline"
        />

        {/* Historical Performance Telemetry Table */}
        <Card className="p-5">
          <SectionHeader
            title="Performance Logs"
            subtitle={`${performances.length} historical entries`}
            icon={<Activity className="w-4 h-4" />}
          />
          {performances.length === 0 ? (
            <EmptyState
              title="No performance logs"
              description="Record telemetry metrics for this athlete from the coach dashboard."
              icon={<Activity className="w-5 h-5" />}
            />
          ) : (
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeader>Date Recorded</DataTableHeader>
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
                      <span className="font-mono font-bold text-brand-400">{p.distance_km ?? '—'}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono font-bold text-accent-400">{p.top_speed_kmh ?? '—'}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono text-text-primary">{p.sprint_count ?? '—'}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono text-text-primary">{p.training_load ?? '—'}</span>
                    </DataTableCell>
                    <DataTableCell numeric>
                      <span className="font-mono text-text-tertiary">{p.max_heart_rate ? `${p.max_heart_rate} bpm` : '—'}</span>
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          )}
        </Card>
      </div>
    </SidebarLayout>
  )
}
