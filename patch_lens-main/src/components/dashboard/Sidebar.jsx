function IconOverview() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconTopReviews() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      <rect x="2" y="3" width="16" height="2.5" rx="1.25" />
      <rect x="2" y="8.75" width="12" height="2.5" rx="1.25" />
      <rect x="2" y="14.5" width="8" height="2.5" rx="1.25" />
    </svg>
  )
}

function IconMyReviews() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      <path d="M10 2l2.16 4.37 4.84.71-3.5 3.41.83 4.81L10 13.1l-4.33 2.27.83-4.81L3 7.08l4.84-.71L10 2z" />
    </svg>
  )
}

const navItems = [
  { id: 'reviews',  label: 'Top Reviews', shortLabel: 'Reviews',  Icon: IconTopReviews },
  { id: 'overview', label: 'Overview',    shortLabel: 'Overview', Icon: IconOverview   },
  { id: 'mypage',   label: 'My Reviews',  shortLabel: 'My Page',  Icon: IconMyReviews  },
]

export default function Sidebar({ activeTab, onTabChange, collapsed }) {
  return (
    <aside
      className="flex-shrink-0 border-r flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? 72 : 220,
        backgroundColor: 'var(--nav-bg)',
        borderColor: 'var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* 네비게이션 */}
      <nav className="flex-1" style={{ padding: collapsed ? '12px 0' : '12px 10px' }}>
        {!collapsed && (
          <div className="text-xs font-semibold tracking-widest mb-2 px-3" style={{ color: 'var(--text-muted)' }}>
            LIBRARY
          </div>
        )}
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, shortLabel, Icon }) => {
            const active = activeTab === id
            return (
              <li key={id}>
                {collapsed ? (
                  <button
                    onClick={() => onTabChange(id)}
                    className="w-full flex flex-col items-center justify-center gap-1 transition-all duration-200 rounded-lg"
                    style={{
                      height: 60,
                      color: active ? 'var(--accent)' : 'var(--text-muted)',
                      backgroundColor: active ? 'var(--accent-glow)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text)' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
                  >
                    <Icon />
                    <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1 }}>{shortLabel}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onTabChange(id)}
                    className="w-full flex items-center gap-3 text-sm font-bold transition-all duration-200 text-left rounded-lg"
                    style={{
                      padding: '9px 12px',
                      backgroundColor: active ? 'var(--accent-glow)' : 'transparent',
                      color: active ? 'var(--accent)' : 'var(--text)',
                      borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-hover)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <span
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 32, height: 32,
                        backgroundColor: active ? 'var(--accent-glow)' : 'var(--bg-deep)',
                        borderRadius: 8,
                        color: active ? 'var(--accent)' : 'var(--text-muted)',
                        border: active ? '1px solid var(--accent-border)' : '1px solid transparent',
                      }}
                    >
                      <Icon />
                    </span>
                    <span>{label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                    )}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 하단: 랜딩 페이지 링크 */}
      <div className="border-t" style={{ borderColor: 'var(--border)', padding: collapsed ? '12px 8px' : '12px 10px' }}>
        {collapsed ? (
          <a
            href="/"
            className="flex flex-col items-center justify-center gap-1 w-full rounded-lg transition-all duration-200"
            style={{ height: 52, color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--bg-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
              <path d="M11 4l-6 6 6 6M5 10h11" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Home</span>
          </a>
        ) : (
          <a
            href="/"
            className="flex items-center gap-2 rounded-lg transition-all duration-200"
            style={{
              padding: '9px 12px',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-deep)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
              <path d="M11 4l-6 6 6 6M5 10h11" />
            </svg>
            <span className="text-sm font-semibold">Landing Page</span>
          </a>
        )}
      </div>
    </aside>
  )
}
