# Patch Lens

Steam 리뷰를 패치/업데이트 관점에서 분석해, 항목별 인사이트를 LLM으로 생성하는 데모 서비스.
정적 SPA(랜딩 + 대시보드) + FastAPI 백엔드 + PostgreSQL 구성이며, AWS(Tokyo, `ap-northeast-1`)에 배포되어 있다.

- **프론트엔드 라이브**: https://d20652wqj6601z.cloudfront.net
- **백엔드 API**: https://myuyuhqnym.ap-northeast-1.awsapprunner.com
- **리전 / 계정**: `ap-northeast-1` (Tokyo) / `510490942540`

> Seoul(`ap-northeast-2`)은 App Runner 미지원이라 Tokyo로 결정했다.

---

## 1. 디렉터리 구조

```
steamreview/
├── patch_lens-back/        # FastAPI 백엔드 (Docker)
│   ├── app/
│   │   ├── main.py         # FastAPI 엔트리, CORS, /api/* 라우트
│   │   ├── routers/        # auth_router, saved_router (회원/저장 리뷰)
│   │   ├── database.py     # SQLAlchemy 엔진/세션 (DATABASE_URL)
│   │   ├── models.py       # ORM 모델
│   │   ├── auth.py         # JWT 발급/검증, bcrypt 해싱
│   │   ├── data_loader.py  # CSV → 리뷰/Overview 로딩
│   │   └── llm_service.py  # Anthropic 인사이트 생성 + fallback
│   ├── data/               # 모델 결과 CSV (대용량 원본 2종은 .gitignore)
│   ├── Dockerfile          # python:3.11-slim, uvicorn :8000
│   └── .env.example
├── patch_lens-main/        # Vite5 + React18 SPA
│   ├── src/
│   │   ├── pages/          # Landing, Dashboard, Login, Signup, Presentation
│   │   ├── components/     # landing/*, dashboard/*
│   │   ├── context/        # AuthContext, SavedReviewsContext
│   │   └── config.js       # API_BASE_URL (VITE_API_BASE_URL 주입)
│   ├── .env.example / .env.production
│   └── vite.config.js
├── docker-compose.yml      # 로컬 통합 테스트 (backend + postgres)
└── .deploy/                # AWS 배포에 사용한 설정 JSON (소스로 보관)
```

---

## 2. 아키텍처

두 개의 독립적인 진입 경로가 있다 — 정적 자산(CloudFront)과 API(App Runner).

```
                              사용자 (브라우저)
                          ┌──────────┴───────────┐
            정적 SPA(HTTPS)│                       │ API 호출(HTTPS)
                          ▼                       ▼
                ┌───────────────────┐   ┌────────────────────────────┐
                │  CloudFront        │   │  App Runner                │
                │  (OAC, 403/404→    │   │  patch-lens-backend        │
                │   /index.html)     │   │  1 vCPU / 2GB, :8000        │
                └─────────┬─────────┘   └──────────────┬─────────────┘
                  OAC 서명 │ GetObject       VPC 커넥터  │ (egress = VPC)
                          ▼                            ▼
                ┌───────────────────┐   ┌─────────────────────────────────────────────┐
                │  S3 (프라이빗)      │   │  VPC vpc-0606a433…  (172.31.0.0/16)          │
                │  퍼블릭 액세스 차단  │   │                                              │
                │  버킷정책=이 배포만  │   │   Private subnet 1a/1c        Public subnet  │
                └───────────────────┘   │   ┌────────────────┐        ┌──────────────┐ │
                                        │   │ App Runner ENI  │        │  NAT GW + EIP │ │
   ┌────────────────────────┐          │   │      │          │        │  13.192.224.90│ │
   │  Secrets Manager        │          │   │      │ :5432    │        └──────┬───────┘ │
   │  patch-lens/DATABASE_URL│──인스턴스─┼──▶│      ▼          │               │         │
   │  patch-lens/JWT_SECRET  │   롤 read  │   │ ┌────────────┐ │               ▼         │
   │  patch-lens/ANTHROPIC…  │          │   │ │ RDS Postgres│ │          ┌────────┐    │
   └────────────────────────┘          │   │ │ 16, 프라이빗 │ │          │  IGW   │    │
                                        │   │ └────────────┘ │          └───┬────┘    │
                                        │   └────────────────┘              │         │
                                        └────────────────────────────────────┼────────┘
                                                                             ▼
                                                          Anthropic API (claude-haiku-4-5)
```

**프론트엔드 경로**: 브라우저 → CloudFront → (OAC 서명) → 프라이빗 S3.
**API 경로 (DB)**: 브라우저 → App Runner → VPC 커넥터 → 프라이빗 서브넷 → RDS(5432, VPC 로컬 라우트).
**API 경로 (LLM)**: App Runner → NAT GW → IGW → Anthropic API.
**비밀값**: App Runner 인스턴스 롤이 시작 시 Secrets Manager에서 주입.

---

## 3. 주요 설계 결정

### 3.1 프라이빗 RDS + NAT egress (퍼블릭 RDS 거부)
- RDS는 `PubliclyAccessible=false`. 인터넷에서 직접 접근 불가.
- App Runner는 **프라이빗 VPC 커넥터**로 프라이빗 서브넷에 ENI를 띄우고, RDS에는 VPC 로컬 라우트로 5432 접근.
- App Runner가 외부(Anthropic API)로 나가야 하므로 프라이빗 서브넷 → **NAT Gateway** → IGW egress 경로를 둠.
- **거부한 대안**: "퍼블릭 RDS + 5432를 `0.0.0.0/0`에 개방". 운영 비용(NAT 시간당 요금)은 들지만, DB를 인터넷에 노출하지 않는 쪽을 택했다.
- 보안 그룹은 최소 권한: RDS SG는 **App Runner SG에서 오는 5432만** 허용(인바운드). App Runner SG는 인바운드 없음.

### 3.2 Secrets Manager (환경변수에 비밀값 미하드코딩)
- `DATABASE_URL`, `JWT_SECRET_KEY`, `ANTHROPIC_API_KEY` 3개는 App Runner의 `RuntimeEnvironmentSecrets`로 ARN 참조 주입.
- 비밀이 아닌 설정(`ANTHROPIC_MODEL`, `CORS_ORIGINS`, `SOURCE_TOTAL_REVIEWS` 등)만 평문 `RuntimeEnvironmentVariables`.
- 인스턴스 롤(`patch-lens-apprunner-instance-role`)에 `patch-lens/*` 한정 `GetSecretValue` 정책만 부여.
- RDS 마스터 자격증명은 RDS 관리형 시크릿(`rds!db-…`)으로 자동 관리.

### 3.3 CloudFront + OAC (S3 완전 비공개)
- S3 버킷은 **모든 퍼블릭 액세스 차단**. 직접 URL 접근 불가.
- CloudFront **OAC**(Origin Access Control)로만 GetObject 가능 — 버킷 정책이 `AWS:SourceArn`을 이 배포 ARN으로 제한.
- SPA 라우팅: 403/404 → `/index.html` (200) 커스텀 에러 응답.
- `redirect-to-https`, CachingOptimized 정책, HTTP/2+3.

### 3.4 App Runner (컨테이너 오케스트레이션 최소화)
- ECS/EKS 대신 App Runner — 이미지 push 후 매니지드 실행/스케일/HTTPS.
- 이미지: ECR `patch-lens-backend:latest`, **단일 플랫폼 amd64** 필수
  (`docker buildx build --platform linux/amd64 --provenance=false --push`).
- 헬스체크 TCP:8000. 액세스 롤(ECR pull)과 인스턴스 롤(시크릿 read) 분리.

---

## 4. 로컬 개발

### Docker Compose (백엔드 + Postgres 통합)
```bash
# ANTHROPIC_API_KEY 없으면 fallback_insight로 동작
export ANTHROPIC_API_KEY=sk-ant-...
docker compose up --build          # backend :8000, postgres :5433(호스트)
docker compose down -v             # 정리
```

### 프론트엔드 (Vite dev)
```bash
cd patch_lens-main
npm install
npm run dev                        # http://localhost:5173, API는 127.0.0.1:8000 폴백
```

### 백엔드 단독 (선택)
```bash
cd patch_lens-back
cp .env.example .env               # 값 채우기
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

주요 엔드포인트: `GET /api/health`, `GET /api/reviews`, `GET /api/overview`,
`POST /api/reviews/{review_id}/insight` (리뷰 ID는 `review_2` 같은 문자열), `/auth/*`, 저장 리뷰 라우트.

---

## 5. 배포된 AWS 리소스 인벤토리

리전 `ap-northeast-1`, 계정 `510490942540`. (티어다운은 [TEARDOWN.md](./TEARDOWN.md) 참고.)

| 종류 | 이름 / ID | 비고 |
|------|-----------|------|
| VPC | `vpc-0606a433f17c53e9e` | 기본 VPC, 172.31.0.0/16 |
| SG (apprunner) | `sg-0729327ae278416cc` | 인바운드 없음 |
| SG (rds) | `sg-0ab6c561d89517025` | 5432 ← apprunner SG only |
| 프라이빗 서브넷 | `subnet-0db17026c90ffa180` (1a), `subnet-064d37550da109403` (1c) | 172.31.48.0/24, .49.0/24 |
| 퍼블릭 서브넷 | `subnet-08ab13f4f280784c7` (1a) | NAT GW 위치 |
| NAT Gateway | `nat-041504d36f3679dbd` | EIP `eipalloc-09f57f67a68d25ce6` (13.192.224.90) |
| 프라이빗 라우트 테이블 | `rtb-091a8740c7be13ee7` | 0.0.0.0/0 → NAT |
| RDS | `patch-lens-db` | PostgreSQL 16.14, db.t3.micro, 20GB gp3, 암호화, **비공개**, backup 1 |
| RDS 엔드포인트 | `patch-lens-db.cvsi4ikmu48v.ap-northeast-1.rds.amazonaws.com:5432` | db/user `patchlens` |
| VPC 커넥터 | `patch-lens-vpc-connector-private` | App Runner egress=VPC |
| ECR | `patch-lens-backend` | amd64 단일 플랫폼 |
| App Runner | `patch-lens-backend` | 1vCPU/2GB, RUNNING |
| Secrets | `patch-lens/DATABASE_URL`, `patch-lens/JWT_SECRET_KEY`, `patch-lens/ANTHROPIC_API_KEY` | + RDS 관리형 `rds!db-…` |
| IAM 롤 | `patch-lens-apprunner-instance-role`, `patch-lens-apprunner-access-role` | 시크릿 read / ECR pull |
| S3 | `patch-lens-frontend-510490942540` | 퍼블릭 액세스 전체 차단 |
| OAC | `ESHMVSM7ZRCT2` | CloudFront → S3 |
| CloudFront | `E1Z2UPSO3E3PIE` | `d20652wqj6601z.cloudfront.net` |

`.deploy/`에 실제 사용한 설정 JSON(소스/네트워크/인스턴스/헬스/시크릿 정책/버킷 정책/CloudFront)이 보관되어 있다.

---

## 6. 재배포 메모

- **백엔드 코드 변경**: amd64 이미지 빌드 → ECR push → `aws apprunner update-service` 또는 콘솔에서 재배포.
  `update-service`로 env를 바꿀 땐 **기존 RuntimeEnvironmentVariables + 3개 시크릿을 전부 다시 명시**해야 한다(누락 시 드롭됨). `.deploy/source-config-cors.json`이 현재 적용본.
- **프론트 변경**: `patch_lens-main`에서 `npm run build` → `dist/`를 S3에 sync → CloudFront invalidation(`/*`).
- **ECR 로그인(이 Windows 박스)**: credsStore가 `desktop`이라 `--password-stdin` 실패 →
  `docker login --username AWS --password <token>` 사용.
- **CORS**: App Runner의 `CORS_ORIGINS`에 CloudFront 도메인 + `http://localhost:5173` 포함.
