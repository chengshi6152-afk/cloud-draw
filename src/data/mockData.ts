export const patientInfo = {
  name: '张伟',
  id: 'P-20240312-0047',
  age: 42,
  gender: '男',
  testDate: '2026年3月28日',
  reportId: 'RPT-2026-0328-001',
  physician: '李芳 医生',
  status: 'attention' as 'clear' | 'attention' | 'critical',
  healthScore: 74,
}

export const trendData = [
  { date: '2025年10月', HbA1c: 5.6, ALT: 22, Glucose: 95, Cholesterol: 178 },
  { date: '2025年11月', HbA1c: 5.8, ALT: 31, Glucose: 102, Cholesterol: 185 },
  { date: '2025年12月', HbA1c: 6.1, ALT: 38, Glucose: 108, Cholesterol: 192 },
  { date: '2026年2月', HbA1c: 6.3, ALT: 52, Glucose: 115, Cholesterol: 201 },
  { date: '2026年3月', HbA1c: 6.5, ALT: 67, Glucose: 121, Cholesterol: 210 },
]

export type LabStatus = 'normal' | 'high' | 'low' | 'critical'

export interface LabMetric {
  id: string
  name: string
  chineseName: string
  value: number
  unit: string
  normalMin: number
  normalMax: number
  status: LabStatus
  category: string
}

export const labResults: LabMetric[] = [
  {
    id: 'hba1c',
    name: 'HbA1c',
    chineseName: '糖化血红蛋白',
    value: 6.5,
    unit: '%',
    normalMin: 4.0,
    normalMax: 5.6,
    status: 'high',
    category: '代谢',
  },
  {
    id: 'glucose',
    name: '空腹血糖',
    chineseName: 'Fasting Glucose',
    value: 121,
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 100,
    status: 'high',
    category: '代谢',
  },
  {
    id: 'alt',
    name: 'ALT',
    chineseName: '谷丙转氨酶',
    value: 67,
    unit: 'U/L',
    normalMin: 7,
    normalMax: 40,
    status: 'high',
    category: '肝功能',
  },
  {
    id: 'ast',
    name: 'AST',
    chineseName: '谷草转氨酶',
    value: 38,
    unit: 'U/L',
    normalMin: 10,
    normalMax: 40,
    status: 'normal',
    category: '肝功能',
  },
  {
    id: 'cholesterol',
    name: '总胆固醇',
    chineseName: 'Total Cholesterol',
    value: 210,
    unit: 'mg/dL',
    normalMin: 0,
    normalMax: 200,
    status: 'high',
    category: '血脂',
  },
  {
    id: 'hdl',
    name: '高密度脂蛋白',
    chineseName: 'HDL Cholesterol',
    value: 52,
    unit: 'mg/dL',
    normalMin: 40,
    normalMax: 999,
    status: 'normal',
    category: '血脂',
  },
  {
    id: 'ldl',
    name: '低密度脂蛋白',
    chineseName: 'LDL Cholesterol',
    value: 128,
    unit: 'mg/dL',
    normalMin: 0,
    normalMax: 130,
    status: 'normal',
    category: '血脂',
  },
  {
    id: 'creatinine',
    name: '肌酐',
    chineseName: 'Creatinine',
    value: 0.9,
    unit: 'mg/dL',
    normalMin: 0.7,
    normalMax: 1.3,
    status: 'normal',
    category: '肾功能',
  },
  {
    id: 'hemoglobin',
    name: '血红蛋白',
    chineseName: 'Hemoglobin',
    value: 14.2,
    unit: 'g/dL',
    normalMin: 13.5,
    normalMax: 17.5,
    status: 'normal',
    category: '血常规',
  },
  {
    id: 'wbc',
    name: '白细胞计数',
    chineseName: 'WBC Count',
    value: 6.8,
    unit: '×10³/μL',
    normalMin: 4.5,
    normalMax: 11.0,
    status: 'normal',
    category: '血常规',
  },
]

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      '张伟您好！我已经查阅了您2026年3月28日的最新检验报告。发现有几项指标需要特别关注——尤其是您的糖化血红蛋白（HbA1c）、空腹血糖和谷丙转氨酶（ALT）。我来帮您用通俗易懂的语言解读这些结果，请随时向我提问。',
    time: '上午 10:02',
  },
  {
    id: '2',
    role: 'user',
    content: '我今天的血糖为什么这么高？我明明空腹了12个小时才去抽血的。',
    time: '上午 10:05',
  },
  {
    id: '3',
    role: 'assistant',
    content:
      '这是个很好的问题，我理解这让您感到困惑和担心。您的空腹血糖为121 mg/dL，超过了正常范围（70–100 mg/dL），结合HbA1c 6.5%，目前处于糖尿病前期至糖尿病诊断临界值的范围。\n\n即使空腹12小时，血糖偏高通常反映的是身体长期调节胰岛素的能力，而不仅仅是昨晚吃了什么。主要原因可能包括：\n\n• **胰岛素抵抗** — 您的细胞对胰岛素的响应可能不够灵敏\n• **应激激素** — 皮质醇即使在空腹时也会升高血糖\n• **饮食习惯积累** — 您过去5个月的趋势显示血糖持续上升\n\n这个情况一定要及时与李芳医生沟通。您想了解通常建议哪些生活方式的改变吗？',
    time: '上午 10:05',
  },
  {
    id: '4',
    role: 'user',
    content: '我的ALT是67，这说明我的肝脏有问题吗？',
    time: '上午 10:08',
  },
  {
    id: '5',
    role: 'assistant',
    content:
      '您的ALT（肝脏酶）为67 U/L，超过了正常上限40 U/L，属于**轻度升高**。\n\nALT是当肝细胞受到刺激或损伤时释放入血液的酶。像您这样的轻度升高可能由以下原因引起：\n\n• **非酒精性脂肪肝（NAFLD）** — 通常与高血糖和高胆固醇有关，与您的报告相符\n• **饮食习惯** — 高脂肪或高糖饮食\n• **药物或保健品** 的副作用\n• **剧烈运动** — 检查前的高强度运动\n\n好消息是：您的AST（38 U/L）仍在正常范围内，这是个积极信号。肝脏具有很强的修复能力——及早通过饮食和生活方式干预，通常可以使ALT恢复正常。\n\n⚠️ *以上为信息参考，不构成诊断。请务必咨询李芳医生进行全面评估。*',
    time: '上午 10:08',
  },
]
