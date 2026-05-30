const lensPoints = [
  '패치 버전과 리뷰 반응을 같은 화면에서 비교',
  '유용성 점수순으로 개발자가 먼저 볼 리뷰 정렬',
  '요약, 개발자 가치, 액션 힌트를 인사이트 카드로 제공',
]

function CompareImage({ src, alt, label, active }) {
  return (
    <div className={`image-compare-panel ${active ? 'compare-panel-after' : 'compare-panel-before'}`}>
      <div className="compare-label-row">
        <div className={`compare-label${active ? ' active' : ''}`}>{label}</div>
        {active && <div className="compare-panel-badge">PATCH LENS</div>}
      </div>
      <div className="compare-img-wrapper">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      </div>
    </div>
  )
}

export default function Differentiator() {
  return (
    <section className="py-24 px-6 lg:px-8 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Why It Works</div>
          <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: 'var(--heading)' }}>
            리뷰 목록을 개발 액션 보드로 바꿉니다
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text)' }}>
            일반 리뷰 목록은 읽을거리를 보여주지만, Patch Lens는 패치 맥락과 우선순위를 붙여 바로 판단 가능한 화면으로 바꿉니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div className="image-compare-stage">
            <CompareImage
              src="/images/diff-before.png"
              alt="정렬되지 않은 리뷰 목록"
              label="Before"
            />
            <div className="compare-arrow">→</div>
            <CompareImage
              src="/images/diff-after.jpeg"
              alt="Patch Lens 인사이트 화면"
              label="After"
              active
            />
          </div>

          <div className="space-y-4">
            {lensPoints.map((point, index) => (
              <div key={point} className="flex items-start gap-4 p-5 rounded-xl border steam-card-hover"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xl"
                  style={{
                    backgroundColor: 'var(--accent-glow)',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent-border)',
                  }}
                >
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed pt-2.5" style={{ color: 'var(--text)', wordBreak: 'keep-all' }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
