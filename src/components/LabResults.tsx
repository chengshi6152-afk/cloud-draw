import { ArrowUp, ArrowDown, CheckCircle2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { labResults, type LabMetric, type LabStatus } from '../data/mockData'

function StatusBadge({ status, value, normalMin, normalMax }: {
  status: LabStatus
  value: number
  normalMin: number
  normalMax: number
}) {
  const deviation = status === 'high'
    ? (((value - normalMax) / normalMax) * 100).toFixed(0)
    : status === 'low'
    ? (((normalMin - value) / normalMin) * 100).toFixed(0)
    : null

  if (status === 'normal') {
    return (
      <div style={badgeStyles.normal}>
        <CheckCircle2 size={13} />
        <span>正常</span>
      </div>
    )
  }
  if (status === 'high') {
    return (
      <div style={badgeStyles.high}>
        <ArrowUp size={13} />
        <span>偏高 +{deviation}%</span>
      </div>
    )
  }
  if (status === 'low') {
    return (
      <div style={badgeStyles.low}>
        <ArrowDown size={13} />
        <span>偏低 -{deviation}%</span>
      </div>
    )
  }
  return (
    <div style={badgeStyles.critical}>
      <ArrowUp size={13} />
      <span>危急值</span>
    </div>
  )
}

function ValueBar({ value, normalMin, normalMax }: { value: number; normalMin: number; normalMax: number }) {
  const effectiveMin = normalMin === 0 ? 0 : normalMin
  const rangeMin = Math.min(effectiveMin * 0.5, value * 0.7, 0)
  const rangeMax = Math.max(normalMax * 1.5, value * 1.15)
  const range = rangeMax - rangeMin || 1
  const normalMinPct = normalMin === 0 ? 0 : Math.max(0, ((normalMin - rangeMin) / range) * 100)
  const normalMaxPct = Math.min(100, ((normalMax - rangeMin) / range) * 100)
  const valuePct = Math.min(97, Math.max(3, ((value - rangeMin) / range) * 100))
  const isAbnormal = value < normalMin || value > normalMax

  return (
    <div style={barStyles.container}>
      <div style={barStyles.track}>
        {/* Normal zone highlight */}
        <div style={{
          ...barStyles.normalZone,
          left: `${normalMinPct}%`,
          width: `${normalMaxPct - normalMinPct}%`,
        }} />
        {/* Value indicator dot */}
        <div style={{
          ...barStyles.dot,
          left: `${valuePct}%`,
          background: isAbnormal ? 'var(--accent-red)' : 'var(--accent-green)',
          boxShadow: isAbnormal
            ? '0 0 8px rgba(220,38,38,0.45)'
            : '0 0 8px rgba(22,163,74,0.45)',
        }} />
      </div>
    </div>
  )
}

const categories = ['全部', '代谢', '肝功能', '血脂', '肾功能', '血常规']

export default function LabResults() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [showAll, setShowAll] = useState(false)

  const filtered = labResults.filter(m =>
    activeCategory === '全部' || m.category === activeCategory
  )
  const displayed = showAll ? filtered : filtered.slice(0, 6)
  const abnormalCount = labResults.filter(m => m.status !== 'normal').length

  return (
    <div>
      {/* AI Summary Card */}
      <div style={styles.aiCard}>
        <div style={styles.aiCardHeader}>
          <div style={styles.aiIconWrap}>
            <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
          </div>
          <span style={styles.aiCardTitle}>AI 智能解读</span>
          <span style={styles.aiBeta}>测试版</span>
        </div>
        <p style={styles.aiText}>
          <strong style={{ color: 'var(--text-primary)' }}>张伟</strong>，您本次检验结果显示{' '}
          <strong style={{ color: 'var(--accent-yellow)' }}>3 项指标需要重点关注</strong>。您的糖化血红蛋白（6.5%）和空腹血糖（121 mg/dL）提示血糖调节功能可能已进入糖尿病前期至临界范围，建议尽快与李芳医生讨论。肝酶 ALT（67 U/L）轻度升高，与血糖问题密切相关。好消息是：您的肾功能、血常规及高密度脂蛋白胆固醇均在正常范围内。现在通过坚持生活方式调整，以上指标有望显著改善。
        </p>
        <div style={styles.aiFooter}>
          <span style={styles.aiDisclaimer}>
            ⚠ 以上为 AI 自动生成的健康摘要，仅供参考，不构成医疗诊断建议。
          </span>
        </div>
      </div>

      {/* Results Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <div style={styles.tableTitle}>检验指标详情</div>
            <div style={styles.tableSubtitle}>
              {labResults.length} 项指标中，{abnormalCount} 项超出正常范围
            </div>
          </div>
          <div style={styles.categoryTabs}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...styles.catTab,
                  ...(activeCategory === cat ? styles.catTabActive : {}),
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div style={styles.colHeaders}>
          <span style={{ flex: '2.5' }}>检验项目</span>
          <span style={{ flex: '1', textAlign: 'right' }}>当前值</span>
          <span style={{ flex: '1.2', textAlign: 'center' }}>参考范围</span>
          <span style={{ flex: '2.5', textAlign: 'center' }}>数值分布</span>
          <span style={{ flex: '1.1', textAlign: 'right' }}>状态</span>
        </div>

        <div style={styles.rows}>
          {displayed.map((metric, i) => (
            <MetricRow key={metric.id} metric={metric} isLast={i === displayed.length - 1} />
          ))}
        </div>

        {filtered.length > 6 && (
          <button onClick={() => setShowAll(!showAll)} style={styles.showMoreBtn}>
            {showAll ? <><ChevronUp size={14} /> 收起</> : <><ChevronDown size={14} /> 查看更多 {filtered.length - 6} 项</>}
          </button>
        )}
      </div>
    </div>
  )
}

function MetricRow({ metric, isLast }: { metric: LabMetric; isLast: boolean }) {
  const [hovered, setHovered] = useState(false)
  const normalRange = metric.normalMin === 0
    ? `< ${metric.normalMax}`
    : `${metric.normalMin} – ${metric.normalMax}`

  const rowBg = metric.status !== 'normal'
    ? 'rgba(248,81,73,0.04)'
    : 'transparent'
  const rowBgHover = metric.status !== 'normal'
    ? 'rgba(248,81,73,0.07)'
    : 'var(--bg-card-hover)'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.row,
        background: hovered ? rowBgHover : rowBg,
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
      }}
    >
      {/* Col 1: Metric name */}
      <div style={{ flex: '2.5', minWidth: 0 }}>
        <div style={styles.metricName}>{metric.chineseName}</div>
        <div style={styles.metricChinese}>{metric.name} · {metric.category}</div>
      </div>

      {/* Col 2: Current value */}
      <div style={{ flex: '1', textAlign: 'right', flexShrink: 0 }}>
        <span style={{
          ...styles.valueText,
          color: metric.status !== 'normal' ? 'var(--accent-red)' : 'var(--text-primary)',
        }}>
          {metric.value}
        </span>
        <span style={styles.unitText}> {metric.unit}</span>
      </div>

      {/* Col 3: Reference range (text only) */}
      <div style={{ flex: '1.2', textAlign: 'center', flexShrink: 0 }}>
        <span style={styles.rangeText}>{normalRange}</span>
        <span style={styles.rangeUnit}> {metric.unit}</span>
      </div>

      {/* Col 4: Visual bar (dedicated, no text) */}
      <div style={{ flex: '2.5', padding: '0 12px', flexShrink: 0 }}>
        <ValueBar value={metric.value} normalMin={metric.normalMin} normalMax={metric.normalMax} />
      </div>

      {/* Col 5: Status badge */}
      <div style={{ flex: '1.1', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        <StatusBadge
          status={metric.status}
          value={metric.value}
          normalMin={metric.normalMin}
          normalMax={metric.normalMax}
        />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  aiCard: {
    background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%)',
    border: '1px solid rgba(124,58,237,0.15)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  aiCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  aiIconWrap: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'rgba(188,140,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--accent-purple)',
  },
  aiBeta: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '1px 6px',
    borderRadius: '4px',
    background: 'rgba(188,140,255,0.15)',
    color: 'var(--accent-purple)',
  },
  aiText: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'var(--text-secondary)',
  },
  aiFooter: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(188,140,255,0.15)',
  },
  aiDisclaimer: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  tableCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  tableHeader: {
    padding: '20px 20px 16px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  tableSubtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  categoryTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  catTab: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  catTabActive: {
    background: 'var(--accent-blue-bg)',
    border: '1px solid rgba(88,166,255,0.3)',
    color: 'var(--accent-blue)',
  },
  colHeaders: {
    display: 'flex',
    padding: '8px 20px',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
  },
  rows: { padding: '0' },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    gap: '12px',
    transition: 'background 0.15s',
    cursor: 'default',
  },
  metricName: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  metricChinese: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  valueText: {
    fontSize: '15px',
    fontWeight: '600',
  },
  unitText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  rangeText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontVariantNumeric: 'tabular-nums',
  },
  rangeUnit: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  showMoreBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: 'none',
    borderTop: '1px solid var(--border)',
    color: 'var(--accent-blue)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'background 0.15s',
  },
}

const badgeStyles: Record<string, React.CSSProperties> = {
  normal: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
    background: 'var(--accent-green-bg)', color: 'var(--accent-green)',
    border: '1px solid rgba(63,185,80,0.2)',
    whiteSpace: 'nowrap',
  },
  high: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
    background: 'var(--accent-red-bg)', color: 'var(--accent-red)',
    border: '1px solid rgba(248,81,73,0.2)',
    whiteSpace: 'nowrap',
  },
  low: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
    background: 'var(--accent-yellow-bg)', color: 'var(--accent-yellow)',
    border: '1px solid rgba(210,153,34,0.2)',
    whiteSpace: 'nowrap',
  },
  critical: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
    background: 'rgba(248,81,73,0.2)', color: '#ff6b6b',
    border: '1px solid rgba(248,81,73,0.4)',
    whiteSpace: 'nowrap',
  },
}

const barStyles: Record<string, React.CSSProperties> = {
  container: { width: '100%' },
  track: {
    position: 'relative',
    height: '6px',
    borderRadius: '3px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
  },
  normalZone: {
    position: 'absolute',
    top: 0,
    height: '100%',
    background: 'rgba(22,163,74,0.18)',
    borderRadius: '2px',
    borderLeft: '1.5px solid rgba(22,163,74,0.4)',
    borderRight: '1.5px solid rgba(22,163,74,0.4)',
  },
  dot: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid var(--bg-card)',
  },
}
