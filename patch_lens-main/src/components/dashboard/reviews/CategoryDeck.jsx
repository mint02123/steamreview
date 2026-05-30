import { memo, useMemo } from 'react'
import { categoryStyles, categoryEmoji } from '../../../data/constants'

const nonAllCategories = ['bug', 'balance', 'qol', 'feature_request', 'other']

export default memo(function CategoryDeck({ active, filtered, onSelect }) {
  const counts = useMemo(() => {
    const tally = {}
    for (const r of filtered) {
      if (!tally[r.category]) tally[r.category] = { count: 0, patchCount: 0 }
      tally[r.category].count++
      if (r.patchRelated) tally[r.category].patchCount++
    }
    return nonAllCategories.map(category => ({
      category,
      count: tally[category]?.count || 0,
      patchCount: tally[category]?.patchCount || 0,
      style: categoryStyles[category] || categoryStyles.other,
    }))
  }, [filtered])

  return (
    <section className="category-deck-wrap">
      <div className="category-deck-heading">
        <div>
          <p>카테고리 빠른 탐색</p>
          <h2>신호별 리뷰 묶음</h2>
        </div>
        <button type="button" onClick={() => onSelect('all')} className={active === 'all' ? 'is-active' : ''}>
          전체 보기
        </button>
      </div>
      <div className="category-card-fan">
        {counts.map((item, index) => (
          <button
            key={item.category}
            type="button"
            className={`category-fan-card ${active === item.category ? 'is-active' : ''}`}
            onClick={() => onSelect(item.category)}
            style={{
              '--fan-index': index,
              '--fan-color': item.style.text,
              '--fan-bg': item.style.bg,
            }}
          >
            <span className="category-fan-top">{categoryEmoji[item.category] || '•'}</span>
            <strong>{item.style.label}</strong>
            <em>{item.count}개 리뷰</em>
            <small>패치 연관 {item.patchCount}개</small>
          </button>
        ))}
      </div>
    </section>
  )
})
