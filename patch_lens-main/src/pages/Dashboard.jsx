import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import Overview from '../components/dashboard/Overview'
import TopReviews from '../components/dashboard/TopReviews'
import MyPage from '../components/dashboard/MyPage'
import { SavedReviewsProvider } from '../context/SavedReviewsContext'
import { Link } from 'react-router-dom'

const TABS = { overview: Overview, reviews: TopReviews, mypage: MyPage }

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('reviews')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const ActiveComponent = TABS[activeTab] || Overview

  return (
    <SavedReviewsProvider>
      <div className="flex flex-col" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>

        {/* 전체 너비 상단 헤더 */}
        <header
          className="flex-shrink-0 border-b flex items-center sticky top-0 z-30 backdrop-blur"
          style={{ height: 64, backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border)' }}
        >
          {/* 좌측: 햄버거 + 로고 */}
          <div className="flex items-center h-full">
            <button
              onClick={() => setSidebarCollapsed(v => !v)}
              className="header-hamburger flex items-center justify-center h-full flex-shrink-0"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <rect x="2" y="4" width="16" height="2" rx="1" />
                <rect x="2" y="9" width="16" height="2" rx="1" />
                <rect x="2" y="14" width="16" height="2" rx="1" />
              </svg>
            </button>

            <Link to="/" className="flex items-center gap-3 px-5">
              <img src="/images/logo.png" alt="Patch Lens" style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'contain' }} />
              <div className="leading-tight">
                <div className="font-black text-base whitespace-nowrap" style={{ color: 'var(--heading)' }}>Patch Lens</div>
                <div className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--accent)' }}>Steam Review Console</div>
              </div>
            </Link>
          </div>

        </header>

        {/* 사이드바 + 콘텐츠 */}
        <div className="flex flex-1">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            collapsed={sidebarCollapsed}
          />
          <main className="flex-1 overflow-auto">
            <ActiveComponent />
          </main>
        </div>

      </div>
    </SavedReviewsProvider>
  )
}
