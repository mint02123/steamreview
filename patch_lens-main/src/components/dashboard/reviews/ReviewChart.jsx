import { memo, useMemo } from 'react'
import { formatDate } from '../../../data/constants'

export function buildChartData(list) {
  const grouped = list.reduce((acc, review) => {
    const key = review.createdAt
    if (!acc[key]) acc[key] = { date: key, count: 0, reviewScore: 0, usefulnessScore: 0, helpful: 0, relevanceScore: 0 }
    acc[key].count += 1
    acc[key].reviewScore += review.reviewScore
    acc[key].usefulnessScore += Number(review.usefulnessScore)
    acc[key].helpful += review.helpful
    acc[key].relevanceScore += review.relevanceScore
    return acc
  }, {})
  return Object.values(grouped)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(item => ({
      ...item,
      label:           formatDate(item.date),
      reviewScore:     Math.round(item.reviewScore / item.count),
      usefulnessScore: Number((item.usefulnessScore / item.count).toFixed(2)),
      helpful:         Math.round(item.helpful / item.count),
      relevanceScore:  Math.round(item.relevanceScore / item.count),
    }))
}

function getChartValues(data, type) {
  if (type === 'volume')    return { primaryLabel: '리뷰 수',    secondaryLabel: '평균 score', primary: data.map(d => d.count),          secondary: data.map(d => d.reviewScore) }
  if (type === 'score')     return { primaryLabel: '평균 score', secondaryLabel: '관련성',     primary: data.map(d => d.reviewScore),     secondary: data.map(d => d.relevanceScore) }
  if (type === 'usefulness')return { primaryLabel: '유용성',     secondaryLabel: '리뷰 수',    primary: data.map(d => d.usefulnessScore), secondary: data.map(d => d.count) }
  return                           { primaryLabel: '추천 수',    secondaryLabel: '관련성',     primary: data.map(d => d.helpful),         secondary: data.map(d => d.relevanceScore) }
}

const chartModeCards = [
  { value: 'volume',     label: '리뷰 흐름',  helper: '날짜별 리뷰량',      color: '#66c0f4' },
  { value: 'score',      label: 'Steam 점수', helper: '평균 점수와 관련성', color: '#22c55e' },
  { value: 'usefulness', label: '유용성',     helper: 'AI 우선순위 점수',   color: '#f7b955' },
  { value: 'helpful',    label: '추천/관련성', helper: '도움됨 반응 비교',   color: '#ef9f43' },
]

const WIDTH  = 980
const HEIGHT = 330
const PAD    = { top: 52, right: 42, bottom: 46, left: 48 }
const INNER_W = WIDTH  - PAD.left - PAD.right
const INNER_H = HEIGHT - PAD.top  - PAD.bottom

export const ChartModeDeck = memo(function ChartModeDeck({ chartType, onChange }) {
  return (
    <div className="chart-mode-deck">
      {chartModeCards.map((card, index) => (
        <button
          key={card.value}
          type="button"
          className={`chart-mode-card ${chartType === card.value ? 'is-active' : ''}`}
          onClick={() => onChange(card.value)}
          style={{ '--mode-color': card.color, '--mode-index': index }}
        >
          <span>{card.label}</span>
          <strong>{card.helper}</strong>
        </button>
      ))}
    </div>
  )
})

export const ReviewChart = memo(function ReviewChart({ data, type }) {
  const { primaryLabel, secondaryLabel, primary, secondary } = useMemo(
    () => getChartValues(data, type),
    [data, type]
  )

  const totalReviews = useMemo(() => data.reduce((sum, item) => sum + item.count, 0), [data])

  const avgScore = useMemo(
    () => Math.round(data.reduce((sum, item) => sum + item.reviewScore * item.count, 0) / Math.max(1, totalReviews)),
    [data, totalReviews]
  )

  const avgUsefulDisplay = useMemo(() => {
    const raw = data.reduce((sum, item) => sum + item.usefulnessScore * item.count, 0) / Math.max(1, totalReviews)
    return Math.round(raw / 4 * 100) + '%'
  }, [data, totalReviews])

  const max  = useMemo(() => Math.max(1, ...primary, ...secondary), [primary, secondary])
  const barW = INNER_W / Math.max(data.length, 1)

  const linePoints = useMemo(
    () => secondary.map((value, index) => {
      const x = PAD.left + barW * index + barW / 2
      const y = PAD.top + INNER_H - (value / max) * INNER_H
      return `${x},${y}`
    }),
    [secondary, barW, max]
  )

  const areaPoints = `${PAD.left},${PAD.top + INNER_H} ${linePoints.join(' ')} ${WIDTH - PAD.right},${PAD.top + INNER_H}`

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ background: 'linear-gradient(135deg, rgba(22,42,63,0.96), rgba(8,15,25,0.96))', borderColor: 'var(--border)' }}>
      <div className="grid grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(102,192,244,0.14)' }}>
        {[
          ['필터 리뷰',   totalReviews.toLocaleString(), '#66c0f4'],
          ['평균 score',  avgScore,                      '#66d87a'],
          ['평균 유용성', avgUsefulDisplay,               '#f7b955'],
        ].map(([label, value, color]) => (
          <div key={label} className="px-5 py-4" style={{ backgroundColor: 'rgba(7,13,22,0.72)' }}>
            <div className="text-[11px] font-bold mb-1" style={{ color: 'rgba(198,212,223,0.72)' }}>{label}</div>
            <div className="text-2xl font-black" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-[330px] block" role="img" aria-label="리뷰 그래프">
        <defs>
          <linearGradient id="chartBars" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#66c0f4" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2a475e" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7b955" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f7b955" stopOpacity="0" />
          </linearGradient>
          <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[0, 1, 2, 3, 4].map(step => {
          const y = PAD.top + (INNER_H / 4) * step
          return <line key={step} x1={PAD.left} y1={y} x2={WIDTH - PAD.right} y2={y} stroke="rgba(198,212,223,0.12)" />
        })}
        <polygon points={areaPoints} fill="url(#chartArea)" />
        {data.map((item, index) => {
          const value = primary[index]
          const barH = (value / max) * INNER_H
          const x = PAD.left + barW * index + Math.min(10, barW * 0.2)
          const y = PAD.top + INNER_H - barH
          return (
            <g key={item.date}>
              <rect x={x} y={y} width={Math.max(6, barW * 0.52)} height={barH} rx="5" fill="url(#chartBars)" />
              {index % 3 === 0 && (
                <text x={PAD.left + barW * index + barW / 2} y={HEIGHT - 18} textAnchor="middle" fontSize="11" fill="rgba(198,212,223,0.74)">
                  {item.label}
                </text>
              )}
            </g>
          )
        })}
        <polyline points={linePoints.join(' ')} fill="none" stroke="#f7b955" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#chartGlow)" />
        {linePoints.map((point, index) => {
          const [x, y] = point.split(',')
          return <circle key={index} cx={x} cy={y} r="4.5" fill="#f7b955" stroke="#0b1622" strokeWidth="2" />
        })}
        <text x={PAD.left} y="30" fontSize="13" fontWeight="900" fill="#ecf6ff">{primaryLabel}</text>
        <text x={PAD.left + 92} y="30" fontSize="12" fontWeight="800" fill="#f7b955">line: {secondaryLabel}</text>
      </svg>
    </div>
  )
})
