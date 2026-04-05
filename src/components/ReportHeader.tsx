import { AlertTriangle, CheckCircle, User, Calendar, FileText, Stethoscope } from 'lucide-react'
import { patientInfo } from '../data/mockData'

const statusConfig = {
  clear: {
    label: '指标正常',
    icon: CheckCircle,
    color: 'var(--accent-green)',
    bg: 'var(--accent-green-bg)',
    border: 'rgba(63, 185, 80, 0.3)',
    dot: '#3fb950',
  },
  attention: {
    label: '需要关注',
    icon: AlertTriangle,
    color: 'var(--accent-yellow)',
    bg: 'var(--accent-yellow-bg)',
    border: 'rgba(210, 153, 34, 0.3)',
    dot: '#d29922',
  },
  critical: {
    label: '需立即处理',
    icon: AlertTriangle,
    color: 'var(--accent-red)',
    bg: 'var(--accent-red-bg)',
    border: 'rgba(248, 81, 73, 0.3)',
    dot: '#f85149',
  },
}

export default function ReportHeader() {
  const cfg = statusConfig[patientInfo.status]
  const Icon = cfg.icon
  const score = patientInfo.healthScore
  const scoreColor = score >= 85 ? 'var(--accent-green)' : score >= 60 ? 'var(--accent-yellow)' : 'var(--accent-red)'
  const circumference = 2 * Math.PI * 32
  const dashOffset = circumference - (score / 100) * circumference

  return (
    <div style={styles.container}>
      {/* Glow accent */}
      <div style={styles.glowAccent} />

      {/* Left: patient info */}
      <div style={styles.left}>
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>
            {patientInfo.name.charAt(0)}
          </div>
          <div style={{ ...styles.statusDot, background: cfg.dot }} />
        </div>
        <div>
          <div style={styles.patientName}>{patientInfo.name}</div>
          <div style={styles.metaRow}>
            <span style={styles.metaChip}>
              <User size={11} /> 年龄 {patientInfo.age} 岁
            </span>
            <span style={styles.metaChip}>
              {patientInfo.gender}
            </span>
            <span style={styles.metaChip}>编号：{patientInfo.id}</span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaItem}>
              <Calendar size={12} style={{ color: 'var(--accent-blue)' }} />
              {patientInfo.testDate}
            </span>
            <span style={styles.metaItem}>
              <FileText size={12} style={{ color: 'var(--accent-purple)' }} />
              {patientInfo.reportId}
            </span>
            <span style={styles.metaItem}>
              <Stethoscope size={12} style={{ color: 'var(--accent-green)' }} />
              {patientInfo.physician}
            </span>
          </div>
        </div>
      </div>

      {/* Right: score + badge */}
      <div style={styles.right}>
        {/* Health score ring */}
        <div style={styles.scoreCard}>
          <svg width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="44" cy="44" r="32" fill="none" stroke="var(--border)" strokeWidth="7" />
            <circle
              cx="44" cy="44" r="32" fill="none"
              stroke={scoreColor} strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={styles.scoreInner}>
            <span style={{ ...styles.scoreNum, color: scoreColor }}>{score}</span>
            <span style={styles.scoreUnit}>/ 100</span>
          </div>
          <div style={styles.scoreLabel}>健康评分</div>
        </div>

        {/* Status badge */}
        <div style={{
          ...styles.badge,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          color: cfg.color,
        }}>
          <Icon size={14} />
          {cfg.label}
        </div>

        <div style={styles.reportNote}>最新报告 · 检测到 3 项异常指标</div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    overflow: 'hidden',
    flexWrap: 'wrap',
    boxShadow: 'var(--shadow-sm)',
  },
  glowAccent: {
    position: 'absolute',
    top: '-40px',
    left: '-20px',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flex: 1,
    minWidth: '280px',
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
    border: '2px solid var(--accent-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '600',
    color: 'var(--accent-blue)',
  },
  statusDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid var(--bg-card)',
  },
  patientName: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '6px',
    letterSpacing: '-0.3px',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '4px',
    alignItems: 'center',
  },
  metaChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: '100px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  scoreCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  scoreInner: {
    position: 'absolute',
    top: '44px',
    left: '44px',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0px',
    lineHeight: 1,
  },
  scoreNum: {
    fontSize: '22px',
    fontWeight: '800',
    lineHeight: '1.1',
  },
  scoreUnit: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  scoreLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: '600',
  },
  reportNote: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
}
