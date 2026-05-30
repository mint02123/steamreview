---
doc_id: qol_feedback
title: QoL Feedback 판단 기준
topic: QoL, 사용성, 편의성, UI/UX, 카테고리
related_docs: [core_principles, evidence_level, display_decision, category_signals, bug_feedback, balance_feedback, feature_request_feedback]
keywords: [qol, quality of life, 사용성, 편의성, UI, UX, 동선, 클릭, 메뉴, inventory, 인벤토리, 정렬, 단축키, hotkey, 번거로움, 불편, tedious, clunky, cumbersome]
---

# 12. QoL Feedback 판단 기준

## 이 문서가 답하는 질문

> Q: 어떤 리뷰가 QoL(Quality of Life) 피드백인가?
> Q: QoL과 Feature Request의 차이는 무엇인가?
> Q: "UI가 별로다"는 QoL인가?
> Q: 작동은 하는데 불편하다는 의견은 모두 QoL인가?

## 핵심 원칙 (요약)

LLM은 입력에 없는 내용을 추측하지 않는다 ([원칙 5](00_core_principles.md)).
낮은 점수의 QoL 리뷰도 약한 신호로 활용할 수 있다 ([원칙 3](00_core_principles.md)).
근거가 부족한 리뷰는 억지로 대표 리뷰로 만들지 않는다 ([원칙 4](00_core_principles.md)).

## 1. QoL Feedback 정의

QoL Feedback은 **기능은 정상 작동하지만 사용 경험이 불편하다**는 피드백이다.
"작동은 한다"가 핵심이며, Bug(작동 안 됨)와 Feature Request(부재)와 구별된다.

다음 영역의 사용성 의견이 해당한다.

- UI 동선/클릭 수
- 메뉴 구조/정렬/필터
- 단축키/조작 방식
- 정보 표시(툴팁, 알림, 미니맵)
- 자동화 가능 영역(자동 정렬, 자동 회수)
- 반복 작업의 번거로움
- 접근성(시야, 색약, 자막, 글자 크기)

## 2. 대표 키워드

다음 표현이 있으면 QoL 후보로 검토한다.

```text
clunky, tedious, cumbersome, annoying, inconvenient,
too many clicks, too many steps, takes forever,
hard to navigate, confusing UI, messy menu,
no auto-sort, no filter, no search, no shortcut,
quality of life, qol, qol issue, qol improvement,
should be easier, would be nice if,
why do I have to, every time I have to,
clutter, cluttered, hidden, buried in menus
```

**중요**: "should add..." 같은 표현은 feature_request로 가는 경우가 많다 (5.1절).

## 3. QoL로 판단하기 좋은 조건

다음 조건이 많을수록 QoL Feedback으로 판단하기 쉽다.

1. 기능 자체는 작동함이 전제되어 있다.
2. 동작이 가능하지만 동선/클릭/시간이 과하다는 불편이 명시된다.
3. 반복적으로 발생하는 불편이다.
4. 어떤 화면/메뉴/조작에 대한 것인지 대상이 있다.
5. 개선 방향이 암시되어 있다("자동으로", "한 번에", "기본값으로").

## 4. 유용성이 높은 QoL 리뷰

QoL 리뷰 중 개발자에게 유용한 리뷰는 다음 정보를 포함한다.

- 어떤 화면/기능에서 (대상)
- 어떤 동작이 (트리거)
- 왜 불편한지 (이유: 클릭 수, 동선, 빈도)
- 언제 반복되는지 (상황)

**좋은 예 (영문 리뷰)**

> "Inventory sorting takes 4 separate clicks every time after picking up loot. There should be at least an auto-sort option."

**해석**
- 대상: 인벤토리 정렬
- 트리거: 전리품 수집 후
- 이유: 4번 클릭 반복
- 개선 방향 암시: 자동 정렬 옵션

이 경우 evidence_level은 `sufficient` 또는 `partial`로 볼 수 있다.

## 5. QoL로 분류하면 안 되는 경우 (경계 케이스)

### 5.1 QoL vs Feature Request

```text
The inventory sort takes too many clicks.            → qol (기존 기능 동선)
There's no inventory sort option at all.             → feature_request (부재)
Sorting works but adding a filter would help.        → feature_request (신규 추가)
The current filter is in a confusing menu position.  → qol (기존 배치)
```

판단 기준:
- **기존 기능이 있는데 불편** → qol
- **기능이 없어서 추가해달라** → feature_request
- 한 리뷰에 둘 다 있으면 더 핵심적인 쪽 선택. 보통 "있긴 한데 불편 + 추가했으면 좋겠다"는 → feature_request 우선
- [`13_feature_request_feedback`](13_feature_request_feedback.md) §5.1 참조

### 5.2 QoL vs Bug

```text
The map is hard to read.                       → qol (가독성)
The map doesn't load half the time.            → bug (작동 안 됨)
The hotkey to open map is in a weird spot.     → qol (배치)
Pressing M doesn't open the map.               → bug (조작 미반응)
```

작동하지만 불편 → qol, 작동 자체에 문제 → bug.

### 5.3 QoL vs Balance

```text
The new menu makes equipping gear take longer.   → qol (동선)
The new gear makes other gear obsolete.          → balance (형평)
```

조작/동선 문제 → qol, 강약 비교 → balance.

### 5.4 단순 UI 비난

```text
Bad UI.
UI sucks.
Trash interface.
```

대상이나 이유가 없으면 evidence_level=insufficient에 가깝다.
QoL 신호로는 약하게 카운트하되 대표 리뷰로 사용하지 않는다 ([원칙 4](00_core_principles.md)).

### 5.5 일반적 디자인 취향

```text
The art style is ugly.       → other (취향)
The font is hard to read.    → qol (접근성)
```

미적 취향은 QoL이 아니다. **읽기 어려움/조작 어려움** 같은 사용성 문제만 QoL.

## 6. evidence_level 판단 (QoL 카테고리 특화)

[`02_evidence_level`](02_evidence_level.md)의 일반 기준에 더해, QoL은 **불편의 구체성**(어디서, 무엇이, 왜)이 핵심이다.

### sufficient

대상 + 동작 + 불편 이유가 명확하다.

> "After every dungeon run, I have to manually right-click each item in the loot bag to send it to storage. There's no 'send all' option."

- 대상: loot bag → storage
- 동작: 매번 우클릭 반복
- 이유: 일괄 전송 부재

### partial

대상은 있으나 이유나 빈도가 부족하다.

> "Inventory sorting is annoying."

- 대상: 인벤토리 정렬
- 부족: 어떤 점이 annoying한지 불명

### weak

QoL 키워드는 있으나 짧고 일반적이다.

> "UI clunky"
> "Too many clicks"
> "QoL is bad"

QoL 카테고리는 [원칙 3](00_core_principles.md)에 따라 **점수가 낮아도 카테고리 요약에 반영**할 수 있다.
다만 대표 리뷰로는 사용하지 않는다.

### insufficient

QoL로 볼 근거가 거의 없다.

> "Bad design."

## 7. action_hint 작성 기준 (QoL 특화)

QoL 리뷰의 action_hint는 **검토할 동선/구간**을 제시한다. 구체적 UI 솔루션을 단정하지 않는다.

**좋은 예**

> 던전 종료 후 전리품 일괄 보관 동선의 클릭 수와 자동화 가능 여부를 검토할 수 있다.

**나쁜 예**

> 'Send all' 버튼을 즉시 추가해야 한다.

나쁜 이유:
- 솔루션 형태를 단정함
- 우선순위를 단정함
- 다른 가능한 개선안(드래그, 단축키, 자동화)을 배제함

권장 표현 패턴:
- "~ 동선의 클릭 수를 줄일 여지를 검토할 수 있다"
- "~ 자동화 또는 일괄 처리 가능성을 점검할 수 있다"
- "~ 메뉴 배치/접근성을 검토할 필요가 있다"

## 8. QoL 설명 생성 시 금지 표현

[`00_core_principles`](00_core_principles.md) §4에 더해, QoL 카테고리에서 특히 주의:

- "심각한 UX 문제이다" (입력에 심각도 정보 없음)
- "대부분의 유저가 불편해한다" (다수 통계 없음)
- "패치로 UI가 나빠졌다" (인과 단정)
- "즉시 UI를 개선해야 한다" (우선순위 단정)

허용 표현:
- "사용성 관련 피드백으로 해석할 수 있다"
- "~ 동선의 개선 여지를 검토할 수 있다"
- "구체적 개선 방향은 단일 리뷰만으로 단정하기 어렵다"
- "QoL 약한 신호로 처리하는 것이 적절하다"

## 9. 출력 예시

**입력 리뷰 (영문)**
> "Inventory sorting takes 4 separate clicks every time after picking up loot. There should be at least an auto-sort option."

**입력 점수**: 0.66

**출력**
```json
{
  "review_id": "r_qol_001",
  "category": "qol",
  "summary": "전리품 수집 후 인벤토리 정렬에 매번 4번의 클릭이 필요하다는 사용성 피드백이다.",
  "developer_value": "불편이 발생하는 상황(전리품 수집 후), 동작(인벤토리 정렬), 구체적 횟수(4번 클릭)가 모두 언급되어 있어 정렬 동선과 자동화 여부를 검토하는 데 도움이 된다.",
  "evidence_level": "sufficient",
  "action_hint": "전리품 수집 후 인벤토리 정렬 동선의 클릭 수를 줄일 여지와 자동 정렬 옵션 도입 가능성을 검토할 수 있다.",
  "display_decision": "show_if_representative"
}
```

## 10. 최종 판단 체크리스트

QoL 카테고리로 분류하기 전 다음을 확인한다.

- [ ] 기능 자체는 작동하는가? (Bug와 구분)
- [ ] 기존 기능에 대한 불편인가? (Feature Request와 구분)
- [ ] 어떤 화면/조작/동선이 문제인지 대상이 있는가?
- [ ] 단순 미적 취향이 아닌 사용성 문제인가?
- [ ] 강약 비교가 핵심이 아닌가? (Balance와 구분)
