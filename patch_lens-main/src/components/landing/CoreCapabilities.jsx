/*
  이미지 파일 위치 (public/images/ 폴더에 넣으면 됩니다):
  - public/images/feature-collection.jpg
  - public/images/feature-insights.jpg
  - public/images/feature-dashboard.jpg
*/

const features = [
  {
    tag: '리뷰 수집 & 연결',
    title: '패치 직후 리뷰를\n맥락과 함께 수집합니다',
    desc: 'Steam 리뷰의 작성 시점과 패치노트를 연결해 특정 업데이트 이후 어떤 반응이 늘어났는지 파악합니다. 단순 평점 변화가 아닌 본문 속 신호까지 함께 추적합니다.',
    points: [
      '패치 버전과 리뷰 시점 자동 매핑',
      '추천 수 · 플레이 시간 등 메타데이터 포함',
      '긍·부정 감정 자동 분류',
    ],
    image: '/images/feature-collection.jpeg',
    accent: '#66c0f4',
  },
  {
    tag: 'LLM 인사이트 분류',
    title: 'Bug, Balance, QoL,\nFeature Request로 즉시 분류',
    desc: 'LLM이 리뷰를 카테고리, 핵심 요약, 개발자 가치, 액션 힌트로 구조화합니다. 긴 리뷰를 전부 읽지 않아도 판단에 필요한 정보를 바로 확인할 수 있습니다.',
    points: [
      '4가지 카테고리 자동 분류',
      '유용성 점수로 우선순위 결정',
      'LLM 기반 요약 및 액션 힌트 생성',
    ],
    image: '/images/feature-insights.mov',
    accent: '#f59e0b',
  },
  {
    tag: '개발자 대시보드',
    title: '별표 저장부터 메모까지\n개발자 전용 인사이트 콘솔',
    desc: 'Overview에서 카테고리 분포와 인사이트 카드를 확인하고, Top Reviews에서 유용성 순으로 정제된 리뷰를 탐색합니다. 중요한 리뷰는 저장 후 메모를 달아 팀과 공유할 수 있습니다.',
    points: [
      '실시간 리뷰 흐름 그래프',
      '필터 · 정렬 · 기간 검색',
      '별표 저장 & 개발자 메모 기능',
    ],
    image: '/images/feature-dashboard.jpeg',
    accent: '#22c55e',
  },
]

function FeatureImage({ src, alt, accent }) {
  const isVideo = src.endsWith('.mov') || src.endsWith('.mp4') || src.endsWith('.webm')
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${accent}30`,
        boxShadow: `var(--shadow-lg), 0 0 40px ${accent}18`,
        backgroundColor: 'var(--bg-sub)',
        height: 360,
      }}
    >
      {isVideo ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover block"
          style={{ position: 'absolute', inset: 0 }}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover block"
          loading="lazy"
          style={{ position: 'absolute', inset: 0 }}
        />
      )}
    </div>
  )
}

export default function CoreCapabilities() {
  return (
    <section id="capabilities" className="py-24 px-6 lg:px-8 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto space-y-28">

        {/* 섹션 헤더 */}
        <div className="text-center reveal-up">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>
            Core Capabilities
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ color: 'var(--heading)' }}>핵심 기능</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text)' }}>
            리뷰 수집부터 인사이트 생성, 대시보드 확인까지 하나의 흐름으로 연결됩니다.
          </p>
        </div>

        {/* 피처 교차 레이아웃 */}
        {features.map((feature, index) => {
          const isEven = index % 2 === 0
          return (
            <div
              key={feature.tag}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center reveal-up"
            >
              {/* 텍스트 */}
              <div className={`space-y-6 ${!isEven ? 'lg:order-2' : ''}`}>
                <span
                  className="inline-block px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${feature.accent}18`,
                    color: feature.accent,
                    border: `1px solid ${feature.accent}40`,
                  }}
                >
                  {feature.tag}
                </span>

                <h3
                  className="text-3xl lg:text-4xl font-black leading-tight whitespace-pre-line"
                  style={{ color: 'var(--heading)' }}
                >
                  {feature.title}
                </h3>

                <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
                  {feature.desc}
                </p>

                <ul className="space-y-3 pt-2">
                  {feature.points.map(point => (
                    <li key={point} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text)' }}>
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold"
                        style={{ backgroundColor: `${feature.accent}20`, color: feature.accent }}
                      >
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 이미지 */}
              <div className={!isEven ? 'lg:order-1' : ''}>
                <FeatureImage src={feature.image} alt={feature.tag} accent={feature.accent} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
