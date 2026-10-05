import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import Card from './Card'
import SectionHeader from './SectionHeader'
import { Activity } from 'lucide-react'

export interface WorkloadDataPoint {
  date: string
  acuteLoad: number   // 7-day ATL
  chronicLoad: number // 28-day CTL
  acwr: number        // Ratio
}

const DEFAULT_CHART_DATA: WorkloadDataPoint[] = [
  { date: 'Day 1', acuteLoad: 320, chronicLoad: 380, acwr: 0.84 },
  { date: 'Day 2', acuteLoad: 410, chronicLoad: 385, acwr: 1.06 },
  { date: 'Day 3', acuteLoad: 520, chronicLoad: 390, acwr: 1.33 },
  { date: 'Day 4', acuteLoad: 480, chronicLoad: 395, acwr: 1.21 },
  { date: 'Day 5', acuteLoad: 610, chronicLoad: 400, acwr: 1.52 },
  { date: 'Day 6', acuteLoad: 540, chronicLoad: 410, acwr: 1.31 },
  { date: 'Day 7', acuteLoad: 460, chronicLoad: 415, acwr: 1.10 },
]

interface WorkloadChartProps {
  data?: WorkloadDataPoint[]
  title?: string
  subtitle?: string
}

export default function WorkloadChart({
  data = DEFAULT_CHART_DATA,
  title = 'Workload & ACWR Progression',
  subtitle = '7-Day Acute Load (ATL) vs 28-Day Chronic Baseline (CTL)',
}: WorkloadChartProps) {
  return (
    <Card className="p-6">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={<Activity className="w-4 h-4 text-brand-400" />}
      />

      {/* Legend & Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-2">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-400 shadow-sm" />
            <span className="text-text-secondary font-medium">7-Day Acute Load (ATL)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-info-400 shadow-sm" />
            <span className="text-text-secondary font-medium">28-Day Chronic Baseline (CTL)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-b border-dashed border-danger-400" />
            <span className="text-text-tertiary">Danger Zone (ACWR 1.5)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-400">
            Optimal Range: 0.8 – 1.3 ACWR
          </span>
        </div>
      </div>

      {/* Responsive Recharts Area */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="acuteGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="chronicGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const acute = payload[0]?.value as number
                  const chronic = payload[1]?.value as number
                  const acwr = chronic ? (acute / chronic).toFixed(2) : '1.00'
                  const isHigh = Number(acwr) > 1.3
                  return (
                    <div className="p-3 rounded-xl surface-elevated border border-white/10 shadow-xl text-xs space-y-1">
                      <p className="font-semibold text-text-primary mb-1">{label}</p>
                      <p className="text-brand-400 font-mono">Acute Load (7d): {acute} AU</p>
                      <p className="text-info-400 font-mono">Chronic Load (28d): {chronic} AU</p>
                      <p className={`font-mono font-bold ${isHigh ? 'text-danger-400' : 'text-success-400'}`}>
                        ACWR Ratio: {acwr} {isHigh ? '(High Risk)' : '(Optimal)'}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />

            <ReferenceLine y={600} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'High Load', fill: '#ef4444', fontSize: 10 }} />

            <Area
              type="monotone"
              dataKey="acuteLoad"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#acuteGrad)"
            />
            <Area
              type="monotone"
              dataKey="chronicLoad"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#chronicGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
