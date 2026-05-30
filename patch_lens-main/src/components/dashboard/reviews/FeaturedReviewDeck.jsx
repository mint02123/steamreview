import { useEffect, useRef, useState } from 'react'
import { categoryStyles, formatDate } from '../../../data/constants'
import { rankStyles, getReviewTier, TierChip, EvidenceChip, ScoreGauge } from './ReviewCommon'

function ReviewDeckCard({ review, rank, position, onSave, saved, onClick }) {
  const { tier, topPct } = getReviewTier(review)
  const style = categoryStyles[review.category] || categoryStyles.other
  return (
    <article
      className={`review-deck-card review-deck-card-${position}`}
      onClick={onClick}
      style={{ '--deck-accent': rankStyles[rank]?.color || style.text }}
    >
      <div className="review-deck-art" style={{ background: `linear-gradient(145deg, ${style.bg}, rgba(102,192,244,0.08)), var(--bg-card)` }}>
        <div className="review-deck-rank">#{rank}</div>
        <div className="review-deck-category">{style.label}</div>
        <ScoreGauge score={review.usefulnessScore} size={position === 'center' ? 108 : 78} medal={rankStyles[rank]?.medal} tier={tier} />
      </div>
      <div className="review-deck-body">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="review-deck-name">{review.reviewer}</div>
            <div className="review-deck-meta">{formatDate(review.createdAt)} · helpful {review.helpful}</div>
          </div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onSave(review) }}
            className="review-deck-save"
            aria-label={saved ? '저장 해제' : '저장'}
          >
            {saved ? '★' : '☆'}
          </button>
        </div>
        <p className="review-deck-text">{review.text}</p>
        <div className="review-deck-footer">
          <TierChip tier={tier} topPct={topPct} />
          <EvidenceChip level={review.evidenceLevel} />
        </div>
      </div>
    </article>
  )
}

export default function FeaturedReviewDeck({ reviews, onSave, isSaved, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const rotateLockRef = useRef(false)
  const lastIndex = Math.max(0, reviews.length - 1)

  useEffect(() => {
    setActiveIndex(current => Math.min(current, lastIndex))
  }, [lastIndex])

  if (!reviews.length) return null
  const prevIndex = activeIndex === 0 ? lastIndex : activeIndex - 1
  const nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1
  const deck = [
    reviews.length > 1 && { review: reviews[prevIndex], rank: prevIndex + 1, position: 'left' },
    { review: reviews[activeIndex], rank: activeIndex + 1, position: 'center' },
    reviews.length > 2 && { review: reviews[nextIndex], rank: nextIndex + 1, position: 'right' },
  ].filter(Boolean)

  const rotateDeck = direction => {
    if (reviews.length <= 1 || rotateLockRef.current) return
    rotateLockRef.current = true
    setActiveIndex(current => {
      if (direction === 'next') return current === lastIndex ? 0 : current + 1
      return current === 0 ? lastIndex : current - 1
    })
    setTimeout(() => { rotateLockRef.current = false }, 260)
  }

  return (
    <section className="featured-review-deck">
      <div className="featured-deck-heading">
        <div>
          <p>핵심 리뷰 덱</p>
          <h2>먼저 확인할 Top 3 리뷰</h2>
        </div>
        <span>카드를 클릭하면 상세 분석이 열립니다</span>
      </div>
      <div className="review-deck-stage">
        {reviews.length > 1 && (
          <>
            <button type="button" className="review-deck-hotzone review-deck-hotzone-left" onClick={() => rotateDeck('prev')} aria-label="이전 Top 리뷰 보기" />
            <button type="button" className="review-deck-hotzone review-deck-hotzone-right" onClick={() => rotateDeck('next')} aria-label="다음 Top 리뷰 보기" />
          </>
        )}
        {deck.map(({ review, rank, position }) => (
          <ReviewDeckCard
            key={review.id}
            review={review}
            rank={rank}
            position={position}
            onSave={onSave}
            saved={isSaved(review.id)}
            onClick={() => position === 'center' ? onOpen(review, rank) : rotateDeck(position === 'left' ? 'prev' : 'next')}
          />
        ))}
      </div>
    </section>
  )
}
