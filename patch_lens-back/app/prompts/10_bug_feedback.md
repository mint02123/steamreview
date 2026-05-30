---
doc_id: bug_feedback
title: Bug Feedback 판단 기준
topic: 버그, bug, 크래시, 오작동, 카테고리
related_docs: [core_principles, evidence_level, display_decision, category_signals, balance_feedback, qol_feedback, feature_request_feedback]
keywords: [bug, 버그, crash, 크래시, freeze, 멈춤, disconnect, 서버 오류, save error, glitch, 오작동, broken, fps drop, lag, 성능 문제]
---

# 10. Bug Feedback 판단 기준

## 이 문서가 답하는 질문

> Q: 어떤 리뷰가 버그 피드백인가?
> Q: "broken"이라는 단어가 있으면 무조건 버그인가?
> Q: 버그 리뷰의 evidence_level을 어떻게 판단하는가?
> Q: 버그 리뷰의 action_hint를 작성할 때 주의점은?

## 핵심 원칙 (요약)

LLM은 입력에 없는 내용을 추측하지 않는다 ([원칙 5](00_core_principles.md)).
근거가 부족한 리뷰는 억지로 대표 리뷰로 만들지 않는다 ([원칙 4](00_core_principles.md)).
키워드만으로 카테고리를 단정하지 않는다 — 문맥을 본다.

## 1. Bug Feedback 정의

Bug Feedback은 사용자가 게임에서 **비정상적인 동작**을 경험했음을 설명하는 리뷰이다.
"의도대로 작동하지 않는 문제"가 핵심이며, 단순 불만이나 강약 비교와 구별된다.

특히 게임이 원래 제공해야 하는 기능·퀘스트·저장·이동·상호작용·물리 동작이 정상적으로 완료되지 않거나,
사용자가 의도하지 않은 상태에 갇히는 경우도 Bug Feedback으로 본다.

다음 영역의 비정상 동작이 해당한다.

- 클라이언트/서버 안정성 (crash, freeze, disconnect)
- 저장 데이터 (save loss, corruption)
- 기능 작동 (퀘스트 진행 불가, 아이템 획득 실패, UI 미반응)
- 성능 (frame drop, lag, stutter)
- 그래픽/사운드/입력 처리 오류
- 퀘스트/미션 진행 문제 (quest stuck, objective not updating, mission cannot complete)
- 오브젝트/아이템/캐릭터 상태 오류 (item disappeared, NPC missing, ship/object clipping)
- 물리/위치 오류 (falling through ground, stuck in terrain, collision issue)

## 2. 대표 키워드

다음 표현이 있으면 Bug 후보로 검토한다.

```text
bug, bugs, crash, crashed, crashing, error, glitch, broken,
stuck, freeze, freezing, disconnect, disconnected, server error,
not working, can't play, cannot play, issue, problem, lag,
fps drop, frame drop, lost save, save deleted, corrupted,
black screen, infinite loading, failed to load, kicked, desync,
quest stuck, objective not updating, mission stuck, cannot complete,
progress blocked, softlock, softlocked, stuck in terrain,
fall through, falling through, clipping, collision issue,
npc missing, item disappeared, item vanished, ship disappeared,
save gone, save missing, lost progress, progress reset,
unable to interact, interaction not working, quest marker missing
```

**중요**: 키워드만으로 최종 판단하지 않는다. "this weapon is broken"은 실제 버그가 아니라 밸런스 불만일 수 있다 (5절 참조).

## 3. Bug로 판단하기 좋은 조건

다음 조건이 많을수록 Bug Feedback으로 판단하기 쉽다.

1. 비정상 동작이 명확하다.
2. 문제가 발생한 기능이나 상황이 언급된다.
3. 사용자가 실제로 겪은 증상을 설명한다.
4. 반복 여부가 언급된다.
5. 서버, 저장, 크래시, 성능 등 개발자가 확인할 수 있는 영역이 있다.
6. 문제 발생 조건이 일부라도 제시된다.
7. 퀘스트 목표, 진행 상태, 상호작용 대상이 정상적으로 갱신되지 않는다고 설명한다.
8. 캐릭터, NPC, 아이템, 함선, 지형 등 게임 오브젝트가 사라지거나 비정상 위치에 있다고 설명한다.

## 4. 유용성이 높은 Bug 리뷰

Bug 리뷰 중 개발자에게 유용한 리뷰는 다음 정보를 포함한다.

- 어떤 문제가 발생했는지 (증상)
- 언제 발생했는지 (타이밍/상황)
- 어떤 기능을 사용할 때 발생했는지 (트리거)
- 특정 서버, 모드, 설정, 아이템, 맵과 관련이 있는지 (조건)
- 문제가 반복되는지 (재현성)
- 게임 진행에 어떤 영향을 주는지 (심각도)

**좋은 예 (영문 리뷰)**

> "The game crashes every time I try to join a community server after changing graphics settings."

**해석**
- 문제: crash
- 조건: community server 접속 시
- 추가 조건: graphics settings 변경 후
- 개발자 확인 방향: 서버 접속 과정, 그래픽 설정 변경 후 상태 처리

이 경우 evidence_level은 `sufficient` 또는 `partial`로 볼 수 있다.

## 5. Bug로 분류하면 안 되는 경우 (경계 케이스)

### 5.0 Bug vs General Complaint

버그처럼 보이는 표현이 있어도, 실제 비정상 동작이 설명되지 않으면 Bug로 분류하지 않는다.

### 5.1 Balance와 혼동되는 "broken"

```text
This gun is broken.       → balance (너무 강하다)
The boss is broken.       → balance (너무 강하다)
This strategy is broken.  → balance (밸런스 붕괴)
The save file is broken.  → bug (실제 손상)
```

여기서 `broken`이 **실제 오류**인지 **"너무 강하다"는 비유 표현**인지 문맥으로 구분한다.
강약 비교 표현(too strong, OP, useless)이 함께 있으면 balance, 작동/저장/연결 관련이면 bug.
판단 시 [`11_balance_feedback`](11_balance_feedback.md) 참조.

### 5.2 단순 부정 감정

```text
This game is trash.
Bad update.
Worst game ever.
```

문제 상황 설명이 없으면 Bug로 단정하지 않는다. `category=other`, `evidence_level=insufficient`가 적절하다.

### 5.3 기능 부재 (feature_request 또는 qol)

```text
There is no option to change the key binding.   → feature_request
Please add more server options.                 → feature_request
The menu has too many clicks to navigate.       → qol
```

기능이 **없다는 불만**은 Bug가 아니다. 신규 추가 요청이면 [`13_feature_request_feedback`](13_feature_request_feedback.md), 기존 동선 불편이면 [`12_qol_feedback`](12_qol_feedback.md).

### 5.4 성능이 "나쁘다" vs 성능이 "비정상"

```text
The game runs at 30fps on max settings.    → 사양 의견 (other 또는 qol)
The game suddenly drops to 5fps in town.   → bug (비정상 드랍)
```

기대 성능과의 차이만 언급되면 일반 의견, **갑작스러운 비정상 드랍**이면 bug.

## 6. evidence_level 판단 (Bug 카테고리 특화)

[`02_evidence_level`](02_evidence_level.md)의 일반 기준에 더해, Bug 카테고리는 **재현 조건의 구체성**이 핵심이다.

### sufficient

증상 + 발생 상황 + 재현 조건이 대부분 구체적이다.

> "The game freezes for 10 seconds whenever I open the map after joining a server."

- 증상: 10초 freeze
- 트리거: 서버 접속 후 맵 열기
- 재현성: whenever (반복적)

### partial

증상과 대상은 있으나 조건이 부족하다.

> "The game crashes when joining servers."

- 증상: crash
- 대상: 서버 접속
- 부족: 어떤 서버, 어떤 시점, 어떤 환경인지 불명

### weak

버그 키워드는 있으나 구체성이 낮다.

> "Too many bugs."
> "Game is buggy."
> "It keeps breaking."

처리 방향:
- 핵심 Top-K 리뷰로는 부적합
- 카테고리 요약에는 반영 가능
- `display_decision`은 보통 `use_for_category_summary_only`

### insufficient

버그로 볼 근거가 거의 없다.

> "Bad game."
> "Worst ever."

## 7. action_hint 작성 기준 (Bug 특화)

Bug 리뷰의 action_hint는 개발자가 **확인할 방향**을 제시한다. 원인이나 해결책을 단정하지 않는다.

**좋은 예**

> 서버 접속 과정에서 발생하는 크래시 로그와 그래픽 설정 변경 후 상태 처리를 점검할 필요가 있다.

**나쁜 예**

> 서버 코드를 즉시 고쳐야 한다.

나쁜 이유:
- 원인을 단정함 ("서버 코드 문제")
- 해결책을 확정함 ("고쳐야 한다")
- 리뷰에 없는 내용을 추측함

권장 표현 패턴:
- "~ 로그를 점검할 필요가 있다"
- "~ 동작 여부를 확인할 수 있다"
- "~ 환경에서의 재현 빈도를 검토할 수 있다"

## 8. Bug 설명 생성 시 금지 표현

[`00_core_principles`](00_core_principles.md) §4의 일반 금지 표현에 더해, Bug 카테고리에서 특히 주의:

- "심각한 버그이다" (입력에 심각도 정보 없음)
- "패치로 인해 발생했다" (인과 단정)
- "대부분의 사용자가 겪고 있다" (다수 통계 없음)
- "서버 코드 문제이다" (원인 단정)
- "개발자의 실수이다" (책임 단정)
- "즉시 수정해야 한다" (우선순위 단정)

허용 표현:
- "버그성 피드백으로 해석할 수 있다"
- "추가 확인이 필요하다"
- "재현 조건은 부족하다"
- "해당 기능의 동작 여부를 점검할 수 있다"

## 9. 출력 예시

**입력 리뷰 (영문)**

> "After talking to the NPC, the quest marker never appears and I can't progress the main story."

**입력 점수**: 0.69

**출력**
```json
{
  "review_id": "r_bug_002",
  "category": "bug",
  "summary": "NPC와 대화한 뒤 퀘스트 마커가 나타나지 않아 메인 스토리를 진행할 수 없다는 버그성 피드백이다.",
  "developer_value": "문제가 발생한 상황(NPC 대화 후), 대상(퀘스트 마커), 영향(메인 스토리 진행 불가)이 함께 제시되어 있어 퀘스트 진행 상태 갱신 로직을 확인하는 데 도움이 된다.",
  "evidence_level": "partial",
  "action_hint": "NPC 대화 이후 퀘스트 마커 생성 여부와 메인 스토리 진행 상태 갱신 흐름을 점검할 필요가 있다.",
  "display_decision": "show_if_representative"
}
```

## 10. 최종 판단 체크리스트

Bug 카테고리로 분류하기 전 다음을 확인한다.

- [ ] 실제 비정상 동작이 있는가?
- [ ] 문제가 발생한 상황이 언급되어 있는가?
- [ ] 개발자가 확인할 기능이나 시스템이 있는가?
- [ ] 단순 감정 표현이 아니라 오류 단서가 있는가?
- [ ] "broken" 같은 단어가 실제 버그인지, 밸런스 불만인지 구분했는가?
- [ ] 기능 부재 불만(feature_request/qol)과 혼동하지 않았는가?
