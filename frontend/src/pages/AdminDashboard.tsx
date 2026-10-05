import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
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
} from '../components/ui'
import {
  Shield,
  Users,
  Search,
  Download,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  XCircle,
  Building2,
  CreditCard,
  Plus,
  Loader2,
  Clock,
  Activity,
} from 'lucide-react'

interface UserItem {
  id: number
  email: string
  full_name: string
  role: 'admin' | 'coach' | 'athlete' | 'physiotherapist' | 'staff'
  is_active: boolean
  created_at?: string
}

interface AthleteItem {
  id: number
  full_name?: string
  jersey_number?: number
  playing_position?: string
}

interface MembershipItem {
  id: number
  athlete_id: number
  plan: string
  start_date?: string
  end_date?: string
  amount_paid: number
  status: string
}

export default function AdminDashboard() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tabParam = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState<string>(tabParam || 'overview')

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const [users, setUsers] = useState<UserItem[]>([])
  const [athletes, setAthletes] = useState<AthleteItem[]>([])
  const [memberships, setMemberships] = useState<MembershipItem[]>([])
  const [facilityCount, setFacilityCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // Create User Form State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newFullName, setNewFullName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'coach' | 'athlete' | 'physiotherapist' | 'staff'>('coach')
  const [createMsg, setCreateMsg] = useState<{ text: string; isError: boolean } | null>(null)
  const [creating, setCreating] = useState(false)

  // Create Membership Form State
  const [showAddMembership, setShowAddMembership] = useState(false)
  const [memAthleteId, setMemAthleteId] = useState<number | ''>('')
  const [memPlan, setMemPlan] = useState('pro')
  const [memAmount, setMemAmount] = useState('150')
  const [memStatus, setMemStatus] = useState('active')
  const [memMsg, setMemMsg] = useState<{ text: string; isError: boolean } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [usersRes, facRes, memRes, athRes] = await Promise.all([
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/facilities').catch(() => ({ data: [] })),
        api.get('/memberships').catch(() => ({ data: [] })),
        api.get('/athletes').catch(() => ({ data: [] })),
      ])
      setUsers(usersRes.data)
      setFacilityCount(facRes.data.length)
      setMemberships(memRes.data)
      setAthletes(athRes.data)
      if (athRes.data.length > 0) setMemAthleteId(athRes.data[0].id)
    } catch (err) {
      console.error('Failed to load admin dashboard data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateMsg(null)
    try {
      await api.post('/users', {
        full_name: newFullName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        is_active: true,
      })
      setCreateMsg({ text: 'User created successfully', isError: false })
      setNewFullName('')
      setNewEmail('')
      setNewPassword('')
      setShowAddModal(false)
      fetchData()
    } catch (err: any) {
      setCreateMsg({ text: err.response?.data?.detail || 'Failed to create user', isError: true })
    } finally {
      setCreating(false)
    }
  }

  const handleCreateMembership = async (e: React.FormEvent) => {
    e.preventDefault()
    setMemMsg(null)
    if (!memAthleteId) return
    try {
      const res = await api.post('/memberships', {
        athlete_id: Number(memAthleteId),
        plan: memPlan,
        amount_paid: Number(memAmount),
        status: memStatus,
        start_date: new Date().toISOString().split('T')[0],
      })
      setMemMsg({ text: 'Membership provisioned successfully', isError: false })
      setMemberships(prev => [res.data, ...prev])
      setShowAddMembership(false)
    } catch (err: any) {
      setMemMsg({ text: err.response?.data?.detail || 'Error creating membership', isError: true })
    }
  }

  const handleToggleStatus = async (user: UserItem) => {
    try {
      await api.patch(`/users/${user.id}`, { is_active: !user.is_active })
      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
      )
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/users/${userId}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete user')
    }
  }

  const handleExportCSV = async (entity: 'users' | 'attendance' | 'facilities' | 'memberships') => {
    try {
      const response = await api.get(`/reports/export?entity=${entity}`, {
        responseType: 'blob',
      })
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${entity}_report_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(`Export failed for ${entity}`, err)
      alert(`Failed to export ${entity} data`)
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Navigation Items
  const navItems: SidebarNavItem[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'User Directory', icon: Users, badge: users.length, badgeVariant: 'brand' },
    { id: 'memberships', label: 'Memberships & Billing', icon: CreditCard, badge: memberships.length, badgeVariant: 'success' },
    { id: 'reports', label: 'CSV Reports & Exports', icon: FileSpreadsheet },
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
        activeTab === 'overview' ? 'Administration Console' :
        activeTab === 'users' ? 'User Directory & Permissions' :
        activeTab === 'memberships' ? 'Player Memberships & Billing' :
        'System Reports & Data Exports'
      }
      subtitle={
        activeTab === 'overview' ? 'System user directory, RBAC governance, and data exports' :
        activeTab === 'users' ? `Managing ${filteredUsers.length} platform accounts` :
        activeTab === 'memberships' ? `Managing ${memberships.length} active player subscription plans` :
        'Download official offline CSV audit records'
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
              label="Total Users"
              value={users.length}
              icon={<Users className="w-4 h-4" />}
              variant="brand"
            />
            <StatCard
              label="Registered Grounds"
              value={facilityCount}
              icon={<Building2 className="w-4 h-4" />}
            />
            <StatCard
              label="Memberships"
              value={memberships.length}
              icon={<CreditCard className="w-4 h-4" />}
              variant="success"
            />
            <StatCard
              label="Security Status"
              value="Protected"
              icon={<Shield className="w-4 h-4" />}
              variant="success"
              trend="up"
              trendValue="Authentication & Access Control Active"
            />
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="p-5 cursor-pointer hover:border-brand-500/40 transition-all group"
              onClick={() => setActiveTab('users')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <Badge variant="brand">{users.length} Users</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">User Governance</h3>
              <p className="text-xs text-text-secondary mt-1">Manage passwords, RBAC assignments, and active statuses.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-success-500/40 transition-all group"
              onClick={() => setActiveTab('memberships')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-success-500/10 border border-success-500/20 flex items-center justify-center text-success-400 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <Badge variant="success">{memberships.length} Active</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">Memberships & Billing</h3>
              <p className="text-xs text-text-secondary mt-1">Manage athlete subscription tiers, billing plans, and fees.</p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-accent-500/40 transition-all group"
              onClick={() => setActiveTab('reports')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <Badge variant="default">4 Data Entities</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">Audit Exports</h3>
              <p className="text-xs text-text-secondary mt-1">1-click CSV downloads for Users, Attendance, Facilities, and Memberships.</p>
            </Card>
          </div>

          {/* User Preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader
                title="Recent User Registrations"
                subtitle="Active system accounts across all roles"
                icon={<Users className="w-4 h-4" />}
                className="mb-0"
              />
              <button
                onClick={() => setActiveTab('users')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                View Full Directory →
              </button>
            </div>
            <DataTable>
              <DataTableHead>
                <tr>
                  <DataTableHeader>Full Name</DataTableHeader>
                  <DataTableHeader>Email Address</DataTableHeader>
                  <DataTableHeader>Role</DataTableHeader>
                  <DataTableHeader>Status</DataTableHeader>
                </tr>
              </DataTableHead>
              <DataTableBody>
                {users.slice(0, 5).map(u => (
                  <DataTableRow key={u.id}>
                    <DataTableCell>
                      <span className="font-bold text-text-primary">{u.full_name}</span>
                    </DataTableCell>
                    <DataTableCell>
                      <span className="text-xs text-text-secondary">{u.email}</span>
                    </DataTableCell>
                    <DataTableCell>
                      <Badge variant="brand">{u.role.toUpperCase()}</Badge>
                    </DataTableCell>
                    <DataTableCell>
                      <Badge variant={u.is_active ? 'success' : 'danger'}>
                        {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                      </Badge>
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </Card>
        </div>
      )}

      {/* VIEW 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Filter & Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl input-human text-sm"
                />
              </div>
              <div className="flex items-center gap-1 p-1 bg-bg-surface border border-border-subtle rounded-xl">
                {['all', 'admin', 'coach', 'athlete', 'physiotherapist', 'staff'].map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                      roleFilter === r
                        ? 'bg-brand-500 text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {r === 'all' ? 'All Roles' : r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(!showAddModal)}
              className="btn-base h-9 px-4 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              {showAddModal ? 'Close Form' : 'Create Account'}
            </button>
          </div>

          {/* Add User Form */}
          {showAddModal && (
            <Card className="p-5 border-brand-500/30 bg-bg-surface animate-fade-in">
              <SectionHeader
                title="Provision New Account"
                subtitle="Create a new user with specific RBAC role permissions"
                icon={<Users className="w-4 h-4" />}
              />
              <form onSubmit={handleCreateUser} className="space-y-3">
                {createMsg && (
                  <div className={`p-2.5 rounded-lg text-sm font-medium ${createMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                    {createMsg.text}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. John Smith)"
                    value={newFullName}
                    onChange={e => setNewFullName(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                    required
                  />
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-lg input-human text-sm"
                  >
                    <option value="coach" className="bg-bg-surface">Coach</option>
                    <option value="athlete" className="bg-bg-surface">Athlete</option>
                    <option value="physiotherapist" className="bg-bg-surface">Physiotherapist</option>
                    <option value="staff" className="bg-bg-surface">Staff</option>
                    <option value="admin" className="bg-bg-surface">Administrator</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white font-semibold"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Save Account
                </button>
              </form>
            </Card>
          )}

          {/* User Table */}
          <Card className="p-5">
            {filteredUsers.length === 0 ? (
              <EmptyState
                title="No users match filter"
                description="Try another search term or role filter."
                icon={<Users className="w-5 h-5" />}
              />
            ) : (
              <DataTable>
                <DataTableHead>
                  <tr>
                    <DataTableHeader>User</DataTableHeader>
                    <DataTableHeader>Email</DataTableHeader>
                    <DataTableHeader>Role</DataTableHeader>
                    <DataTableHeader>Status</DataTableHeader>
                    <DataTableHeader>Actions</DataTableHeader>
                  </tr>
                </DataTableHead>
                <DataTableBody>
                  {filteredUsers.map(u => (
                    <DataTableRow key={u.id}>
                      <DataTableCell>
                        <span className="font-bold text-text-primary">{u.full_name}</span>
                      </DataTableCell>
                      <DataTableCell>
                        <span className="text-xs text-text-secondary">{u.email}</span>
                      </DataTableCell>
                      <DataTableCell>
                        <Badge variant="brand">{u.role.toUpperCase()}</Badge>
                      </DataTableCell>
                      <DataTableCell>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            u.is_active
                              ? 'bg-success-500/10 text-success-400 border border-success-500/20 hover:bg-success-500/20'
                              : 'bg-danger-500/10 text-danger-400 border border-danger-500/20 hover:bg-danger-500/20'
                          }`}
                        >
                          {u.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {u.is_active ? 'Active' : 'Suspended'}
                        </button>
                      </DataTableCell>
                      <DataTableCell>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg text-text-tertiary hover:text-danger-400 hover:bg-danger-500/10 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* VIEW 3: MEMBERSHIPS & BILLING */}
      {activeTab === 'memberships' && (
        <div className="space-y-6 animate-fade-in">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Player Memberships & Subscriptions"
              subtitle="Provision and manage player club tiers, annual fees, and billing statuses"
              icon={<CreditCard className="w-5 h-5" />}
              className="mb-0"
            />
            <button
              onClick={() => setShowAddMembership(!showAddMembership)}
              className="btn-base h-9 px-4 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              {showAddMembership ? 'Close Form' : 'Provision Membership'}
            </button>
          </div>

          {/* Provision Membership Form */}
          {showAddMembership && (
            <Card className="p-5 border-brand-500/30 bg-bg-surface animate-fade-in">
              <SectionHeader
                title="Provision Athlete Membership Plan"
                subtitle="Assign subscription tier and record payment"
                icon={<CreditCard className="w-4 h-4" />}
              />
              <form onSubmit={handleCreateMembership} className="space-y-3">
                {memMsg && (
                  <div className={`p-2.5 rounded-lg text-sm font-medium ${memMsg.isError ? 'bg-danger-500/8 text-danger-400 border border-danger-500/15' : 'bg-success-500/8 text-success-400 border border-success-500/15'}`}>
                    {memMsg.text}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-tertiary mb-1">Target Athlete</label>
                    <select
                      value={memAthleteId}
                      onChange={e => setMemAthleteId(Number(e.target.value))}
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
                    <label className="block text-xs font-medium text-text-tertiary mb-1">Membership Plan</label>
                    <select
                      value={memPlan}
                      onChange={e => setMemPlan(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg input-human text-sm"
                    >
                      <option value="basic" className="bg-bg-surface">Basic Plan</option>
                      <option value="pro" className="bg-bg-surface">Pro Athlete Plan</option>
                      <option value="elite" className="bg-bg-surface">Elite First-Team Plan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-tertiary mb-1">Amount Paid ($)</label>
                    <input
                      type="number"
                      value={memAmount}
                      onChange={e => setMemAmount(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg input-human text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-tertiary mb-1">Initial Status</label>
                    <select
                      value={memStatus}
                      onChange={e => setMemStatus(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg input-human text-sm"
                    >
                      <option value="active" className="bg-bg-surface">Active</option>
                      <option value="pending" className="bg-bg-surface">Pending Payment</option>
                      <option value="cancelled" className="bg-bg-surface">Cancelled</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-base w-full h-9 bg-brand-600 hover:bg-brand-500 text-white font-semibold"
                >
                  <Plus className="w-4 h-4" /> Provision Membership
                </button>
              </form>
            </Card>
          )}

          {/* Memberships Table */}
          <Card className="p-5">
            {memberships.length === 0 ? (
              <EmptyState
                title="No active memberships"
                description="Use the button above to provision new athlete memberships."
                icon={<CreditCard className="w-5 h-5" />}
              />
            ) : (
              <DataTable>
                <DataTableHead>
                  <tr>
                    <DataTableHeader>Athlete</DataTableHeader>
                    <DataTableHeader>Subscription Tier</DataTableHeader>
                    <DataTableHeader numeric>Amount Paid</DataTableHeader>
                    <DataTableHeader>Start Date</DataTableHeader>
                    <DataTableHeader>Billing Status</DataTableHeader>
                  </tr>
                </DataTableHead>
                <DataTableBody>
                  {memberships.map(m => {
                    const ath = athletes.find(a => a.id === m.athlete_id)
                    return (
                      <DataTableRow key={m.id}>
                        <DataTableCell>
                          <div className="font-bold text-text-primary">
                            {ath?.full_name || `Athlete #${m.athlete_id}`}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            #{ath?.jersey_number || '—'} · {ath?.playing_position || 'Squad'}
                          </div>
                        </DataTableCell>
                        <DataTableCell>
                          <Badge variant="brand">{m.plan.toUpperCase()}</Badge>
                        </DataTableCell>
                        <DataTableCell numeric>
                          <span className="font-mono font-bold text-success-400">${m.amount_paid}</span>
                        </DataTableCell>
                        <DataTableCell>
                          <span className="text-xs text-text-secondary">{m.start_date || 'Current'}</span>
                        </DataTableCell>
                        <DataTableCell>
                          <Badge variant={m.status === 'active' ? 'success' : m.status === 'pending' ? 'warning' : 'danger'}>
                            {m.status.toUpperCase()}
                          </Badge>
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

      {/* VIEW 4: REPORTS & CSV EXPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fade-in">
          <SectionHeader
            title="1-Click System CSV Exporters"
            subtitle="Download clean offline reports for analytics and league compliance"
            icon={<FileSpreadsheet className="w-5 h-5" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-text-primary">Users & Accounts</h4>
                <p className="text-xs text-text-secondary mt-1">Full registry with emails, RBAC roles, and creation dates.</p>
              </div>
              <button
                onClick={() => handleExportCSV('users')}
                className="btn-base h-9 px-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold w-full"
              >
                <Download className="w-3.5 h-3.5" /> Export Users CSV
              </button>
            </Card>

            <Card className="p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-text-primary">Attendance & RPE</h4>
                <p className="text-xs text-text-secondary mt-1">Session attendance records, late minutes, and RPE scores.</p>
              </div>
              <button
                onClick={() => handleExportCSV('attendance')}
                className="btn-base h-9 px-3 bg-accent-600 hover:bg-accent-500 text-white text-xs font-semibold w-full"
              >
                <Download className="w-3.5 h-3.5" /> Export Attendance CSV
              </button>
            </Card>

            <Card className="p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-info-500/10 border border-info-500/20 flex items-center justify-center text-info-400 mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-text-primary">Facilities & Grounds</h4>
                <p className="text-xs text-text-secondary mt-1">Stadium pitches, capacities, and availability logs.</p>
              </div>
              <button
                onClick={() => handleExportCSV('facilities')}
                className="btn-base h-9 px-3 bg-info-600 hover:bg-info-500 text-white text-xs font-semibold w-full"
              >
                <Download className="w-3.5 h-3.5" /> Export Facilities CSV
              </button>
            </Card>

            <Card className="p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-success-500/10 border border-success-500/20 flex items-center justify-center text-success-400 mb-3">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-text-primary">Memberships & Plans</h4>
                <p className="text-xs text-text-secondary mt-1">Subscription plans, fees paid, and member active statuses.</p>
              </div>
              <button
                onClick={() => handleExportCSV('memberships')}
                className="btn-base h-9 px-3 bg-success-600 hover:bg-success-500 text-white text-xs font-semibold w-full"
              >
                <Download className="w-3.5 h-3.5" /> Export Memberships CSV
              </button>
            </Card>
          </div>
        </div>
      )}
    </SidebarLayout>
  )
}
