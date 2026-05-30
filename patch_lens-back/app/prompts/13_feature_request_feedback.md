---
doc_id: feature_request_feedback
title: Feature Request Feedback 판단 기준
topic: 기능 추가, feature request, 신규 기능, 콘텐츠 요청, 카테고리
related_docs: [core_principles, evidence_level, display_decision, category_signals, bug_feedback, balance_feedback, qol_feedback]
keywords: [feature_request, 기능 추가, 신규 기능, please add, would be nice, suggestion, 제안, 콘텐츠 추가, 모드 추가, 옵션 추가, 신규 맵, 신규 캐릭터, 부재, no option, missing]
---

# 13. Feature Request Feedback 판단 기준

## 이 문서가 답하는 질문

> Q: 어떤 리뷰가 기능 추가 요청인가?
> Q: Feature Request와 QoL의 차이는 무엇인가?
> Q: "옵션이 없다"는 불만은 Feature Request인가 Bug인가?
> Q: 신규 콘텐츠 요청과 신규 기능 요청을 같이 묶어도 되는가?

## 핵심 원칙 (요약)

LLM은 입력에 없는 내용을 추측하지 않는다 ([원칙 5](00_core_principles.md)).
낮은 점수의 기능 추가 요청도 약한 신호로 활용할 수 있다 ([원칙 3](00_core_principles.md)).
근거가 부족한 리뷰는 억지로 대표 리뷰로 만들지 않는다 ([원칙 4](00_core_principles.md)).

## 1. Feature Request Feedback 정의

Feature Request Feedback은 **기능·옵션·콘텐츠에 대한 추가 요청**뿐 아니라,
**패치로 추가되거나 개선된 기능·콘텐츠에 대한 구체적인 사용자 반응**도 포함한다.

이 카테고리의 핵심은 단순 감상이나 일반적인 칭찬이 아니라,
게임의 기능, 시스템, 옵션, 콘텐츠 단위에서 사용자가 무엇을 원하거나,
무엇이 추가·개선되어 게임 경험이 어떻게 달라졌는지를 설명하는 것이다.

따라서 Feature Request Feedback은 다음 두 유형을 모두 포함한다.

### 1) Missing Feature / Content Request

현재 게임에 없는 기능, 옵션, 콘텐츠를 추가해달라는 요청이다.

예시:
- 신규 기능/시스템 추가 요청
- 신규 옵션 추가 요청
- 신규 콘텐츠 추가 요청
- 외부 연동 또는 플랫폼 지원 요청
- 커뮤니티 기능 추가 요청

구체 예:
- 친구 목록에서 직접 초대 기능 추가
- 신규 맵, 신규 캐릭터, 신규 스토리 추가
- 그래픽 옵션, 키 바인딩, 접근성 옵션 추가
- 모드 지원, 컨트롤러 지원, 클라우드 세이브 추가

### 2) Patch-added Feature / Content Feedback

이미 패치로 추가되거나 개선된 기능·콘텐츠가 게임 경험에 어떤 영향을 주었는지를 평가하는 리뷰이다.

예시:
- 스토리라인 추가에 대한 반응
- 월드 생성 개선에 대한 반응
- 기지 건설, 차량, 퀘스트, 사이드퀘스트, 멀티플레이 추가에 대한 반응
- 신규 바이옴, 탐험 콘텐츠, 보상 구조, 콘텐츠 확장에 대한 반응
- 기존에 부족했던 콘텐츠가 업데이트로 보완되었다는 평가

중요:
- 이 유형은 미래 기능을 직접 요청하지 않더라도 feature_request로 분류할 수 있다.
- 이유는 개발자 관점에서 “어떤 기능·콘텐츠 추가가 유저 재평가에 영향을 주었는지”를 보여주기 때문이다.
- 단, 구체적인 기능·콘텐츠·시스템 대상 없이 단순히 “게임이 좋아졌다”, “업데이트가 좋다” 정도만 말하는 경우는 other로 분류한다.

## 2. 대표 키워드

다음 표현이 있으면 Feature Request 후보로 검토한다.

```text
added, introduced, improved, expanded, new content,
new storyline, actual storyline, story update,
world generation, new biomes, planet generation,
base building, vehicles, exocraft,
quests, sidequests, missions,
multiplayer, co-op, online features,
new systems, new mechanics,
free update, major update, content update,
made the game better, made exploration better,
closer to what was promised
```

**중요**: "no option" 같은 표현은 bug처럼 보일 수 있지만 부재 = 추가 요청이다 (5.1절).

## 3. Feature Request로 판단하기 좋은 조건

다음 조건이 많을수록 Feature Request로 판단하기 쉽다.

1. 현재 게임에 해당 요소가 없음이 명시되거나 암시된다.
2. 추가 요청이 구체적이다 (어떤 기능, 어떤 옵션).
3. 그 기능이 왜 필요한지 이유가 함께 있다.
4. 기존 기능의 불편이 아니라 부재가 핵심이다.

## 4. 유용성이 높은 Feature Request 리뷰

Feature Request 리뷰 중 개발자에게 유용한 리뷰는 다음 정보를 포함한다.

- 어떤 기능을 추가해달라는지 (대상)
- 왜 필요한지 (이유/사용 시나리오)
- 현재 어떻게 우회하고 있는지 (현재 상태)
- 어떤 사용자층/상황에 도움이 되는지 (대상층)

**좋은 예 (영문 리뷰)**

> "There's no way to invite friends directly from my friends list — I have to share a code every time. A direct invite option would save a lot of time for repeat co-op sessions."

**해석**
- 대상: 친구 직접 초대 기능
- 현재 상태: 코드 공유 방식만 존재
- 이유: 반복 협동 플레이의 시간 단축
- 사용 시나리오: 협동 세션

이 경우 evidence_level은 `sufficient`로 볼 수 있다.

## 5. Feature Request로 분류하면 안 되는 경우 (경계 케이스)

### 5.1 Feature Request vs QoL

```text
There's no auto-sort option.                          → feature_request (부재)
The auto-sort takes too long to finish.               → qol (기존 동선)
Sorting works but no filter exists.                   → feature_request (부재)
The filter is buried in a confusing submenu.          → qol (배치/동선)
```

판단 기준:
- **현재 없는 기능** → feature_request
- **현재 있는데 불편한 기능** → qol
- 한 리뷰에 둘 다 있을 때:
  - 핵심이 추가 요청이면 → feature_request
  - 핵심이 기존 동선 개선이면 → qol
- [`12_qol_feedback`](12_qol_feedback.md) §5.1 참조

### 5.2 Feature Request vs Bug

```text
There's no option to disable motion blur.            → feature_request (부재)
The motion blur toggle doesn't actually work.        → bug (작동 안 됨)
The graphics menu has no FPS cap option.             → feature_request (부재)
The FPS cap is locked at 60 even when set to 144.    → bug (작동 안 됨)
```

판단 기준:
- 옵션 자체가 **존재하지 않음** → feature_request
- 옵션은 있는데 **작동하지 않음** → bug

### 5.3 Feature Request vs Balance

```text
Add a new tier above legendary.            → feature_request (신규 콘텐츠)
The legendary tier is too easy to get.     → balance (희귀도/형평)
```

신규 추가 요청은 feature_request, 기존 요소의 형평 의견은 balance.

### 5.4 단순 "더 만들어줘" 불만

```text
More content please.
Need more updates.
We need new stuff.
```

대상이 불명확하면 evidence_level=insufficient 또는 weak.
그러나 [원칙 3](00_core_principles.md)에 따라 카테고리 신호로는 약하게 카운트할 수 있다.
대표 리뷰로는 사용하지 않는다.

### 5.5 비현실적/범위 외 요청

```text
Make it free.                          → other (수익화)
Port to PS5.                           → 플랫폼 요청 (other 또는 feature_request, 게임 정책에 따라)
Add anime girls.                       → other (취향)
```

상품 정책이나 단순 취향에 가까우면 feature_request가 아니라 other로 분류하는 것이 적절할 수 있다.
판단이 모호하면 한 단계 보수적으로(`other`).

## 6. evidence_level 판단 (Feature Request 카테고리 특화)

[`02_evidence_level`](02_evidence_level.md)의 일반 기준에 더해, Feature Request는 **요청의 구체성과 이유**가 핵심이다.

### sufficient

대상 + 현재 상태 + 이유가 명확하다.

> "There's no in-game voice chat. Currently we have to use Discord for every match, which is inconvenient for matchmade lobbies with strangers. An optional in-game voice chat with mute controls would help a lot."

- 대상: 인게임 보이스챗
- 현재 상태: Discord 필요
- 이유: 매치메이킹 로비 불편
- 부가 명세: 음소거 옵션

### partial

대상은 있으나 이유나 명세가 부족하다.

> "Please add voice chat."

- 대상: 보이스챗
- 부족: 어떤 형태, 왜 필요한지 불명

### weak

요청 키워드는 있으나 짧고 일반적이다.

> "More content"
> "Need new maps"
> "Add mod support"

Feature Request는 [원칙 3](00_core_principles.md)에 따라 점수가 낮아도 카테고리 요약에 반영할 수 있다.

### insufficient

요청으로 볼 근거가 거의 없다.

> "Make it better."
> "Improve the game."

## 7. action_hint 작성 기준 (Feature Request 특화)

Feature Request 리뷰의 action_hint는 **검토할 기능 영역과 우선순위 검토 방향**을 제시한다.
구현 방향이나 일정을 단정하지 않는다.

**좋은 예**

> 협동 미션의 친구 초대 흐름에서 친구 목록 기반 직접 초대 기능 추가의 우선순위를 검토할 수 있다.

**나쁜 예**

> 다음 패치에 친구 초대 기능을 반드시 추가해야 한다.

나쁜 이유:
- 일정을 단정함
- 우선순위를 단정함
- 입력에 없는 정보 추가

권장 표현 패턴:
- "~ 기능 추가의 우선순위를 검토할 수 있다"
- "~ 옵션 도입 가능성을 검토할 필요가 있다"
- "~ 사용 시나리오에서의 수요를 점검할 수 있다"

## 8. Feature Request 설명 생성 시 금지 표현

[`00_core_principles`](00_core_principles.md) §4에 더해, Feature Request 카테고리에서 특히 주의:

- "반드시 추가해야 한다" (우선순위 단정)
- "다음 패치에 포함되어야 한다" (일정 단정)
- "대부분의 유저가 원한다" (다수 통계 없음)
- "이 기능 부재가 유저 이탈의 원인이다" (인과 단정)
- "개발자가 잊어버린 기능이다" (의도 단정)

허용 표현:
- "기능 추가 요청으로 해석할 수 있다"
- "~ 기능 도입 가능성을 검토할 수 있다"
- "단일 리뷰의 요청이며 수요 규모는 별도 검토가 필요하다"
- "약한 신호로 처리하는 것이 적절하다"

## 9. 출력 예시

**입력 리뷰 (영문)**

> "1.3 added an actual storyline, new world generation, sidequests, and limited multiplayer. It made the game feel much closer to what was promised."

**입력 점수**: 0.68

**출력**
```json
{
  "review_id": "r_fr_002",
  "category": "feature_request",
  "summary": "1.3 업데이트에서 추가된 스토리라인, 월드 생성, 사이드퀘스트, 제한적 멀티플레이가 게임 경험을 개선했다는 리뷰이다.",
  "developer_value": "패치로 추가된 기능과 콘텐츠가 유저의 재평가와 만족도 변화에 어떤 영향을 주었는지 확인할 수 있어, 향후 콘텐츠 확장 방향을 검토하는 데 도움이 된다.",
  "evidence_level": "partial",
  "action_hint": "스토리라인, 월드 생성, 퀘스트, 멀티플레이 등 콘텐츠 확장 요소에 대한 긍정 반응이 다른 리뷰에서도 반복되는지 검토할 수 있다.",
  "display_decision": "show_if_representative"
}
```

## 10. 최종 판단 체크리스트

Feature Request 카테고리로 분류하기 전 다음을 확인한다.

- [ ] 현재 없는 기능에 대한 요청인가? (QoL과 구분)
- [ ] 옵션 부재인가, 옵션 작동 실패인가? (Bug와 구분)
- [ ] 신규 추가 요청인가, 기존 요소 형평 의견인가? (Balance와 구분)
- [ ] 추가 요청 대상이 구체적인가? (단순 "더 만들어줘"와 구분)
- [ ] 게임 정책/수익화/단순 취향 영역과 혼동하지 않았는가?
