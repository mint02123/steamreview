import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const TABS = [
  { id: 'background', label: '배경',      accent: '#66c0f4', num: '01' },
  { id: 'pipeline',   label: '파이프라인', accent: '#a78bfa', num: '02' },
  { id: 'comparison', label: '비교 모델', accent: '#22c55e', num: '03' },
  { id: 'impact',     label: '기대효과',  accent: '#f59e0b', num: '04' },
]

const CSS = `
  .pres-page, .pres-page * { word-break: keep-all; overflow-wrap: break-word; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounceY {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50%       { transform: translateY(10px); opacity: 1; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }
  @keyframes ctaPulse {
    0%, 100% { box-shadow: 0 8px 32px rgba(102,192,244,0.22); }
    50%       { box-shadow: 0 8px 52px rgba(102,192,244,0.48); }
  }
  @keyframes orbFloat1 {
    0%, 100% { transform: translate(0,0) scale(1); }
    33%       { transform: translate(30px,-22px) scale(1.06); }
    66%       { transform: translate(-12px,16px) scale(0.97); }
  }
  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0,0) scale(1); }
    40%       { transform: translate(-26px,22px) scale(1.05); }
    70%       { transform: translate(16px,-12px) scale(0.98); }
  }
  .pres-fadein  { animation: fadeInUp 0.4s cubic-bezier(.22,.68,0,1.1) both; }
  .pres-bounce  { animation: bounceY 2s ease-in-out infinite; }
  .pres-glow    { animation: glowPulse 2.4s ease-in-out infinite; }
  .pres-cta     { animation: ctaPulse 2.6s ease-in-out infinite; }
  .pres-orb1    { animation: orbFloat1 12s ease-in-out infinite; }
  .pres-orb2    { animation: orbFloat2  9s ease-in-out infinite; }

  .lift-card {
    transition: transform 0.22s ease, box-shadow 0.22s ease !important;
    cursor: default;
  }
  .lift-card:hover {
    transform: translateY(-5px) scale(1.01) !important;
    box-shadow: 0 16px 48px rgba(0,0,0,0.35) !important;
  }
  .module-row {
    transition: background-color 0.2s ease !important;
    border-radius: 12px;
  }
  .module-row:hover {
    background-color: rgba(255,255,255,0.04) !important;
  }
`

// ── Tab: 배경 (문제 정의) ──────────────────────────────────
function TabBackground() {
  const steps = [
    {
      step: '01', label: '배경', color: '#66c0f4',
      text: '글로벌 게임 시장은 2025년 1,888억 달러를 돌파하며 연평균 6.6%의 성장이 전망되는 거대 산업이다. 그러나 다양한 사용자층을 동시에 만족시키기는 구조적으로 어렵고, 게임 흥행은 결국 품질이 좌우한다.',
    },
    {
      step: '02', label: '한계', color: '#f59e0b',
      text: '기존 리뷰 유용성 연구는 소비자 구매 결정 관점에만 집중해왔다. 게임 도메인은 패치마다 리뷰 가치가 실시간으로 변화하는 동적 특성을 지니며, 정적 분석 전제로는 현재 즉각 반영해야 할 피드백을 선별할 수 없다.',
    },
    {
      step: '03', label: '필요성', color: '#22c55e',
      text: '개발자의 의도가 담긴 패치 노트와 리뷰 간 상관관계에 주목한 게임 도메인 특화 유용성 예측 모델 PRIS-RHP를 제안한다. 방대한 리뷰에서 개발자가 즉각 활용할 수 있는 피드백을 효과적으로 선별하고자 한다.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* 3단계 흐름 */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
        {steps.flatMap((item, i) => [
          <div key={item.step} className="lift-card" style={{
            flex: 1, padding: '26px 22px', borderRadius: 16, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(145deg, ${item.color}07 0%, rgba(255,255,255,0.015) 100%)`,
            border: `1px solid ${item.color}22`, borderTop: `3px solid ${item.color}`,
          }}>
            {/* Background glow blob */}
            <div style={{
              position: 'absolute', bottom: -24, right: -24,
              width: 100, height: 100, borderRadius: '50%',
              background: `radial-gradient(circle, ${item.color}18, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.15em', color: item.color, opacity: 0.65 }}>STEP {item.step}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: item.color,
                padding: '2px 9px', borderRadius: 5,
                background: `${item.color}15`, border: `1px solid ${item.color}30`,
              }}>{item.label}</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(198,212,223,0.7)', lineHeight: 1.75, margin: 0 }}>{item.text}</p>
          </div>,

          i < 2 && (
            <div key={`conn-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, flexShrink: 0 }}>
              <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                <path d="M0 8 H20" stroke="rgba(198,212,223,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
                <path d="M18 4 L26 8 L18 12" stroke="rgba(198,212,223,0.25)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
              </svg>
            </div>
          ),
        ])}
      </div>

      {/* 기존 vs 제안 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{
          padding: '24px 26px', borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(239,68,68,0.07) 0%, rgba(239,68,68,0.02) 100%)',
          border: '1px solid rgba(239,68,68,0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#ef4444' }}>기존 연구의 한계</span>
          </div>
          {[
            '리뷰 유용성 연구 대부분이 소비자 구매 결정 관점에 국한',
            '게임 도메인의 동적 특성(패치에 따른 리뷰 가치 변화) 미반영',
            '정적 분석 전제 → 현시점에 즉각 반영할 피드백 선별 불가',
            '개발자 관점의 유용성 예측 연구 자체가 극히 제한적',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 11, alignItems: 'flex-start' }}>
              <span style={{ color: '#ef4444', fontWeight: 900, flexShrink: 0, fontSize: 13, lineHeight: 1.65 }}>✗</span>
              <span style={{ fontSize: 12.5, color: 'rgba(198,212,223,0.6)', lineHeight: 1.65 }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{
          padding: '24px 26px', borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(34,197,94,0.07) 0%, rgba(34,197,94,0.02) 100%)',
          border: '1px solid rgba(34,197,94,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e' }}>본 연구의 제안</span>
          </div>
          {[
            '패치 노트–리뷰 상관관계를 명시적으로 모델에 반영',
            '개발자 관점의 리뷰 유용성을 직접 예측 대상으로 정의',
            '게임 리뷰의 동적 특성을 모델 구조에 내재화',
            '방대한 리뷰에서 즉각 활용 가능한 피드백을 자동 선별',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 11, alignItems: 'flex-start' }}>
              <span style={{ color: '#22c55e', fontWeight: 900, flexShrink: 0, fontSize: 13, lineHeight: 1.65 }}>✓</span>
              <span style={{ fontSize: 12.5, color: 'rgba(198,212,223,0.6)', lineHeight: 1.65 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Tab: 파이프라인 ────────────────────────────────────────
function TabPipeline() {
  const modules = [
    {
      num: '①', title: 'Embedding & Encoding', color: '#66c0f4',
      desc: 'BGE-large-en-v1.5로 리뷰와 패치노트를 각각 임베딩. 리뷰는 CLS 토큰(1024d)을 직접 추출하고, 패치노트는 chunking 후 mean pooling으로 단일 벡터(1024d)로 압축. 메타데이터(6d)·핸드크래프트 피처(4d)는 별도 스케일링.',
    },
    {
      num: '②', title: 'Element-wise Fusion', color: '#a78bfa',
      desc: '리뷰 벡터 r과 패치 벡터 p를 Hadamard(⊙, 의미 합치)와 차이(⊖, 의미 차이)로 결합. Concat(r, p, r⊙p, r⊖p) → 4096d 생성 후 Meta(6d)+HC(4d)를 추가 concat해 최종 4106d 표현 벡터 완성.',
    },
    {
      num: '③', title: 'Pyramid MLP Regressor', color: '#22c55e',
      desc: '4106→2048→1024→512→256→128→64→1로 차원을 절반씩 점진 축소. 급격한 압축 없이 정보 손실을 최소화하며, BN·GELU·Dropout을 매 레이어에 적용해 최종 유용성 점수를 회귀 예측.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#a78bfa', marginBottom: 10 }}>3단계 파이프라인 구조</div>
        <p style={{ fontSize: 13.5, color: 'rgba(198,212,223,0.55)', lineHeight: 1.8, margin: 0 }}>
          PRIS-RHP는 <strong style={{ color: 'rgba(236,246,255,0.8)' }}>리뷰</strong>·<strong style={{ color: 'rgba(236,246,255,0.8)' }}>패치노트</strong>·<strong style={{ color: 'rgba(236,246,255,0.8)' }}>리뷰어 메타데이터</strong>를 입력받아 개발자 관점의 유용성 점수를 회귀 예측하는 end-to-end 프레임워크입니다.
        </p>
      </div>

      {/* Full-width architecture image — top */}
      <div>
        <div style={{ fontSize: 11, color: 'rgba(198,212,223,0.28)', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 8 }}>ARCHITECTURE DIAGRAM</div>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#fff', boxShadow: '0 20px 56px rgba(0,0,0,0.45)' }}>
          <img src="/images/arch_diagram.png" alt="PRIS-RHP Architecture" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>

      {/* 3 module cards — bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {modules.map(({ num, title, color, desc }) => (
          <div key={num} style={{
            padding: '22px 20px', borderRadius: 16, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(145deg, ${color}07 0%, rgba(255,255,255,0.015) 100%)`,
            border: `1px solid ${color}22`, borderTop: `3px solid ${color}`,
          }}>
            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${color}14, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 13 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: `${color}18`, border: `1.5px solid ${color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 900, color,
              }}>{num}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(236,246,255,0.9)' }}>{title}</div>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(198,212,223,0.62)', lineHeight: 1.72, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Performance Bar Chart (SVG) ───────────────────────────
function PerformanceBarChart() {
  const W = 520, H = 370
  const PAD = { top: 68, right: 16, bottom: 60, left: 16 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom
  const baseline = PAD.top + chartH
  const groupW = chartW / TABLE_ROWS.length
  const barW = 38, barGap = 8
  const maxVal = 1.12

  const groups = TABLE_ROWS.map((row, i) => {
    const mae  = row.vals[0]
    const rmse = row.vals[2]
    const gx   = PAD.left + i * groupW
    const bx   = gx + (groupW - (barW * 2 + barGap)) / 2
    return {
      model: row.model, best: row.best,
      mae:  { v: mae,  x: bx,             h: (mae  / maxVal) * chartH },
      rmse: { v: rmse, x: bx + barW + barGap, h: (rmse / maxVal) * chartH },
      cx: gx + groupW / 2,
    }
  })

  const maeCol  = m => m === 'PRIS-RHP' ? '#22c55e' : 'rgba(255,255,255,0.28)'
  const rmseCol = m => m === 'PRIS-RHP' ? '#16a34a' : 'rgba(255,255,255,0.52)'
  const valCol  = m => m === 'PRIS-RHP' ? '#22c55e' : 'rgba(255,255,255,0.65)'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      <text x={PAD.left} y={20} fontSize="12.5" fontWeight="800" fill="rgba(236,246,255,0.88)">
        PRIS-RHP achieves the lowest error on every metric
      </text>
      <text x={PAD.left} y={38} fontSize="10.5" fill="rgba(198,212,223,0.38)">
        MAE and RMSE across four models · lower is better
      </text>

      <line x1={PAD.left} y1={baseline} x2={W - PAD.right} y2={baseline}
        stroke="rgba(198,212,223,0.18)" strokeWidth="1" />

      {groups.map((g, i) => (
        <g key={g.model}>
          {/* MAE bar */}
          <rect x={g.mae.x} y={baseline - g.mae.h} width={barW} height={g.mae.h} fill={maeCol(g.model)} rx="3" />
          <text x={g.mae.x + barW / 2} y={baseline - g.mae.h - 6}
            textAnchor="middle" fontSize="11" fontWeight="700" fill={valCol(g.model)}>
            {g.mae.v.toFixed(3)}
          </text>
          {i === 0 && (
            <text x={g.mae.x + barW / 2} y={baseline - g.mae.h + 16}
              textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(198,212,223,0.4)">
              MAE
            </text>
          )}

          {/* RMSE bar */}
          <rect x={g.rmse.x} y={baseline - g.rmse.h} width={barW} height={g.rmse.h} fill={rmseCol(g.model)} rx="3" />
          <text x={g.rmse.x + barW / 2} y={baseline - g.rmse.h - 6}
            textAnchor="middle" fontSize="11" fontWeight="700" fill={valCol(g.model)}>
            {g.rmse.v.toFixed(3)}
          </text>
          {i === 0 && (
            <text x={g.rmse.x + barW / 2} y={baseline - g.rmse.h + 16}
              textAnchor="middle" fontSize="9" fontWeight="800" fill="rgba(198,212,223,0.55)">
              RMSE
            </text>
          )}

          {/* Model label */}
          <text x={g.cx} y={baseline + 22} textAnchor="middle" fontSize="12"
            fontWeight={g.best ? 800 : 600}
            fill={g.best ? '#22c55e' : 'rgba(198,212,223,0.55)'}>
            {g.model}
          </text>
        </g>
      ))}

      <text x={PAD.left} y={H - 8} fontSize="10" fill="rgba(198,212,223,0.18)" fontStyle="italic">
        Source: PRIS-RHP capstone evaluation, 2026.
      </text>
    </svg>
  )
}

// ── Tab: 비교 모델 ─────────────────────────────────────────
const TABLE_ROWS = [
  { model: 'HP-BERT',  vals: [0.664, 0.974, 0.987, 34.851], best: false },
  { model: 'TNN',      vals: [0.487, 0.622, 0.789, 39.691], best: false },
  { model: 'DMMN',     vals: [0.443, 0.568, 0.754, 35.408], best: false },
  { model: 'PRIS-RHP', vals: [0.369, 0.399, 0.631, 31.317], best: true  },
]
const TBL_METRICS = ['MAE', 'MSE', 'RMSE', 'MAPE %']
const TBL_MAX     = [0.664, 0.974, 0.987, 39.691]
const TBL_MIN     = [0.369, 0.399, 0.631, 31.317]
const fmtV = (v) => v.toFixed(3)

function TabComparison() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Setup cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{
          padding: '22px 24px', borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(102,192,244,0.07) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(102,192,244,0.16)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#66c0f4', letterSpacing: '0.15em', marginBottom: 12 }}>DATASET</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'rgba(236,246,255,0.95)', marginBottom: 12 }}>No Man's Sky</div>
          {['영어 리뷰만 사용', 'Steam 공식 유저 메타데이터 포함', 'Official Patch만 사용'].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 7, alignItems: 'center' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#66c0f4', flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: 'rgba(198,212,223,0.6)', lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{
          padding: '22px 24px', borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(167,139,250,0.07) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(167,139,250,0.16)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', letterSpacing: '0.15em', marginBottom: 12 }}>EVALUATION</div>
          <p style={{ fontSize: 12.5, color: 'rgba(198,212,223,0.6)', lineHeight: 1.75, marginBottom: 16 }}>
            경험적 분석을 통한 하이퍼파라미터 튜닝 후 <strong style={{ color: 'rgba(236,246,255,0.9)' }}>5회 반복 실험</strong> 평균 ± 표준편차 산출 → 안정성 · 재현성 확보
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { name: 'TNN',      color: 'rgba(198,212,223,0.35)' },
              { name: 'HP-BERT',  color: 'rgba(198,212,223,0.35)' },
              { name: 'DMMN',     color: 'rgba(198,212,223,0.35)' },
              { name: 'PRIS-RHP', color: '#22c55e', star: true },
            ].map(({ name, color, star }) => (
              <div key={name} style={{
                padding: '8px 12px', borderRadius: 9, fontSize: 12, fontWeight: 700, color,
                background: star ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${star ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}>{star ? '★ ' : ''}{name}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Table + Graph */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

        {/* Data table */}
        <div>
          <div style={{ fontSize: 11, color: 'rgba(198,212,223,0.28)', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 8 }}>
            PERFORMANCE TABLE <span style={{ opacity: 0.6, fontWeight: 500, letterSpacing: 0 }}>· 낮을수록 우수</span>
          </div>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1.3fr repeat(4, 1fr)',
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.035)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(198,212,223,0.35)', letterSpacing: '0.1em' }}>MODEL</div>
              {TBL_METRICS.map(m => (
                <div key={m} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(236,246,255,0.75)', letterSpacing: '0.08em', textAlign: 'center' }}>{m}</div>
              ))}
            </div>

            {/* Rows */}
            {TABLE_ROWS.map((row, ri) => (
              <div key={row.model} style={{
                display: 'grid', gridTemplateColumns: '1.3fr repeat(4, 1fr)',
                padding: '14px 16px',
                background: row.best ? 'rgba(34,197,94,0.07)' : ri % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                borderBottom: ri < TABLE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                {/* Model name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {row.best
                    ? <span style={{ fontSize: 11, color: '#22c55e', flexShrink: 0 }}>★</span>
                    : <div style={{ width: 11, flexShrink: 0 }} />}
                  <span style={{ fontSize: 13, fontWeight: row.best ? 800 : 500, color: row.best ? '#22c55e' : 'rgba(236,246,255,0.88)' }}>
                    {row.model}
                  </span>
                </div>

                {/* Metric cells with mini bar */}
                {row.vals.map((v, vi) => {
                  const isBest = v === TBL_MIN[vi]
                  const barPct = (v / (TBL_MAX[vi] * 1.25)) * 100
                  return (
                    <div key={vi} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: isBest ? 800 : 500, color: isBest ? '#22c55e' : 'rgba(236,246,255,0.88)' }}>
                        {fmtV(v)}
                      </div>
                      <div style={{ marginTop: 5, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${barPct}%`, borderRadius: 2,
                          backgroundColor: isBest ? '#22c55e' : 'rgba(102,192,244,0.28)',
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Performance chart */}
        <div>
          <div style={{ fontSize: 11, color: 'rgba(198,212,223,0.28)', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 8 }}>PERFORMANCE GRAPH</div>
          <div style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)', padding: '16px 12px' }}>
            <PerformanceBarChart />
          </div>
        </div>
      </div>

      {/* Result banner */}
      <div style={{
        padding: '20px 28px', borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.03) 100%)',
        border: '1px solid rgba(34,197,94,0.24)',
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>🏆</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#22c55e', marginBottom: 5, letterSpacing: '0.08em' }}>최고 성능 달성</div>
          <div style={{ fontSize: 13, color: 'rgba(198,212,223,0.65)', lineHeight: 1.55 }}>
            PRIS-RHP Framework가 HP-BERT · TNN · DMMN 대비 <strong style={{ color: 'rgba(236,246,255,0.9)' }}>모든 지표에서 최고 성능</strong>을 기록했습니다.
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tab: 기대효과 ──────────────────────────────────────────
const IMPACT_ITEMS = [
  { value: 'Top-K', label: '핵심 리뷰 자동 선별',    sub: '유용성 기반 상위 리뷰만 우선 제공',           color: '#66c0f4', icon: '↑' },
  { value: '5종',   label: '인사이트 카테고리 분류', sub: '버그 · 밸런스 · QoL · 기능 요청 · 기타',      color: '#a78bfa', icon: '◈' },
  { value: 'S–D',   label: '등급 기반 우선순위',     sub: '전체 분포 내 상대 순위로 직관적 판단',         color: '#22c55e', icon: '▲' },
  { value: '자동',  label: '수동 분류 대체',         sub: '개발팀이 리뷰를 직접 읽지 않아도 되는 구조',   color: '#f59e0b', icon: '◎' },
]

function TabImpact() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, alignItems: 'start' }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', marginBottom: 14, lineHeight: 1.3 }}>
          개발자가 리뷰를 직접<br />읽지 않아도 되는 세상
        </div>
        <p style={{ fontSize: 13.5, color: 'rgba(198,212,223,0.58)', lineHeight: 1.85, marginBottom: 28 }}>
          Patch Lens는 Steam 패치 이후 쏟아지는 리뷰에서 개발팀이 실제로 필요한 신호만을 자동으로 추출합니다. 수동 분류에 소요되던 시간을 제품 개선에 온전히 집중할 수 있습니다.
        </p>
        <div style={{
          padding: '22px 26px', borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(102,192,244,0.08) 0%, rgba(34,197,94,0.04) 100%)',
          border: '1px solid rgba(102,192,244,0.15)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(236,246,255,0.8)', marginBottom: 14, letterSpacing: '0.06em' }}>서비스 제공 기능</div>
          {[
            'LLM 기반 인사이트 · 피드백 자동 생성',
            '리뷰 유용성 점수 기반 Top-K 선별',
            '카테고리별 분류 및 시각화 대시보드',
            '개발자 우선 확인 리뷰 빠른 탐색',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#66c0f4', flexShrink: 0, marginTop: 8 }} />
              <span style={{ fontSize: 13, color: 'rgba(198,212,223,0.62)', lineHeight: 1.6 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {IMPACT_ITEMS.map(item => (
          <div key={item.label} className="lift-card" style={{
            padding: '24px 20px', borderRadius: 18, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(145deg, ${item.color}14 0%, ${item.color}04 100%)`,
            border: `1px solid ${item.color}26`,
          }}>
            {/* Background glow blob */}
            <div style={{
              position: 'absolute', top: -24, right: -24,
              width: 90, height: 90, borderRadius: '50%',
              background: `radial-gradient(circle, ${item.color}22, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.value}</div>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: `${item.color}18`, border: `1px solid ${item.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: item.color,
              }}>{item.icon}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(236,246,255,0.9)', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(198,212,223,0.48)', lineHeight: 1.55 }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TAB_CONTENT = {
  background: TabBackground,
  pipeline:   TabPipeline,
  comparison: TabComparison,
  impact:     TabImpact,
}

// ── Main page ──────────────────────────────────────────────
export default function Presentation() {
  const [activeTab, setActiveTab] = useState('background')
  const tabSectionRef = useRef(null)
  const ActiveContent = TAB_CONTENT[activeTab]
  const accent = TABS.find(t => t.id === activeTab)?.accent ?? '#66c0f4'

  const scrollToTabs = () =>
    tabSectionRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="pres-page" style={{ backgroundColor: '#070b12', color: 'var(--text)', minHeight: '100vh' }}>
      <style>{CSS}</style>

      {/* ── Fixed header ─────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 36px',
        backgroundColor: 'rgba(7,11,18,0.88)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/images/logo.png" alt="Patch Lens" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain' }} />
          <span style={{ fontWeight: 900, fontSize: 15, color: 'rgba(236,246,255,0.95)' }}>Patch Lens</span>
          <span style={{ fontSize: 11, color: '#66c0f4', fontWeight: 700, padding: '2px 8px', border: '1px solid rgba(102,192,244,0.22)', borderRadius: 4, letterSpacing: '0.1em' }}>PRESENTATION</span>
        </Link>
        <Link to="/" style={{
          fontSize: 12, fontWeight: 600, color: 'rgba(198,212,223,0.45)', textDecoration: 'none',
          padding: '5px 16px', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 6,
          transition: 'color 0.2s, border-color 0.2s',
        }}>← 메인</Link>
      </header>

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', position: 'relative',
        background: 'radial-gradient(ellipse at 68% 48%, rgba(16,50,52,0.95) 0%, rgba(9,22,42,0.88) 40%, #070b12 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 48px 60px', textAlign: 'center',
        overflow: 'hidden',
      }}>

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: [
            'linear-gradient(rgba(102,192,244,0.035) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(102,192,244,0.035) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
        }} />

        {/* Glow orbs */}
        <div className="pres-orb1" style={{
          position: 'absolute', top: '15%', right: '10%',
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102,192,244,0.09) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />
        <div className="pres-orb2" style={{
          position: 'absolute', bottom: '18%', left: '6%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '30%', right: '20%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 780, position: 'relative' }}>

          {/* Overline badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32,
            padding: '7px 18px', borderRadius: 100,
            background: 'rgba(102,192,244,0.08)', border: '1px solid rgba(102,192,244,0.18)',
          }}>
            <div className="pres-glow" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#66c0f4' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(102,192,244,0.85)', letterSpacing: '0.12em' }}>
              한성대학교
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)', fontWeight: 900,
            color: '#fff', lineHeight: 1.07, marginBottom: 26, letterSpacing: '-0.025em',
          }}>
            Steam Review<br />
            <span style={{
              background: 'linear-gradient(135deg, #66c0f4 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>RHP</span> Framework
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(198,212,223,0.6)',
            lineHeight: 1.75, margin: '0 auto 52px', maxWidth: 520,
          }}>
            개발자를 위한 Steam 리뷰 유용성 자동 예측 프레임워크
          </p>

          <button
            onClick={scrollToTabs}
            className="pres-cta"
            style={{
              padding: '16px 46px', borderRadius: 100, fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #1a6fa8 0%, #66c0f4 100%)',
              color: '#fff', border: 'none', cursor: 'pointer',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.84'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
          >
            연구 소개 살펴보기
          </button>

          {/* Scroll indicator */}
          <div
            className="pres-bounce"
            onClick={scrollToTabs}
            style={{ marginTop: 68, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          >
            <span style={{ fontSize: 11, color: 'rgba(198,212,223,0.28)', fontWeight: 700, letterSpacing: '0.14em' }}>SCROLL</span>
            <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
              <path d="M1 1 L10 9.5 L19 1" stroke="rgba(198,212,223,0.28)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TAB SECTION
      ════════════════════════════════════════════════════ */}
      <section ref={tabSectionRef} style={{ padding: '88px 48px 108px', backgroundColor: '#07090f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(102,192,244,0.5)', marginBottom: 14 }}>
            PRIS-RHP OVERVIEW
          </p>
          <h2 style={{
            textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 900, color: '#fff', marginBottom: 52, lineHeight: 1.2,
          }}>
            핵심 내용을 빠르게 살펴보세요
          </h2>

          {/* Underline-style tab buttons */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 44,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '14px 34px', border: 'none', cursor: 'pointer',
                    backgroundColor: 'transparent',
                    borderBottom: `2px solid ${isActive ? tab.accent : 'transparent'}`,
                    marginBottom: -1,
                    color: isActive ? tab.accent : 'rgba(198,212,223,0.38)',
                    transition: 'color 0.25s, border-color 0.25s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(198,212,223,0.65)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(198,212,223,0.38)' }}
                >
                  <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', opacity: isActive ? 0.75 : 0.5 }}>{tab.num}</span>
                  <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Content card */}
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            backgroundColor: '#0d1422',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: `0 0 90px ${accent}0e`,
            transition: 'box-shadow 0.45s',
          }}>
            <div style={{
              height: 3,
              background: `linear-gradient(90deg, ${accent} 0%, ${accent}55 100%)`,
              transition: 'background 0.4s',
            }} />
            <div style={{ padding: '50px 54px' }}>
              <div key={activeTab} className="pres-fadein">
                <ActiveContent />
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
