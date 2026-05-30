"""model_result.csv(100행)에 nomans_processed.csv의 메타데이터를 부착한다.

매칭 키: review 텍스트 (+ 모호 시 txt_file_name 으로 좁힘).
model_result.csv 에는 recommendationid 가 없어 텍스트 기반으로 매칭한다.
"""

import pandas as pd

MODEL = "model_result.csv"
PROC = "nomans_processed.csv"
OUT = "model_result_enriched.csv"

# 분석에 자주 쓰는 핵심 메타 컬럼만 부착 (hardware_* 등 대부분 빈 컬럼은 제외)
CORE_META = [
    "recommendationid",
    "language",
    "voted_up",
    "votes_up",
    "votes_funny",
    "weighted_vote_score",
    "comment_count",
    "steam_purchase",
    "received_for_free",
    "written_during_early_access",
    "timestamp_created_dt",
    "author_steamid",
    "author_num_games_owned",
    "author_num_reviews",
    "author_playtime_forever",
    "author_playtime_at_review",
    "developer_response",
    "timestamp_dev_responded",
    "latest_patch",
    "latest_patch_date",
    "has_patch_notes",
]


def norm(s):
    return str(s).strip()


def main():
    mr = pd.read_csv(MODEL)
    proc = pd.read_csv(PROC, low_memory=False)

    # processed 의 이름없는 인덱스 컬럼 제거
    first_col = proc.columns[0]
    if first_col.strip() == "" or first_col.startswith("Unnamed"):
        proc = proc.drop(columns=[first_col])

    mr["_rev"] = mr["review"].map(norm)
    mr["_txt"] = mr["txt_file_name"].map(norm)
    proc["_rev"] = proc["review"].map(norm)
    proc["_txt"] = proc["txt_file_name"].map(norm)

    # 부착할 메타 컬럼 = 핵심 컬럼 중 processed 에 실제 존재하는 것
    meta_cols = [c for c in CORE_META if c in proc.columns]

    records = []
    stats = {"unique": 0, "by_txt": 0, "ambiguous_first": 0, "no_match": 0}

    for _, row in mr.iterrows():
        cands = proc[proc["_rev"] == row["_rev"]]
        chosen = None

        if len(cands) == 0:
            stats["no_match"] += 1
        elif len(cands) == 1:
            chosen = cands.iloc[0]
            stats["unique"] += 1
        else:
            narrowed = cands[cands["_txt"] == row["_txt"]]
            if len(narrowed) == 1:
                chosen = narrowed.iloc[0]
                stats["by_txt"] += 1
            elif len(narrowed) >= 1:
                chosen = narrowed.iloc[0]
                stats["ambiguous_first"] += 1
            else:
                # txt 로 못 좁히면 텍스트 후보 첫 행
                chosen = cands.iloc[0]
                stats["ambiguous_first"] += 1

        rec = {
            "rank": row["rank"],
            "review": row["review"],
            "txt_file_name": row["txt_file_name"],
            "actual_helpfulvotes": row["actual_helpfulvotes"],
            "predicted_helpfulvotes": row["predicted_helpfulvotes"],
            "_match_status": "no_match" if chosen is None else "matched",
        }
        for c in meta_cols:
            rec[c] = None if chosen is None else chosen[c]
        records.append(rec)

    out = pd.DataFrame(records)
    out.to_csv(OUT, index=False, encoding="utf-8-sig")

    print("=== 매칭 통계 ===")
    print("명확(후보1개)        :", stats["unique"])
    print("txt로 해소           :", stats["by_txt"])
    print("모호→첫행 선택       :", stats["ambiguous_first"])
    print("매칭 없음            :", stats["no_match"])
    print()
    print("출력 파일:", OUT)
    print("출력 행수:", len(out), "/ 컬럼수:", len(out.columns))
    print("부착된 메타 컬럼수:", len(meta_cols))
    print()
    print("recommendationid 채워진 행:", out["recommendationid"].notna().sum(), "/", len(out))


if __name__ == "__main__":
    main()
