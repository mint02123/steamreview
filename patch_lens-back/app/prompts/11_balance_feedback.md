---
doc_id: balance_feedback
title: Balance Feedback 판단 기준
topic: 밸런스, balance, 강함, 약함, 형평성, 카테고리
related_docs: [core_principles, evidence_level, display_decision, category_signals, bug_feedback, qol_feedback, feature_request_feedback]
keywords: [balance, 밸런스, OP, overpowered, 사기, 너무 강함, 너무 약함, useless, 쓰레기 무기, 너프, nerf, buff, 밸붕, 캐릭터 밸런스, 무기 밸런스, 직업 밸런스, 난이도]
---

# 11. Balance Feedback 판단 기준

## 이 문서가 답하는 질문

> Q: 어떤 리뷰가 밸런스 피드백인가?
> Q: "너프해주세요"와 "버그 같아요"를 어떻게 구분하는가?
> Q: 단순 강약 불만과 의미 있는 밸런스 피드백을 어떻게 구분하는가?
> Q: PvP/PvE/난이도 관련 의견은 모두 balance인가?

## 핵심 원칙 (요약)

LLM은 입력에 없는 내용을 추측하지 않는다 ([원칙 5](00_core_principles.md)).
근거가 부족한 리뷰는 억지로 대표 리뷰로 만들지 않는다 ([원칙 4](00_core_principles.md)).

## 1. Balance Feedback 정의

Balance Feedback은 게임 내 요소들 간의 **강함/약함의 형평성**에 대한 피드백이다.
"작동은 정상이지만 의도된 형평이 깨졌다"가 핵심이며, Bug(작동 자체가 안 됨)와 구별된다.

다음 영역의 형평성 의견이 해당한다.

- 캐릭터/직업/영웅 간 강함 비교
- 무기/장비/스킬 간 효율 비교
- PvP 매치업 형평성
- 난이도 (보스 난이도, 진행 난이도)
- 보상/경제 시스템의 효율 (XP, 골드, 드랍률)
- 진영/팩션 간 강함 비교

## 2. 대표 키워드

다음 표현이 있으면 Balance 후보로 검토한다.

```text
overpowered, OP, op, too strong, too powerful, broken (in the sense of OP),
underpowered, useless, weak, garbage tier, trash tier,
nerf, buff, needs nerf, needs buff,
unbalanced, balance, balancing, imbalance,
unfair, cheap, one-shot, one-shotted,
no chance, can't compete, dominates, ruins the game,
meta, off-meta, only viable
```

**중요**: "broken"은 bug 키워드와 겹친다. 문맥으로 구분한다 (5.1절).

## 3. Balance로 판단하기 좋은 조건

다음 조건이 많을수록 Balance Feedback으로 판단하기 쉽다.

1. 강하다/약하다는 비교 표현이 있다.
2. 비교 대상이 명시되어 있다 (어떤 캐릭터/무기/직업).
3. 어떤 상황·구간에서 형평이 깨지는지 언급된다 (PvP, 후반, 특정 보스).
4. 작동 자체는 정상임이 암묵적/명시적으로 드러난다.
5. 다른 옵션 대비 이 옵션이 유일하게 강하거나 무의미하다는 비교가 있다.

## 4. 유용성이 높은 Balance 리뷰

Balance 리뷰 중 개발자에게 유용한 리뷰는 다음 정보를 포함한다.

- 어떤 요소가 강하거나 약한지 (대상)
- 어떤 상황에서 그러한지 (구간/모드)
- 어떤 다른 요소와 비교했을 때인지 (비교 대상)
- 그 결과 게임 경험이 어떻게 영향받는지 (체감 결과)

**좋은 예 (영문 리뷰)**

> "The new sniper rifle one-shots in PvP from any distance, making other long-range weapons completely useless. Everyone just uses it now."

**해석**
- 대상: 신규 sniper rifle
- 상황: PvP, 모든 거리
- 비교: 다른 장거리 무기 무의미화
- 체감 결과: 단일 무기 메타 고착

이 경우 evidence_level은 `sufficient`로 볼 수 있다.

## 5. Balance로 분류하면 안 되는 경우 (경계 케이스)

### 5.1 Bug와 혼동되는 "broken"

```text
The new boss is broken.        → balance (너무 강하다)
My save file is broken.        → bug (실제 손상)
The matchmaking is broken.     → bug 가능성 높음 (작동 안 됨)
This combo is broken.          → balance (너무 강하다)
```

판단 기준:
- 강약 비교 표현(too strong, OP, useless)이 함께 → balance
- 작동/저장/연결/진행 불가 의미 → bug
- [`10_bug_feedback`](10_bug_feedback.md) §5.1 참조

### 5.2 단순 패배 불만

```text
I keep losing.
PvP is unfair.
This game hates me.
```

특정 요소에 대한 비교 없이 일반적 좌절감만 표현하면 evidence_level=insufficient.
`category=balance`로 분류해도 `display_decision=exclude` 가능성이 높다.

### 5.3 난이도 불만 vs 밸런스 불만

```text
The game is too hard.                            → 일반 난이도 의견 (other 또는 weak balance)
Boss X has 10x more HP than Boss Y at same tier. → balance (구간 내 형평성)
The tutorial is too long.                        → qol (편의성)
```

전반적 난이도는 일반 의견에 가깝고, **구간 내 또는 요소 간 형평성**이 언급되면 balance.

### 5.4 가격/수익화 불만

```text
This DLC is too expensive.       → other (수익화 의견)
The premium currency is OP.      → balance (P2W 형평)
```

가격 자체에 대한 의견은 balance가 아니지만, **유료 요소가 게임 내 형평을 깨뜨린다**는 의견은 balance에 해당할 수 있다.

### 5.5 기능 부재

```text
There's no difficulty option for casuals.   → feature_request
```

밸런스가 아니라 신규 기능 추가 요청이다.

## 6. evidence_level 판단 (Balance 카테고리 특화)

[`02_evidence_level`](02_evidence_level.md)의 일반 기준에 더해, Balance는 **비교 대상의 구체성**이 핵심이다.

### sufficient

비교 대상 + 상황 + 영향이 명확하다.

> "Class A's AoE skill has a 5-second cooldown while similar skills on other classes are 15 seconds, making other classes pointless in late-game dungeons."

- 비교: 5초 vs 15초
- 상황: 후반 던전
- 영향: 다른 직업 무의미화

### partial

대상은 있으나 비교나 상황이 부족하다.

> "Class A is too strong."

- 대상: Class A
- 부족: 어떤 상황에서, 무엇과 비교해서 강한지 불명

### weak

밸런스 키워드는 있으나 설명이 짧다.

> "Nerf class A pls"
> "OP weapon"
> "Imbalanced"

### insufficient

밸런스로 볼 근거가 거의 없다.

> "Unfair game."
> "Trash balance."

## 7. action_hint 작성 기준 (Balance 특화)

Balance 리뷰의 action_hint는 **검토 대상과 검토 관점**을 제시한다. 너프/버프 수치를 단정하지 않는다.

**좋은 예**

> 신규 sniper rifle의 PvP 장거리 데미지 수치와 다른 장거리 무기와의 효율 차이를 검토할 수 있다.

**나쁜 예**

> 신규 sniper rifle의 데미지를 30% 너프해야 한다.

나쁜 이유:
- 수치를 단정함 (입력에 없음)
- 해결 방향을 확정함 (너프만이 답이 아닐 수 있음)

권장 표현 패턴:
- "~과 ~의 효율 차이를 검토할 수 있다"
- "~ 구간에서 ~의 비중을 확인할 필요가 있다"
- "~ 메타에서 단일 옵션 의존도를 점검할 수 있다"

## 8. Balance 설명 생성 시 금지 표현

[`00_core_principles`](00_core_principles.md) §4에 더해, Balance 카테고리에서 특히 주의:

- "패치로 인해 OP가 되었다" (패치 인과 단정)
- "대부분의 유저가 OP라고 생각한다" (다수 통계 없음)
- "메타가 망가졌다" (단정 표현)
- "즉시 너프해야 한다" (우선순위/방향 단정)
- "X는 무조건 사기 캐릭이다" (단정)
- "유저 이탈의 원인이다" (인과 단정)

허용 표현:
- "밸런스 관련 피드백으로 해석할 수 있다"
- "~ 효율 차이를 점검할 필요가 있다"
- "비교 근거는 부족하다"
- "단일 리뷰의 의견이며 검토 대상으로 기록할 수 있다"

## 9. 출력 예시

**입력 리뷰 (영문)**
> "The new sniper rifle one-shots in PvP from any distance, making other long-range weapons completely useless. Everyone just uses it now."

**입력 점수**: 0.81

**출력**
```json
{
  "review_id": "r_bal_001",
  "category": "balance",
  "summary": "신규 저격소총이 PvP 모든 거리에서 원샷이 가능하여 다른 장거리 무기가 무의미해졌다는 밸런스 피드백이다.",
  "developer_value": "비교 대상(다른 장거리 무기), 상황(PvP, 모든 거리), 체감 결과(단일 무기 의존)가 함께 언급되어 있어 PvP 무기 메타 분포를 검토하는 데 도움이 된다.",
  "evidence_level": "sufficient",
  "action_hint": "신규 저격소총의 PvP 거리별 데미지 수치와 다른 장거리 무기 사용률·효율 차이를 검토할 수 있다.",
  "display_decision": "show_as_core_review"
}
```

## 10. 최종 판단 체크리스트

Balance 카테고리로 분류하기 전 다음을 확인한다.

- [ ] 강함/약함의 비교 표현이 있는가?
- [ ] 비교 대상 또는 비교 구간이 언급되어 있는가?
- [ ] 작동 자체의 문제가 아니라 형평성 문제인가? (Bug와 구분)
- [ ] 단순 패배 좌절감이 아니라 구체적 요소 비교인가?
- [ ] "broken"이 실제 오류인지 OP 의미인지 구분했는가?
