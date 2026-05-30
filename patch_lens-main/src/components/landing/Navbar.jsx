import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ANNOUNCE_H = 50
const NAV_H = 80

const NAV_LINKS = [
  { label: '서비스 소개', id: 'intro' },
  { label: '핵심 기능', id: 'capabilities' },
  { label: '활용 장면', id: 'usecases' },
]

function scrollTo(id) {
  const element = document.getElementById(id)
  if (!element) return
  window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - (ANNOUNCE_H + NAV_H + 4), behavior: 'smooth' })
}

export default function Navbar() {
  const goFinalCta = () => scrollTo('final-cta')
  const navigate = useNavigate()
  const { user, isAuthenticated, loading, logout } = useAuth()

  const goDashboard = () => {
    navigate('/dashboard')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* ── Announcement bar ─────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 51,
        height: ANNOUNCE_H,
        backgroundColor: '#06090e',
        borderBottom: '1px solid rgba(102,192,244,0.13)',
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to="/presentation"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flex: 1, minWidth: 0 }}
          >
            <span style={{
              fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#66c0f4',
              padding: '3px 10px', border: '1px solid rgba(102,192,244,0.35)', borderRadius: 5,
              flexShrink: 0,
            }}>NEW</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(198,212,223,0.88)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              PRIS-RHP: 패치 노트 기반 Steam 리뷰 유용성 예측 프레임워크 — 연구 소개 보기
            </span>
            <span style={{ fontSize: 14, color: 'rgba(102,192,244,0.75)', flexShrink: 0 }}>→</span>
          </Link>

          <span style={{ fontSize: 12, color: 'rgba(198,212,223,0.32)', fontWeight: 500, flexShrink: 0, marginLeft: 20 }}>한성대학교</span>
        </div>
      </div>

      {/* ── Main navbar ──────────────────────────────────────── */}
      <nav
        className="fixed w-full z-50 border-b"
        style={{ top: ANNOUNCE_H, backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border)', backdropFilter: 'blur(14px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Patch Lens" className="h-16 w-auto object-contain" />
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--heading)' }}>
              Patch Lens
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: 'var(--text)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--heading)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!loading && isAuthenticated ? (
              <>
                <span
                  style={{
                    maxWidth: 140,
                    color: 'rgba(198,212,223,0.82)',
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={user?.email}
                >
                  {user?.nickname || user?.email}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
                  style={{ color: 'var(--text)', borderColor: 'var(--border)', backgroundColor: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
                >
                  로그아웃
                </button>

                <button
                  type="button"
                  onClick={goDashboard}
                  className="glow-button px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--logo-text)' }}
                >
                  대시보드 보기
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
                  style={{ color: 'var(--text)', borderColor: 'var(--border)', backgroundColor: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
                >
                  로그인
                </Link>

                <button
                  type="button"
                  onClick={goFinalCta}
                  className="glow-button px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--logo-text)' }}
                >
                  대시보드 보기
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
