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
} from '../components/ui'
import {
  HeartPulse,
  Building2,
  Package,
  CheckCircle2,
  Plus,
  Clock,
  Activity,
} from 'lucide-react'

interface InjuryRecord {
  id: number
  athlete_id: number
  injury_type: string
  body_part?: string
  severity: string
  occurred_on: string
  returned_on?: string
  cause?: string
  notes?: string
}

interface Facility {
  id: number
  name: string
  facility_type: string
  location?: string
  capacity?: number
  is_available: boolean
}

interface Equipment {
  id: number
  name: string
  category?: string
  facility_id?: number
  quantity: number
  condition: string
  last_maintenance?: string
}

interface Athlete {
  id: number
  full_name?: string
  jersey_number?: number
  playing_position?: string
  user?: { full_name: string }
}

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [injuries, setInjuries] = useState<InjuryRecord[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | ''>('')

  // Injury Form
  const [injuryType, setInjuryType] = useState('')
  const [bodyPart, setBodyPart] = useState('')
  const [severity, setSeverity] = useState('minor')
  const [cause, setCause] = useState('training')
  const [occurredOn, setOccurredOn] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [injuryMsg, setInjuryMsg] = useState<{ text: string; isError: boolean } | null>(null)

  // Facility Form
  const [facName, setFacName] = useState('')
  const [facType, setFacType] = useState('pitch')
  const [facLocation, setFacLocation] = useState('')
  const [facCapacity, setFacCapacity] = useState('')
  const [facMsg, setFacMsg] = useState<{ text: string; isError: boolean } | null>(null)

  // Equipment Form
  const [eqName, setEqName] = useState('')
  const [eqCategory, setEqCategory] = useState('')
  const [eqFacilityId, setEqFacilityId] = useState<number | ''>('')
  const [eqQuantity, setEqQuantity] = useState('1')
  const [eqCondition, setEqCondition] = useState('good')
  const [eqMsg, setEqMsg] = useState<{ text: string; isError: boolean } | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [injRes, facRes, eqRes, athRes] = await Promise.all([
        api.get('/injuries').catch(() => ({ data: [] })),
        api.get('/facilities').catch(() => ({ data: [] })),
        api.get('/equipment').catch(() => ({ data: [] })),
        api.get('/athletes').catch(() => ({ data: [] })),
      ])
      setInjuries(injRes.data)
      setFacilities(facRes.data)
      setEquipment(eqRes.data)
      setAthletes(athRes.data)
      if (athRes.data.length > 0) setSelectedAthleteId(athRes.data[0].id)
      if (facRes.data.length > 0) setEqFacilityId(facRes.data[0].id)
    } catch (err) {
      console.error('Failed to load staff dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInjury = async (e: React.FormEvent) => {
    e.preventDefault()
    setInjuryMsg(null)
    if (!selectedAthleteId) return
    try {
      const res = await api.post('/injuries', {
        athlete_id: Number(selectedAthleteId),
        injury_type: injuryType,
        body_part: bodyPart,
        severity,
        cause,
        occurred_on: occurredOn,
        notes,
      })
      setInjuryMsg({ text: 'Injury incident recorded', isError: false })
      setInjuries(prev => [res.data, ...prev])
      setInjuryType('')
      setBodyPart('')
      setNotes('')
    } catch (err: any) {
      setInjuryMsg({ text: err.response?.data?.detail || 'Error logging injury', isError: true })
    }
  }

  const handleClearReturnToPlay = async (injuryId: number) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      await api.patch(`/injuries/${injuryId}`, { returned_on: today })
      setInjuries(prev =>
        prev.map(inj => (inj.id === injuryId ? { ...inj, returned_on: today } : inj))
      )
    } catch (err) {
      console.error('Error updating injury clearance', err)
    }
  }

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault()
    setFacMsg(null)
    try {
      const res = await api.post('/facilities', {
        name: facName,
        facility_type: facType,
        location: facLocation,
        capacity: facCapacity ? Number(facCapacity) : undefined,
        is_available: true,
      })
      setFacMsg({ text: 'Facility created', isError: false })
      setFacilities(prev => [...prev, res.data])
      setFacName('')
      setFacLocation('')
      setFacCapacity('')
    } catch (err: any) {
      setFacMsg({ text: err.response?.data?.detail || 'Error creating facility', isError: true })
    }
  }

  const handleToggleFacilityAvailability = async (fac: Facility) => {
    try {
      const res = await api.put(`/facilities/${fac.id}`, {
        is_available: !fac.is_available,
      })
      setFacilities(prev => prev.map(f => (f.id === fac.id ? res.data : f)))
    } catch (err) {
      console.error('Error toggling facility availability', err)
    }
  }

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    setEqMsg(null)
    try {
      const res = await api.post('/equipment', {
        name: eqName,
        category: eqCategory,
        facility_id: eqFacilityId ? Number(eqFacilityId) : undefined,
        quantity: Number(eqQuantity),
        condition: eqCondition,
      })
      setEqMsg({ text: 'Equipment added', isError: false })
      setEquipment(prev => [...prev, res.data])
      setEqName('')
      setEqCategory('')
    } catch (err: any) {
      setEqMsg({ text: err.response?.data?.detail || 'Error adding equipment', isError: true })
    }
  }

  const activeInjuries = injuries.filter(i => !i.returned_on)
  const availableFacilities = facilities.filter(f => f.is_available).length

  // Navigation Items
  const navItems: SidebarNavItem[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'medical', label: 'Medical & Injuries', icon: HeartPulse, badge: activeInjuries.length > 0 ? `${activeInjuries.length} Active` : undefined, badgeVariant: 'danger' },
    { id: 'facilities', label: 'Facilities Manager', icon: Building2, badge: facilities.length, badgeVariant: 'brand' },
    { id: 'equipment', label: 'Equipment Inventory', icon: Package, badge: equipment.length, badgeVariant: 'default' },
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
        activeTab === 'overview' ? 'Operations & Medical Hub' :
        activeTab === 'medical' ? 'Physiotherapy & Injury Center' :
        activeTab === 'facilities' ? 'Facility Operations & Grounds' :
        'Equipment & Gear Inventory'
      }
      subtitle={
        activeTab === 'overview' ? 'Monitor active injuries, training grounds, and equipment status' :
        activeTab === 'medical' ? `Managing ${activeInjuries.length} active rehabilitation cases` :
        activeTab === 'facilities' ? 'Manage stadium pitches, gyms, and availability states' :
        'Track gear conditions and maintenance schedules'
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Active Injuries"
              value={activeInjuries.length}
              icon={<HeartPulse className="w-4 h-4" />}
              variant={activeInjuries.length > 0 ? 'danger' : 'default'}
            />
            <StatCard
              label="Available Grounds"
              value={`${availableFacilities}/${facilities.length}`}
              icon={<Building2 className="w-4 h-4" />}
              variant="brand"
            />
            <StatCard
              label="Total Equipment Items"
              value={equipment.reduce((acc, eq) => acc + (eq.quantity || 1), 0)}
              icon={<Package className="w-4 h-4" />}
              variant="success"
            />
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="p-5 cursor-pointer hover:border-danger-500/40 transition-all group"
              onClick={() => setActiveTab('medical')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center text-danger-400 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <Badge variant={activeInjuries.length > 0 ? 'danger' : 'success'}>
                  {activeInjuries.length} Active
                </Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">Medical Center</h3>
              <p className="text-xs text-text-secondary mt-1">Log injury cases and execute Return-to-Play clearances.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-brand-500/40 transition-all group"
              onClick={() => setActiveTab('facilities')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <Badge variant="brand">{facilities.length} Pitches</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">Grounds & Pitches</h3>
              <p className="text-xs text-text-secondary mt-1">Configure field capacities and maintenance availability.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-accent-500/40 transition-all group"
              onClick={() => setActiveTab('equipment')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <Badge variant="default">{equipment.length} Items</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">Equipment & Inventory</h3>
              <p className="text-xs text-text-secondary mt-1">Monitor GPS vests, balls, cones, and condition ratings.</p>
            </Card>
          </div>

          {/* Active Injuries Table Preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader
                title="Current Medical Rehabilitation Cases"
                subtitle="Athletes under medical observation"
                icon={<HeartPulse className="w-4 h-4" />}
                className="mb-0"
              />
              <button
                onClick={() => setActiveTab('medical')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Go to Medical Center →
              </button>
            </div>
            {activeInjuries.length === 0 ? (
              <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 flex items-center gap-3 text-success-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-success-400" />
                <span>Squad clean bill of health: zero active injuries registered.</span>
              </div>
            ) : (
              <DataTable>
                <DataTableHead>
                  <tr>
                    <DataTableHeader>Athlete</DataTableHeader>
                    <DataTableHeader>Diagnosis / Body Part</DataTableHeader>
                    <DataTableHeader>Severity</DataTableHeader>
                    <DataTableHeader>Date Occurred</DataTableHeader>
                    <DataTableHeader>Action</DataTableHeader>
                  </tr>
                </DataTableHead>
                <DataTableBody>
                  {activeInjuries.map(inj => (
                    <DataTableRow key={inj.id}>
                      <DataTableCell>
                        <span className="font-bold text-text-primary">
                          {athletes.find(a => a.id === inj.athlete_id)?.full_name || `Athlete #${inj.athlete_id}`}
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <div className="text-sm font-semibold text-text-primary">{inj.injury_type}</div>
                        <div className="text-xs text-text-tertiary">{inj.body_part || 'General'}</div>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge variant={inj.severity === 'severe' ? 'danger' : inj.severity === 'moderate' ? 'warning' : 'default'}>
                          {inj.severity.toUpperCase()}
                        </Badge>
                      </DataTableCell>
                      <DataTableCell>
                        <span className="text-xs text-text-secondary">{inj.occurred_on}</span>
                      </DataTableCell>
                      <DataTableCell>
                        <button
                          onClick={() => handleClearReturnToPlay(inj.id)}
                          className="btn-base h-7 px-3 bg-success-600 hover:bg-success-500 text-white text-xs font-semibold"
                        >
                          Clear RTP
                        </button>
                      </DataTableCell>
                    </DataTableRow>
                  ))}
                </DataTableBody>
              </DataTable>
            )}
          </Card>
        </div>
      )}

      {/* VIEW 2: MEDICAL & INJURY CENTER */}
      {activeTab === 'medical' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Log Injury Form */}
          <Card className="p-5 lg:col-span-1">
            <SectionHeader
              title="Log Clinical Incident"
              subtitle="Record new medical diagnosis"
              icon={<HeartPulse className="w-4 h-4" />}
            />
            <form onSubmit={handleCreateInjury} className="space-y-3">
              {injuryMsg && (
                <div className={`p-2.5 rounded-lg text-sm font-medium ${injuryMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                  {injuryMsg.text}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-text-tertiary mb-1">Select Athlete</label>
                <select
                  value={selectedAthleteId}
                  onChange={e => setSelectedAthleteId(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  required
                >
                  {athletes.map(a => (
                    <option key={a.id} value={a.id} className="bg-bg-surface">
                      #{a.jersey_number || ''} {a.full_name} ({a.playing_position || 'Player'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-tertiary mb-1">Injury Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. Hamstring Strain (Grade 2)"
                  value={injuryType}
                  onChange={e => setInjuryType(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">Body Part</label>
                  <input
                    type="text"
                    placeholder="e.g. Thigh / Ankle"
                    value={bodyPart}
                    onChange={e => setBodyPart(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  >
                    <option value="minor" className="bg-bg-surface">Minor</option>
                    <option value="moderate" className="bg-bg-surface">Moderate</option>
                    <option value="severe" className="bg-bg-surface">Severe</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">Date Occurred</label>
                  <input
                    type="date"
                    value={occurredOn}
                    onChange={e => setOccurredOn(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">Cause</label>
                  <select
                    value={cause}
                    onChange={e => setCause(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  >
                    <option value="training" className="bg-bg-surface">Training</option>
                    <option value="match" className="bg-bg-surface">Match</option>
                    <option value="other" className="bg-bg-surface">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-tertiary mb-1">Physio Clinical Notes</label>
                <textarea
                  placeholder="Rehab notes, MRI scan info..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm resize-none h-16"
                />
              </div>
              <button className="btn-base w-full h-9 bg-danger-600 hover:bg-danger-500 text-white font-semibold">
                <Plus className="w-4 h-4" /> Save Medical Record
              </button>
            </form>
          </Card>

          {/* Full Injury Log Table */}
          <Card className="p-5 lg:col-span-2">
            <SectionHeader
              title="Injury Incident & Clearance Log"
              subtitle={`${injuries.length} total historical records`}
              icon={<HeartPulse className="w-4 h-4" />}
            />
            {injuries.length === 0 ? (
              <EmptyState
                title="No medical records"
                description="Use the form to log physical injury incidents."
                icon={<HeartPulse className="w-5 h-5" />}
              />
            ) : (
              <DataTable>
                <DataTableHead>
                  <tr>
                    <DataTableHeader>Athlete</DataTableHeader>
                    <DataTableHeader>Injury Details</DataTableHeader>
                    <DataTableHeader>Severity</DataTableHeader>
                    <DataTableHeader>Timeline</DataTableHeader>
                    <DataTableHeader>Return-to-Play</DataTableHeader>
                  </tr>
                </DataTableHead>
                <DataTableBody>
                  {injuries.map(inj => (
                    <DataTableRow key={inj.id}>
                      <DataTableCell>
                        <span className="font-bold text-text-primary">
                          {athletes.find(a => a.id === inj.athlete_id)?.full_name || `Athlete #${inj.athlete_id}`}
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <div className="font-semibold text-text-primary">{inj.injury_type}</div>
                        <div className="text-xs text-text-tertiary">{inj.body_part || 'General'} · {inj.cause}</div>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge variant={inj.severity === 'severe' ? 'danger' : inj.severity === 'moderate' ? 'warning' : 'default'}>
                          {inj.severity.toUpperCase()}
                        </Badge>
                      </DataTableCell>
                      <DataTableCell>
                        <div className="text-xs text-text-secondary">Occurred: {inj.occurred_on}</div>
                        {inj.returned_on && (
                          <div className="text-[11px] text-success-400 font-medium">Cleared: {inj.returned_on}</div>
                        )}
                      </DataTableCell>
                      <DataTableCell>
                        {inj.returned_on ? (
                          <Badge variant="success">CLEARED</Badge>
                        ) : (
                          <button
                            onClick={() => handleClearReturnToPlay(inj.id)}
                            className="btn-base h-7 px-3 bg-success-600 hover:bg-success-500 text-white text-xs font-semibold"
                          >
                            Clear RTP
                          </button>
                        )}
                      </DataTableCell>
                    </DataTableRow>
                  ))}
                </DataTableBody>
              </DataTable>
            )}
          </Card>
        </div>
      )}

      {/* VIEW 3: FACILITIES MANAGER */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <Card className="p-5 lg:col-span-1">
            <SectionHeader
              title="Add New Facility"
              subtitle="Register stadium pitches & fitness grounds"
              icon={<Building2 className="w-4 h-4" />}
            />
            <form onSubmit={handleCreateFacility} className="space-y-3">
              {facMsg && (
                <div className={`p-2.5 rounded-lg text-sm font-medium ${facMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                  {facMsg.text}
                </div>
              )}
              <input
                type="text"
                placeholder="Facility Name (e.g. Main Stadium Pitch)"
                value={facName}
                onChange={e => setFacName(e.target.value)}
                className="w-full py-2 px-3 rounded-lg input-human text-sm"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={facType}
                  onChange={e => setFacType(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                >
                  <option value="pitch" className="bg-bg-surface">Grass Pitch</option>
                  <option value="gym" className="bg-bg-surface">Gym / Weight Room</option>
                  <option value="court" className="bg-bg-surface">Indoor Court</option>
                  <option value="pool" className="bg-bg-surface">Hydrotherapy Pool</option>
                </select>
                <input
                  type="number"
                  placeholder="Capacity (Players)"
                  value={facCapacity}
                  onChange={e => setFacCapacity(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Location / Zone (e.g. North Field Complex)"
                value={facLocation}
                onChange={e => setFacLocation(e.target.value)}
                className="w-full py-2 px-3 rounded-lg input-human text-sm"
              />
              <button className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                <Plus className="w-4 h-4" /> Save Facility
              </button>
            </form>
          </Card>

          <Card className="p-5 lg:col-span-2">
            <SectionHeader
              title="Registered Training Grounds"
              subtitle={`${facilities.length} registered facilities`}
              icon={<Building2 className="w-4 h-4" />}
            />
            {facilities.length === 0 ? (
              <EmptyState
                title="No facilities found"
                description="Add training pitches or gym facilities."
                icon={<Building2 className="w-5 h-5" />}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facilities.map(fac => (
                  <div
                    key={fac.id}
                    className="p-4 rounded-xl bg-bg-elevated border border-border-subtle flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-text-primary">{fac.name}</span>
                        <Badge variant={fac.is_available ? 'success' : 'danger'}>
                          {fac.is_available ? 'AVAILABLE' : 'MAINTENANCE'}
                        </Badge>
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        Type: <span className="capitalize text-text-secondary">{fac.facility_type}</span> · Capacity: {fac.capacity || '—'}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">{fac.location || 'Main Complex'}</div>
                    </div>
                    <button
                      onClick={() => handleToggleFacilityAvailability(fac)}
                      className={`btn-base h-8 px-3 text-xs font-semibold w-full ${
                        fac.is_available
                          ? 'bg-warning-500/10 hover:bg-warning-500/20 text-warning-400 border border-warning-500/20'
                          : 'bg-success-500/10 hover:bg-success-500/20 text-success-400 border border-success-500/20'
                      }`}
                    >
                      {fac.is_available ? 'Set to Maintenance' : 'Set to Available'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* VIEW 4: EQUIPMENT INVENTORY */}
      {activeTab === 'equipment' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <Card className="p-5 lg:col-span-1">
            <SectionHeader
              title="Add Gear Item"
              subtitle="Register new equipment"
              icon={<Package className="w-4 h-4" />}
            />
            <form onSubmit={handleCreateEquipment} className="space-y-3">
              {eqMsg && (
                <div className={`p-2.5 rounded-lg text-sm font-medium ${eqMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                  {eqMsg.text}
                </div>
              )}
              <input
                type="text"
                placeholder="Equipment Name (e.g. GPS Tracking Vests)"
                value={eqName}
                onChange={e => setEqName(e.target.value)}
                className="w-full py-2 px-3 rounded-lg input-human text-sm"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Category (e.g. Tracking)"
                  value={eqCategory}
                  onChange={e => setEqCategory(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={eqQuantity}
                  onChange={e => setEqQuantity(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  min={1}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={eqCondition}
                  onChange={e => setEqCondition(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                >
                  <option value="good" className="bg-bg-surface">Good Condition</option>
                  <option value="fair" className="bg-bg-surface">Fair Condition</option>
                  <option value="broken" className="bg-bg-surface">Damaged / Repair</option>
                </select>
                <select
                  value={eqFacilityId}
                  onChange={e => setEqFacilityId(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg input-human text-sm"
                >
                  {facilities.map(f => (
                    <option key={f.id} value={f.id} className="bg-bg-surface">{f.name}</option>
                  ))}
                </select>
              </div>
              <button className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white font-semibold">
                <Plus className="w-4 h-4" /> Save Equipment
              </button>
            </form>
          </Card>

          <Card className="p-5 lg:col-span-2">
            <SectionHeader
              title="Club Equipment & Supplies"
              subtitle={`${equipment.length} registered item types`}
              icon={<Package className="w-4 h-4" />}
            />
            {equipment.length === 0 ? (
              <EmptyState
                title="No equipment found"
                description="Add GPS vests, tactical cones, or medicine balls."
                icon={<Package className="w-5 h-5" />}
              />
            ) : (
              <DataTable>
                <DataTableHead>
                  <tr>
                    <DataTableHeader>Item Name</DataTableHeader>
                    <DataTableHeader>Category</DataTableHeader>
                    <DataTableHeader numeric>Quantity</DataTableHeader>
                    <DataTableHeader>Condition</DataTableHeader>
                  </tr>
                </DataTableHead>
                <DataTableBody>
                  {equipment.map(eq => (
                    <DataTableRow key={eq.id}>
                      <DataTableCell>
                        <span className="font-bold text-text-primary">{eq.name}</span>
                      </DataTableCell>
                      <DataTableCell>
                        <span className="text-xs text-text-secondary capitalize">{eq.category || 'Training'}</span>
                      </DataTableCell>
                      <DataTableCell numeric>
                        <span className="font-mono font-bold text-brand-400">{eq.quantity}</span>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge variant={eq.condition === 'good' ? 'success' : eq.condition === 'fair' ? 'warning' : 'danger'}>
                          {eq.condition.toUpperCase()}
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
