import { useState } from 'react'

// ── geometry ──────────────────────────────────────────────────────────────────
const CX = 500, CY = 280
const R_OUT = 230, R_IN = 160, R_MID = 193, R_ARW = 193

function d2r(deg) { return (deg - 90) * Math.PI / 180 }
function xy(r, deg) {
  const a = d2r(deg)
  return [+(CX + r * Math.cos(a)).toFixed(1), +(CY + r * Math.sin(a)).toFixed(1)]
}

// Filled arc-ring segment (a1 → a2, clockwise)
function segPath(a1, a2) {
  const [ox1, oy1] = xy(R_OUT, a1), [ox2, oy2] = xy(R_OUT, a2)
  const [ix1, iy1] = xy(R_IN,  a1), [ix2, iy2] = xy(R_IN,  a2)
  const lg = ((a2 - a1 + 360) % 360) > 180 ? 1 : 0
  return `M${ox1} ${oy1} A${R_OUT} ${R_OUT} 0 ${lg} 1 ${ox2} ${oy2} L${ix2} ${iy2} A${R_IN} ${R_IN} 0 ${lg} 0 ${ix1} ${iy1} Z`
}

// Mid-radius arc for textPath (optionally reversed)
function tpD(a1, a2, rev) {
  const [x1, y1] = xy(R_MID, rev ? a2 : a1)
  const [x2, y2] = xy(R_MID, rev ? a1 : a2)
  const lg = ((a2 - a1 + 360) % 360) > 180 ? 1 : 0
  return `M${x1} ${y1} A${R_MID} ${R_MID} 0 ${lg} ${rev ? 0 : 1} ${x2} ${y2}`
}

// Clockwise-pointing arrow triangle at gap angle
function arrowPts(deg) {
  const S = 10, W = 8
  const [cx, cy] = xy(R_ARW, deg)
  const a = d2r(deg)
  const tx = -Math.sin(a), ty = Math.cos(a)  // CW tangent
  const nx = -ty,          ny = tx            // left normal
  return [
    [cx + S * tx,           cy + S * ty          ],
    [cx - S * tx + W * nx,  cy - S * ty + W * ny ],
    [cx - S * tx - W * nx,  cy - S * ty - W * ny ],
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

// ── data ──────────────────────────────────────────────────────────────────────
// Angle convention: 0° = 12 o'clock, increases clockwise
// Entry gap: 261°–279° (left, 9 o'clock). 5 × 62° arcs + 4 × 8° gaps + 1 × 18° entry = 360°
const STEPS = [
  {
    id: 'reviews',   title: '리뷰 수집',    short: '리뷰 수집',
    a1: 279, a2: 341, gapDeg: 345, rev: false,
    tipX: 20,  tipY: 28,
    desc: 'Steam 리뷰 본문, 작성일, 추천 수, 평점, 플레이 시간 등 개발 판단에 필요한 신호를 모읍니다.',
  },
  {
    id: 'patch',     title: '패치 연결',    short: '패치 연결',
    a1: 349, a2:  51, gapDeg:  55, rev: false,
    tipX: 742, tipY: 28,
    desc: '리뷰 시점과 패치 버전을 연결해 특정 업데이트 이후의 반응인지 확인합니다.',
  },
  {
    id: 'ranking',   title: '리뷰 선별',    short: '리뷰 선별',
    a1:  59, a2: 121, gapDeg: 125, rev: false,
    tipX: 745, tipY: 222,
    desc: '패치 관련성, 구체성, 유용성 점수를 바탕으로 개발자가 먼저 볼 리뷰를 정렬합니다.',
  },
  {
    id: 'llm',       title: 'LLM 인사이트', short: 'LLM 분석',
    a1: 129, a2: 191, gapDeg: 195, rev: true,
    tipX: 652, tipY: 428,
    desc: '선별된 리뷰를 카테고리, 요약, 개발자 가치, 액션 힌트로 구조화합니다.',
  },
  {
    id: 'dashboard', title: '대시보드 반영', short: '대시보드',
    a1: 199, a2: 261, gapDeg: null, rev: true,
    tipX: 20,  tipY: 398,
    desc: '인사이트 카드, 차트, Top Reviews, 기간 필터로 바로 확인할 수 있게 시각화합니다.',
  },
]

// Entry gap: left side (270°)
const [entryX] = xy(R_OUT, 270)   // outer edge x at 9 o'clock

// ── component ─────────────────────────────────────────────────────────────────
export default function InsightArchitecture() {
  const [active, setActive] = useState(null)
  const flowItems = ['게임 입력', ...STEPS.map(s => s.short)]
  const activeStep = STEPS.find(s => s.id === active)

  return (
    <section className="py-24 px-6 lg:px-8 border-t"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center max-w-4xl mx-auto mb-14 reveal-up">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--accent)' }}>Insight Architecture</p>
          <h2 className="text-4xl lg:text-5xl font-black mb-5 leading-tight"
            style={{ color: 'var(--heading)' }}>
            게임 리뷰 분석을 위한 end-to-end 구조
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
            게임을 입력하면 리뷰 수집, 패치 연결, LLM 분석, 대시보드 반영까지 하나의 분석 흐름으로 이어집니다.
          </p>
        </div>

        <div className="architecture-window">
          <div className="architecture-titlebar">
            <div className="flex items-center gap-2">
              <span className="steam-dot bg-[#ff5f57]" />
              <span className="steam-dot bg-[#febc2e]" />
              <span className="steam-dot bg-[#28c840]" />
            </div>
            <div className="text-[11px] font-semibold tracking-[0.18em]"
              style={{ color: 'var(--text-muted)' }}>PATCH LENS ARCHITECTURE VIEW</div>
            <div className="text-[11px]" style={{ color: 'var(--accent)' }}>flow</div>
          </div>

          <div className="architecture-orbit">
            <svg viewBox="0 0 1000 580" className="architecture-orbit-svg">
              <defs>
                <filter id="orbitGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {STEPS.map(s => (
                  <path key={`tp-${s.id}`} id={`tp-${s.id}`} d={tpD(s.a1, s.a2, s.rev)} />
                ))}
              </defs>

              {/* ── Arc segments ── */}
              {STEPS.map(s => {
                const on = active === s.id
                return (
                  <g key={s.id} style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setActive(s.id)}
                    onMouseLeave={() => setActive(null)}>
                    <path
                      d={segPath(s.a1, s.a2)}
                      fill={on ? '#7ec7ff' : '#5aa3ed'}
                      style={{ transition: 'fill 0.22s' }}
                    />
                    <text
                      dy="5"
                      fill={on ? '#001a2e' : 'rgba(255,255,255,0.88)'}
                      fontSize="14"
                      fontWeight="800"
                      textAnchor="middle"
                      style={{
                        fontFamily: 'Noto Sans KR, sans-serif',
                        transition: 'fill 0.22s',
                        userSelect: 'none',
                        pointerEvents: 'none',
                        letterSpacing: '0.06em',
                      }}
                    >
                      <textPath href={`#tp-${s.id}`} startOffset="50%">
                        {s.title}
                      </textPath>
                    </text>
                  </g>
                )
              })}

              {/* ── Gap arrows ── */}
              {STEPS.filter(s => s.gapDeg !== null).map(s => (
                <polygon key={`arr-${s.id}`} points={arrowPts(s.gapDeg)}
                  fill="#c8e8ff" style={{ pointerEvents: 'none' }} />
              ))}

              {/* ── Inner dark circle ── */}
              <circle cx={CX} cy={CY} r="152"
                fill="#0d1520" stroke="#2a4a6e" strokeWidth="2" />
              <circle cx={CX} cy={CY} r="148"
                fill="none" stroke="#355fce" strokeWidth="2" strokeOpacity=".7" />

              {/* ── Center icons ── */}
              <g filter="url(#orbitGlow)">
                <ellipse cx={CX} cy={CY - 88} rx="24" ry="8"
                  fill="none" stroke="#75d979" strokeWidth="4.5" />
                <path
                  d={`M${CX - 24} ${CY - 88} v30 c0 5.5 10 9 24 9 s24-3.5 24-9 v-30 M${CX - 24} ${CY - 72} c0 5.5 10 9 24 9 s24-3.5 24-9`}
                  fill="none" stroke="#75d979" strokeWidth="4.5" strokeLinecap="round"
                />
                <text x={CX} y={CY - 15} textAnchor="middle"
                  fill="var(--heading)" fontSize="22" fontWeight="800"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>데이터</text>
                <path d={`M${CX - 62} ${CY + 4} H${CX + 62}`}
                  stroke="var(--accent)" strokeWidth="1.5" strokeOpacity=".6" />
                <text x={CX} y={CY + 36} textAnchor="middle"
                  fill="var(--heading)" fontSize="22" fontWeight="800"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>개발자</text>
                <circle cx={CX}      cy={CY + 68} r="13" fill="#75d979" />
                <circle cx={CX - 22} cy={CY + 78} r="11" fill="#75d979" />
                <circle cx={CX + 22} cy={CY + 78} r="11" fill="#75d979" />
                <path
                  d={`M${CX - 34} ${CY + 108} c0-20 14-32 34-32 s34 12 34 32 c-14 10-54 10-68 0z`}
                  fill="#75d979"
                />
              </g>

              {/* ── Arc-adjacent tooltip on hover ── */}
              {activeStep && (
                <foreignObject x={activeStep.tipX} y={activeStep.tipY} width="220" height="220"
                  style={{ pointerEvents: 'none' }}>
                  <div style={{
                    display: 'inline-block',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '13px 16px',
                    borderRadius: 11,
                    border: '1px solid rgba(102,192,244,0.38)',
                    background: 'rgba(9,16,26,0.95)',
                  }}>
                    <div style={{
                      color: '#7ec7ff',
                      fontSize: 11,
                      fontWeight: 900,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: 9,
                    }}>
                      {activeStep.title}
                    </div>
                    <div style={{
                      color: '#cde8ff',
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 1.85,
                      wordBreak: 'keep-all',
                    }}>
                      {activeStep.desc}
                    </div>
                  </div>
                </foreignObject>
              )}

              {/* ── 게임 입력 entry ── */}
              <text x="44" y={CY - 10} fill="#7ec7ff" fontSize="26" fontWeight="900"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>게임 입력</text>
              <path
                d={`M44 ${CY + 2} H${entryX - 6}`}
                fill="none" stroke="#7ec7ff" strokeWidth="3" strokeLinecap="round"
              />
              <path
                d={`M${entryX - 16} ${CY - 9} L${entryX - 3} ${CY + 2} L${entryX - 16} ${CY + 13}`}
                fill="none" stroke="#7ec7ff" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>

          </div>
        </div>

        {/* Mobile fallback list */}
        <div className="architecture-step-list">
          {STEPS.map(s => (
            <div key={s.id} className="architecture-step-item">
              <div className="architecture-step-title">{s.title}</div>
              <div className="architecture-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* 3-stage value flow */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 0, marginTop: 48, flexWrap: 'wrap', rowGap: 16,
        }}>
          {/* Stage 1 */}
          <div style={{
            padding: '22px 36px', borderRadius: 14, textAlign: 'center', minWidth: 200,
            border: '1.5px solid var(--border)', background: 'var(--bg-card)',
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--heading)', marginBottom: 6 }}>유저</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Steam 플레이어</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>리뷰 작성 · 평가</div>
          </div>

          <div style={{ fontSize: 24, color: 'var(--accent)', padding: '0 16px', flexShrink: 0 }}>▶</div>

          {/* Stage 2 — Patch Lens 제공 */}
          <div style={{
            padding: '22px 36px', borderRadius: 14, textAlign: 'center', minWidth: 260,
            border: '2px solid var(--accent)', background: 'rgba(53,95,206,0.10)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--accent)', color: '#fff',
              fontSize: 11, fontWeight: 900, letterSpacing: '0.12em',
              padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap',
            }}>PATCH LENS 제공</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)', marginBottom: 6 }}>분석</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--heading)', marginBottom: 6 }}>자동 파이프라인</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
              리뷰 수집 · 패치 연결<br />리뷰 선별 · LLM 인사이트
            </div>
          </div>

          <div style={{ fontSize: 24, color: 'var(--accent)', padding: '0 16px', flexShrink: 0 }}>▶</div>

          {/* Stage 3 */}
          <div style={{
            padding: '22px 36px', borderRadius: 14, textAlign: 'center', minWidth: 200,
            border: '1.5px solid var(--border)', background: 'var(--bg-card)',
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--heading)', marginBottom: 6 }}>활용</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>게임 개발자</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>인사이트 기반 의사결정</div>
          </div>
        </div>

      </div>
    </section>
  )
}
