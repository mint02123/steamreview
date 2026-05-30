const footerGroups = [
  {
    title: '제품',
    items: ['서비스 소개', '리뷰 인사이트', '개발자 대시보드', '활용 시나리오'],
  },
  {
    title: '분석 기능',
    items: ['패치 연관 리뷰 탐색', '카테고리 분류', '유용성 점수화', '개발 액션 제안'],
  },
  {
    title: '리소스',
    items: ['Steam 리뷰', '패치노트', '인사이트 카드', '리뷰 우선순위'],
  },
]

export default function Footer() {
  return (
    <footer className="border-t py-16 px-6 lg:px-8" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_2fr] gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--logo-text)' }}>
                PL
              </div>
              <span className="font-bold text-sm" style={{ color: 'var(--heading)' }}>Patch Lens</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-muted)' }}>
              Patch Lens는 Steam 리뷰와 패치노트를 연결해 개발자가 먼저 확인해야 할 반응을 구조화합니다.
              리뷰의 흐름, 주요 불만, 개선 액션을 한 화면에서 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerGroups.map(group => (
              <div key={group.title}>
                <h4 className="font-semibold text-sm mb-4 tracking-wider" style={{ color: 'var(--heading)' }}>{group.title}</h4>
                <ul className="space-y-2">
                  {group.items.map(item => (
                    <li key={item}>
                      <span className="text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <span>2026 Patch Lens. Review intelligence for game updates.</span>
          <span>Built for data-driven patch decisions.</span>
        </div>
      </div>
    </footer>
  )
}
