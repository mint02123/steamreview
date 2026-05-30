import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { reviewPool as fallbackReviewPool } from '../../data/mockData'
import { API_BASE_URL } from '../../config'
import { useSavedReviews } from '../../context/SavedReviewsContext'
import { categoryStyles, categoryEmoji, formatDate } from '../../data/constants'
import {
  evidenceStyles, rankStyles, getReviewTier,
  CategoryPill, TierChip, EvidenceChip, RankBadge,
} from './reviews/ReviewCommon'
import ReviewInsightOverlay from './reviews/ReviewInsightOverlay'
import FeaturedReviewDeck from './reviews/FeaturedReviewDeck'
import CategoryDeck from './reviews/CategoryDeck'
import { ChartModeDeck, ReviewChart, buildChartData } from './reviews/ReviewChart'

const TODAY = new Date().toISOString().split('T')[0]

const categories = ['all', 'bug', 'balance', 'qol', 'feature_request', 'other']
const pageSizeOptions = [5, 10, 20, 40, 60]

const sortOptions = [
  { value: 'usefulness',      label: '유용성 점수순' },
  { value: 'latest',          label: '최신순' },
  { value: 'relevance',       label: '관련성순' },
  { value: 'helpful',         label: '추천 많은 순' },
  { value: 'reviewScoreAsc',  label: '실제 score 낮은 순' },
  { value: 'reviewScoreDesc', label: '실제 score 높은 순' },
  { value: 'evidence',        label: '근거 강한 순' },
  { value: 'patchRelated',    label: '패치 관련 우선' },
  { value: 'funny',           label: 'funny 많은 순' },
]

const readableSortLabels = {
  usefulness: 'Usefulness', latest: 'Latest', relevance: 'Patch relevance',
  helpful: 'Helpful votes', reviewScoreAsc: 'Low Steam score', reviewScoreDesc: 'High Steam score',
  evidence: 'Evidence strength', patchRelated: 'Patch related', funny: 'Funny votes',
}

const readableCategoryLabels = {
  all: 'All categories', bug: 'Bug', balance: 'Balance',
  qol: 'QoL', feature_request: 'Feature request', other: 'Other',
}

function compareReviews(sortBy) {
  if (sortBy === 'relevance')       return (a, b) => b.relevanceScore - a.relevanceScore
  if (sortBy === 'helpful')         return (a, b) => b.helpful - a.helpful
  if (sortBy === 'usefulness')      return (a, b) => b.usefulnessScore - a.usefulnessScore
  if (sortBy === 'reviewScoreAsc')  return (a, b) => a.reviewScore - b.reviewScore
  if (sortBy === 'reviewScoreDesc') return (a, b) => b.reviewScore - a.reviewScore
  if (sortBy === 'patchRelated')    return (a, b) => Number(b.patchRelated) - Number(a.patchRelated)
  if (sortBy === 'funny')           return (a, b) => b.funny - a.funny
  if (sortBy === 'evidence')        return (a, b) => (evidenceStyles[b.evidenceLevel]?.weight || 0) - (evidenceStyles[a.evidenceLevel]?.weight || 0)
  return (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

const ActiveFilterChips = memo(function ActiveFilterChips({ filters, onReset }) {
  if (!filters.length) return null
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
        적용된 필터
      </span>
      {filters.map(filter => (
        <span key={`${filter.label}-${filter.value}`} className="active-filter-chip">
          <span>{filter.label}</span>
          <strong>{filter.value}</strong>
        </span>
      ))}
      <button type="button" onClick={onReset} className="active-filter-reset">
        전체 해제
      </button>
    </div>
  )
})

const ReviewListItem = memo(function ReviewListItem({ review, rank, savedState, onSave, onOpen, rankShadow, showFunny }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [canToggle, setCanToggle] = useState(false)
  const textRef = useRef(null)
  const { tier, topPct } = getReviewTier(review)
  const boxShadow = rankShadow && rankStyles[rank]
    ? `inset 3px 0 0 ${rankStyles[rank].color}, var(--shadow)`
    : 'var(--shadow)'

  useLayoutEffect(() => {
    const node = textRef.current
    if (!node) return
    setCanToggle(node.scrollHeight > node.clientHeight + 1)
  }, [isExpanded, review.text])

  return (
    <article
      onClick={() => onOpen(review, rank)}
      className="p-5 rounded-xl border transition-all duration-200 steam-card-hover cursor-pointer"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow }}
    >
      <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <RankBadge rank={rank} />
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: categoryStyles[review.category]?.bg || 'var(--bg-sub)', border: `1px solid ${categoryStyles[review.category]?.bdr || 'var(--border)'}` }}>
            {categoryEmoji[review.category] || '💬'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-bold text-sm" style={{ color: 'var(--heading)' }}>{review.reviewer}</div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>ID {review.reviewId}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {formatDate(review.createdAt)} · helpful {review.helpful}
              {showFunny && ` · funny ${review.funny}`}
              {' · '}{review.sentiment === 'positive' ? '긍정' : '부정'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <TierChip tier={tier} topPct={topPct} />
          <EvidenceChip level={review.evidenceLevel} />
          <CategoryPill category={review.category} selected />
          <button
            onClick={e => { e.stopPropagation(); onSave(review) }}
            className="text-xl leading-none transition-transform duration-150 hover:scale-125"
            title={savedState ? '저장 해제' : '저장'}
            style={{ color: savedState ? '#f7b955' : 'rgba(198,212,223,0.45)' }}
          >
            {savedState ? '★' : '☆'}
          </button>
        </div>
      </div>
      <p
        ref={textRef}
        className="text-sm leading-relaxed pl-4 border-l-2"
        style={{
          color: 'var(--text)',
          borderColor: 'var(--border)',
          marginBottom: canToggle ? 6 : 12,
          display: isExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : 4,
          WebkitBoxOrient: 'vertical',
          overflow: isExpanded ? 'visible' : 'hidden',
          whiteSpace: 'pre-wrap',
        }}
      >
        {review.text}
      </p>
      {canToggle && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); setIsExpanded(v => !v) }}
          style={{
            display: 'block',
            marginBottom: 8,
            marginLeft: 12,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: 'var(--accent)',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
            lineHeight: 1.4,
          }}
        >
          {isExpanded ? '접기' : '더보기'}
        </button>
      )}
      {review.patchRelated && (
        <span className="px-2 py-0.5 rounded-md text-xs font-semibold"
          style={{ backgroundColor: 'rgba(102,192,244,0.1)', color: '#66c0f4' }}>
          패치 연관 ✓
        </span>
      )}
    </article>
  )
})

export default function TopReviews() {
  const { toggleSave, isSaved } = useSavedReviews()
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  const [active, setActive] = useState('all')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(5)
  const [sortBy, setSortBy] = useState('usefulness')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showCharts, setShowCharts] = useState(false)
  const [showCategoryDeck, setShowCategoryDeck] = useState(false)
  const [chartType, setChartType] = useState('volume')
  const [page, setPage] = useState(1)
  const [overlayReview, setOverlayReview] = useState(null)
  const [overlayRank, setOverlayRank] = useState(1)
  
  const [reviewPool, setReviewPool] = useState(fallbackReviewPool)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    setLoading(true)
    setError('')

    fetch(`${API_BASE_URL}/api/reviews`)
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (!alive) return
        setReviewPool(Array.isArray(data.items) ? data.items : fallbackReviewPool)
      })
      .catch(err => {
        console.warn('Failed to load reviews.', err)
        if (!alive) return
        setError('백엔드 리뷰 데이터를 불러오지 못해 기본 데이터를 표시합니다.')
        setReviewPool(fallbackReviewPool)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return reviewPool
      .filter(review => {
        const categoryMatch = active === 'all' || review.category === active
        const textMatch = !needle || `${review.reviewer} ${review.text} ${review.category} ${review.reviewId}`.toLowerCase().includes(needle)
        const reviewDate = new Date(review.createdAt)
        const startMatch = !startDate || reviewDate >= new Date(startDate)
        const endMatch = !endDate || reviewDate <= new Date(endDate)
        return categoryMatch && textMatch && startMatch && endMatch
      })
      .sort(compareReviews(sortBy))
  }, [active, endDate, query, reviewPool, sortBy, startDate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / visibleCount))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * visibleCount
  const visibleReviews = filtered.slice(pageStart, pageStart + visibleCount)
  const chartData = useMemo(() => buildChartData(filtered), [filtered])
  const isPodiumMode = page === 1 && sortBy === 'usefulness'
  const podiumReviews = isPodiumMode ? visibleReviews.slice(0, Math.min(3, visibleReviews.length)) : []
  const listReviews = visibleReviews

  const activeFilters = useMemo(() => {
    const filters = []
    if (active !== 'all') filters.push({ label: 'Category', value: readableCategoryLabels[active] || active })
    if (query.trim()) filters.push({ label: 'Search', value: query.trim() })
    if (startDate) filters.push({ label: 'From', value: startDate })
    if (endDate) filters.push({ label: 'To', value: endDate })
    if (sortBy !== 'usefulness') filters.push({ label: 'Sort', value: readableSortLabels[sortBy] || sortBy })
    if (visibleCount !== 5) filters.push({ label: 'Page size', value: visibleCount })
    return filters
  }, [active, endDate, query, sortBy, startDate, visibleCount])

  const openOverlay = useCallback((review, rank) => { setOverlayReview(review); setOverlayRank(rank) }, [])

  const resetFilters = useCallback(() => {
    setActive('all'); setQuery(''); setVisibleCount(5); setSortBy('usefulness')
    setStartDate(''); setEndDate(''); setPage(1)
  }, [])

  const onSelectCategory = useCallback(cat => { setActive(cat); setPage(1) }, [])

  const openDatePicker = ref => {
    if (ref.current?.showPicker) { ref.current.showPicker(); return }
    ref.current?.focus(); ref.current?.click()
  }

  return (
    <div className="p-8 space-y-6">
      {loading && (
        <div className="steam-panel p-4 text-sm font-bold" style={{ color: 'var(--accent)' }}>
          백엔드 리뷰 데이터를 불러오는 중입니다...
        </div>
      )}

      {error && (
        <div className="steam-panel p-4 text-sm font-bold" style={{ color: '#f7b955' }}>
          {error}
        </div>
      )}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => { setActive('all'); setPage(1) }} className="px-3 py-1.5 rounded-lg text-xs font-black"
            style={{
              backgroundColor: active === 'all' ? 'var(--accent-glow)' : 'var(--bg-card)',
              color: active === 'all' ? 'var(--accent)' : 'var(--text)',
              border: `1px solid ${active === 'all' ? 'var(--accent-border)' : 'var(--border)'}`,
            }}>전체</button>
          {categories.filter(c => c !== 'all').map(category => (
            <button key={category} onClick={() => { setActive(category); setPage(1) }} className="transition-transform duration-200 hover:-translate-y-0.5">
              <CategoryPill category={category} selected={active === category} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setShowCategoryDeck(v => !v)}
            className="px-4 h-10 rounded text-sm font-black flex items-center gap-2"
            style={{ backgroundColor: '#05080d', color: '#ffffff', border: '1px solid rgba(102,192,244,0.32)' }}>
            {showCategoryDeck ? '카테고리 숨기기' : '카테고리 덱'}
            <span className="text-base leading-none">{showCategoryDeck ? '▴' : '▾'}</span>
          </button>
          <button onClick={() => setShowCharts(v => !v)}
            className="px-4 h-10 rounded text-sm font-black flex items-center gap-2"
            style={{ backgroundColor: '#05080d', color: '#ffffff', border: '1px solid rgba(102,192,244,0.32)' }}>
            {showCharts ? '그래프 숨기기' : '그래프 표시'}
            <span className="text-base leading-none">{showCharts ? '▴' : '▾'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)', borderColor: 'var(--border)' }}>
          <button type="button" className="calendar-badge" title="시작일 선택" onClick={() => openDatePicker(startDateRef)}>▦</button>
          <input ref={startDateRef} type="date" value={startDate}
            max={endDate || TODAY}
            onChange={e => { setStartDate(e.target.value); setPage(1) }}
            className="date-input bg-transparent text-sm outline-none" style={{ color: 'var(--text)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>~</span>
          <button type="button" className="calendar-badge" title="종료일 선택" onClick={() => openDatePicker(endDateRef)}>▦</button>
          <input ref={endDateRef} type="date" value={endDate}
            min={startDate || undefined}
            max={TODAY}
            onChange={e => { setEndDate(e.target.value); setPage(1) }}
            className="date-input bg-transparent text-sm outline-none" style={{ color: 'var(--text)' }} />
        </div>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }}
          className="px-3 py-2 rounded-lg text-sm font-bold outline-none border"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)', borderColor: 'var(--border)' }}>
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={resetFilters} className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ color: 'var(--accent)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>초기화</button>
        <input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}
          placeholder="리뷰어, 본문, 카테고리 검색"
          className="flex-1 min-w-[240px] px-3 py-2 rounded-lg text-sm outline-none border"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)', borderColor: 'var(--border)' }} />
        <label className="ml-auto flex items-center gap-2 text-xl font-black" style={{ color: 'var(--heading)' }}>
          <select value={visibleCount} onChange={e => { setVisibleCount(Number(e.target.value)); setPage(1) }}
            className="w-[86px] px-2 py-1 rounded border text-xl font-black outline-none"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--heading)', borderColor: 'var(--border)' }}>
            {pageSizeOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          씩 보기
        </label>
      </div>

      <ActiveFilterChips filters={activeFilters} onReset={resetFilters} />

      {showCharts && (
        <section className="steam-panel p-5 space-y-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-black" style={{ color: 'var(--heading)' }}>리뷰 흐름 분석</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>현재 필터에 맞춰 리뷰 양과 품질 지표를 함께 봅니다.</p>
            </div>
          </div>
          <ChartModeDeck chartType={chartType} onChange={setChartType} />
          <ReviewChart data={chartData} type={chartType} />
        </section>
      )}

      {showCategoryDeck && (
        <CategoryDeck active={active} filtered={filtered} onSelect={onSelectCategory} />
      )}

      <div className="flex items-center justify-between text-xs flex-wrap gap-3" style={{ color: 'var(--text-muted)' }}>
        <span>{filtered.length.toLocaleString()}개 후보 중 {pageStart + 1}-{Math.min(pageStart + visibleCount, filtered.length)}개 표시</span>
        <span>{safePage}/{totalPages}페이지 · {sortOptions.find(o => o.value === sortBy)?.label}</span>
      </div>

      {isPodiumMode && podiumReviews.length > 0 ? (
        <div className="space-y-4">
          <FeaturedReviewDeck reviews={podiumReviews} onSave={toggleSave} isSaved={isSaved} onOpen={openOverlay} />
          {listReviews.length > 0 && (
            <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-bold uppercase tracking-widest pt-1" style={{ color: 'var(--text-muted)' }}>그 외 리뷰</p>
              {listReviews.map((review, index) => (
                <ReviewListItem
                  key={review.id}
                  review={review}
                  rank={pageStart + index + 1}
                  savedState={isSaved(review.id)}
                  onSave={toggleSave}
                  onOpen={openOverlay}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visibleReviews.map((review, index) => (
            <ReviewListItem
              key={review.id}
              review={review}
              rank={pageStart + index + 1}
              savedState={isSaved(review.id)}
              onSave={toggleSave}
              onOpen={openOverlay}
              rankShadow
              showFunny
            />
          ))}
        </div>
      )}

      <div className="steam-panel p-4 flex items-center justify-center gap-2 flex-wrap">
        {totalPages > 10 ? (
          <>
            <button onClick={() => setPage(1)} disabled={safePage === 1} className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>맨처음</button>
            <button onClick={() => setPage(v => Math.max(1, v - 1))} disabled={safePage === 1} className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>이전</button>
            {(() => {
              const windowStart = Math.max(1, Math.min(safePage - 4, totalPages - 9))
              const windowEnd = Math.min(windowStart + 9, totalPages)
              return Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i).map(pageNumber => (
                <button key={pageNumber} onClick={() => setPage(pageNumber)} className="w-9 h-9 rounded-lg text-xs font-black"
                  style={{ backgroundColor: safePage === pageNumber ? 'var(--accent)' : 'var(--bg)', color: safePage === pageNumber ? 'var(--logo-text)' : 'var(--text)', border: `1px solid ${safePage === pageNumber ? 'var(--accent)' : 'var(--border)'}` }}>
                  {pageNumber}
                </button>
              ))
            })()}
            <button onClick={() => setPage(v => Math.min(totalPages, v + 1))} disabled={safePage === totalPages} className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>다음</button>
            <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>맨뒤</button>
          </>
        ) : (
          <>
            <button onClick={() => setPage(v => Math.max(1, v - 1))} disabled={safePage === 1} className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>이전</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button key={pageNumber} onClick={() => setPage(pageNumber)} className="w-9 h-9 rounded-lg text-xs font-black"
                style={{ backgroundColor: safePage === pageNumber ? 'var(--accent)' : 'var(--bg)', color: safePage === pageNumber ? 'var(--logo-text)' : 'var(--text)', border: `1px solid ${safePage === pageNumber ? 'var(--accent)' : 'var(--border)'}` }}>
                {pageNumber}
              </button>
            ))}
            <button onClick={() => setPage(v => Math.min(totalPages, v + 1))} disabled={safePage === totalPages} className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>다음</button>
          </>
        )}
      </div>

      {overlayReview && (
        <ReviewInsightOverlay review={overlayReview} rank={overlayRank} onClose={() => setOverlayReview(null)} />
      )}
    </div>
  )
}
