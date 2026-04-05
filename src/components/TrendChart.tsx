import { useState } from 'react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { trendData } from '../data/mockData'

type MetricKey = 'HbA1c' | 'ALT' | 'Glucose' | 'Cholesterol'

const metricConfig: Record<MetricKey, {
  label: string
  unit: string
  normalMax: number
  normalMin: number
  color: string
  gradientId: string
  description: string
}> = {
  HbA1c: {
    label: 'HbA1c 糖化血红蛋白',
    unit: '%',
    normalMin: 4.0,
    normalMax: 5.6,
    color: '#58a6ff',
    gradientId: 'hba1cGrad',
    description: '糖化血红蛋白 — 反映近3个月的平均血糖水平',
  },
  ALT: {
    label: 'ALT 谷丙转氨酶',
    unit: 'U/L',
    normalMin: 7,
    normalMax: 40,
    color: '#f0883e',
    gradientId: 'altGrad',
    description: '谷丙转氨酶 — 肝脏功能重要指标',
  },
  Glucose: {
    label: '空腹血糖',
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 100,
    color: '#bc8cff',
    gradientId: 'glucoseGrad',
    description: '空腹血糖 — 隔夜空腹后的血糖水平',
  },
  Cholesterol: {
    label: '总胆固醇',
    unit: 'mg/dL',
    normalMin: 0,
    normalMax: 200,
    color: '#3fb950',
    gradientId: 'cholGrad',
    description: '总胆固醇 — 包含高密度、低密度脂蛋白及甘油三酯',
  },
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
  metric: MetricKey
}

function CustomTooltip({ active, payload, label, metric }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const cfg = metricConfig[metric]
  const value = payload[0]?.value
  const isHigh = value > cfg.normalMax
  const isLow = value < cfg.normalMin

  return (
    <div style={tooltipStyles.container}>
      <div style={tooltipStyles.date}>{label}</div>
      <div style={tooltipStyles.valueRow}>
        <span style={{ ...tooltipStyles.value, color: cfg.color }}>
          {value} {cfg.unit}
        </span>
        {isHigh && <span style={tooltipStyles.tagHigh}>偏高</span>}
        {isLow && <span style={tooltipStyles.tagLow}>偏低</span>}
        {!isHigh && !isLow && <span style={tooltipStyles.tagNormal}>正常</span>}
      </div>
      <div style={tooltipStyles.range}>
        参考值：{cfg.normalMin === 0 ? `<${cfg.normalMax}` : `${cfg.normalMin}–${cfg.normalMax}`} {cfg.unit}
      </div>
    </div>
  )
}

export default function TrendChart() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('HbA1c')
  const cfg = metricConfig[activeMetric]

  const values = trendData.map(d => d[activeMetric])
  const first = values[0]
  const last = values[values.length - 1]
  const pctChange = (((last - first) / first) * 100).toFixed(1)
  const isRising = last > first

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>历史趋势</div>
          <div style={styles.subtitle}>{cfg.description}</div>
        </div>
        <div style={styles.trendBadge}>
          {isRising ? (
            <TrendingUp size={14} style={{ color: 'var(--accent-red)' }} />
          ) : (
            <TrendingDown size={14} style={{ color: 'var(--accent-green)' }} />
          )}
          <span style={{ color: isRising ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 600, fontSize: 13 }}>
            {isRising ? '+' : ''}{pctChange}%
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>近5次检测</span>
        </div>
      </div>

      {/* Metric selector */}
      <div style={styles.tabRow}>
        {(Object.keys(metricConfig) as MetricKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActiveMetric(key)}
            style={{
              ...styles.tab,
              ...(activeMetric === key ? {
                background: `${metricConfig[key].color}18`,
                border: `1px solid ${metricConfig[key].color}55`,
                color: metricConfig[key].color,
              } : {}),
            }}
          >
            {metricConfig[key].label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={cfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={cfg.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.3)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip metric={activeMetric} />} cursor={{ stroke: cfg.color, strokeWidth: 1, strokeDasharray: '4 4' }} />

            {/* Normal range band */}
            {cfg.normalMin > 0 && (
              <ReferenceLine
                y={cfg.normalMin}
                stroke="#16a34a"
                strokeDasharray="6 4"
                strokeOpacity={0.5}
                label={{ value: `下限 ${cfg.normalMin}`, fill: '#16a34a', fontSize: 10, position: 'insideLeft' }}
              />
            )}
            <ReferenceLine
              y={cfg.normalMax}
              stroke="#16a34a"
              strokeDasharray="6 4"
              strokeOpacity={0.6}
              label={{ value: `正常上限 ≤${cfg.normalMax} ${cfg.unit}`, fill: '#16a34a', fontSize: 10, position: 'insideRight' }}
            />

            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={cfg.color}
              strokeWidth={2.5}
              fill={`url(#${cfg.gradientId})`}
              dot={{ r: 5, fill: cfg.color, stroke: 'var(--bg-card)', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: cfg.color, stroke: 'var(--bg-card)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend note */}
      <div style={styles.legendNote}>
        <div style={{ ...styles.legendDot, background: '#16a34a' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>绿色虚线 = 正常参考上限</span>
        <div style={{ ...styles.legendDot, background: cfg.color, marginLeft: 12 }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>您的 {cfg.label} 历次检测值</span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '18px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: '8px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
  },
  tabRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  },
  tab: {
    padding: '5px 14px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  chartWrap: { marginBottom: '12px' },
  legendNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
}

const tooltipStyles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '10px 14px',
    boxShadow: 'var(--shadow-lg)',
  },
  date: { fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' },
  valueRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  value: { fontSize: '18px', fontWeight: '700' },
  tagHigh: {
    fontSize: '10px', fontWeight: '600', padding: '1px 6px',
    borderRadius: '4px', background: 'var(--accent-red-bg)', color: 'var(--accent-red)',
  },
  tagLow: {
    fontSize: '10px', fontWeight: '600', padding: '1px 6px',
    borderRadius: '4px', background: 'var(--accent-yellow-bg)', color: 'var(--accent-yellow)',
  },
  tagNormal: {
    fontSize: '10px', fontWeight: '600', padding: '1px 6px',
    borderRadius: '4px', background: 'var(--accent-green-bg)', color: 'var(--accent-green)',
  },
  range: { fontSize: '11px', color: 'var(--text-muted)' },
}
