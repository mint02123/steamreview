import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CTA() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const openDashboard = () => {
    setIsLoading(true)
    setTimeout(() => navigate('/dashboard'), 650)
  }

  return (
    <section id="final-cta" className="py-28 px-6 lg:px-8 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
      {isLoading && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center" style={{ backgroundColor: 'rgba(7,13,22,0.88)', backdropFilter: 'blur(10px)' }}>
          <div className="w-[320px] rounded-xl border p-6 text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--accent-border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            <div className="text-lg font-black mb-1" style={{ color: 'var(--heading)' }}>대시보드 로딩 중</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>리뷰 인사이트 화면을 준비하고 있습니다</div>
          </div>
        </div>
      )}
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
          Insight-ready interface
        </div>
        <h2 className="text-4xl font-bold mb-4 leading-tight" style={{ color: 'var(--heading)' }}>
          리뷰 분석 결과를<br />바로 운영 화면으로 연결합니다
        </h2>
        <p className="mb-10 text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
          Patch Lens는 리뷰 수집, 분류, 요약, 개발 액션까지 이어지는 분석 흐름을 하나의 대시보드로 제공합니다.
          데이터 소스가 확장되어도 같은 화면 구조에서 인사이트를 일관되게 확인할 수 있습니다.
        </p>
        <div className="flex justify-center">
          <button
            onClick={openDashboard}
            className="glow-button px-8 py-3 rounded-xl text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--bg)' }}>
            대시보드 보기
          </button>
        </div>
      </div>
    </section>
  )
}
