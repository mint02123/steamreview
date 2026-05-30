// TODO: Overview는 현재 데모용 mockData 기반 집계 화면입니다.
// 추후 FastAPI /api/overview 응답 기반으로 교체 예정입니다.

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
  Label,
  ReferenceLine,
} from 'recharts'
import { useEffect, useMemo, useState } from 'react'
import { categoryStyles } from '../../data/constants'
import { API_BASE_URL } from '../../config'

const decisionLabels = {
  show: '즉시 검토',
  use_for_category_summary_only: '요약 활용',
  exclude: '필터링됨',
  needs_review: '검토 필요',
}

const grid = '#2a475e'
const tick = '#c6d4df'
const tooltipStyle = {
  backgroundColor: '#111923',
  border: '1px solid #2a475e',
  borderRadius: 8,
  color: '#c6d4df',
  fontSize: 12,
}
const tooltipTextStyle = { color: '#c6d4df' }


export default function Overview() {

  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    setLoading(true)
    setError('')

    fetch(`${API_BASE_URL}/api/overview`)
      .then(res => {
        if (!res.ok) throw new Error(`Overview API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (!alive) return
        setOverview(data)
      })
      .catch(err => {
        console.warn('Failed to load overview.', err)
        if (!alive) return
        setError('Overview 데이터를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  const {
    kpiData = {},
    categoryDistribution = [],
    displayDecisionData = [],
    usefulnessBuckets = [],
    sentimentByCategory = [],
    patchStats = {},
  } = overview || {}

  const totalCategoryCount = categoryDistribution.reduce((sum, item) => sum + item.count, 0)

  const summaryCards = useMemo(() => ([
    {
      label: '총 수집 리뷰',
      value: Number(kpiData.totalReviews || 0).toLocaleString(),
      helper: '수집된 Steam 영어 리뷰',
      color: '#66c0f4',
      icon: '◈',
    },
    {
      label: 'Top-K 선별',
      value: kpiData.selectedReviews || 0,
      helper: '개발자가 먼저 볼 후보',
      color: '#ef4444',
      icon: '↑',
    },
    {
      label: 'LLM 처리 완료',
      value: kpiData.llmProcessed || 0,
      helper: '인사이트 생성 성공',
      color: '#f59e0b',
      icon: '◎',
    },
    {
      label: '평균 유용성',
      value: `${kpiData.avgUsefulnessPercent || 0}%`,
      helper: `${kpiData.avgUsefulnessLabel || '보통'} 등급 · 정규화 0–100`,
      color: '#22c55e',
      icon: '▲',
    },
  ]), [kpiData])

  const divergingData = useMemo(() => (
    sentimentByCategory.map(item => ({
      name: categoryStyles[item.name]?.label || item.name,
      긍정: item.positive || 0,
      부정: -(item.negative || 0),
    }))
  ), [sentimentByCategory])

  if (loading) {
    return (
      <div className="p-8" style={{ color: 'var(--text-muted)' }}>
        Overview 데이터를 불러오는 중입니다...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8" style={{ color: '#ef4444', fontWeight: 700 }}>
        {error}
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* 헤더 */}
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--accent)' }}>OVERVIEW</p>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--heading)' }}>패치 반응 전체 분석</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          모델 결과 분포, 카테고리 구성, 패치 연관 반응을 집계해서 보여줍니다.
        </p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="steam-panel steam-card-hover overflow-hidden">
            <div style={{ height: 3, background: card.color }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="text-xs font-semibold tracking-wide" style={{ color: 'var(--text-muted)' }}>{card.label}</div>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ backgroundColor: `${card.color}18`, color: card.color, border: `1px solid ${card.color}35` }}>
                  {card.icon}
                </div>
              </div>
              <div className="text-3xl font-black" style={{ color: card.color }}>{card.value}</div>
              <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{card.helper}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 분포 차트 3열 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* 카테고리 분포 */}
        <div className="steam-panel p-5">
          <h3 className="font-black mb-1" style={{ color: 'var(--heading)' }}>카테고리 분포</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>LLM 분류 결과</p>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={56} outerRadius={90} paddingAngle={0} dataKey="count">
                {categoryDistribution.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                <Label content={({ viewBox }) => {
                  const { cx, cy } = viewBox
                  return (
                    <>
                      <text x={cx} y={cy - 7} textAnchor="middle" dominantBaseline="middle" fill="#c6d4df" fontSize={18} fontWeight={900}>{totalCategoryCount}</text>
                      <text x={cx} y={cy + 11} textAnchor="middle" dominantBaseline="middle" fill="rgba(198,212,223,0.4)" fontSize={10} fontWeight={600}>전체 리뷰</text>
                    </>
                  )
                }} />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipTextStyle} itemStyle={tooltipTextStyle}
                formatter={(value, name) => [`${value}건`, categoryStyles[name]?.label || name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-2">
            {categoryDistribution.map(item => {
              const style = categoryStyles[item.name] || categoryStyles.other
              const percent = totalCategoryCount ? Math.round((item.count / totalCategoryCount) * 100) : 0
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between gap-3 text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-xs" style={{ color: 'var(--heading)' }}>{style.label}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.count}건 · {percent}%</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, backgroundColor: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percent}%`, backgroundColor: item.color, borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 모델 결정 분포 */}
        <div className="steam-panel p-5">
          <h3 className="font-black mb-1" style={{ color: 'var(--heading)' }}>모델 결정 분포</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>displayDecision 기준</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={displayDecisionData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="name" stroke={grid} tick={{ fill: tick, fontSize: 11 }}
                tickFormatter={name => decisionLabels[name] || name} />
              <YAxis stroke={grid} tick={{ fill: tick, fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipTextStyle} itemStyle={tooltipTextStyle}
                formatter={(value, name) => [`${value}건`, decisionLabels[name] || name]}
                labelFormatter={name => decisionLabels[name] || name} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {displayDecisionData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {displayDecisionData.map(item => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="min-w-0">
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{decisionLabels[item.name] || item.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.value}건</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 유용성 점수 분포 */}
        <div className="steam-panel p-5">
          <h3 className="font-black mb-1" style={{ color: 'var(--heading)' }}>유용성 점수 분포</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>모델 예측 usefulnessScore (0–4)</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={usefulnessBuckets} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="name" stroke={grid} tick={{ fill: tick, fontSize: 11 }} />
              <YAxis stroke={grid} tick={{ fill: tick, fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipTextStyle} itemStyle={tooltipTextStyle}
                formatter={(value) => [`${value}건`]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {usefulnessBuckets.map(entry => <Cell key={entry.name} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-3 flex-wrap">
            {usefulnessBuckets.map(b => (
              <div key={b.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{b.count}건</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 패치 반응 분석 - 3열 레이아웃 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* 카테고리별 긍/부정 - Diverging Bar Chart */}
        <div className="xl:col-span-2 steam-panel p-5">
          <h3 className="font-black mb-1" style={{ color: 'var(--heading)' }}>카테고리별 긍/부정 반응</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Steam 리뷰 sentiment 기준</p>

          {/* 방향 레이블 */}
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>부정 ←</span>
            </div>
            <span style={{ fontSize: 11, color: 'rgba(198,212,223,0.35)', fontWeight: 600 }}>0</span>
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>→ 긍정</span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={divergingData} layout="vertical" margin={{ left: 0, right: 10, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
              <XAxis
                type="number"
                stroke={grid}
                tick={{ fill: tick, fontSize: 11 }}
                allowDecimals={false}
                tickFormatter={v => String(Math.abs(v))}
              />
              <YAxis dataKey="name" type="category" stroke={grid} tick={{ fill: tick, fontSize: 11 }} width={52} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipTextStyle}
                itemStyle={tooltipTextStyle}
                formatter={(value, name) => [`${Math.abs(value)}건`, name]}
              />
              <ReferenceLine x={0} stroke="rgba(198,212,223,0.25)" strokeWidth={1.5} />
              <Bar dataKey="부정" fill="#ef4444" fillOpacity={0.85} radius={[4, 0, 0, 4]} />
              <Bar dataKey="긍정" fill="#22c55e" fillOpacity={0.85} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 패치 연관 요약 */}
        <div className="steam-panel p-5">
          <h3 className="font-black mb-1" style={{ color: 'var(--heading)' }}>패치 반응 요약</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>패치 언급 여부 · 근거 강도 · 유용성 비교</p>

          {/* 패치 연관 비율 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--heading)' }}>패치 연관 리뷰</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#66c0f4' }}>{patchStats.relatedCount}건 ({patchStats.relatedPct}%)</span>
            </div>
            <div style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', width: `${patchStats.relatedPct}%`, backgroundColor: '#66c0f4', borderRadius: 5, boxShadow: '0 0 8px rgba(102,192,244,0.4)' }} />
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              일반 피드백 {patchStats.unrelatedCount}건 ({100 - patchStats.relatedPct}%)
            </div>
          </div>

          {/* 유용성 비교 */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(102,192,244,0.08)', border: '1px solid rgba(102,192,244,0.2)' }}>
              <div style={{ fontSize: 11, color: '#66c0f4', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>패치 연관</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#66c0f4', lineHeight: 1 }}>{patchStats.avgRelLabel}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#66c0f4', marginTop: 3 }}>{patchStats.avgRelPct}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>평균 유용성</div>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.2)' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>일반 피드백</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#9ca3af', lineHeight: 1 }}>{patchStats.avgUnrelLabel}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginTop: 3 }}>{patchStats.avgUnrelPct}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>평균 유용성</div>
            </div>
          </div>

          {/* 추가 지표 */}
          <div className="space-y-3">
            {[
              { label: '패치 연관 긍정 비율', value: `${patchStats.posRelatedPct}%`, color: '#22c55e', sub: '패치 언급 리뷰 중 긍정 sentiment' },
              { label: '근거 강함 (strong evidence)', value: `${patchStats.highEvidencePct}%`, color: '#f59e0b', sub: '전체 리뷰 중 evidenceLevel = strong' },
            ].map(({ label, value, color, sub }) => (
              <div key={label} className="flex items-center justify-between gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--heading)' }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color, flexShrink: 0 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
