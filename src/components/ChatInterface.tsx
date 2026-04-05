import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Clipboard, Check } from 'lucide-react'
import { initialMessages, type ChatMessage } from '../data/mockData'

const suggestedQuestions = [
  '我的HbA1c持续上升，需要担心吗？',
  'ALT偏高应该避免哪些食物？',
  '如何通过饮食自然降低胆固醇？',
  '我什么时候应该安排复查？',
]

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple markdown-like parser for **bold** and bullet points
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold text
      const parts = line.split(/(\*\*[^*]+\*\*)/g)
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
        }
        return part
      })
      // Bullet points
      if (line.startsWith('• ')) {
        return (
          <div key={i} style={msgStyles.bullet}>
            <span style={msgStyles.bulletDot}>•</span>
            <span>{rendered.slice(1)}</span>
          </div>
        )
      }
      if (line.trim() === '') return <div key={i} style={{ height: '6px' }} />
      return <div key={i}>{rendered}</div>
    })
  }

  return (
    <div style={{ ...msgStyles.wrapper, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div style={msgStyles.avatar}>
          <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
        </div>
      )}
      <div style={{ maxWidth: '85%' }}>
        <div style={{
          ...msgStyles.bubble,
          ...(isUser ? msgStyles.userBubble : msgStyles.aiBubble),
        }}>
          {renderContent(msg.content)}
        </div>
        <div style={{ ...msgStyles.time, textAlign: isUser ? 'right' : 'left' }}>
          {isUser ? '我' : '云采 AI'} · {msg.time}
          {!isUser && (
            <button onClick={handleCopy} style={msgStyles.copyBtn} title="Copy">
              {copied ? <Check size={11} /> : <Clipboard size={11} />}
            </button>
          )}
        </div>
      </div>
      {isUser && (
        <div style={msgStyles.userAvatar}>Z</div>
      )}
    </div>
  )
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages, isTyping])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAiResponse(trimmed),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1400)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = (q: string) => {
    setInput(q)
    inputRef.current?.focus()
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.aiLogoWrap}>
            <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
          </div>
          <div>
            <div style={styles.headerTitle}>AI 健康助手</div>
            <div style={styles.headerSub}>由云采 AI 驱动</div>
          </div>
        </div>
        <div style={styles.onlineBadge}>
          <div style={styles.onlineDot} />
          在线
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        <div style={styles.dateStamp}>今日 · 2026年3月28日</div>

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isTyping && (
          <div style={{ ...msgStyles.wrapper, justifyContent: 'flex-start' }}>
            <div style={msgStyles.avatar}>
              <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div style={{ ...msgStyles.bubble, ...msgStyles.aiBubble, padding: '12px 16px' }}>
              <div style={styles.typingDots}>
                <div style={{ ...styles.dot, animationDelay: '0ms' }} />
                <div style={{ ...styles.dot, animationDelay: '180ms' }} />
                <div style={{ ...styles.dot, animationDelay: '360ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      <div style={styles.suggestions}>
        <div style={styles.suggestLabel}>快速提问</div>
        <div style={styles.suggestRow}>
          {suggestedQuestions.map((q, i) => (
            <button key={i} onClick={() => handleSuggestion(q)} style={styles.suggestBtn}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div style={styles.inputWrap}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="向AI提问您的检验报告…（按 Enter 发送）"
          rows={1}
          style={styles.input}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            ...styles.sendBtn,
            opacity: input.trim() ? 1 : 0.4,
            cursor: input.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          <Send size={16} />
        </button>
      </div>
      <div style={styles.disclaimer}>
        云采 AI 提供健康信息参考，不构成医疗诊断。重要决策请咨询专业医生。
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}

function getAiResponse(question: string): string {
  const q = question
  if (q.includes('hba1c') || q.includes('HbA1c') || q.includes('糖化') || q.includes('担心') || q.includes('上升')) {
    return "您的 HbA1c 从 2025年10月 的 5.6% 上升至今天的 6.5%，五个月内持续升高。中国糖尿病指南将 HbA1c ≥6.5% 列为糖尿病诊断标准之一。\n\n这不代表需要恐慌——早期干预效果非常显著。建议：\n\n• **调整饮食结构** — 减少精制碳水化合物和糖分的摄入\n• **规律运动** — 每天30分钟步行即可改善胰岛素敏感性\n• **3个月后复查** — 监测生活方式干预后的效果\n\n请优先在下次就诊时与李芳医生详细讨论这一趋势。"
  }
  if (q.includes('alt') || q.includes('ALT') || q.includes('谷丙') || q.includes('肝') || q.includes('食物') || q.includes('避免')) {
    return "针对 ALT 偏高，以下食物建议减少或避免：\n\n• **酒精** — 即使少量也会加重肝脏负担\n• **油炸及加工食品** — 饱和脂肪含量高\n• **精制糖和精白碳水** — 与脂肪肝直接相关\n\n对肝脏有益的食物包括：绿叶蔬菜、西兰花、橄榄油，以及适量咖啡（研究表明适量饮咖啡有助于降低肝酶水平）。\n\n⚠ *以上为通用建议。个性化饮食方案请咨询您的医生。*"
  }
  if (q.includes('胆固醇') || q.includes('cholesterol') || q.includes('降低') || q.includes('血脂')) {
    return "您的总胆固醇为 210 mg/dL，略高于推荐值（< 200 mg/dL）。循证依据最充分的自然降胆固醇方法：\n\n• **增加可溶性膳食纤维** — 燕麦、豆类、苹果等\n• **选择健康脂肪** — 牛油果、坚果、橄榄油代替饱和脂肪\n• **坚持运动** — 有助于提升高密度脂蛋白（您的 HDL 52 mg/dL 已处于健康水平！）\n• **减少反式脂肪** — 常见于加工食品和油炸食品\n\n您的低密度脂蛋白（LDL）128 mg/dL 接近正常上限，值得持续监测。"
  }
  if (q.includes('复查') || q.includes('随访') || q.includes('什么时候') || q.includes('安排')) {
    return "根据您目前的检查结果，建议在 **6至8周内** 安排复查，重点关注：\n\n• **复测 HbA1c 和空腹血糖** — 评估生活方式干预的效果\n• **监测 ALT 变化趋势** — 确认是否继续上升\n• **如未做，建议进行口服葡萄糖耐量试验（OGTT）**\n\n请告知李芳医生您过去5次检测的趋势变化。需要我帮您整理一份就诊摘要吗？"
  }
  return "感谢您的提问。根据您2026年3月28日的检验报告，我可以提供相关健康信息帮助您理解指标含义。如需个性化医疗建议、诊断或治疗方案，请直接咨询李芳医生。\n\n您是否希望我详细解读报告中某项具体指标？"
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '600px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  aiLogoWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #ede9fe, #dbeafe)',
    border: '1px solid rgba(124,58,237,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' },
  headerSub: { fontSize: '11px', color: 'var(--text-muted)' },
  onlineBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--accent-green)',
    padding: '4px 10px',
    borderRadius: '100px',
    background: 'var(--accent-green-bg)',
    border: '1px solid rgba(63,185,80,0.2)',
  },
  onlineDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: 'var(--accent-green)',
    boxShadow: '0 0 6px rgba(63,185,80,0.6)',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  dateStamp: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'var(--text-muted)',
    padding: '4px 12px',
    background: 'var(--bg-secondary)',
    borderRadius: '100px',
    alignSelf: 'center',
    border: '1px solid var(--border)',
    marginBottom: '4px',
  },
  typingDots: { display: 'flex', gap: '4px', alignItems: 'center' },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--accent-purple)',
    animation: 'bounce 1.2s ease infinite',
  },
  suggestions: {
    padding: '12px 16px',
    borderTop: '1px solid var(--border-subtle)',
    background: 'var(--bg-secondary)',
    flexShrink: 0,
  },
  suggestLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  suggestRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  suggestBtn: {
    fontSize: '11px',
    padding: '5px 10px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'left',
    maxWidth: '100%',
  },
  inputWrap: {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    borderTop: '1px solid var(--border)',
    alignItems: 'flex-end',
    background: 'var(--bg-card)',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    outline: 'none',
    minHeight: '40px',
    maxHeight: '120px',
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s',
    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
  },
  disclaimer: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '8px 16px',
    paddingTop: 0,
    flexShrink: 0,
  },
}

const msgStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ede9fe, #dbeafe)',
    border: '1px solid rgba(124,58,237,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: '#dbeafe',
    border: '1px solid rgba(37,99,235,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--accent-blue)',
  },
  bubble: {
    padding: '12px 16px',
    borderRadius: '14px',
    fontSize: '13px',
    lineHeight: '1.65',
  },
  aiBubble: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderBottomLeftRadius: '4px',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    border: 'none',
    color: '#ffffff',
    borderBottomRightRadius: '4px',
    boxShadow: '0 2px 8px rgba(37,99,235,0.2)',
  },
  time: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '1px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'color 0.15s',
  },
  bullet: {
    display: 'flex',
    gap: '6px',
    margin: '3px 0',
  },
  bulletDot: {
    color: 'var(--accent-purple)',
    flexShrink: 0,
  },
}
