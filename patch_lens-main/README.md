<h2>Preview</h2>
<p align="center">
  <img src="" width="900" />
</p>
<hr>

<h2>👥 Members</h2>
<table align="center" cellpadding="14">
  <tr>
    <td align="center">
      <img src="./members/yurim.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/shinurim">신유림</a>
      </div>
    </td>
    <td align="center">
      <img src="./members/mint02123.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/mint02123">민재영</a>
      </div>
    </td>
    <td align="center">
      <img src="./members/jonghwa-8620.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/jonghwa-8620">박종화</a>
      </div>
    </td>
    <td align="center">
      <img src="./members/HOSTing1108.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/HOSTing1108">노진수</a>
      </div>
    </td>
    <td align="center">
      <img src="./members/Realysh.png"
           width="140" height="140"
           style="border:2px solid #ddd;border-radius:12px;object-fit:cover;" />
      <div style="margin-top:8px;font-weight:600;">
        <a href="https://github.com/Realysh">윤상현</a>
      </div>
    </td>
  </tr>
</table>
<hr>

<h2>🛠 Tech Stack</h2>
<ul>
  <li>
    <strong>Frontend</strong>
    <ul>
      <li>React 18</li>
      <li>React Router DOM 6</li>
      <li>Recharts 2</li>
      <li>Tailwind CSS 3</li>
      <li>Vite 5</li>
    </ul>
  </li>
  <li>
    <strong>Backend</strong>
    <ul>
      <li>Python</li>
      <li>Django <!-- TODO: 버전 추가 --></li>
      <li>Django REST Framework <!-- TODO: 버전 추가 --></li>
      <li>django-cors-headers</li>
    </ul>
  </li>
  <li>
    <strong>Database</strong>
    <ul>
      <li>PostgreSQL (AWS RDS)</li>
      <li>pgvector (Vector similarity search)</li>
    </ul>
  </li>
  <li>
    <strong>LLM</strong>
    <ul>
      <li>Anthropic Claude API (claude-haiku-4-5)</li>
    </ul>
  </li>
  <li>
    <strong>Infrastructure</strong>
    <ul>
      <li>AWS (Amplify · EC2 · RDS)</li>
    </ul>
  </li>
</ul>

<h2>🚀 Getting Started</h2>
<p>배포된 서비스는 아래 링크에서 바로 이용하실 수 있습니다.</p>
<!-- TODO: 배포 완료 후 URL 추가 -->
<p><strong>🔗 <a href="">Patch Lens 바로가기</a></strong></p>
<hr>

<h2>🧩 Project Structure</h2>
<pre><code>patch_lens/                         # Frontend
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── reviews/            # 리뷰 분석 UI 컴포넌트 모음
│   │   │   │   ├── CategoryDeck.jsx        # 카테고리별 리뷰 탐색
│   │   │   │   ├── FeaturedReviewDeck.jsx  # 주요 리뷰 하이라이트
│   │   │   │   ├── ReviewChart.jsx         # 날짜별 리뷰 추이 차트
│   │   │   │   ├── ReviewCommon.jsx        # 공통 UI 원자 컴포넌트
│   │   │   │   └── ReviewInsightOverlay.jsx # 리뷰 상세 인사이트 오버레이
│   │   │   ├── Overview.jsx        # 통계 요약 대시보드
│   │   │   ├── TopReviews.jsx      # 리뷰 목록 · 필터 · 정렬
│   │   │   ├── MyPage.jsx          # 저장 리뷰 관리
│   │   │   └── Sidebar.jsx         # 사이드바 네비게이션
│   │   └── landing/                # 랜딩 페이지 섹션 컴포넌트
│   ├── context/                    # React Context (저장 리뷰 상태)
│   ├── data/                       # 상수 · 스타일 · mock 데이터
│   └── pages/                      # 라우트 단위 페이지
│       ├── Landing.jsx
│       ├── Dashboard.jsx
│       └── Presentation.jsx
├── public/
└── package.json

<!-- TODO: 백엔드 프로젝트 구조 추가 -->
</code></pre>

<hr>
<h2>📌 API Endpoints</h2>
<!-- TODO: API 엔드포인트 확정 후 추가 -->

<hr>
<h2>🔑 Key Features</h2>
<ul>
  <li>
    <strong>AI 기반 리뷰 분류</strong>:<br>
    Steam 리뷰를 <code>bug</code>, <code>balance</code>, <code>qol</code>, <code>feature_request</code>, <code>other</code> 5개 카테고리로 자동 분류하고,
    패치와의 연관성을 판별합니다.
  </li>

  <li>
    <strong>유용성 점수 (Usefulness Score)</strong>:<br>
    개발자 관점에서 각 리뷰의 실질적 가치를 AI가 채점하여
    수천 개의 리뷰 중 우선 검토해야 할 리뷰를 빠르게 파악할 수 있습니다.
  </li>

  <li>
    <strong>다차원 필터 · 정렬</strong>:<br>
    카테고리, 기간, 감성(긍정/부정), 패치 연관 여부 등 다양한 조건으로 리뷰를 필터링하고
    유용성 · 관련성 · 추천 수 등 기준으로 정렬합니다.
  </li>

  <li>
    <strong>리뷰 추이 시각화</strong>:<br>
    날짜별 리뷰 수 · 평균 점수 · 유용성 · 추천 수 변화를 바 차트 + 라인 차트로 한눈에 확인합니다.
  </li>

  <li>
    <strong>리뷰 인사이트 오버레이</strong>:<br>
    개별 리뷰를 클릭하면 AI 분석 근거, 증거 수준, 티어, 패치 연관 이유 등 상세 인사이트를 확인합니다.
  </li>

  <li>
    <strong>MyPage — 저장 리뷰 관리</strong>:<br>
    중요 리뷰를 별표로 저장하고 <code>미검토 · 검토중 · 완료 · 보류</code> 상태와 개발자 메모를 남겨
    팀 내 리뷰 워크플로우로 활용합니다.
  </li>
</ul>

<hr>
<h2>LLM Models</h2>
<ul>
  <li>claude-haiku-4-5 : 리뷰 분류 · 유용성 채점 · 인사이트 생성</li>
</ul>

<hr>
<h2>License</h2>
<p>본 프로젝트는 한성대학교 빅데이터 캡스톤디자인 수업에서 진행되었습니다.</p>
