---
doc_id: output_schema
title: 출력 JSON 스키마 및 작성 가이드
topic: 출력, 스키마, JSON, 필드, 작성 가이드
related_docs: [core_principles, usefulness_score, evidence_level, display_decision, category_signals]
keywords: [output schema, JSON, review_id, summary, developer_value, action_hint, evidence_level, category, display_decision, 출력 형식, 필드 작성]
---

# 05. 출력 JSON 스키마 및 작성 가이드

## 이 문서가 답하는 질문

> Q: 최종 출력은 어떤 형식이어야 하는가?
> Q: 각 필드는 어떻게 작성해야 하는가?
> Q: summary와 developer_value의 차이는 무엇인가?
> Q: action_hint를 작성할 때 주의할 점은?

## 핵심 원칙 (요약)

LLM은 입력에 없는 내용을 추측하지 않는다([원칙 5](00_core_principles.md)).
RAG 문서는 점수 예측 결과를 개발자용 설명으로 변환하기 위한 기준을 제공한다([원칙 6](00_core_principles.md)).

## 1. 출력 JSON 스키마

리뷰 1건당 다음 형식으로 출력한다.

```json
{
  "review_id": "string",
  "category": "bug | balance | qol | feature_request | other",
  "summary": "리뷰 핵심을 1문장으로 요약",
  "developer_value": "개발자에게 유용한 이유",
  "evidence_level": "sufficient | partial | weak | insufficient",
  "action_hint": "개발자가 확인할 수 있는 조치 방향",
  "display_decision": "show_as_core_review | show_if_representative | use_for_category_summary_only | exclude"
}
```

## 2. 필드별 작성 기준

### 2.1 review_id

입력으로 주어진 리뷰 ID를 **그대로** 사용한다. 변형하지 않는다.

### 2.2 category

[`04_category_signals`](04_category_signals.md)의 5종 중 하나만 선택한다.
여러 유형이 동시에 보이면 가장 중심적인 피드백 유형 1개를 선택한다(우선순위: bug → balance → qol → feature_request → other).

### 2.3 summary

리뷰 내용을 **1문장으로** 요약한다.

**좋은 예**
> 인벤토리 정렬 과정의 반복 클릭이 불편하다는 사용성 피드백이다.

**나쁜 예**
> 사용자가 게임에 불만을 가지고 있다.
> (X: 너무 일반적, 어떤 불만인지 알 수 없음)

**작성 원칙**
- 리뷰 원문에 있는 내용만 반영한다.
- 어떤 대상에 대한 어떤 피드백인지를 담는다.
- 감정 표현을 그대로 옮기기보다 피드백 핵심을 추출한다.

### 2.4 developer_value

개발자에게 **왜** 유용한지를 설명한다.

**좋은 예**
> 특정 UI 동작의 불편함을 언급하고 있어 인벤토리 정렬 기능이나 조작 동선 개선 여부를 검토하는 데 도움이 된다.

**나쁜 예**
> 좋은 피드백이기 때문에 유용하다.
> (X: 동어반복, 정보 없음)

**작성 원칙**
- 무엇을 검토할 수 있는지를 구체적으로 적는다.
- "유용하다"는 말 자체로 끝내지 않는다.
- 리뷰의 어떤 부분이 단서가 되는지 연결한다.

### 2.5 evidence_level

[`02_evidence_level`](02_evidence_level.md)의 4단계 중 하나를 선택한다.

```
sufficient | partial | weak | insufficient
```

판단 시 [원칙 5](00_core_principles.md)에 따라 입력에 없는 내용을 가정하지 않는다.

### 2.6 action_hint

개발자가 확인할 수 있는 **방향**을 제시한다.

**작성 원칙**
- 확정적 해결책을 말하지 않는다.
- 리뷰에 없는 원인을 단정하지 않는다.
- "확인", "검토", "점검" 중심의 표현을 사용한다.

**좋은 예**
> 인벤토리 정렬 UI의 클릭 수와 동선이 과도한지 검토할 필요가 있다.

**나쁜 예**
> 인벤토리 시스템을 즉시 다시 만들어야 한다.
> (X: 단정적 해결책)

> 패치 이후 추가된 정렬 기능 때문이다.
> (X: 입력에 없는 인과 단정 — [원칙 5](00_core_principles.md) 위반)

### 2.7 display_decision

[`03_display_decision`](03_display_decision.md)의 4가지 값 중 하나를 선택한다.

```
show_as_core_review | show_if_representative | use_for_category_summary_only | exclude
```

점수 구간과 evidence_level의 매핑 표에 따라 결정한다.

## 3. 카테고리별 작성 예시

### 3.1 bug 예시

**입력 리뷰**
> "보스 2페이즈 진입 시 일정 확률로 화면이 멈추고 강제 종료됩니다. RTX 3060, Win11입니다."

**입력 점수**: 0.84

**출력**
```json
{
  "review_id": "r_001",
  "category": "bug",
  "summary": "특정 보스 2페이즈 진입 시 화면 정지 및 강제 종료가 발생한다는 보고이다.",
  "developer_value": "재현 환경(RTX 3060, Windows 11)과 발생 시점(보스 2페이즈 진입)이 함께 언급되어 있어 클라이언트 크래시 원인 추적에 도움이 된다.",
  "evidence_level": "sufficient",
  "action_hint": "보스 2페이즈 진입 시점의 클라이언트 로그와 GPU 환경별 재현 빈도를 점검할 필요가 있다.",
  "display_decision": "show_as_core_review"
}
```

### 3.2 balance 예시

**입력 리뷰**
> "신규 캐릭터가 너무 셈"

**입력 점수**: 0.42

**출력**
```json
{
  "review_id": "r_002",
  "category": "balance",
  "summary": "신규 캐릭터의 강함에 대한 불만이 짧게 표현된 리뷰이다.",
  "developer_value": "신규 캐릭터 성능에 대한 부정적 인식이 존재함을 시사하나, 어떤 상황·구간에서 강한지에 대한 설명은 부족하다.",
  "evidence_level": "weak",
  "action_hint": "신규 캐릭터에 대한 다른 리뷰들과 함께 묶어 카테고리 신호로 검토할 수 있으며, 단독 대표 리뷰로 사용하기에는 근거가 약하다.",
  "display_decision": "use_for_category_summary_only"
}
```

### 3.3 qol 예시

**입력 리뷰**
> "전리품 정리하고 나서 인벤토리 정렬할 때 클릭이 너무 많이 필요해서 불편합니다."

**입력 점수**: 0.68

**출력**
```json
{
  "review_id": "r_003",
  "category": "qol",
  "summary": "전리품 수집 후 인벤토리 정렬 과정의 반복 클릭이 불편하다는 사용성 피드백이다.",
  "developer_value": "특정 상황(전리품 수집 후)과 특정 동작(인벤토리 정렬)이 명시되어 있어 정렬 동선 개선 여지를 검토하는 데 도움이 된다.",
  "evidence_level": "partial",
  "action_hint": "인벤토리 정렬 UI의 클릭 수를 줄이거나 자동 정렬 옵션 도입 여부를 검토할 필요가 있다.",
  "display_decision": "show_if_representative"
}
```

### 3.4 feature_request 예시

**입력 리뷰**
> "협동 미션에서 친구 초대 시 코드 입력만 가능한데, 친구 목록에서 직접 초대할 수 있으면 좋겠습니다."

**입력 점수**: 0.72

**출력**
```json
{
  "review_id": "r_004",
  "category": "feature_request",
  "summary": "협동 미션의 친구 초대 방식에 친구 목록 직접 초대 옵션을 추가해달라는 요청이다.",
  "developer_value": "현재 초대 방식(코드 입력)과 원하는 추가 기능(친구 목록 초대)이 명확히 구분되어 있어 기능 확장 검토에 도움이 된다.",
  "evidence_level": "sufficient",
  "action_hint": "협동 미션 친구 초대 흐름에서 친구 목록 기반 초대 기능 추가의 우선순위를 검토할 수 있다.",
  "display_decision": "show_as_core_review"
}
```

### 3.5 other / exclude 예시

**입력 리뷰**
> "갓겜 ㅋㅋ"

**입력 점수**: 0.31

**출력**
```json
{
  "review_id": "r_005",
  "category": "other",
  "summary": "긍정적 감상을 짧게 표현한 리뷰이다.",
  "developer_value": "구체적인 대상이나 개선 방향이 포함되어 있지 않아 개발 피드백으로 활용하기 어렵다.",
  "evidence_level": "insufficient",
  "action_hint": "개발자가 확인할 수 있는 단서가 부족하므로 별도 조치를 권장하지 않는다.",
  "display_decision": "exclude"
}
```

## 4. 출력 작성 체크리스트

출력을 작성한 뒤 LLM은 다음을 확인한다.

- [ ] 모든 필드가 채워져 있는가?
- [ ] category, evidence_level, display_decision은 enum 값에서 벗어나지 않았는가?
- [ ] summary가 1문장인가?
- [ ] developer_value가 동어반복이 아닌가?
- [ ] action_hint에 단정적 해결책이나 환각 인과가 들어가지 않았는가?
- [ ] [금지 표현](00_core_principles.md)이 사용되지 않았는가?
- [ ] display_decision이 점수×evidence_level 매핑 표와 정합한가?

## 5. 자주 묻는 케이스

### summary와 developer_value의 차이는?
- **summary**: 리뷰가 무엇을 말하는가 (내용 요약)
- **developer_value**: 그 내용이 개발자에게 어떤 검토 가치를 주는가 (가치 설명)

### action_hint에 구체적 솔루션을 적어도 되는가?
적지 않는다. "검토할 수 있다", "점검할 필요가 있다" 같은 검토 방향까지만 작성한다.
"X로 변경해야 한다" 같은 솔루션 단정은 [원칙 5](00_core_principles.md) 위반이다.

### display_decision이 exclude인 리뷰도 다른 필드를 채워야 하는가?
채운다. 다만 summary와 developer_value는 "왜 제외되었는가"를 설명하는 방향으로 작성한다.
이는 추후 모니터링과 모델 개선에 활용된다.
