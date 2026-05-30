const cases = [
  {
    tag: 'Patch Reaction',
    color: '#66c0f4',
    image: '/images/usecase-patch-reaction.png',
    title: '패치 직후 반응이 왜 바뀌었는지 설명해야 할 때',
    desc: '패치 이후 리뷰량과 감정 변화를 기간별로 묶어 어떤 변경이 불만을 만들었는지 확인합니다.',
  },
  {
    tag: 'Bug',
    color: '#ef4444',
    image: '/images/usecase-bug-review.png',
    title: '추천 수 뒤에 숨어 있는 치명적인 버그를 찾을 때',
    desc: '평점보다 재현 단서와 패치 연관성이 있는 리뷰를 우선순위 큐에 올립니다.',
  },
  {
    tag: 'Balance',
    color: '#f59e0b',
    image: '/images/usecase-balance-chart.png',
    title: '밸런스 패치의 체감 반응을 검토할 때',
    desc: '무기, 클래스, PvP 구조에 대한 불만을 밸런스 신호로 묶어 개발자가 바로 읽을 수 있게 만듭니다.',
  },
  {
    tag: 'Feature',
    color: '#3b82f6',
    image: '/images/usecase-feature-roadmap.png',
    title: '다음 로드맵 후보를 커뮤니티 신호로 정리할 때',
    desc: '기능 요청을 빈도와 근거 수준으로 나눠 바로 논의 가능한 후보로 정리합니다.',
  },
  {
    tag: 'QoL',
    color: '#22c55e',
    image: '/images/usecase-qol-ui.png',
    title: '작지만 반복되는 사용성 불만을 놓치지 않을 때',
    desc: '메뉴 흐름, 조작감, UI 피로도 같은 QoL 이슈를 개발자가 읽기 쉬운 단위로 묶습니다.',
  },
  {
    tag: 'API Ready',
    color: '#a78bfa',
    image: '/images/usecase-api-flow.png',
    title: '백엔드 연결 전에 데이터 구조를 맞춰야 할 때',
    desc: '리뷰, 패치, 인사이트 필드가 화면 어디에 반영되는지 미리 확인할 수 있습니다.',
  },
]

export default function UseCases() {
  return (
    <section id="usecases" className="py-24 px-6 lg:px-8 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Use Cases</div>
          <h2 className="text-4xl font-bold mb-3" style={{ color: 'var(--heading)' }}>실제 개발 상황을 제품 화면처럼 보여줍니다</h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text)' }}>
            Patch Lens가 어떤 업무 장면에서 리뷰를 인사이트로 바꾸는지, 각 기능의 미리보기 이미지로 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map(item => (
            <div
              key={item.title}
              className="image-card steam-card-hover"
              style={{ '--card-color': item.color }}
            >
              {/* 상단 카테고리 컬러 액센트 바 */}
              <div className="image-card-accent-bar" style={{ background: item.color }} />

              <div className="image-card-media">
                {/* 이미지 위 태그 배지 오버레이 */}
                <div className="image-card-tag-overlay">
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    backgroundColor: `${item.color}28`,
                    color: item.color,
                    border: `1px solid ${item.color}55`,
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                  }}>
                    {item.tag}
                  </span>
                </div>

                {/* 호버 시 카테고리 컬러 그라디언트 오버레이 */}
                <div className="image-card-gradient" />

                <img
                  src={item.image}
                  alt={`${item.title} preview`}
                  loading="lazy"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>

              <div className="p-6">
                <h3 className="font-bold text-base mb-3 leading-snug" style={{ color: 'var(--heading)', wordBreak: 'keep-all' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', wordBreak: 'keep-all' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
