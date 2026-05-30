from pathlib import Path
import math
import os
import pandas as pd


DATA_DIR = Path(__file__).resolve().parents[1] / "data"
ENRICHED_PATH = DATA_DIR / "model_result_enriched.csv"
BASE_DATA_PATH = DATA_DIR / "model_result.csv"

# 메타데이터(votes_funny, playtime, 작성일, 패치 연관 등)가 부착된 enriched CSV가
# 있으면 우선 사용하고, 없으면 기존 model_result.csv 로 폴백한다.
DATA_PATH = ENRICHED_PATH if ENRICHED_PATH.exists() else BASE_DATA_PATH


def _safe_text(value, default=""):
    if value is None:
        return default
    if isinstance(value, float) and math.isnan(value):
        return default
    return str(value)


def _safe_float(value, default=0.0):
    try:
        if pd.isna(value):
            return default
        return float(value)
    except Exception:
        return default


def _safe_int(value, default=0):
    try:
        if pd.isna(value):
            return default
        return int(float(value))
    except Exception:
        return default


def _normalize_usefulness(predicted_helpfulvotes):
    """
    predicted_helpfulvotes를 프론트의 0~4 유용성 점수로 변환.
    값 범위가 크면 log 기반으로 압축한다.
    """
    value = max(0.0, _safe_float(predicted_helpfulvotes))
    if value == 0:
        return 0.5

    score = math.log1p(value) / math.log1p(100) * 4
    return round(max(0.5, min(4.0, score)), 2)


def _infer_sentiment(text):
    lowered = text.lower()
    negative_words = ["bug", "crash", "broken", "issue", "problem", "bad", "worse", "lag", "error"]
    positive_words = ["good", "great", "better", "fixed", "love", "fun", "improved"]

    neg_count = sum(word in lowered for word in negative_words)
    pos_count = sum(word in lowered for word in positive_words)

    if pos_count > neg_count:
        return "positive"
    return "negative"


def _infer_category(text):
    lowered = text.lower()

    if any(word in lowered for word in ["bug", "crash", "error", "broken", "freeze", "glitch"]):
        return "bug"
    if any(word in lowered for word in ["balance", "nerf", "buff", "weapon", "damage", "op"]):
        return "balance"
    if any(word in lowered for word in ["ui", "menu", "quality", "convenient", "qol", "setting"]):
        return "qol"
    if any(word in lowered for word in ["add", "feature", "request", "please", "want", "need"]):
        return "feature_request"
    return "other"


def _infer_evidence_level(text):
    length = len(text.split())

    if length >= 40:
        return "strong"
    if length >= 15:
        return "partial"
    return "insufficient"


def _to_bool(value, default=False):
    """CSV의 True/False/1/0 문자열을 bool로 변환."""
    if pd.isna(value):
        return default
    text = str(value).strip().lower()
    if text in ("true", "1", "1.0", "yes", "t"):
        return True
    if text in ("false", "0", "0.0", "no", "f", ""):
        return False
    return default


def _sentiment_from_voted_up(value):
    """voted_up(True/False) → positive/negative. 값이 없으면 None."""
    if pd.isna(value):
        return None
    text = str(value).strip().lower()
    if text in ("true", "1", "1.0", "yes", "t"):
        return "positive"
    if text in ("false", "0", "0.0", "no", "f"):
        return "negative"
    return None


def _minutes_to_hours(value):
    """Steam playtime(분)을 시간으로 변환."""
    minutes = _safe_float(value, 0.0)
    if minutes and minutes > 0:
        return int(round(minutes / 60))
    return 0


def _date_only(value):
    """'2026-05-04 08:54:53' 또는 ISO 문자열에서 날짜 부분만 추출."""
    text = _safe_text(value).strip()
    if not text:
        return ""
    return text.split(" ")[0].split("T")[0]


def _normalize_language(value):
    """CSV language('english') → 프론트 코드('en')."""
    text = _safe_text(value).strip().lower()
    mapping = {"english": "en", "korean": "ko"}
    return mapping.get(text, text or "en")


def load_reviews():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"CSV file not found: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)

    reviews = []
    for index, row in df.iterrows():
        rank = _safe_int(row.get("rank"), index + 1)
        text = _safe_text(row.get("review"), "")
        txt_file_name = _safe_text(row.get("txt_file_name"), f"review_{rank}")
        actual_helpfulvotes = _safe_int(row.get("actual_helpfulvotes"), 0)
        predicted_helpfulvotes = _safe_float(row.get("predicted_helpfulvotes"), 0.0)

        # 비정상 테스트/깨진 row 제거
        if not text.strip():
            continue

        if predicted_helpfulvotes > 1000:
            continue

        if len(set(text.strip())) < 10 and len(text.strip()) > 100:
            continue

        category = _infer_category(text)
        usefulness_score = _normalize_usefulness(predicted_helpfulvotes)
        evidence_level = _infer_evidence_level(text)

        # enriched CSV의 실제 메타데이터를 우선 사용하고, 없으면 기존 동작으로 폴백한다.
        votes_up = _safe_int(row.get("votes_up"), actual_helpfulvotes)
        votes_funny = _safe_int(row.get("votes_funny"), 0)

        play_hours = _minutes_to_hours(row.get("author_playtime_at_review"))
        if play_hours == 0:
            play_hours = _minutes_to_hours(row.get("author_playtime_forever"))

        created_at = _date_only(row.get("timestamp_created_dt")) or "2026-05-19"

        sentiment = _sentiment_from_voted_up(row.get("voted_up")) or _infer_sentiment(text)

        # has_patch_notes 컬럼이 있으면 그 값을, 없으면 기존처럼 True로 둔다.
        patch_related = _to_bool(row.get("has_patch_notes"), default=True)

        language = _normalize_language(row.get("language"))
        purchase_type = "free" if _to_bool(row.get("received_for_free")) else "paid"
        recommendation_id = _safe_text(row.get("recommendationid"))

        review = {
            "id": f"review_{rank}",
            "rank": rank,
            "reviewId": txt_file_name,
            "txtFileName": txt_file_name,
            "recommendationId": recommendation_id,
            "reviewer": f"Steam User {rank}",
            "text": text,
            "category": category,
            "usefulnessScore": usefulness_score,
            "predictedHelpfulVotes": round(predicted_helpfulvotes, 3),
            "actualHelpfulVotes": actual_helpfulvotes,
            "helpful": votes_up,
            "funny": votes_funny,
            "playHours": play_hours,
            "reviewScore": min(100, max(0, int(usefulness_score / 4 * 100))),
            "relevanceScore": min(100, max(40, int(usefulness_score / 4 * 100))),
            "sentiment": sentiment,
            "evidenceLevel": evidence_level,
            "patchRelated": patch_related,
            "createdAt": created_at,
            "purchaseType": purchase_type,
            "language": language,
            "summary": _make_summary(text),
            "developerValue": _make_developer_value(category, predicted_helpfulvotes),
            "actionHint": _make_action_hint(category),
        }
        reviews.append(review)

    reviews.sort(key=lambda item: item["rank"])
    return reviews


def _make_summary(text):
    if not text:
        return "리뷰 본문이 비어 있습니다."

    trimmed = text.strip().replace("\n", " ")
    if len(trimmed) > 120:
        trimmed = trimmed[:120] + "..."

    return f"사용자 리뷰 핵심 내용: {trimmed}"


def _make_developer_value(category, predicted_helpfulvotes):
    score = round(_safe_float(predicted_helpfulvotes), 3)

    category_messages = {
        "bug": "버그 또는 오류와 관련된 사용자 불편 신호로, 수정 우선순위 판단에 활용할 수 있습니다.",
        "balance": "밸런스 조정에 대한 반응으로, 패치 이후 게임 플레이 체감 변화를 확인하는 데 활용할 수 있습니다.",
        "qol": "사용성 또는 편의성 개선과 관련된 피드백으로, UX 개선 후보를 찾는 데 활용할 수 있습니다.",
        "feature_request": "기능 추가 요구가 포함된 피드백으로, 향후 업데이트 요구사항 후보로 검토할 수 있습니다.",
        "other": "개발자가 참고할 수 있는 일반 사용자 반응으로, 추가 리뷰와 함께 반복 신호 여부를 확인할 수 있습니다.",
    }

    return f"{category_messages.get(category, category_messages['other'])} 예측 helpful 값은 {score}입니다."


def _make_action_hint(category):
    hints = {
        "bug": "동일 증상을 언급한 리뷰를 추가로 묶어 재현 조건과 발생 빈도를 확인하세요.",
        "balance": "패치 전후 같은 주제의 리뷰를 비교해 특정 캐릭터, 무기, 시스템에 반응이 집중되는지 확인하세요.",
        "qol": "반복적으로 언급되는 불편 요소를 UI/UX 개선 backlog 후보로 분류하세요.",
        "feature_request": "요청 빈도와 개발 난이도를 기준으로 다음 업데이트 후보에 포함할지 검토하세요.",
        "other": "유사 리뷰가 반복되는지 확인한 뒤 개발 이슈로 승격할지 판단하세요.",
    }
    return hints.get(category, hints["other"])


def _get_tier_label(percent):
    """상위 퍼센트 기준 유용성 등급 라벨."""
    if percent <= 10:
        return "매우 높음"
    if percent <= 30:
        return "높음"
    if percent <= 60:
        return "보통"
    return "낮음"


def build_overview(reviews):
    """Overview 화면에서 사용할 집계 데이터를 생성한다."""
    total_selected = len(reviews)
    source_total = int(os.getenv("SOURCE_TOTAL_REVIEWS", str(total_selected)))

    categories = ["bug", "balance", "qol", "feature_request", "other"]
    colors = {
        "bug": "#ef4444",
        "balance": "#f59e0b",
        "qol": "#22c55e",
        "feature_request": "#3b82f6",
        "other": "#9ca3af",
    }

    category_distribution = [
        {
            "name": category,
            "count": sum(1 for review in reviews if review["category"] == category),
            "color": colors[category],
        }
        for category in categories
    ]

    display_decision_data = [
        {
            "name": "show",
            "value": min(total_selected, 30),
            "color": "#66c0f4",
        },
        {
            "name": "use_for_category_summary_only",
            "value": min(max(total_selected - 30, 0), 50),
            "color": "#f59e0b",
        },
        {
            "name": "exclude",
            "value": max(total_selected - 80, 0),
            "color": "#6b7280",
        },
    ]

    scores = [float(review.get("usefulnessScore", 0)) for review in reviews]

    if scores:
        min_score = min(scores)
        max_score = max(scores)

        # 모든 값이 거의 같을 때 대비
        if abs(max_score - min_score) < 1e-9:
            max_score = min_score + 0.1

        step = (max_score - min_score) / 4

        bucket_edges = [
            min_score,
            min_score + step,
            min_score + step * 2,
            min_score + step * 3,
            max_score,
        ]

        usefulness_buckets = [
            {
                "name": f"{bucket_edges[0]:.2f}–{bucket_edges[1]:.2f}",
                "count": 0,
                "color": "#ef4444",
            },
            {
                "name": f"{bucket_edges[1]:.2f}–{bucket_edges[2]:.2f}",
                "count": 0,
                "color": "#f59e0b",
            },
            {
                "name": f"{bucket_edges[2]:.2f}–{bucket_edges[3]:.2f}",
                "count": 0,
                "color": "#66c0f4",
            },
            {
                "name": f"{bucket_edges[3]:.2f}–{bucket_edges[4]:.2f}",
                "count": 0,
                "color": "#22c55e",
            },
        ]

        for score in scores:
            if score < bucket_edges[1]:
                usefulness_buckets[0]["count"] += 1
            elif score < bucket_edges[2]:
                usefulness_buckets[1]["count"] += 1
            elif score < bucket_edges[3]:
                usefulness_buckets[2]["count"] += 1
            else:
                usefulness_buckets[3]["count"] += 1
    else:
        usefulness_buckets = [
            {"name": "0.00–1.00", "count": 0, "color": "#ef4444"},
            {"name": "1.00–2.00", "count": 0, "color": "#f59e0b"},
            {"name": "2.00–3.00", "count": 0, "color": "#66c0f4"},
            {"name": "3.00–4.00", "count": 0, "color": "#22c55e"},
        ]

    for review in reviews:
        score = float(review.get("usefulnessScore", 0))

        if score < 1:
            usefulness_buckets[0]["count"] += 1
        elif score < 2:
            usefulness_buckets[1]["count"] += 1
        elif score < 3:
            usefulness_buckets[2]["count"] += 1
        else:
            usefulness_buckets[3]["count"] += 1

    sentiment_by_category = []
    for category in categories:
        category_reviews = [review for review in reviews if review["category"] == category]
        positive_count = sum(1 for review in category_reviews if review.get("sentiment") == "positive")
        negative_count = len(category_reviews) - positive_count

        sentiment_by_category.append({
            "name": category,
            "positive": positive_count,
            "negative": negative_count,
        })

    related = [review for review in reviews if review.get("patchRelated")]
    unrelated = [review for review in reviews if not review.get("patchRelated")]

    avg_usefulness = (
        sum(float(review.get("usefulnessScore", 0)) for review in reviews) / total_selected
        if total_selected else 0
    )

    avg_rel_usefulness = (
        sum(float(review.get("usefulnessScore", 0)) for review in related) / len(related)
        if related else 0
    )

    avg_unrel_usefulness = (
        sum(float(review.get("usefulnessScore", 0)) for review in unrelated) / len(unrelated)
        if unrelated else 0
    )

    sorted_scores = sorted(
        [float(review.get("usefulnessScore", 0)) for review in reviews],
        reverse=True,
    )

    def score_to_top_percent(score):
        if not sorted_scores:
            return 100

        better_count = sum(1 for value in sorted_scores if value > score)
        return max(1, round((better_count + 1) / len(sorted_scores) * 100))

    avg_top_percent = score_to_top_percent(avg_usefulness)
    avg_rel_percent = round(avg_rel_usefulness / 4 * 100) if avg_rel_usefulness else 0
    avg_unrel_percent = round(avg_unrel_usefulness / 4 * 100) if avg_unrel_usefulness else 0

    pos_related = sum(1 for review in related if review.get("sentiment") == "positive")
    high_evidence = sum(
        1
        for review in reviews
        if review.get("evidenceLevel") in ["strong", "sufficient"]
    )

    patch_stats = {
        "relatedCount": len(related),
        "unrelatedCount": len(unrelated),
        "relatedPct": round(len(related) / total_selected * 100) if total_selected else 0,
        "avgRelLabel": _get_tier_label(score_to_top_percent(avg_rel_usefulness)),
        "avgRelPct": avg_rel_percent,
        "avgUnrelLabel": _get_tier_label(score_to_top_percent(avg_unrel_usefulness)),
        "avgUnrelPct": avg_unrel_percent,
        "posRelatedPct": round(pos_related / len(related) * 100) if related else 0,
        "highEvidencePct": round(high_evidence / total_selected * 100) if total_selected else 0,
    }

    return {
        "analysisRun": {
            "appName": "No Man's Sky",
            "dataSource": "FastAPI + PostgreSQL + CSV model result",
            "modelName": "PRIS-RHP + LLM Insight",
            "status": "ready",
        },
        "kpiData": {
            "totalReviews": source_total,
            "selectedReviews": total_selected,
            "llmProcessed": total_selected,
            "avgUsefulnessScore": round(avg_usefulness, 2),
            "avgUsefulnessPercent": round(avg_usefulness / 4 * 100) if total_selected else 0,
            "avgUsefulnessLabel": _get_tier_label(avg_top_percent),
        },
        "categoryDistribution": category_distribution,
        "displayDecisionData": display_decision_data,
        "usefulnessBuckets": usefulness_buckets,
        "sentimentByCategory": sentiment_by_category,
        "patchStats": patch_stats,
    }