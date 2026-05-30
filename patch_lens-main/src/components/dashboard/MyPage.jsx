import { memo, useState, useMemo } from 'react'
import { useSavedReviews } from '../../context/SavedReviewsContext'
import { categoryStyles, categoryEmoji, formatDate } from '../../data/constants'

const statusConfig = {
  pending:   { label: '미검토', color: '#aeb9c8', bg: 'rgba(148,163,184,0.15)', bdr: 'rgba(148,163,184,0.38)' },
  reviewing: { label: '검토중', color: '#6ea0ff', bg: 'rgba(59,130,246,0.16)',  bdr: 'rgba(59,130,246,0.5)'  },
  done:      { label: '완료',   color: '#66d87a', bg: 'rgba(34,197,94,0.16)',   bdr: 'rgba(34,197,94,0.5)'   },
  hold:      { label: '보류',   color: '#f7b955', bg: 'rgba(245,158,11,0.16)',  bdr: 'rgba(245,158,11,0.5)'  },
}

const statusOrder = ['pending', 'reviewing', 'done', 'hold']
const categoryFilters = ['all', 'bug', 'balance', 'qol', 'feature_request', 'other']
const statusFilters = ['all', ...statusOrder]

const formatSavedAt = iso =>
  new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

const SavedReviewCard = memo(function SavedReviewCard({ entry }) {
  const { toggleSave, updateNote, updateStatus } = useSavedReviews()
  const { review, savedAt, note, status } = entry
  const [localNote, setLocalNote] = useState(note)
  const catStyle = categoryStyles[review.category] || categoryStyles.other
  const statStyle = status ? statusConfig[status] : null

  return (
    <article
      className="p-5 rounded-xl border space-y-4"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 relative"
            style={{ backgroundColor: catStyle.bg, border: `1px solid ${catStyle.bdr}` }}
          >
            {categoryEmoji[review.category] || '💬'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm" style={{ color: 'var(--heading)' }}>{review.reviewer}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>ID {review.reviewId}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {formatDate(review.createdAt)} · helpful {review.helpful} · {review.sentiment === 'positive' ? '긍정' : '부정'}
              <span className="ml-2 opacity-60">저장 {formatSavedAt(savedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* 상태 선택 */}
          <div className="flex gap-1">
            {statusOrder.map(s => {
              const st = statusConfig[s]
              const active = status === s
              return (
                <button
                  key={s}
                  onClick={() => updateStatus(review.id, active ? null : s)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150"
                  style={{
                    backgroundColor: active ? st.bg : 'var(--bg)',
                    color: active ? st.color : 'var(--text-muted)',
                    border: `1px solid ${active ? st.bdr : 'var(--border)'}`,
                  }}
                >
                  {st.label}
                </button>
              )
            })}
          </div>

          {/* 카테고리 */}
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-black"
            style={{ backgroundColor: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.bdr}` }}
          >
            {catStyle.label}
          </span>

          {/* 별 (제거) */}
          <button
            onClick={() => toggleSave(review)}
            className="text-xl leading-none transition-transform duration-150 hover:scale-110"
            title="저장 해제"
            style={{ color: '#f7b955' }}
          >
            ★
          </button>
        </div>
      </div>

      {/* 리뷰 본문 */}
      <p
        className="text-sm leading-relaxed pl-4 border-l-2"
        style={{ color: 'var(--text)', borderColor: statStyle?.bdr || 'var(--border)' }}
      >
        {review.text}
      </p>

      {/* 메모 */}
      <div>
        <div className="text-xs font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>개발자 메모</div>
        <textarea
          value={localNote}
          onChange={e => setLocalNote(e.target.value)}
          onBlur={() => updateNote(review.id, localNote)}
          placeholder="검토 내용, 조치 계획, 팀 공유 메시지 등을 기록하세요..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none border resize-none"
          style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            borderColor: 'var(--border)',
            lineHeight: '1.6',
          }}
        />
      </div>
    </article>
  )
})

export default function MyPage() {
  const { saved } = useSavedReviews()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('savedAt')

  const entries = useMemo(() => {
    return Object.values(saved)
      .filter(entry => {
        const catMatch = categoryFilter === 'all' || entry.review.category === categoryFilter
        const statMatch = statusFilter === 'all' || entry.status === statusFilter
        return catMatch && statMatch
      })
      .sort((a, b) => {
        if (sortBy === 'savedAt') return new Date(b.savedAt) - new Date(a.savedAt)
        if (sortBy === 'usefulness') return b.review.usefulnessScore - a.review.usefulnessScore
        if (sortBy === 'status') return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        return 0
      })
  }, [saved, categoryFilter, statusFilter, sortBy])

  const total = Object.values(saved).length
  const countByStatus = useMemo(() => {
    const counts = { pending: 0, reviewing: 0, done: 0, hold: 0 }
    Object.values(saved).forEach(e => { if (e.status) counts[e.status] = (counts[e.status] || 0) + 1 })
    return counts
  }, [saved])

  return (
    <div className="p-8 space-y-6">
      {/* 제목 */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>My Reviews</p>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--heading)' }}>저장한 리뷰</h1>
        <p className="text-sm max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          별표로 저장한 리뷰를 카테고리·상태별로 관리하고 메모를 남길 수 있습니다.
        </p>
      </div>

      {/* 상태 요약 */}
      <div className="grid grid-cols-4 gap-3">
        {statusOrder.map(s => {
          const st = statusConfig[s]
          return (
            <div
              key={s}
              className="p-4 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="text-xs font-bold mb-1" style={{ color: 'var(--text-muted)' }}>{st.label}</div>
              <div className="text-2xl font-black" style={{ color: st.color }}>{countByStatus[s]}</div>
            </div>
          )
        })}
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-3 flex-wrap p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-sub)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          {categoryFilters.map(cat => {
            const active = categoryFilter === cat
            const st = cat === 'all' ? null : categoryStyles[cat]
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-150"
                style={{
                  backgroundColor: active ? (st?.bg || 'var(--accent-glow)') : 'var(--bg-card)',
                  color: active ? (st?.text || 'var(--accent)') : 'var(--text)',
                  border: `1px solid ${active ? (st?.bdr || 'var(--accent-border)') : 'var(--border)'}`,
                }}
              >
                {cat === 'all' ? '전체' : st?.label}
              </button>
            )
          })}
        </div>

        <div className="w-px h-5 self-center" style={{ backgroundColor: 'var(--border)' }} />

        <div className="flex items-center gap-2 flex-wrap">
          {statusFilters.map(s => {
            const active = statusFilter === s
            const st = s === 'all' ? null : statusConfig[s]
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                style={{
                  backgroundColor: active ? (st?.bg || 'var(--accent-glow)') : 'var(--bg-card)',
                  color: active ? (st?.color || 'var(--accent)') : 'var(--text)',
                  border: `1px solid ${active ? (st?.bdr || 'var(--accent-border)') : 'var(--border)'}`,
                }}
              >
                {s === 'all' ? '전체 상태' : st?.label}
              </button>
            )
          })}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="ml-auto px-3 py-2 rounded-lg text-sm font-bold outline-none border"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)', borderColor: 'var(--border)' }}
        >
          <option value="savedAt">저장 최신순</option>
          <option value="usefulness">유용성 점수순</option>
          <option value="status">상태순</option>
        </select>
      </div>

      {/* 결과 수 */}
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        전체 {total}개 저장 · 현재 필터 {entries.length}개 표시
      </div>

      {/* 리뷰 목록 */}
      {entries.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-4" style={{ color: 'var(--text-muted)' }}>
          <span className="text-5xl">★</span>
          <p className="text-sm font-bold">
            {total === 0 ? 'Top Reviews에서 별표를 눌러 리뷰를 저장하세요.' : '필터 조건에 맞는 저장 리뷰가 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <SavedReviewCard key={entry.review.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
