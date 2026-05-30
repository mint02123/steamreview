import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.data_loader import load_reviews, build_overview
from app.llm_service import generate_llm_insight, fallback_insight
from app.database import Base, engine
from app.routers.auth_router import router as auth_router
from app.routers.saved_router import router as saved_router


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR.parent / ".env")


app = FastAPI(title="Patch Lens Demo API")

Base.metadata.create_all(bind=engine)

# 허용 오리진은 CORS_ORIGINS 환경변수(쉼표 구분)로 주입한다.
# 미설정 시 로컬 개발 기본값으로 폴백한다.
_cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
allow_origins = [origin.strip() for origin in _cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(saved_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/reviews")
def get_reviews(limit: int | None = None):
    reviews = load_reviews()

    if limit is not None:
        reviews = reviews[:limit]

    return {
        "items": reviews,
        "total": len(reviews),
    }


@app.get("/api/overview")
def get_overview():
    reviews = load_reviews()
    return build_overview(reviews)


@app.post("/api/reviews/{review_id}/insight")
def get_review_insight(review_id: str):
    reviews = load_reviews()

    target = None
    for review in reviews:
        if (
            str(review["reviewId"]) == str(review_id)
            or str(review["id"]) == str(review_id)
            or str(review["txtFileName"]) == str(review_id)
        ):
            target = review
            break

    if target is None:
        raise HTTPException(status_code=404, detail="Review not found")

    try:
        insight = generate_llm_insight(target)
        return insight
    except Exception as exc:
        fallback = fallback_insight(target)
        fallback["llm_error"] = str(exc)
        return fallback