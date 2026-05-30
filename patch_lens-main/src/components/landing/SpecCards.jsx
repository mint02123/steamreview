const specs = [
  { value: 'Steam', label: '리뷰 데이터 기반', desc: '대규모 사용자 반응을 제품 개선 신호로 재구성합니다.' },
  { value: 'Patch', label: '패치 맥락 연결', desc: '패치노트와 리뷰를 연결해 업데이트별 반응을 추적합니다.' },
  { value: '4 Types', label: '피드백 분류', desc: 'Bug, Balance, QoL, Feature Request로 바로 해석 가능한 구조를 만듭니다.' },
  { value: 'Top-K', label: '우선순위 큐', desc: '개발자가 먼저 읽을 리뷰와 인사이트를 선별해 보여줍니다.' },
]

export default function SpecCards() {
  return (
    <section id="intro" className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {specs.map(spec => (
          <div
            key={spec.label}
            className="p-6 rounded-xl border transition-all duration-300"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
          >
            <div className="text-2xl font-black mb-3" style={{ color: 'var(--accent)' }}>{spec.value}</div>
            <div className="font-semibold text-sm mb-2" style={{ color: 'var(--heading)', wordBreak: 'keep-all' }}>{spec.label}</div>
            <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', wordBreak: 'keep-all' }}>{spec.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
