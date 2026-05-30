import json
import os
import re
from pathlib import Path
from typing import Any

from anthropic import Anthropic


BASE_DIR = Path(__file__).resolve().parent
PROMPT_DIR = BASE_DIR / "prompts"

CATEGORIES = ["bug", "balance", "qol", "feature_request", "other"]
EVIDENCE_LEVELS = ["sufficient", "partial", "weak", "insufficient", "strong"]
DISPLAY_DECISIONS = [
    "show_as_core_review",
    "show_if_representative",
    "use_for_category_summary_only",
    "exclude",
]


def normalize_category(value: Any, default: str = "other") -> str:
    """LLM 또는 CSV에서 들어온 카테고리 값을 서비스 enum으로 정규화한다."""
    if value is None:
        return default

    category = str(value).strip().lower()

    alias_map = {
        "bug": "bug",
        "bugs": "bug",
        "버그": "bug",

        "balance": "balance",
        "balancing": "balance",
        "밸런스": "balance",
        "벨런스": "balance",

        "qol": "qol",
        "quality_of_life": "qol",
        "quality-of-life": "qol",
        "quality of life": "qol",
        "사용성": "qol",
        "편의성": "qol",

        "feature_request": "feature_request",
        "feature request": "feature_request",
        "feature-request": "feature_request",
        "feature_content": "feature_request",
        "feature/content": "feature_request",
        "feature": "feature_request",
        "content": "feature_request",
        "기능요청": "feature_request",
        "기능 요청": "feature_request",
        "기능/콘텐츠": "feature_request",
        "콘텐츠": "feature_request",

        "other": "other",
        "기타": "other",
    }

    normalized = alias_map.get(category, category)
    return normalized if normalized in CATEGORIES else default


def load_prompt_context() -> str:
    """app/prompts 아래의 md 파일을 모두 읽어 LLM 기준 문서로 합친다."""
    parts: list[str] = []

    for path in sorted(PROMPT_DIR.glob("*.md")):
        try:
            parts.append(f"\n\n# FILE: {path.name}\n{path.read_text(encoding='utf-8')}")
        except Exception:
            continue

    return "\n".join(parts)


def extract_json(text: str) -> dict[str, Any]:
    """LLM 응답에서 JSON 객체만 추출한다."""
    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in LLM response.")

    return json.loads(match.group(0))


def fallback_insight(review: dict[str, Any]) -> dict[str, Any]:
    """LLM 실패 또는 API 키 누락 시 반환할 안전한 기본 인사이트."""
    score = float(review.get("usefulnessScore", 0))

    if score >= 3:
        display_decision = "show_as_core_review"
    elif score >= 2:
        display_decision = "show_if_representative"
    elif score >= 1:
        display_decision = "use_for_category_summary_only"
    else:
        display_decision = "exclude"

    return {
        "review_id": review.get("reviewId", ""),
        "category": normalize_category(review.get("category"), default="other"),
        "summary": review.get("summary") or "리뷰 원문에서 게임 경험에 대한 구체적인 평가와 개선 신호를 확인할 수 있습니다.",
        "developer_value": review.get("developerValue") or "개발자가 패치 이후 유저 반응을 검토할 때 참고할 수 있는 정성적 피드백입니다.",
        "evidence_level": review.get("evidenceLevel") or "partial",
        "action_hint": review.get("actionHint") or "동일 주제의 다른 리뷰와 함께 묶어 반복적으로 나타나는 불편 또는 요구가 있는지 검토할 수 있습니다.",
        "display_decision": review.get("displayDecision") or display_decision,
    }


def generate_llm_insight(review: dict[str, Any]) -> dict[str, Any]:
    """Claude API와 RAG prompt docs를 사용해 리뷰 인사이트를 생성한다."""
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        return fallback_insight(review)

    prompt_context = load_prompt_context()

    print("[PROMPT_CONTEXT_LENGTH]", len(prompt_context))
    print("[PROMPT_CONTEXT_PREVIEW]", prompt_context[:500])

    client = Anthropic(api_key=api_key)

    user_prompt = f"""
You are classifying a Steam review for a developer dashboard.

Use the following RAG policy documents as strict criteria:
{prompt_context}

Input review:
- review_id: {review.get("reviewId", "")}
- usefulness_score: {review.get("usefulnessScore", "")}
- predicted_helpful_votes: {review.get("predictedHelpfulVotes", "")}
- actual_helpful_votes: {review.get("actualHelpfulVotes", "")}
- provided_category: {review.get("category", "")}
- txt_file_name: {review.get("txtFileName", "")}
- review_text:
\"\"\"{str(review.get("text", ""))[:6000]}\"\"\"

Category decision override:
- A provided_category may be supplied from a pre-labeled CSV or model output.
- If provided_category is one of bug, balance, qol, feature_request, other, use it as the primary category unless the review text clearly contradicts it.
- Classify as "feature_request" when the review discusses newly added features, added content, storyline, world generation, base building, vehicles, quests, sidequests, multiplayer, or evaluates whether these additions improved the game.
- This includes positive feedback about features/content already added by a patch, not only explicit requests for future features.
- Classify as "qol" when the review discusses usability, convenience, UI, inventory, menus, scanning, navigation, repetitive friction, tedious steps, or quality-of-life improvements.
- Classify as "bug" when the review discusses crashes, broken behavior, glitches, freezes, performance failures, save issues, or technical malfunction.
- Classify as "balance" only when the review discusses difficulty, unfairness, overpowered/underpowered mechanics, economy balance, progression balance, resource tuning, combat balance, or similar balance problems.
- Use "other" only when the review is mostly about price, general praise, company reputation, emotional reaction, purchase recommendation, or broad impressions without a concrete game feature/content/system signal.

Return ONLY valid JSON.
The JSON must follow this schema:
{{
  "review_id": "string",
  "category": "bug | balance | qol | feature_request | other",
  "summary": "Korean one-sentence summary",
  "developer_value": "Korean explanation of why this is useful for developers",
  "evidence_level": "sufficient | partial | weak | insufficient",
  "action_hint": "Korean cautious action hint",
  "display_decision": "show_as_core_review | show_if_representative | use_for_category_summary_only | exclude"
}}

Do not infer facts that are not present in the review.
"""

    message = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=800,
        temperature=0.2,
        messages=[{"role": "user", "content": user_prompt}],
    )

    text = message.content[0].text
    data = extract_json(text)

    provided_category = normalize_category(review.get("category"), default="")
    if provided_category:
        data["category"] = provided_category

    data["category"] = normalize_category(data.get("category"), default="other")

    if data.get("evidence_level") not in EVIDENCE_LEVELS:
        data["evidence_level"] = "partial"

    if data.get("display_decision") not in DISPLAY_DECISIONS:
        data["display_decision"] = "show_if_representative"

    if not data.get("review_id"):
        data["review_id"] = str(review.get("reviewId", ""))

    return data