export const categoryStyles = {
  bug:             { label: '버그',     bg: 'rgba(239,68,68,0.16)',   text: '#ff5f6d', bdr: 'rgba(239,68,68,0.5)'    },
  balance:         { label: '밸런스',   bg: 'rgba(245,158,11,0.16)',  text: '#f7b955', bdr: 'rgba(245,158,11,0.5)'   },
  qol:             { label: 'QoL',      bg: 'rgba(34,197,94,0.16)',   text: '#66d87a', bdr: 'rgba(34,197,94,0.5)'    },
  feature_request: { label: '기능 요청', bg: 'rgba(59,130,246,0.16)', text: '#6ea0ff', bdr: 'rgba(59,130,246,0.5)'   },
  other:           { label: '기타',     bg: 'rgba(148,163,184,0.15)', text: '#aeb9c8', bdr: 'rgba(148,163,184,0.38)' },
}

export const categoryEmoji = {
  bug:             '🐛',
  balance:         '⚖️',
  qol:             '✨',
  feature_request: '💡',
  other:           '💬',
}

export const formatDate = date =>
  new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' }).format(new Date(date))

export function getTierByPct(topPct) {
  if (topPct <= 10) return { label: '매우 높음', short: 'S', color: '#22c55e' }
  if (topPct <= 30) return { label: '높음',     short: 'A', color: '#66d87a' }
  if (topPct <= 60) return { label: '보통',     short: 'B', color: '#f59e0b' }
  if (topPct <= 80) return { label: '낮음',     short: 'C', color: '#ef4444' }
  return             { label: '매우 낮음',     short: 'D', color: '#6b7280' }
}
