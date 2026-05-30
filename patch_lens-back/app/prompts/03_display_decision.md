---
doc_id: display_decision
title: display_decision 결정 기준
topic: 노출, 화면 표시, 대표 리뷰
related_docs: [core_principles, usefulness_score, evidence_level]
keywords: [display_decision, 노출 결정, 대표 리뷰, 핵심 리뷰, 카테고리 요약, 제외, show_as_core_review, show_if_representative, use_for_category_summary_only, exclude]
---

# 03. display_decision 결정 기준

## 이 문서가 답하는 질문

> Q: 리뷰를 서비스 화면에 어떻게 노출할지 어떻게 결정하는가?
> Q: 점수와 근거 수준이 서로 다를 때 어떻게 결정하는가?
> Q: 4가지 display_decision 값은 각각 어떤 조건에서 부여하는가?

## 핵심 원칙 (요약)

근거가 부족한 리뷰는 억지로 대표 리뷰로 만들지 않는다([원칙 4](00_core_principles.md)).
점수만으로 노출을 결정하지 않으며, evidence_level과 함께 판단한다.

## 1. display_decision 4가지 값

```
show_as_core_review | show_if_representative | use_for_category_summary_only | exclude
```

| 값 | 의미 | 사용 위치 |
|---|---|---|
| show_as_core_review | 핵심 Top-K로 표시 | 메인 대시보드의 핵심 리뷰 영역 |
| show_if_representative | 카테고리 대표로 표시 가능 | 카테고리별 대표 리뷰 영역 |
| use_for_category_summary_only | 요약 통계에만 반영 | 카테고리 요약 텍스트의 근거 |
| exclude | 출력에서 제외 | 노출하지 않음 |

## 2. 점수 × evidence_level 매핑 표

display_decision은 **점수 구간과 evidence_level을 조합**하여 결정한다.

| 점수 구간 \ evidence_level | sufficient | partial | weak | insufficient |
|---|---|---|---|---|
| **0.80 이상** | show_as_core_review | show_as_core_review | show_if_representative | exclude |
| **0.60 ~ 0.80** | show_as_core_review | show_if_representative | use_for_category_summary_only | exclude |
| **0.40 ~ 0.60** | show_if_representative | use_for_category_summary_only | use_for_category_summary_only | exclude |
| **0.40 미만** | use_for_category_summary_only | use_for_category_summary_only | exclude | exclude |

이 표는 **기본값**이며, 다음 경우에만 한 단계 조정할 수 있다.
- 동일 카테고리에서 같은 의견이 여러 리뷰에서 반복적으로 등장하는 경우 → 한 단계 격상 가능
- 리뷰 원문이 욕설·혐오·인신공격을 포함하는 경우 → 한 단계 강등 (대표 리뷰 부적합)

## 3. 각 값의 상세 조건

### 3.1 show_as_core_review

핵심 Top-K 리뷰로 표시한다.

**필요 조건 (모두 충족)**
- usefulness_score가 0.60 이상
- evidence_level이 `sufficient` 또는 `partial`
- 단, 점수 0.60~0.80 구간에서는 evidence_level이 `sufficient`여야 함
- 개발자가 확인할 방향이 명확하다.
- 서비스 화면에서 대표적으로 보여주기 적합하다(욕설·혐오·스포일러 등 부적절 내용 없음).

### 3.2 show_if_representative

카테고리 대표 리뷰로 표시할 수 있다.

**필요 조건**
- 점수와 근거가 핵심 리뷰 기준에는 못 미치지만, 특정 카테고리를 대표할 수 있다.
- usefulness_score가 0.40 이상
- evidence_level이 `sufficient` 또는 `partial`

**사용 사례**
- 전체 Top-K에는 들지 못한 카테고리 대표 리뷰
- 점수는 중간이지만 카테고리 신호가 뚜렷한 리뷰

### 3.3 use_for_category_summary_only

유형별 요약에만 반영하고 직접 노출하지 않는다.

**필요 조건**
- 카테고리 신호는 있다.
- 대표 리뷰로 보여주기에는 근거가 부족하다.
- 점수가 낮거나 evidence_level이 `weak` 또는 `partial`이다.

**사용 사례**
- QoL 약한 신호 누적
- 기능 추가 요청 신호 누적
- 점수는 낮지만 카테고리 카운트에는 기여

### 3.4 exclude

서비스 출력에서 제외한다.

**필요 조건 (다음 중 하나 이상)**
- 개발 피드백으로 보기 어렵다.
- evidence_level이 `insufficient`이다.
- 카테고리 판단이 어렵다.
- 단순 감정·농담·욕설·짧은 칭찬에 가깝다.

## 4. 판단 절차

리뷰 1건의 display_decision을 결정할 때:

1. `usefulness_score`로 점수 구간을 확인한다([01_usefulness_score](01_usefulness_score.md) 참조).
2. 리뷰 원문으로 evidence_level을 판단한다([02_evidence_level](02_evidence_level.md) 참조).
3. 위 2절의 매핑 표에서 해당 셀을 찾는다.
4. 부적절 내용(욕설/혐오/스포일러) 또는 카테고리 반복 신호를 확인하여 한 단계 조정 여부를 검토한다.
5. 최종 값을 출력 JSON에 기록한다([05_output_schema](05_output_schema.md) 참조).

## 5. 자주 묻는 케이스

### 점수 0.85 + evidence_level=insufficient → 어떻게 처리?
`exclude`. 점수가 높아도 근거가 없으면 핵심 리뷰가 될 수 없다(매핑 표 우상단).
이 경우 점수 모델이 잘못 판단했을 가능성이 있으므로 모니터링 신호로 가치가 있다.

### 점수 0.45 + evidence_level=sufficient → 어떻게 처리?
`show_if_representative`. 점수는 중간이지만 근거가 충분하면 카테고리 대표로 활용한다.
이는 [원칙 2](00_core_principles.md)와도 정합한다.

### 같은 카테고리에서 같은 불만이 50건 이상 반복 등장한다면?
빈도 자체는 점수에 반영되지 않을 수 있으나, 카테고리 상태 판단에는 영향을 준다.
대표 리뷰 1건은 매핑 표 그대로 결정하되, 카테고리 상태는 `Detected`로 격상할 수 있다([04_category_signals](04_category_signals.md) 참조).
