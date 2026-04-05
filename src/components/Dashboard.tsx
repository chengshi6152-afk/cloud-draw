import { Activity, FileText, Download, Share2, Bell } from 'lucide-react'
import ReportHeader from './ReportHeader'
import TrendChart from './TrendChart'
import LabResults from './LabResults'
import ChatInterface from './ChatInterface'

export default function Dashboard() {
  return (
    <div style={styles.root}>
      {/* Top Nav */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>
            <Activity size={18} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <span style={styles.navTitle}>云采</span>
          <span style={styles.navDivider}>/</span>
          <span style={styles.navSub}>云采健康平台</span>
        </div>
        <div style={styles.navActions}>
          <button style={styles.navBtn}>
            <Bell size={15} />
          </button>
          <button style={styles.navBtn}>
            <Share2 size={15} />
          </button>
          <button style={styles.navBtnPrimary}>
            <Download size={14} />
            导出 PDF
          </button>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <FileText size={13} style={{ color: 'var(--text-muted)' }} />
        <span style={styles.breadcrumbText}>健康报告</span>
        <span style={styles.breadcrumbSep}>/</span>
        <span style={styles.breadcrumbText}>张伟</span>
        <span style={styles.breadcrumbSep}>/</span>
        <span style={{ ...styles.breadcrumbText, color: 'var(--text-primary)' }}>2026年3月28日</span>
      </div>

      {/* Main layout */}
      <div style={styles.mainLayout}>
        {/* Left column */}
        <div style={styles.leftCol}>
          {/* Section 1: Report Header */}
          <section>
            <ReportHeader />
          </section>

          {/* Section 2: Trend Chart */}
          <section>
            <TrendChart />
          </section>

          {/* Section 3: Lab Results */}
          <section>
            <LabResults />
          </section>
        </div>

        {/* Right column: Chat */}
        <div style={styles.rightCol}>
          <div style={styles.chatSticky}>
            <ChatInterface />
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <span>© 2026 云采数字健康平台 · CloudDraw Health</span>
        <span>报告编号 RPT-2026-0328-001 · 保密文件</span>
      </footer>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '56px',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    boxShadow: '0 1px 0 var(--border)',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLogo: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
    border: '1px solid rgba(37,99,235,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: { fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' },
  navDivider: { color: 'var(--text-muted)', fontSize: '16px', margin: '0 2px' },
  navSub: { fontSize: '14px', color: 'var(--text-muted)' },
  navActions: { display: 'flex', alignItems: 'center', gap: '8px' },
  navBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  navBtnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    border: 'none',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 24px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  breadcrumbText: { fontSize: '12px', color: 'var(--text-muted)' },
  breadcrumbSep: { fontSize: '12px', color: 'var(--text-muted)' },
  mainLayout: {
    display: 'flex',
    gap: '20px',
    padding: '20px 24px',
    flex: 1,
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightCol: {
    width: '380px',
    flexShrink: 0,
  },
  chatSticky: {
    position: 'sticky',
    top: '76px',
    height: 'calc(100vh - 96px)',
    minHeight: '600px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 24px',
    borderTop: '1px solid var(--border)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    flexWrap: 'wrap',
    gap: '6px',
  },
}
