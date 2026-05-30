function AiDiagram() {
  const colors = {
    window: '#111a25',
    topbar: '#171f2a',
    cardBg: '#0f1924',
    cardBdr: '#2f4a63',
    accent: '#66c0f4',
    text: '#ecf6ff',
    muted: '#9db4c7',
    center: '#0b1622',
    panel: '#182635',
  }
  const inputs = [
    ['패치노트', '매치메이킹 안정화 업데이트', 'v2.1.3'],
    ['Steam 리뷰', '큐 대기 시간이 20분을 넘어요', 'helpful 142'],
    ['Steam 리뷰', 'Pyro 피해량이 너무 강해요', 'helpful 89'],
    ['패치노트', '제작 메뉴 추가', 'v2.1.0'],
    ['Steam 리뷰', '새 제작 메뉴에서 게임이 꺼져요', 'helpful 44'],
  ]
  const outputs = [
    ['버그', '#ff4f5f', '38건'],
    ['밸런스', '#f7a431', '21건'],
    ['QoL', '#57b96b', '17건'],
    ['기능 요청', '#4d83ff', '15건'],
  ]

  return (
    <div className="steam-window">
      <div className="steam-titlebar" style={{ backgroundColor: colors.topbar }}>
        <div className="flex items-center gap-2">
          <span className="steam-dot bg-[#ff5f57]" />
          <span className="steam-dot bg-[#febc2e]" />
          <span className="steam-dot bg-[#28c840]" />
        </div>
        <div className="text-[11px] font-semibold tracking-[0.16em]" style={{ color: colors.muted }}>
          PATCH LENS REVIEW VIEW
        </div>
        <div className="text-[11px]" style={{ color: colors.accent }}>preview</div>
      </div>
      <svg viewBox="0 0 800 500" width="100%" className="block" aria-hidden="true">
        <defs>
          <radialGradient id="heroCenterKorean" cx="38%" cy="35%" r="70%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity=".42" />
            <stop offset="100%" stopColor={colors.center} />
          </radialGradient>
          <linearGradient id="steamPanelKorean" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.window} />
            <stop offset="100%" stopColor={colors.panel} />
          </linearGradient>
          <filter id="softGlowKorean" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="800" height="500" fill="url(#steamPanelKorean)" />
        <path d="M0 76 H800 M0 394 H800" stroke={colors.cardBdr} strokeOpacity=".32" />
        <text x="34" y="48" fill={colors.text} fontSize="22" fontWeight="800">리뷰 인사이트 미리보기</text>
        <text x="646" y="48" fill={colors.accent} fontSize="12" fontWeight="700" letterSpacing="2">READY</text>

        <circle cx="430" cy="252" r="112" fill={colors.accent} opacity=".08" />
        <circle cx="430" cy="252" r="72" fill="url(#heroCenterKorean)" stroke={colors.accent} strokeWidth="2" filter="url(#softGlowKorean)" />
        <circle cx="430" cy="252" r="54" fill="none" stroke={colors.accent} strokeOpacity=".25" strokeDasharray="5 5" />
        <text x="430" y="245" textAnchor="middle" fill={colors.text} fontSize="19" fontWeight="800">PRIS-RHP</text>
        <text x="430" y="272" textAnchor="middle" fill={colors.muted} fontSize="13">Framework</text>

        {[94, 160, 226, 292, 358].map((y, index) => (
          <g key={inputs[index][1]}>
            <rect x="34" y={y} width="288" height="58" rx="9" fill={colors.cardBg} stroke={colors.cardBdr} strokeWidth="1.2" />
            <rect x="34" y={y} width="4" height="58" rx="2" fill={index % 3 === 0 ? colors.accent : '#2f89c5'} />
            <text x="54" y={y + 21} fill={colors.accent} fontSize="11" fontWeight="800" letterSpacing="1.4">
              {inputs[index][0]}
            </text>
            <text x="54" y={y + 42} fill={colors.text} fontSize="15" fontWeight="700">
              {inputs[index][1]}
            </text>
            <text x="248" y={y + 21} fill={colors.muted} fontSize="10" textAnchor="end">
              {inputs[index][2]}
            </text>
            <path d={`M 322 ${y + 29} C 365 ${y + 29}, 360 252, 358 252`} fill="none" stroke={colors.accent} strokeOpacity=".42" strokeDasharray="7 6" className="flow-line" />
          </g>
        ))}

        {outputs.map(([label, color, count], index) => {
          const y = 124 + index * 70
          return (
            <g key={label}>
              <path d={`M 502 252 C 552 252, 552 ${y + 22}, 604 ${y + 22}`} fill="none" stroke={color} strokeOpacity=".48" strokeDasharray="7 6" className="flow-line" />
              <rect x="604" y={y} width="164" height="46" rx="23" fill={`${color}20`} stroke={color} strokeOpacity=".68" />
              <circle cx="626" cy={y + 23} r="6" fill={color} />
              <text x="644" y={y + 21} fill={color} fontSize="16" fontWeight="800">{label}</text>
              <text x="644" y={y + 36} fill={colors.muted} fontSize="10">{count}</text>
            </g>
          )
        })}

        {[
          ['762K', 'Steam 전체 리뷰'],
          ['0.369', 'MAE (최저)'],
          ['5', '인사이트'],
        ].map(([value, label], index) => (
          <g key={label}>
            <rect x={34 + index * 168} y="426" width="148" height="36" rx="6" fill={colors.cardBg} stroke={colors.cardBdr} strokeOpacity=".65" />
            <text x={50 + index * 168} y="448" fill={colors.accent} fontSize="12" fontWeight="700">
              {value} {label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function Hero() {
  const goFinalCta = () => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="relative min-h-[76vh] pt-40 pb-12 px-6 lg:px-8 overflow-hidden steam-hero">
      <div className="steam-sheen" />
      <div className="relative max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.86fr_1.14fr] gap-10 xl:gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
            Patch-aware review intelligence
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-[1.12] mb-6 tracking-tight"
            style={{ color: 'var(--heading)' }}>
            게임 리뷰를<br />
            개발자가 바로 쓰는<br />
            <span className="gradient-text">패치 인사이트로</span>
          </h1>

          <p className="text-lg mb-9 leading-relaxed max-w-xl" style={{ color: 'var(--text)' }}>
            Steam 리뷰와 패치노트를 연결해 업데이트 반응을 한눈에 보여줍니다.
            중요한 리뷰, 분류 결과, 개발 액션 힌트를 발표용 대시보드처럼 확인할 수 있습니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <button
              onClick={goFinalCta}
              className="glow-button px-6 py-3 rounded-xl text-sm font-semibold text-center transition-opacity duration-200 hover:opacity-85"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--logo-text)' }}>
              대시보드 둘러보기
            </button>
            <button onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-xl text-sm font-semibold border steam-card-hover"
              style={{ color: 'var(--text)', borderColor: 'var(--border)', backgroundColor: 'transparent' }}>
              기능 구조 보기
            </button>
          </div>

          <div className="grid grid-cols-3 gap-5 max-w-lg">
            {[
              { value: '762K', label: 'Steam 전체 리뷰' },
              { value: '0.369', label: 'MAE (최저)' },
              { value: '5', label: '핵심 인사이트' },
            ].map(metric => (
              <div key={metric.label}>
                <div className="metric-glow text-3xl font-bold" style={{ color: 'var(--accent)' }}>{metric.value}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[860px] ml-auto lg:translate-x-8 xl:translate-x-14">
          <AiDiagram />
        </div>
      </div>
    </section>
  )
}
