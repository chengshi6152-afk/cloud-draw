import { useRef, useState } from 'react'
import { Activity, FileText, Download, Share2, Bell, Loader } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ReportHeader from './ReportHeader'
import TrendChart from './TrendChart'
import LabResults from './LabResults'
import ChatInterface from './ChatInterface'

export default function Dashboard() {
  const reportRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  const handleExportPDF = async () => {
    if (!reportRef.current || exporting) return
    setExporting(true)

    try {
      const element = reportRef.current

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f0f4f8',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      // A4 dimensions in mm
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()

      const imgW = canvas.width
      const imgH = canvas.height
      const ratio = imgW / imgH

      // Scale image to fit page width, then paginate if tall
      const pdfImgW = pageW
      const pdfImgH = pageW / ratio

      let yPosition = 0
      let remainingH = pdfImgH

      while (remainingH > 0) {
        if (yPosition > 0) pdf.addPage()

        // Clip to one page height at a time
        const sliceH = Math.min(remainingH, pageH)
        const srcY = (yPosition / pdfImgH) * imgH
        const srcH = (sliceH / pdfImgH) * imgH

        // Create a slice canvas
        const sliceCanvas = document.createElement('canvas')
        sliceCanvas.width = imgW
        sliceCanvas.height = srcH
        const ctx = sliceCanvas.getContext('2d')!
        ctx.drawImage(canvas, 0, srcY, imgW, srcH, 0, 0, imgW, srcH)

        const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95)
        const slicePdfH = (srcH / imgW) * pageW

        pdf.addImage(sliceData, 'JPEG', 0, 0, pdfImgW, slicePdfH)

        yPosition += pageH
        remainingH -= pageH
      }

      pdf.save(`云采健康报告_张伟_2026-03-28.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

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
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            style={{
              ...styles.navBtnPrimary,
              opacity: exporting ? 0.75 : 1,
              cursor: exporting ? 'not-allowed' : 'pointer',
            }}
          >
            {exporting
              ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> 导出中…</>
              : <><Download size={14} /> 导出 PDF</>
            }
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
        {/* Left column — this is what gets exported */}
        <div ref={reportRef} style={styles.leftCol}>
          <section>
            <ReportHeader />
          </section>
          <section>
            <TrendChart />
          </section>
          <section>
            <LabResults />
          </section>
        </div>

        {/* Right column: Chat (excluded from PDF) */}
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

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
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
