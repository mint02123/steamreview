import { memo } from 'react'
import { getTierByPct, categoryStyles } from '../../../data/constants'

export const evidenceStyles = {
  strong:       { label: '근거 강함', bg: 'rgba(34,197,94,0.12)',  text: '#22c55e', weight: 3 },
  partial:      { label: '부분 근거', bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', weight: 2 },
  insufficient: { label: '근거 부족', bg: 'rgba(239,68,68,0.12)',  text: '#ef4444', weight: 1 },
}

export const rankStyles = {
  1: { color: '#f7b955', glow: 'rgba(247,185,85,0.18)', bdr: 'rgba(247,185,85,0.45)', medal: '🏆' },
  2: { color: '#b0bec5', glow: 'rgba(176,190,197,0.14)', bdr: 'rgba(176,190,197,0.38)', medal: '🥈' },
  3: { color: '#cd9b68', glow: 'rgba(205,155,104,0.14)', bdr: 'rgba(205,155,104,0.38)', medal: '🥉' },
}

// 실제 로드된 리뷰 집합을 기준으로 유용성 순위 맵(id -> {rank, total})을 만든다.
// 하드코딩된 mockData가 아니라 화면에 표시 중인 리뷰들로 상대 순위를 계산하기 위함.
export function buildUsefulnessRanks(reviews = []) {
  return new Map(
    [...reviews]
      .sort((a, b) => Number(b.usefulnessScore) - Number(a.usefulnessScore))
      .map((r, i) => [r.id, { rank: i + 1, total: reviews.length }])
  )
}

export function getReviewTier(review, ranks) {
  const entry = ranks?.get(review.id)
  if (entry && entry.total > 0) {
    const pct = Math.max(1, Math.round((entry.rank / entry.total) * 100))
    return { tier: getTierByPct(pct), topPct: pct }
  }

  // 순위 맵이 없으면 리뷰 자체 유용성 점수(0–4)로 상위%를 근사한다.
  const score = Math.min(4, Math.max(0, Number(review.usefulnessScore) || 0))
  const pct = Math.max(1, Math.min(100, Math.round((1 - score / 4) * 100)))
  return { tier: getTierByPct(pct), topPct: pct }
}

export const CategoryPill = memo(function CategoryPill({ category, selected = false }) {
  const style = categoryStyles[category] || categoryStyles.other
  return (
    <span
      className="px-3 py-1.5 rounded-lg text-xs font-black"
      style={{
        backgroundColor: selected ? style.bg : 'var(--bg-card)',
        color: selected ? style.text : 'var(--text)',
        border: `1px solid ${selected ? style.bdr : 'var(--border)'}`,
      }}
    >
      {style.label}
    </span>
  )
})

export const DetailTag = memo(function DetailTag({ children, color = 'var(--accent)' }) {
  return (
    <span className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
      style={{ backgroundColor: 'var(--bg)', color, border: '1px solid var(--border)' }}>
      {children}
    </span>
  )
})

export const TierChip = memo(function TierChip({ tier, topPct }) {
  return (
    <span
      className="px-2 py-0.5 rounded-md text-xs font-black"
      style={{
        backgroundColor: `${tier.color}22`,
        color: tier.color,
        border: `1px solid ${tier.color}44`,
        letterSpacing: '0.03em',
      }}
    >
      {tier.short} · 상위 {topPct}%
    </span>
  )
})

export const EvidenceChip = memo(function EvidenceChip({ level }) {
  const s = evidenceStyles[level] || evidenceStyles.partial
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  )
})

export const RankBadge = memo(function RankBadge({ rank }) {
  const top3 = rankStyles[rank]
  if (top3) {
    return (
      <div className="flex-shrink-0 flex flex-col items-center justify-center gap-0.5 rounded-xl"
        style={{ width: 52, minWidth: 52, height: 52, backgroundColor: top3.glow, border: `1px solid ${top3.bdr}` }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>{top3.medal}</span>
        <span style={{ fontSize: 15, fontWeight: 900, color: top3.color, lineHeight: 1.1 }}>#{rank}</span>
      </div>
    )
  }
  return (
    <div className="flex-shrink-0 flex items-center justify-center rounded-xl"
      style={{ width: 52, minWidth: 52, height: 52, backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
      <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-muted)' }}>#{rank}</span>
    </div>
  )
})

export const ScoreGauge = memo(function ScoreGauge({ score, size = 80, medal, tier }) {
  const max = 4
  const r = size * 0.38
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const arcLength = circumference * 0.75
  const s = Number(score)
  const fillLength = arcLength * Math.min(1, Math.max(0, s / max))
  const color = s >= 3 ? '#66d87a' : s >= 2 ? '#f7b955' : '#ef4444'
  const strokeW = Math.max(4, size * 0.08)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeW}
        strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round"
        transform={`rotate(135, ${cx}, ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW}
        strokeDasharray={`${fillLength} ${circumference}`} strokeLinecap="round"
        transform={`rotate(135, ${cx}, ${cy})`}
        style={{ filter: `drop-shadow(0 0 ${Math.max(3, size * 0.05)}px ${color}80)` }} />
      {medal ? (
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.34} fontFamily="inherit">{medal}</text>
      ) : (
        <>
          <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
            fill={tier?.color || color} fontSize={size * 0.26} fontWeight="900" fontFamily="inherit">
            {tier?.short ?? '?'}
          </text>
          <text x={cx} y={cy + size * 0.21} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(200,210,220,0.4)" fontSize={size * 0.1} fontWeight="600" fontFamily="inherit">
            {tier?.label ?? '-'}
          </text>
        </>
      )}
    </svg>
  )
})
