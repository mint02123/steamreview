import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { categoryStyles, formatDate } from '../../../data/constants'
import { rankingReasons } from '../../../data/rankingReasons'
import { API_BASE_URL } from '../../../config'
import {
  evidenceStyles, rankStyles, getReviewTier,
  CategoryPill, TierChip, EvidenceChip, ScoreGauge,
} from './ReviewCommon'

export default function ReviewInsightOverlay({ review, rank, onClose }) {
  const reason = rankingReasons[review.reviewId]
  const evidenceStyle = evidenceStyles[review.evidenceLevel] || evidenceStyles.partial
  const s = Number(review.usefulnessScore)
  const scoreColor = s >= 3 ? '#66d87a' : s >= 2 ? '#f7b955' : '#ef4444'
  const { tier, topPct } = getReviewTier(review)
  const reviewTextRef = useRef(null)
  const [llmInsight, setLlmInsight] = useState(null)
  const [insightLoading, setInsightLoading] = useState(false)
  const [insightError, setInsightError] = useState('')
  const [activePanel, setActivePanel] = useState('insight')
  const [isReviewExpanded, setIsReviewExpanded] = useState(false)
  const [canToggleReview, setCanToggleReview] = useState(false)

  useEffect(() => {
    if (activePanel !== 'insight') return
    if (llmInsight) return

    let alive = true

    setInsightLoading(true)
    setInsightError('')

    fetch(`${API_BASE_URL}/api/reviews/${review.reviewId}/insight`, {
      method: 'POST',
    })
      .then(res => {
        if (!res.ok) throw new Error(`Insight API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (!alive) return
        setLlmInsight(data)
      })
      .catch(err => {
        console.warn('Failed to load review insight.', err)
        if (!alive) return
        setInsightError('AI 인사이트를 불러오지 못했습니다. 기본 분석 결과를 표시합니다.')
      })
      .finally(() => {
        if (!alive) return
        setInsightLoading(false)
      })

    return () => {
      alive = false
    }
  }, [activePanel, review.reviewId, llmInsight])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    setIsReviewExpanded(false)
    setCanToggleReview(false)
    setActivePanel('insight')
    setLlmInsight(null)
    setInsightError('')
    setInsightLoading(false)
  }, [review.text])

  useLayoutEffect(() => {
    if (activePanel !== 'raw') return
    window.requestAnimationFrame(() => {
      const node = reviewTextRef.current
      if (!node) return
      setCanToggleReview(node.scrollHeight > node.clientHeight + 1)
    })
  }, [activePanel, isReviewExpanded, review.text])

  const insightSummary =
    llmInsight?.summary ||
    review.summary ||
    '리뷰 핵심 요약을 준비 중입니다.'

  const insightDeveloperValue =
    llmInsight?.developer_value ||
    llmInsight?.developerValue ||
    review.developerValue ||
    reason ||
    '개발자가 참고할 수 있는 사용자 피드백 후보입니다.'

  const insightActionHint =
    llmInsight?.action_hint ||
    llmInsight?.actionHint ||
    review.actionHint ||
    '동일 주제의 리뷰와 함께 반복 신호 여부를 검토하세요.'

  const insightCategory =
    llmInsight?.category || review.category

  const insightEvidenceLevel =
    llmInsight?.evidence_level || review.evidenceLevel

  const insightEvidenceStyle =
    evidenceStyles[insightEvidenceLevel] || evidenceStyles.partial

  return (
    <div
      className="review-cinema-backdrop"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.58)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        className="review-cinema-panel"
        style={{
          width: '100%', maxWidth: 780,
          maxHeight: '88vh', overflowY: 'auto',
          borderRadius: 16,
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          backgroundColor: 'var(--bg-card)',
          borderTop: `3px solid ${scoreColor}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-card)', zIndex: 1 }}>
          <div className="flex items-center gap-3">
            {rankStyles[rank] && <span style={{ fontSize: 18 }}>{rankStyles[rank].medal}</span>}
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--heading)' }}>#{rank}</span>
            <CategoryPill category={review.category} selected />
            <TierChip tier={tier} topPct={topPct} />
          </div>
          <button onClick={onClose}
            style={{ color: 'rgba(198,212,223,0.6)', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="flex items-center gap-5">
            <ScoreGauge score={review.usefulnessScore} size={96} medal={rankStyles[rank]?.medal} tier={tier} />
            <div style={{ flex: 1 }}>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  ['패치 연관성', `${review.relevanceScore}%`, '#66c0f4'],
                  ['도움됨',     `${review.helpful}명`,       '#22c55e'],
                  ['플레이',     `${review.playHours}h`,      '#f59e0b'],
                ].map(([label, value, color]) => (
                  <div key={label} className="p-2.5 rounded-xl text-center" style={{ backgroundColor: 'var(--bg)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 8, backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>유용성</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: scoreColor }}>{tier.label} · 상위 {topPct}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.07)' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (s / 4) * 100)}%`, backgroundColor: scoreColor, borderRadius: 3, boxShadow: `0 0 8px ${scoreColor}60` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="overlay-tabs" role="tablist" aria-label="Review detail panels">
            {[
              ['insight', 'AI 인사이트'],
              ['raw', '원문 리뷰'],
              ['signals', '상세 지표'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`overlay-tab ${activePanel === value ? 'is-active' : ''}`}
                onClick={() => setActivePanel(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {activePanel === 'insight' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="insight-brief-grid">
                {[
                  ['Priority', tier.label, tier.color],
                  ['Evidence', insightEvidenceStyle.label, insightEvidenceStyle.text],
                  ['LLM Category', categoryStyles[insightCategory]?.label || insightCategory, categoryStyles[insightCategory]?.text || 'var(--accent)'],
                  ['패치 신호', review.patchRelated ? '패치 연관' : '일반 피드백', review.patchRelated ? '#66c0f4' : 'var(--text-muted)'],
                ].map(([label, value, color]) => (
                  <div key={label} className="insight-brief-card">
                    <span>{label}</span>
                    <strong style={{ color }}>{value}</strong>
                  </div>
                ))}
              </div>

              {insightError && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    backgroundColor: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.24)',
                    color: '#f7b955',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {insightError}
                </div>
              )}

              <div style={{ padding: '14px 16px', borderRadius: 12, backgroundColor: 'rgba(102,192,244,0.06)', border: '1px solid rgba(102,192,244,0.2)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#66c0f4', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  AI 요약
                </div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>
                  {insightLoading ? 'AI가 리뷰를 분석하는 중입니다...' : insightSummary}
                </p>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  개발자 가치
                </div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>
                  {insightLoading ? '개발자 관점의 가치를 생성하는 중입니다...' : insightDeveloperValue}
                </p>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  액션 힌트
                </div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>
                  {insightLoading ? '조치 힌트를 준비하는 중입니다...' : insightActionHint}
                </p>
              </div>
            </div>
          )}

          <div style={{ display: activePanel === 'raw' ? 'block' : 'none', padding: '16px 18px', borderRadius: 12, backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--heading)' }}>{review.reviewer}</span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(review.createdAt)}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: review.sentiment === 'positive' ? '#22c55e' : '#ef4444' }}>
                  {review.sentiment === 'positive' ? '긍정' : '부정'}
                </span>
              </div>
            </div>
            <p
              ref={reviewTextRef}
              style={{
                fontSize: 13,
                lineHeight: 1.85,
                color: 'var(--text)',
                paddingLeft: 12,
                borderLeft: `2px solid ${categoryStyles[review.category]?.text || 'var(--accent)'}`,
                margin: 0,
                display: isReviewExpanded ? 'block' : '-webkit-box',
                WebkitLineClamp: isReviewExpanded ? 'unset' : 5,
                WebkitBoxOrient: 'vertical',
                overflow: isReviewExpanded ? 'visible' : 'hidden',
                whiteSpace: 'pre-wrap',
              }}
            >
              {review.text}
            </p>
            {canToggleReview && (
              <button
                type="button"
                onClick={() => setIsReviewExpanded(v => !v)}
                style={{
                  marginTop: 10,
                  marginLeft: 12,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--accent)',
                  fontSize: 12,
                  fontWeight: 800,
                  lineHeight: 1.4,
                }}
              >
                {isReviewExpanded ? '접기' : '더보기'}
              </button>
            )}
          </div>

          <div style={{ display: activePanel === 'signals' ? 'block' : 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>상세 지표</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                ['Steam Score',  `${review.reviewScore}/100`,        '#22c55e'],
                ['패치 관련성',  `${review.relevanceScore}%`,        '#66c0f4'],
                ['근거 강도',    evidenceStyle.label,                evidenceStyle.text],
                ['구매 유형',    review.purchaseType === 'paid' ? '구매자' : '무료 플레이', 'var(--text-muted)'],
                ['언어',         review.language === 'ko' ? '한국어' : '영어', 'var(--text-muted)'],
                ['재미있음',     `${review.funny}명`,                'var(--text-muted)'],
                ['플레이 시간',  `${review.playHours}h`,             '#f59e0b'],
                ['패치 연관',    review.patchRelated ? '연관 ✓' : '해당 없음', review.patchRelated ? 'var(--accent)' : 'var(--text-muted)'],
              ].map(([label, value, color]) => (
                <div key={label} className="p-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {activePanel === 'insight' && reason && (
            <div style={{ padding: '14px 16px', borderRadius: 12, backgroundColor: 'rgba(102,192,244,0.06)', border: '1px solid rgba(102,192,244,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: 11, fontWeight: 800, color: '#66c0f4', textTransform: 'uppercase', letterSpacing: '0.1em' }}>순위 선정 근거</span>
                <span style={{ fontSize: 11, color: 'rgba(102,192,244,0.6)', fontWeight: 600, padding: '1px 5px', backgroundColor: 'rgba(102,192,244,0.1)', borderRadius: 3 }}>AI</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>{reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
