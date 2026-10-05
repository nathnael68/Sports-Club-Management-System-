import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
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
  Badge,
  EmptyState,
  Card,
  WorkloadChart,
} from '../components/ui'
import {
  Calendar,
  Users,
  TrendingUp,
  BrainCircuit,
  Clock,
  Activity,
  Trophy,
  Plus,
  Loader2,
  ChevronRight,
  AlertTriangle,
  Dumbbell,
  Search,
  CheckCircle2,
  Zap,
} from 'lucide-react'

interface TrainingSession {
  id: number
  title: string
  scheduled_at: string
  duration_min: number
  intensity: string
  focus: string
}

interface Athlete {
  id: number
  jersey_number?: number
  playing_position?: string
  full_name?: string
  height_cm?: number
  weight_kg?: number
  nationality?: string
  user?: { full_name: string; email: string }
}

interface AttendanceRecord {
  id: number
  athlete_id: number
  session_id: number
  status: string
  minutes_late: number
  rpe?: number
}

interface MLModel {
  id: number
  name: string
  model_type: string
  version: string
  trained_at: string
  metrics?: string
}

interface AthleteMLOverview {
  athlete_id: number
  athlete_name: string
  injury_risk_probability?: number
  risk_level?: string
  predicted_fitness_score?: number
  recommendations?: string[]
}

interface Competition {
  id: number
  name: string
  opponent?: string
  match_date: string
  result?: string
  our_score?: number
  opponent_score?: number
}

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [, setModels] = useState<MLModel[]>([])
  const [mlOverviews, setMlOverviews] = useState<AthleteMLOverview[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [trainingMl, setTrainingMl] = useState(false)
  const [trainMessage, setTrainMessage] = useState('')

  // Roster Filters
  const [searchRoster, setSearchRoster] = useState('')
  const [posFilter, setPosFilter] = useState('ALL')

  // Form states
  const [selectedSessionId, setSelectedSessionId] = useState<number | ''>('')
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | ''>('')

  // Attendance
  const [attendanceStatus, setAttendanceStatus] = useState<'present' | 'absent' | 'late'>('present')
  const [minutesLate, setMinutesLate] = useState<number>(0)
  const [rpe, setRpe] = useState<number>(7)
  const [attMessage, setAttMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const [sessionAttendances, setSessionAttendances] = useState<AttendanceRecord[]>([])

  // Training Session Form
  const [tsTitle, setTsTitle] = useState('')
  const [tsDate, setTsDate] = useState(new Date().toISOString().slice(0, 16))
  const [tsDuration, setTsDuration] = useState('90')
  const [tsIntensity, setTsIntensity] = useState('medium')
  const [tsFocus, setTsFocus] = useState('')
  const [tsMsg, setTsMsg] = useState<{ text: string; isError: boolean } | null>(null)

  // Performance Form
  const [perfDistance, setPerfDistance] = useState('')
  const [perfSpeed, setPerfSpeed] = useState('')
  const [perfLoad, setPerfLoad] = useState('')
  const [perfMsg, setPerfMsg] = useState<{ text: string; isError: boolean } | null>(null)

  // Competition Form
  const [compName, setCompName] = useState('')
  const [compOpponent, setCompOpponent] = useState('')
  const [compDate, setCompDate] = useState(new Date().toISOString().slice(0, 16))
  const [compResult, setCompResult] = useState('')
  const [compMsg, setCompMsg] = useState<{ text: string; isError: boolean } | null>(null)

  // Add Athlete Form
  const [showAddAthlete, setShowAddAthlete] = useState(false)
  const [athFullName, setAthFullName] = useState('')
  const [athEmail, setAthEmail] = useState('')
  const [athPassword, setAthPassword] = useState('')
  const [athJersey, setAthJersey] = useState('')
  const [athPosition, setAthPosition] = useState('FWD')
  const [athHeight, setAthHeight] = useState('')
  const [athWeight, setAthWeight] = useState('')
  const [athNationality, setAthNationality] = useState('')
  const [athMsg, setAthMsg] = useState<{ text: string; isError: boolean } | null>(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = useCallback(async () => {
    setLoading(true)
    try {
      const [sessionsRes, athletesRes, modelsRes, compRes] = await Promise.all([
        api.get('/training').catch(() => ({ data: [] })),
        api.get('/athletes').catch(() => ({ data: [] })),
        api.get('/ml/models').catch(() => ({ data: [] })),
        api.get('/competitions').catch(() => ({ data: [] })),
      ])
      setSessions(sessionsRes.data)
      setAthletes(athletesRes.data)
      setModels(modelsRes.data)
      setCompetitions(compRes.data)

      if (sessionsRes.data.length > 0) {
        setSelectedSessionId(sessionsRes.data[0].id)
        fetchSessionAttendance(sessionsRes.data[0].id)
      }
      if (athletesRes.data.length > 0) {
        setSelectedAthleteId(athletesRes.data[0].id)
        fetchMLInsights(athletesRes.data)
      }
    } catch (err) {
      console.error('Failed to load coach dashboard data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSessionAttendance = useCallback(async (sessionId: number) => {
    try {
      const res = await api.get(`/attendance?session_id=${sessionId}`)
      setSessionAttendances(res.data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const fetchMLInsights = async (athleteList: Athlete[]) => {
    const overviews: AthleteMLOverview[] = []
    for (const ath of athleteList) {
      try {
        const [injuryRes, perfRes, recRes] = await Promise.all([
          api.get(`/ml/predict/injury/${ath.id}`).catch(() => null),
          api.get(`/ml/predict/performance/${ath.id}`).catch(() => null),
          api.get(`/ml/recommendations/${ath.id}`).catch(() => null),
        ])
        overviews.push({
          athlete_id: ath.id,
          athlete_name: ath.full_name || `Athlete #${ath.id}`,
          injury_risk_probability: injuryRes?.data?.injury_risk_probability,
          risk_level: injuryRes?.data?.risk_level,
          predicted_fitness_score: perfRes?.data?.predicted_fitness_score,
          recommendations: recRes?.data?.recommendations || [],
        })
      } catch (err) {}
    }
    setMlOverviews(overviews)
  }

  const handleLogAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    setAttMessage(null)
    if (!selectedSessionId || !selectedAthleteId) return
    try {
      await api.post('/attendance', {
        session_id: Number(selectedSessionId),
        athlete_id: Number(selectedAthleteId),
        status: attendanceStatus,
        minutes_late: Number(minutesLate),
        rpe: Number(rpe),
      })
      setAttMessage({ text: 'Attendance recorded successfully', isError: false })
      fetchSessionAttendance(Number(selectedSessionId))
    } catch (err: any) {
      setAttMessage({ text: err.response?.data?.detail || 'Error logging attendance', isError: true })
    }
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setTsMsg(null)
    try {
      const res = await api.post('/training', {
        title: tsTitle,
        scheduled_at: tsDate,
        duration_min: Number(tsDuration),
        intensity: tsIntensity,
        focus: tsFocus,
      })
      setTsMsg({ text: 'Session scheduled successfully', isError: false })
      setSessions(prev => [res.data, ...prev])
      setTsTitle('')
      setTsFocus('')
      setSelectedSessionId(res.data.id)
    } catch (err: any) {
      setTsMsg({ text: err.response?.data?.detail || 'Error scheduling session', isError: true })
    }
  }

  const handleLogPerformance = async (e: React.FormEvent) => {
    e.preventDefault()
    setPerfMsg(null)
    if (!selectedAthleteId) return
    try {
      await api.post(`/athletes/${selectedAthleteId}/performance`, {
        distance_km: Number(perfDistance),
        top_speed_kmh: Number(perfSpeed),
        training_load: Number(perfLoad),
        recorded_at: new Date().toISOString().split('T')[0],
      })
      setPerfMsg({ text: 'Performance metrics logged', isError: false })
      setPerfDistance('')
      setPerfSpeed('')
      setPerfLoad('')
      fetchMLInsights(athletes)
    } catch (err: any) {
      setPerfMsg({ text: err.response?.data?.detail || 'Error logging performance', isError: true })
    }
  }

  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault()
    setCompMsg(null)
    try {
      const res = await api.post('/competitions', {
        name: compName,
        opponent: compOpponent,
        match_date: compDate,
        result: compResult || undefined,
      })
      setCompMsg({ text: 'Competition fixture saved', isError: false })
      setCompetitions(prev => [res.data, ...prev])
      setCompName('')
      setCompOpponent('')
    } catch (err: any) {
      setCompMsg({ text: err.response?.data?.detail || 'Error creating competition', isError: true })
    }
  }

  const handleCreateAthlete = async (e: React.FormEvent) => {
    e.preventDefault()
    setAthMsg(null)
    try {
      const userRes = await api.post('/users', {
        full_name: athFullName,
        email: athEmail,
        password: athPassword,
        role: 'athlete',
        is_active: true,
      })
      const athRes = await api.post('/athletes', {
        user_id: userRes.data.id,
        jersey_number: athJersey ? Number(athJersey) : undefined,
        playing_position: athPosition,
        height_cm: athHeight ? Number(athHeight) : undefined,
        weight_kg: athWeight ? Number(athWeight) : undefined,
        nationality: athNationality || undefined,
      })
      setAthMsg({ text: 'Athlete created successfully', isError: false })
      setAthletes(prev => [...prev, athRes.data])
      setAthFullName('')
      setAthEmail('')
      setAthPassword('')
      setAthJersey('')
      setAthHeight('')
      setAthWeight('')
      setAthNationality('')
      setShowAddAthlete(false)
      fetchMLInsights([...athletes, athRes.data])
    } catch (err: any) {
      setAthMsg({ text: err.response?.data?.detail || 'Error creating athlete', isError: true })
    }
  }

  const handleRetrainModels = async () => {
    setTrainingMl(true)
    setTrainMessage('')
    try {
      await api.post('/ml/train')
      setTrainMessage('Models retrained successfully on latest telemetry')
      const modelsRes = await api.get('/ml/models')
      setModels(modelsRes.data)
      fetchMLInsights(athletes)
    } catch (err: any) {
      setTrainMessage(err.response?.data?.detail || 'Error retraining')
    } finally {
      setTrainingMl(false)
    }
  }

  const highRiskCount = mlOverviews.filter(m => m.risk_level === 'high').length
  const avgFitness = mlOverviews.length
    ? (mlOverviews.reduce((a, b) => a + (b.predicted_fitness_score || 0), 0) / mlOverviews.length).toFixed(1)
    : '—'

  const filteredAthletes = athletes.filter(a => {
    const matchName = (a.full_name || '').toLowerCase().includes(searchRoster.toLowerCase())
    const matchPos = posFilter === 'ALL' || a.playing_position === posFilter
    return matchName && matchPos
  })

  // Navigation Items
  const navItems: SidebarNavItem[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'roster', label: 'Squad Roster', icon: Users, badge: athletes.length, badgeVariant: 'brand' },
    { id: 'training', label: 'Training Sessions', icon: Dumbbell, badge: sessions.length, badgeVariant: 'default' },
    { id: 'performance', label: 'Performance Logs', icon: Activity },
    { id: 'ai_insights', label: 'AI Risk Analytics', icon: BrainCircuit, badge: highRiskCount > 0 ? `${highRiskCount} Risk` : undefined, badgeVariant: 'danger' },
    { id: 'competitions', label: 'Match Fixtures', icon: Trophy, badge: competitions.length, badgeVariant: 'default' },
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
        activeTab === 'overview' ? 'Coach Hub Overview' :
        activeTab === 'roster' ? 'Squad Roster & Profiles' :
        activeTab === 'training' ? 'Training & Attendance Center' :
        activeTab === 'performance' ? 'Performance Telemetry' :
        activeTab === 'ai_insights' ? 'AI Predictive Intelligence' :
        'Competitions & Match Fixtures'
      }
      subtitle={
        activeTab === 'overview' ? 'Real-time telemetry, squad readiness, and predictive insights' :
        activeTab === 'roster' ? `Viewing ${filteredAthletes.length} registered club players` :
        activeTab === 'training' ? 'Schedule sessions and record RPE exertion attendance' :
        activeTab === 'performance' ? 'Log distance, sprint speed, and physical training load' :
        activeTab === 'ai_insights' ? 'ACWR fatigue calculations and automated recovery directives' :
        'Track upcoming matches and competition results'
      }
      headerActions={
        <div className="flex items-center gap-2.5 text-xs text-text-tertiary">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      }
    >
      {/* VIEW 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Squad Size"
              value={athletes.length}
              icon={<Users className="w-4 h-4" />}
              variant="brand"
            />
            <StatCard
              label="Training Sessions"
              value={sessions.length}
              icon={<Calendar className="w-4 h-4" />}
            />
            <StatCard
              label="Squad Avg Fitness"
              value={avgFitness}
              unit="/100"
              icon={<TrendingUp className="w-4 h-4" />}
              variant="success"
            />
            <StatCard
              label="High Injury Risk"
              value={highRiskCount}
              icon={<AlertTriangle className="w-4 h-4" />}
              variant={highRiskCount > 0 ? 'danger' : 'default'}
            />
          </div>

          {/* High Risk Alert Banner (if any) */}
          {highRiskCount > 0 && (
            <Card className="p-4 bg-danger-500/10 border-danger-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-danger-500/20 text-danger-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-danger-300">
                    High Injury Risk Warning ({highRiskCount} Athletes Flagged)
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Acute workload spikes detected. Taper training volume or check AI recovery recommendations.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai_insights')}
                className="btn-base h-8 px-3.5 bg-danger-500 hover:bg-danger-600 text-white text-xs font-semibold shrink-0"
              >
                Inspect AI Analytics
              </button>
            </Card>
          )}

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="p-5 cursor-pointer hover:border-brand-500/40 transition-all group"
              onClick={() => setActiveTab('roster')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-400 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Squad Roster</h3>
              <p className="text-xs text-text-secondary mt-1">Manage player profiles, positions, and individual records.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-brand-500/40 transition-all group"
              onClick={() => setActiveTab('training')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-accent-400 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Training Drills</h3>
              <p className="text-xs text-text-secondary mt-1">Schedule tactical sessions and mark player RPE attendance.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-brand-500/40 transition-all group"
              onClick={() => setActiveTab('ai_insights')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center text-danger-400 group-hover:scale-105 transition-transform">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-danger-400 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-text-primary">AI Injury Analytics</h3>
              <p className="text-xs text-text-secondary mt-1">View ACWR calculations and personalized recovery advice.</p>
            </Card>
          </div>

          {/* Recent Squad Telemetry Table Preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader
                title="Squad Status Summary"
                subtitle="Live fitness scores and risk distribution"
                icon={<Activity className="w-4 h-4" />}
                className="mb-0"
              />
              <button
                onClick={() => setActiveTab('roster')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                View Full Roster <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeader>Player</DataTableHeader>
                  <DataTableHeader>Position</DataTableHeader>
                  <DataTableHeader>Risk Status</DataTableHeader>
                  <DataTableHeader numeric>Pred. Fitness</DataTableHeader>
                  <DataTableHeader>Action</DataTableHeader>
                </tr>
              </DataTableHead>
              <DataTableBody>
                {mlOverviews.slice(0, 5).map(item => {
                  const ath = athletes.find(a => a.id === item.athlete_id)
                  return (
                    <DataTableRow key={item.athlete_id}>
                      <DataTableCell>
                        <div className="font-semibold text-text-primary">
                          #{ath?.jersey_number || '—'} {item.athlete_name}
                        </div>
                        <div className="text-[11px] text-text-tertiary">{ath?.nationality || 'Squad Member'}</div>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge variant="brand">{ath?.playing_position || 'FWD'}</Badge>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge
                          variant={
                            item.risk_level === 'high' ? 'danger' :
                            item.risk_level === 'moderate' ? 'warning' : 'success'
                          }
                        >
                          {item.risk_level?.toUpperCase() || 'LOW'} ({((item.injury_risk_probability || 0) * 100).toFixed(0)}%)
                        </Badge>
                      </DataTableCell>
                      <DataTableCell numeric>
                        <span className="font-mono font-bold text-brand-400">
                          {item.predicted_fitness_score ? item.predicted_fitness_score.toFixed(1) : '72.0'} / 100
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <Link
                          to={`/athlete/${item.athlete_id}`}
                          className="btn-base h-7 px-2.5 text-xs bg-bg-elevated hover:bg-bg-elevated-hover text-text-secondary hover:text-text-primary"
                        >
                          Profile
                        </Link>
                      </DataTableCell>
                    </DataTableRow>
                  )
                })}
              </DataTableBody>
            </DataTable>
          </Card>
        </div>
      )}

      {/* VIEW 2: SQUAD ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchRoster}
                  onChange={e => setSearchRoster(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl input-human text-sm"
                />
              </div>
              <div className="flex items-center gap-1 p-1 bg-bg-surface border border-border-subtle rounded-xl">
                {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map(pos => (
                  <button
                    key={pos}
                    onClick={() => setPosFilter(pos)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      posFilter === pos
                        ? 'bg-brand-500 text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddAthlete(!showAddAthlete)}
              className="btn-base h-9 px-4 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              {showAddAthlete ? 'Close Form' : 'Register New Player'}
            </button>
          </div>

          {/* Add Athlete Modal / Collapsible Form */}
          {showAddAthlete && (
            <Card className="p-5 border-brand-500/30 bg-bg-surface animate-fade-in">
              <SectionHeader
                title="Register New Player"
                subtitle="Add an athlete to the official squad roster"
                icon={<Users className="w-4 h-4" />}
              />
              <form onSubmit={handleCreateAthlete} className="space-y-3">
                {athMsg && (
                  <div className={`p-2.5 rounded-lg text-sm font-medium ${athMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                    {athMsg.text}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={athFullName}
                    onChange={e => setAthFullName(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={athEmail}
                    onChange={e => setAthEmail(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="password"
                    placeholder="Initial Password"
                    value={athPassword}
                    onChange={e => setAthPassword(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Jersey Number"
                    value={athJersey}
                    onChange={e => setAthJersey(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  />
                  <select
                    value={athPosition}
                    onChange={e => setAthPosition(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  >
                    <option value="GK" className="bg-bg-surface">Goalkeeper (GK)</option>
                    <option value="DEF" className="bg-bg-surface">Defender (DEF)</option>
                    <option value="MID" className="bg-bg-surface">Midfielder (MID)</option>
                    <option value="FWD" className="bg-bg-surface">Forward (FWD)</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Height (cm)"
                    value={athHeight}
                    onChange={e => setAthHeight(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Weight (kg)"
                    value={athWeight}
                    onChange={e => setAthWeight(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Nationality"
                    value={athNationality}
                    onChange={e => setAthNationality(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  />
                </div>
                <button className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                  <Plus className="w-4 h-4" /> Save Athlete Profile
                </button>
              </form>
            </Card>
          )}

          {/* Roster Table */}
          <Card className="p-5">
            {filteredAthletes.length === 0 ? (
              <EmptyState
                title="No athletes found"
                description="Try adjusting your search query or position filter."
                icon={<Users className="w-5 h-5" />}
              />
            ) : (
              <DataTable>
                <DataTableHead>
                  <tr>
                    <DataTableHeader>#</DataTableHeader>
                    <DataTableHeader>Athlete Name</DataTableHeader>
                    <DataTableHeader>Position</DataTableHeader>
                    <DataTableHeader>Physical Profile</DataTableHeader>
                    <DataTableHeader>Nationality</DataTableHeader>
                    <DataTableHeader>AI Risk</DataTableHeader>
                    <DataTableHeader>Actions</DataTableHeader>
                  </tr>
                </DataTableHead>
                <DataTableBody>
                  {filteredAthletes.map(ath => {
                    const ml = mlOverviews.find(m => m.athlete_id === ath.id)
                    return (
                      <DataTableRow key={ath.id}>
                        <DataTableCell>
                          <span className="font-mono font-bold text-brand-400">
                            #{ath.jersey_number || '—'}
                          </span>
                        </DataTableCell>
                        <DataTableCell>
                          <div className="font-semibold text-text-primary">
                            {ath.full_name}
                          </div>
                          <div className="text-xs text-text-tertiary">{ath.user?.email}</div>
                        </DataTableCell>
                        <DataTableCell>
                          <Badge variant="brand">{ath.playing_position || 'FWD'}</Badge>
                        </DataTableCell>
                        <DataTableCell>
                          <span className="text-xs text-text-secondary">
                            {ath.height_cm ? `${ath.height_cm} cm` : '—'} · {ath.weight_kg ? `${ath.weight_kg} kg` : '—'}
                          </span>
                        </DataTableCell>
                        <DataTableCell>
                          <span className="text-xs text-text-secondary">{ath.nationality || 'Local'}</span>
                        </DataTableCell>
                        <DataTableCell>
                          <Badge
                            variant={
                              ml?.risk_level === 'high' ? 'danger' :
                              ml?.risk_level === 'moderate' ? 'warning' : 'success'
                            }
                          >
                            {ml?.risk_level?.toUpperCase() || 'LOW'}
                          </Badge>
                        </DataTableCell>
                        <DataTableCell>
                          <Link
                            to={`/athlete/${ath.id}`}
                            className="btn-base h-8 px-3 text-xs bg-bg-elevated hover:bg-brand-500/20 text-brand-400 border border-brand-500/20"
                          >
                            View Telemetry
                          </Link>
                        </DataTableCell>
                      </DataTableRow>
                    )
                  })}
                </DataTableBody>
              </DataTable>
            )}
          </Card>
        </div>
      )}

      {/* VIEW 3: TRAINING & SESSIONS */}
      {activeTab === 'training' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Schedule Training Session */}
          <Card className="p-5">
            <SectionHeader
              title="Schedule Training Drill"
              subtitle="Create upcoming tactical & conditioning sessions"
              icon={<Dumbbell className="w-4 h-4" />}
            />
            <form onSubmit={handleCreateSession} className="space-y-3">
              {tsMsg && (
                <div className={`p-2.5 rounded-lg text-sm font-medium ${tsMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                  {tsMsg.text}
                </div>
              )}
              <input
                type="text"
                placeholder="Session title (e.g. High-Intensity Sprints & Tactics)"
                value={tsTitle}
                onChange={e => setTsTitle(e.target.value)}
                className="w-full py-2 px-3 rounded-lg input-human text-sm"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="datetime-local"
                  value={tsDate}
                  onChange={e => setTsDate(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                />
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={tsDuration}
                  onChange={e => setTsDuration(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={tsIntensity}
                  onChange={e => setTsIntensity(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                >
                  <option value="low" className="bg-bg-surface">Low Intensity</option>
                  <option value="medium" className="bg-bg-surface">Medium Intensity</option>
                  <option value="high" className="bg-bg-surface">High Intensity</option>
                </select>
                <input
                  type="text"
                  placeholder="Focus (e.g. Counter-Attack)"
                  value={tsFocus}
                  onChange={e => setTsFocus(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                />
              </div>
              <button className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                <Plus className="w-4 h-4" /> Save Training Drill
              </button>
            </form>
          </Card>

          {/* Mark Attendance & RPE Exertion */}
          <Card className="p-5">
            <SectionHeader
              title="Attendance & RPE Logger"
              subtitle="Log player attendance and perceived exertion (1–10)"
              icon={<Users className="w-4 h-4" />}
            />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase text-text-tertiary mb-1">Select Session</label>
                  <select
                    value={selectedSessionId}
                    onChange={e => {
                      setSelectedSessionId(Number(e.target.value))
                      fetchSessionAttendance(Number(e.target.value))
                    }}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  >
                    {sessions.map(s => (
                      <option key={s.id} value={s.id} className="bg-bg-surface">
                        {s.title} ({new Date(s.scheduled_at).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase text-text-tertiary mb-1">Select Athlete</label>
                  <select
                    value={selectedAthleteId}
                    onChange={e => setSelectedAthleteId(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  >
                    {athletes.map(a => (
                      <option key={a.id} value={a.id} className="bg-bg-surface">
                        #{a.jersey_number || ''} {a.full_name} ({a.playing_position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <form onSubmit={handleLogAttendance} className="space-y-3">
                {attMessage && (
                  <div className={`p-2.5 rounded-lg text-sm font-medium ${attMessage.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                    {attMessage.text}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={attendanceStatus}
                    onChange={e => {
                      const newStatus = e.target.value as 'present' | 'absent' | 'late'
                      setAttendanceStatus(newStatus)
                      if (newStatus !== 'late') setMinutesLate(0)
                      else if (minutesLate === 0) setMinutesLate(5)
                    }}
                    className="py-2 px-3 rounded-lg input-human text-sm"
                  >
                    <option value="present" className="bg-bg-surface">Present</option>
                    <option value="late" className="bg-bg-surface">Late</option>
                    <option value="absent" className="bg-bg-surface">Absent</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Late min"
                    value={minutesLate}
                    disabled={attendanceStatus !== 'late'}
                    onChange={e => setMinutesLate(Number(e.target.value))}
                    className="py-2 px-3 rounded-lg input-human text-sm disabled:opacity-40"
                  />
                  <input
                    type="number"
                    placeholder="RPE (1-10)"
                    min={1}
                    max={10}
                    value={rpe}
                    onChange={e => setRpe(Number(e.target.value))}
                    className="py-2 px-3 rounded-lg input-human text-sm"
                  />
                </div>
                <button className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Save Attendance & RPE
                </button>
              </form>

              {/* Recorded List */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-text-secondary mb-2">
                  Recorded for Session ({sessionAttendances.length} players):
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {sessionAttendances.map(rec => (
                    <div key={rec.id} className="flex items-center justify-between p-2 rounded-lg bg-bg-elevated text-xs">
                      <span className="font-medium text-text-primary">
                        {athletes.find(a => a.id === rec.athlete_id)?.full_name || 'Athlete'}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant={rec.status === 'present' ? 'success' : rec.status === 'late' ? 'warning' : 'danger'}>
                          {rec.status}
                        </Badge>
                        <span className="font-mono text-text-tertiary">RPE: {rec.rpe || '—'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 4: PERFORMANCE TELEMETRY */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <Card className="p-5 lg:col-span-1">
            <SectionHeader
              title="Log Match & GPS Telemetry"
              subtitle="Record physical workload metrics"
              icon={<Activity className="w-4 h-4" />}
            />
            <form onSubmit={handleLogPerformance} className="space-y-3">
              {perfMsg && (
                <div className={`p-2.5 rounded-lg text-sm font-medium ${perfMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                  {perfMsg.text}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-text-tertiary mb-1">Target Athlete</label>
                <select
                  value={selectedAthleteId}
                  onChange={e => setSelectedAthleteId(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                >
                  {athletes.map(a => (
                    <option key={a.id} value={a.id} className="bg-bg-surface">
                      #{a.jersey_number || ''} {a.full_name} ({a.playing_position})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 6.8"
                  value={perfDistance}
                  onChange={e => setPerfDistance(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">Top Sprint Speed (km/h)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 31.4"
                  value={perfSpeed}
                  onChange={e => setPerfSpeed(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">Session Training Load</label>
                <input
                  type="number"
                  placeholder="e.g. 520"
                  value={perfLoad}
                  onChange={e => setPerfLoad(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  required
                />
              </div>
              <button className="btn-base w-full h-9 bg-accent-600 hover:bg-accent-500 text-white font-semibold">
                <Zap className="w-4 h-4" /> Save Telemetry Record
              </button>
            </form>
          </Card>

          <Card className="p-5 lg:col-span-2">
            <SectionHeader
              title="Squad Performance Overview"
              subtitle="Latest telemetry distribution across squad members"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeader>Player</DataTableHeader>
                  <DataTableHeader>Position</DataTableHeader>
                  <DataTableHeader numeric>Predicted Readiness</DataTableHeader>
                  <DataTableHeader>Status</DataTableHeader>
                </tr>
              </DataTableHead>
              <DataTableBody>
                {athletes.map(ath => {
                  const ml = mlOverviews.find(m => m.athlete_id === ath.id)
                  return (
                    <DataTableRow key={ath.id}>
                      <DataTableCell>
                        <div className="font-semibold text-text-primary">#{ath.jersey_number || '—'} {ath.full_name}</div>
                        <div className="text-xs text-text-tertiary">{ath.nationality || 'Local'}</div>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge variant="brand">{ath.playing_position || 'FWD'}</Badge>
                      </DataTableCell>
                      <DataTableCell numeric>
                        <span className="font-mono font-bold text-brand-400">
                          {ml?.predicted_fitness_score ? ml.predicted_fitness_score.toFixed(1) : '72.0'} / 100
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge variant={ml?.risk_level === 'high' ? 'danger' : ml?.risk_level === 'moderate' ? 'warning' : 'success'}>
                          {ml?.risk_level || 'optimal'}
                        </Badge>
                      </DataTableCell>
                    </DataTableRow>
                  )
                })}
              </DataTableBody>
            </DataTable>
          </Card>
        </div>
      )}

      {/* VIEW 5: AI & PREDICTIVE INSIGHTS */}
      {activeTab === 'ai_insights' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-bg-surface border border-border-default">
            <div>
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-brand-400" />
                Machine Learning Predictive Engine
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Evaluates rolling ACWR workload ratios against clinical injury risk models
              </p>
            </div>
            <div className="flex items-center gap-3">
              {trainMessage && <span className="text-xs font-semibold text-brand-400">{trainMessage}</span>}
              <button
                onClick={handleRetrainModels}
                disabled={trainingMl}
                className="btn-base h-9 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold disabled:opacity-50"
              >
                {trainingMl ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                Retrain ML Models
              </button>
            </div>
          </div>

          {/* Interactive Recharts Workload & ACWR Progression Chart */}
          <WorkloadChart
            title="Squad Workload & ACWR Fatigue Trend"
            subtitle="7-Day Acute Load vs 28-Day Chronic Baseline across active squad"
          />

          {/* AI Insights Table */}
          <Card className="p-5">
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeader>Athlete</DataTableHeader>
                  <DataTableHeader>Injury Risk Tier</DataTableHeader>
                  <DataTableHeader numeric>Risk Probability</DataTableHeader>
                  <DataTableHeader numeric>Predicted Fitness</DataTableHeader>
                  <DataTableHeader>AI Recommendation</DataTableHeader>
                </tr>
              </DataTableHead>
              <DataTableBody>
                {mlOverviews.map(item => {
                  const ath = athletes.find(a => a.id === item.athlete_id)
                  const isHigh = item.risk_level === 'high'
                  const isMod = item.risk_level === 'moderate'
                  return (
                    <DataTableRow key={item.athlete_id}>
                      <DataTableCell>
                        <Link
                          to={`/athlete/${item.athlete_id}`}
                          className="font-bold text-text-primary hover:text-brand-400 flex items-center gap-1.5"
                        >
                          #{ath?.jersey_number || '—'} {item.athlete_name}
                          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                        </Link>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge variant={isHigh ? 'danger' : isMod ? 'warning' : 'success'}>
                          {item.risk_level?.toUpperCase() || 'LOW'}
                        </Badge>
                      </DataTableCell>
                      <DataTableCell numeric>
                        <span className={`font-mono font-bold ${isHigh ? 'text-danger-400' : isMod ? 'text-warning-400' : 'text-success-400'}`}>
                          {item.injury_risk_probability ? (item.injury_risk_probability * 100).toFixed(1) : '15.0'}%
                        </span>
                      </DataTableCell>
                      <DataTableCell numeric>
                        <span className="font-mono font-bold text-brand-400">
                          {item.predicted_fitness_score ? item.predicted_fitness_score.toFixed(1) : '72.0'} / 100
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <span className="text-xs text-text-secondary line-clamp-1">
                          {item.recommendations && item.recommendations.length > 0
                            ? item.recommendations[0]
                            : 'Normal training routine approved.'}
                        </span>
                      </DataTableCell>
                    </DataTableRow>
                  )
                })}
              </DataTableBody>
            </DataTable>
          </Card>
        </div>
      )}

      {/* VIEW 6: COMPETITIONS */}
      {activeTab === 'competitions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <Card className="p-5 lg:col-span-1">
            <SectionHeader
              title="Add Match Fixture"
              subtitle="Schedule competition games"
              icon={<Trophy className="w-4 h-4" />}
            />
            <form onSubmit={handleCreateCompetition} className="space-y-3">
              {compMsg && (
                <div className={`p-2.5 rounded-lg text-sm font-medium ${compMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                  {compMsg.text}
                </div>
              )}
              <input
                type="text"
                placeholder="Competition Name (e.g. League Cup R1)"
                value={compName}
                onChange={e => setCompName(e.target.value)}
                className="w-full py-2 px-3 rounded-lg input-human text-sm"
                required
              />
              <input
                type="text"
                placeholder="Opponent Team"
                value={compOpponent}
                onChange={e => setCompOpponent(e.target.value)}
                className="w-full py-2 px-3 rounded-lg input-human text-sm"
                required
              />
              <input
                type="datetime-local"
                value={compDate}
                onChange={e => setCompDate(e.target.value)}
                className="w-full py-2 px-3 rounded-lg input-human text-sm"
              />
              <select
                value={compResult}
                onChange={e => setCompResult(e.target.value)}
                className="w-full py-2 px-3 rounded-lg input-human text-sm"
              >
                <option value="" className="bg-bg-surface">Upcoming Match</option>
                <option value="win" className="bg-bg-surface">Win</option>
                <option value="loss" className="bg-bg-surface">Loss</option>
                <option value="draw" className="bg-bg-surface">Draw</option>
              </select>
              <button className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                <Plus className="w-4 h-4" /> Save Competition Fixture
              </button>
            </form>
          </Card>

          <Card className="p-5 lg:col-span-2">
            <SectionHeader
              title="Competition Fixtures & Results"
              subtitle={`${competitions.length} recorded matches`}
              icon={<Trophy className="w-4 h-4" />}
            />
            {competitions.length === 0 ? (
              <EmptyState
                title="No competitions logged"
                description="Add upcoming fixtures or past match results."
                icon={<Trophy className="w-5 h-5" />}
              />
            ) : (
              <DataTable>
                <DataTableHead>
                  <tr>
                    <DataTableHeader>Competition</DataTableHeader>
                    <DataTableHeader>Opponent</DataTableHeader>
                    <DataTableHeader>Match Date</DataTableHeader>
                    <DataTableHeader>Outcome</DataTableHeader>
                  </tr>
                </DataTableHead>
                <DataTableBody>
                  {competitions.map(c => (
                    <DataTableRow key={c.id}>
                      <DataTableCell>
                        <span className="font-bold text-text-primary">{c.name}</span>
                      </DataTableCell>
                      <DataTableCell>
                        <span className="text-text-secondary">{c.opponent || 'TBD'}</span>
                      </DataTableCell>
                      <DataTableCell>
                        <span className="text-xs text-text-tertiary">
                          {new Date(c.match_date).toLocaleDateString()}
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge
                          variant={
                            c.result === 'win' ? 'success' :
                            c.result === 'loss' ? 'danger' :
                            c.result === 'draw' ? 'warning' : 'default'
                          }
                        >
                          {c.result ? c.result.toUpperCase() : 'UPCOMING'}
                        </Badge>
                      </DataTableCell>
                    </DataTableRow>
                  ))}
                </DataTableBody>
              </DataTable>
            )}
          </Card>
        </div>
      )}
    </SidebarLayout>
  )
}
