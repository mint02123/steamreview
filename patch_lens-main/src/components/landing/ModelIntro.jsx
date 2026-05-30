import { useEffect, useRef, useState } from 'react'

// ── Step definitions ──────────────────────────────────────────────
const STEPS = [
  { id: 'relevance', label: '패치 연관성 분석', log: 'patch_relevance   = 0.87',     color: '#22c55e', delay: 0    },
  { id: 'usefulness',label: '유용성 점수 계산', log: 'usefulness_signal = 3.92',     color: '#66c0f4', delay: 720  },
  { id: 'evidence',  label: '근거 강도 측정',   log: 'evidence_level    = STRONG',   color: '#a78bfa', delay: 1440 },
  { id: 'helpful',   label: '추천 수 반영',     log: 'helpful_weight    = 0.44×105', color: '#f59e0b', delay: 2160 },
  { id: 'final',     label: '종합 점수 산출',   log: 'final_score       = 3.92/4.0', color: '#66d87a', delay: 2880 },
]

// ── Review text segments with feature tags ────────────────────────
const SEGMENTS = [
  { text: '패치 이후 ',                                           feat: 'relevance'  },
  { text: '스토리 분기·베이스 건설·화물선 등 구체적 업데이트 항목', feat: 'evidence'   },
  { text: '을 열거식으로 언급했습니다. ',                          feat: null         },
  { text: '105명',                                                feat: 'helpful'    },
  { text: '의 "도움됨" 반응과 ',                                   feat: null         },
  { text: '관련성 점수 93%',                                      feat: 'relevance'  },
  { text: '가 복합적으로 높은 ',                                   feat: null         },
  { text: '유용성 점수',                                          feat: 'usefulness' },
  { text: '를 견인했습니다.',                                      feat: null         },
]

const FEAT_COLOR = {
  relevance:  '#22c55e',
  usefulness: '#66c0f4',
  evidence:   '#a78bfa',
  helpful:    '#f59e0b',
}

// ── Animated arc gauge ────────────────────────────────────────────
function AnimatedGauge({ score, size = 148 }) {
  const max = 4
  const r = size * 0.37
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const arcLen = circ * 0.75
  const fill = arcLen * Math.min(1, score / max)
  const sw = size * 0.09
  const color = score >= 3 ? '#22c55e' : score >= 2 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <defs>
        <filter id="gaugeGlow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={sw}
        strokeDasharray={`${arcLen} ${circ}`} strokeLinecap="round"
        transform={`rotate(135,${cx},${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        transform={`rotate(135,${cx},${cy})`}
        filter="url(#gaugeGlow)" />
      <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size * 0.2} fontWeight="900" fontFamily="inherit">
        {score.toFixed(2)}
      </text>
      <text x={cx} y={cy + size * 0.17} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(200,210,220,0.3)" fontSize={size * 0.09} fontWeight="600" fontFamily="inherit">
        / 4.0
      </text>
    </svg>
  )
}

// ── Animated flow arrow ───────────────────────────────────────────
function FlowArrow({ active, done }) {
  const c = active || done ? 'var(--accent)' : 'rgba(255,255,255,0.1)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 52 }}>
      <svg width="52" height="24" viewBox="0 0 52 24" overflow="visible">
        <line x1="0" y1="12" x2="38" y2="12"
          stroke={c} strokeWidth="1.5"
          strokeDasharray={active ? '5 4' : 'none'}
          style={{ transition: 'stroke 0.4s' }} />
        <polygon points="52,12 38,6 38,18"
          fill={c} style={{ transition: 'fill 0.4s' }} />
        {active && (
          <circle r="3.5" fill="var(--accent)" opacity="0.9">
            <animateMotion dur="0.85s" repeatCount="indefinite" path="M0,12 L38,12" />
          </circle>
        )}
      </svg>
    </div>
  )
}

// ── Terminal line ─────────────────────────────────────────────────
function TermLine({ text, color, cursor = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Fira Code","Cascadia Code","Consolas",monospace', fontSize: 12, lineHeight: 1.6 }}>
      <span style={{ color: 'rgba(102,192,244,0.4)', flexShrink: 0 }}>{'>'}</span>
      <span style={{ color: color || 'rgba(198,212,223,0.7)', flex: 1 }}>{text}</span>
      {cursor && <span style={{ width: 7, height: 14, backgroundColor: 'var(--accent)', opacity: 0.8, animation: 'blink 1s step-end infinite', flexShrink: 0 }} />}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function ModelIntro() {
  const [stepIdx, setStepIdx] = useState(-1)   // -1 idle, 0-4 steps, 99 done
  const [running, setRunning] = useState(false)
  const [gaugeScore, setGaugeScore] = useState(0)
  const [gaugeRunning, setGaugeRunning] = useState(false)
  const timersRef = useRef([])

  const activeFeats = stepIdx >= 0
    ? new Set(STEPS.slice(0, Math.min(stepIdx + 1, STEPS.length)).map(s => s.id))
    : new Set()
  const isDone = stepIdx === 99
  const arrow1Active = running && stepIdx >= 0 && stepIdx < 99
  const arrow1Done   = isDone
  const arrow2Active = running && stepIdx >= STEPS.length - 1 && stepIdx !== 99
  const arrow2Done   = isDone

  const logLines = stepIdx >= 0
    ? STEPS.slice(0, Math.min(stepIdx + 1, STEPS.length))
    : []

  const startDemo = () => {
    if (running) return
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setStepIdx(-1)
    setRunning(true)
    setGaugeScore(0)
    setGaugeRunning(false)

    STEPS.forEach((s, i) => {
      const t = setTimeout(() => {
        setStepIdx(i)
        if (i === STEPS.length - 1) {
          const t2 = setTimeout(() => setGaugeRunning(true), 380)
          const t3 = setTimeout(() => { setStepIdx(99); setRunning(false) }, 2300)
          timersRef.current.push(t2, t3)
        }
      }, s.delay + 150)
      timersRef.current.push(t)
    })
  }

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  // Gauge rAF animation
  const rafRef = useRef(null)
  useEffect(() => {
    if (!gaugeRunning) return
    let start = null
    const dur = 1900
    const target = 3.92
    const frame = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setGaugeScore(parseFloat((eased * target).toFixed(3)))
      if (p < 1) rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [gaugeRunning])

  return (
    <section className="py-24 px-6 lg:px-8 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-up">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--accent)' }}>Insight Pipeline</p>
          <h2 className="text-4xl lg:text-5xl font-black mb-5 leading-tight" style={{ color: 'var(--heading)' }}>
            Steam 리뷰에서<br />개발 인사이트를 추출합니다
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
            패치 연관성·근거 강도·추천 수를 조합해 리뷰별 유용성 점수를 계산하고, 전체 리뷰 풀 내 상대 순위로 어떤 리뷰가 실제로 가치 있는지 판단합니다.
          </p>
        </div>

        {/* Demo window */}
        <div style={{ borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', backgroundColor: 'var(--bg-card)', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>

          {/* Title bar */}
          <div style={{
            padding: '13px 22px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => (
                  <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: c, display: 'block' }} />
                ))}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>
                PATCH LENS · MODEL DEMO
              </span>
            </div>
            <button
              onClick={startDemo}
              style={{
                padding: '7px 22px', borderRadius: 20, fontSize: 12, fontWeight: 800,
                backgroundColor: running ? 'transparent' : 'var(--accent)',
                color: running ? 'var(--accent)' : '#0b1622',
                border: `1px solid ${running ? 'var(--accent-border)' : 'transparent'}`,
                cursor: running ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s',
              }}
            >
              {running ? '분석 중...' : isDone ? '다시 실행 ↺' : '분석 시작 ▶'}
            </button>
          </div>

          {/* Three panels */}
          <div style={{ display: 'flex', alignItems: 'stretch' }}>

            {/* ── LEFT: Input ── */}
            <div style={{ flex: '0 0 38%', padding: '28px 28px', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 18 }}>
                Input · 리뷰 원문
              </div>
              <div style={{
                padding: '18px 20px', borderRadius: 14,
                backgroundColor: 'var(--bg)', border: '1px solid var(--border)',
              }}>
                {/* Reviewer header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: 'rgba(102,192,244,0.14)', border: '1px solid rgba(102,192,244,0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 900, color: '#66c0f4',
                  }}>S</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--heading)' }}>ShadowBlade_92</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>2024.03.15 · helpful 105 · 318h</div>
                  </div>
                </div>

                {/* Highlighted text */}
                <p style={{ fontSize: 13, lineHeight: 1.85, paddingLeft: 12, borderLeft: '2px solid var(--accent)', marginBottom: 14 }}>
                  {SEGMENTS.map((seg, i) => {
                    const isActive = seg.feat && activeFeats.has(seg.feat)
                    const col = seg.feat ? FEAT_COLOR[seg.feat] : null
                    return (
                      <span key={i} style={{
                        color: isActive ? col : 'var(--text)',
                        backgroundColor: isActive ? `${col}18` : 'transparent',
                        borderRadius: 3,
                        padding: isActive ? '1px 2px' : '0',
                        boxShadow: isActive ? `0 0 10px ${col}40` : 'none',
                        transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                        fontWeight: isActive ? 700 : 400,
                      }}>{seg.text}</span>
                    )
                  })}
                </p>

                {/* Feature legend */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.entries(FEAT_COLOR).map(([feat, color]) => {
                    const isOn = activeFeats.has(feat)
                    return (
                      <span key={feat} style={{
                        padding: '2px 8px', borderRadius: 6,
                        fontSize: 11, fontWeight: 700,
                        backgroundColor: isOn ? `${color}20` : 'rgba(255,255,255,0.04)',
                        color: isOn ? color : 'rgba(198,212,223,0.3)',
                        border: `1px solid ${isOn ? `${color}40` : 'rgba(255,255,255,0.06)'}`,
                        transition: 'all 0.4s',
                      }}>
                        {feat === 'relevance' ? '패치 연관' : feat === 'usefulness' ? '유용성' : feat === 'evidence' ? '근거 강도' : '추천 수'}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Arrow 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 52, borderRight: '1px solid var(--border)' }}>
              <FlowArrow active={arrow1Active} done={arrow1Done} />
            </div>

            {/* ── MIDDLE: Processing ── */}
            <div style={{ flex: '0 0 32%', padding: '28px 24px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 18 }}>
                Model Processing
              </div>

              {/* Terminal */}
              <div style={{
                flex: 1, padding: '16px 18px', borderRadius: 12,
                backgroundColor: '#060c14', border: '1px solid rgba(255,255,255,0.07)',
                fontFamily: '"Fira Code","Cascadia Code","Consolas",monospace',
                display: 'flex', flexDirection: 'column', gap: 4, minHeight: 220,
              }}>
                <TermLine text="Initializing analysis..." color="rgba(198,212,223,0.35)" />
                {logLines.map((s, i) => (
                  <TermLine
                    key={s.id}
                    text={s.log}
                    color={s.color}
                    cursor={i === logLines.length - 1 && !isDone && running}
                  />
                ))}
                {isDone && (
                  <TermLine
                    text={'rank = #1/100 · top_pct = 1%'}
                    color="#22c55e"
                  />
                )}
                {!isDone && (running || stepIdx >= 0) && logLines.length < STEPS.length && (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                    <span style={{ color: 'rgba(102,192,244,0.4)' }}>{'>'}</span>
                    <span style={{ width: 7, height: 14, backgroundColor: 'var(--accent)', opacity: 0.8, animation: 'blink 1s step-end infinite', display: 'inline-block' }} />
                  </div>
                )}
                {stepIdx === -1 && !running && (
                  <div style={{ color: 'rgba(198,212,223,0.2)', fontSize: 12 }}>
                    _ 대기 중
                  </div>
                )}
              </div>

              {/* Step progress indicators */}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {STEPS.map((s, i) => {
                  const isActive = stepIdx >= i && stepIdx !== -1
                  return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        backgroundColor: isActive ? s.color : 'rgba(255,255,255,0.1)',
                        boxShadow: isActive ? `0 0 6px ${s.color}` : 'none',
                        transition: 'all 0.3s',
                      }} />
                      <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: isActive ? `${STEPS[i] === STEPS.find(s => s.id === 'relevance') ? 87 : s.id === 'usefulness' ? 94 : s.id === 'evidence' ? 72 : s.id === 'helpful' ? 58 : 96}%` : '0%',
                          backgroundColor: s.color,
                          borderRadius: 2,
                          boxShadow: `0 0 6px ${s.color}60`,
                          transition: 'width 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                        }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? s.color : 'rgba(198,212,223,0.2)', transition: 'color 0.3s', flexShrink: 0, minWidth: 88, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Arrow 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 52, borderRight: '1px solid var(--border)' }}>
              <FlowArrow active={arrow2Active} done={arrow2Done} />
            </div>

            {/* ── RIGHT: Output ── */}
            <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 18 }}>
                Output · 분석 결과
              </div>

              <div style={{
                flex: 1, borderRadius: 14,
                backgroundColor: 'var(--bg)',
                border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                transition: 'border-color 0.6s, box-shadow 0.6s',
                boxShadow: isDone ? '0 0 32px rgba(34,197,94,0.1)' : 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 16, padding: '24px 20px', minHeight: 260,
              }}>
                {!isDone && !running && (
                  <div style={{ textAlign: 'center', color: 'rgba(198,212,223,0.25)', fontSize: 13, lineHeight: 1.9 }}>
                    분석 시작 버튼을<br />눌러보세요
                  </div>
                )}

                {running && !isDone && (
                  <>
                    <AnimatedGauge score={gaugeScore} size={130} />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {stepIdx >= 0 ? STEPS[Math.min(stepIdx, STEPS.length - 1)].label : '대기 중...'}
                    </div>
                  </>
                )}

                {isDone && (
                  <>
                    {/* Gauge fully filled */}
                    <div style={{ position: 'relative' }}>
                      <AnimatedGauge score={gaugeScore} size={130} />
                      {/* S badge overlay */}
                      <div style={{
                        position: 'absolute', bottom: -8, right: -8,
                        width: 36, height: 36, borderRadius: '50%',
                        backgroundColor: 'rgba(34,197,94,0.15)',
                        border: '2px solid rgba(34,197,94,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 900, color: '#22c55e',
                        boxShadow: '0 0 20px rgba(34,197,94,0.35)',
                        animation: 'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                      }}>S</div>
                    </div>

                    <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease forwards' }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--heading)', marginBottom: 4 }}>#1 순위</div>
                      <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>매우 높음 · 상위 1%</div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {[['유용성', '3.92', '#66c0f4'], ['관련성', '93%', '#22c55e'], ['근거', 'STRONG', '#a78bfa']].map(([l, v, c]) => (
                        <div key={l} style={{
                          padding: '8px 12px', borderRadius: 10,
                          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
                          textAlign: 'center', animation: 'fadeUp 0.5s ease forwards',
                        }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 3, whiteSpace: 'nowrap' }}>{l}</div>
                          <div style={{ fontSize: 13, fontWeight: 900, color: c, whiteSpace: 'nowrap' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes spin   { to{transform:rotate(360deg)} }
      `}</style>
    </section>
  )
}
