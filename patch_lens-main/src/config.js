// 백엔드 API 베이스 URL.
// 배포 시 빌드 환경변수 VITE_API_BASE_URL 로 주입하고,
// 로컬 개발에서는 미설정 시 로컬 백엔드로 폴백한다.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
