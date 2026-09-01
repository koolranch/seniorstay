#!/usr/bin/env python3
"""DataForSEO performance audit for Guide for Seniors placement SEO.

Focus: private-pay AL/MC/IL city + advisor keywords that can produce
referral fees. Medicaid / SNF are classified but not treated as wins.

Usage: python3 scripts/seo/placement-performance-audit.py
"""

from __future__ import annotations

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = ROOT / ".env.local"
OUT_DIR = Path(__file__).resolve().parent / "rank-snapshots" / "placement-audit"
DOMAIN = "guideforseniors.com"
US = 2840

# High-intent private-pay placement SERPs (no Medicaid).
PLACEMENT_KEYWORDS = [
    {"keyword": "assisted living rocky river oh", "target": "/cleveland/rocky-river", "lane": "al-city"},
    {"keyword": "assisted living westlake oh", "target": "/cleveland/westlake", "lane": "al-city"},
    {"keyword": "assisted living shaker heights oh", "target": "/cleveland/shaker-heights", "lane": "al-city"},
    {"keyword": "assisted living lakewood oh", "target": "/cleveland/lakewood", "lane": "al-city"},
    {"keyword": "assisted living beachwood oh", "target": "/cleveland/beachwood", "lane": "al-city"},
    {"keyword": "assisted living parma oh", "target": "/cleveland/parma", "lane": "al-city"},
    {"keyword": "assisted living chagrin falls oh", "target": "/cleveland/chagrin-falls", "lane": "al-city"},
    {"keyword": "assisted living solon oh", "target": "/cleveland/solon", "lane": "al-city"},
    {"keyword": "assisted living aurora oh", "target": "/cleveland/aurora", "lane": "al-city"},
    {"keyword": "assisted living south russell oh", "target": "/cleveland/south-russell", "lane": "al-city"},
    {"keyword": "assisted living cleveland oh", "target": "/assisted-living-cleveland", "lane": "al-metro"},
    {"keyword": "memory care rocky river oh", "target": "/cleveland/rocky-river", "lane": "mc-city"},
    {"keyword": "memory care westlake oh", "target": "/cleveland/westlake", "lane": "mc-city"},
    {"keyword": "memory care beachwood oh", "target": "/cleveland/beachwood", "lane": "mc-city"},
    {"keyword": "memory care shaker heights oh", "target": "/cleveland/shaker-heights", "lane": "mc-city"},
    {"keyword": "memory care lakewood oh", "target": "/cleveland/lakewood", "lane": "mc-city"},
    {"keyword": "memory care chagrin falls oh", "target": "/cleveland/chagrin-falls", "lane": "mc-city"},
    {"keyword": "memory care cleveland oh", "target": "/memory-care-cleveland", "lane": "mc-metro"},
    {"keyword": "independent living rocky river oh", "target": "/cleveland/rocky-river", "lane": "il-city"},
    {"keyword": "independent living westlake oh", "target": "/cleveland/westlake", "lane": "il-city"},
    {"keyword": "independent living cleveland oh", "target": "/independent-living-cleveland", "lane": "il-metro"},
    {"keyword": "senior living advisor cleveland", "target": "/cleveland-senior-living-advisor", "lane": "advisor"},
    {"keyword": "assisted living advisor cleveland", "target": "/cleveland-senior-living-advisor", "lane": "advisor"},
    {"keyword": "senior living placement cleveland", "target": "/contact", "lane": "advisor"},
    {"keyword": "best assisted living cleveland", "target": "/assisted-living-cleveland", "lane": "al-metro"},
    {"keyword": "assisted living near me cleveland", "target": "/assisted-living-cleveland", "lane": "al-metro"},
    {"keyword": "memory care near me cleveland", "target": "/memory-care-cleveland", "lane": "mc-metro"},
    {"keyword": "senior living consultant cleveland", "target": "/cleveland-senior-living-advisor", "lane": "advisor"},
    {"keyword": "assisted living columbus oh", "target": "/columbus", "lane": "columbus"},
    {"keyword": "memory care columbus oh", "target": "/columbus", "lane": "columbus"},
    {"keyword": "senior living advisor columbus", "target": "/contact", "lane": "columbus"},
]

COMPETITORS = [
    "oasissenioradvisors.com",
    "aplaceformom.com",
    "caring.com",
    "senioradvisor.com",
    "assistedlivinglocators.com",
    "seniorcareauthority.com",
    "carepatrol.com",
]


def load_env() -> None:
    if not ENV_PATH.exists():
        raise SystemExit(f"Missing {ENV_PATH}")
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def api_post(path: str, payload: list | dict, timeout: int = 120) -> dict:
    login = os.environ["DATAFORSEO_LOGIN"]
    password = os.environ["DATAFORSEO_PASSWORD"]
    auth = base64.b64encode(f"{login}:{password}".encode()).decode()
    req = urllib.request.Request(
        f"https://api.dataforseo.com/v3/{path}",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


def task_ok(data: dict) -> tuple[dict, list]:
    task = (data.get("tasks") or [None])[0] or {}
    return task, task.get("result") or []


def classify_keyword(keyword: str, url: str | None = None) -> dict:
    k = (keyword or "").lower()
    path = urlparse(url or "").path.lower() if url else ""
    hay = f"{k} {path}"

    if any(x in hay for x in ("medicaid", "waiver", "passport", "pasSPORT".lower())):
        bucket = "medicaid"
    elif any(x in hay for x in ("nursing home", "skilled nursing", " nursing")):
        bucket = "snf"
    elif any(x in k for x in ("advisor", "placement", "locator", "consultant", "referral")):
        bucket = "advisor"
    elif "memory care" in k:
        bucket = "memory-care"
    elif "independent living" in k:
        bucket = "independent-living"
    elif "assisted living" in k:
        bucket = "assisted-living"
    elif "senior living" in k or "senior housing" in k:
        bucket = "senior-living"
    else:
        bucket = "other"

    geo = "other"
    if any(x in hay for x in ("columbus",)):
        geo = "columbus"
    elif any(
        x in hay
        for x in (
            "cleveland",
            "rocky river",
            "westlake",
            "shaker",
            "lakewood",
            "beachwood",
            "parma",
            "chagrin",
            "solon",
            "aurora",
            "south russell",
            "strongsville",
            "mentor",
            "hudson",
            "akron",
            "euclid",
            "lorain",
            "medina",
            "independence",
            "north olmsted",
        )
    ):
        geo = "cleveland"

    revenue = bucket in {
        "advisor",
        "memory-care",
        "independent-living",
        "assisted-living",
        "senior-living",
    } and geo in {"cleveland", "columbus"} and bucket != "medicaid" and bucket != "snf"

    return {"bucket": bucket, "geo": geo, "revenue_relevant": revenue}


def normalize_path(url: str | None) -> str | None:
    if not url:
        return None
    path = urlparse(url).path.rstrip("/") or "/"
    return path


def is_ours(domain: str | None, url: str | None) -> bool:
    d = (domain or "").replace("www.", "")
    if d == DOMAIN:
        return True
    return bool(url and DOMAIN in url)


def fetch_location(name: str) -> dict | None:
    print(f"Location lookup: {name}", flush=True)
    try:
        data = api_post(
            "serp/google/locations",
            [{"country_iso_code": "US", "location_name": name}],
            timeout=30,
        )
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"  location failed: {exc}", flush=True)
        return None
    task, result = task_ok(data)
    if task.get("status_code") not in (20000, 20001) and not result:
        print(f"  location warning: {task.get('status_message')}", flush=True)
        return None
    for row in result:
        if name.lower() in (row.get("location_name") or "").lower():
            return {"name": row.get("location_name"), "code": row.get("location_code")}
    return result[0] if result else None


def fetch_domain_overview() -> dict:
    print("Domain rank overview...", flush=True)
    data = api_post(
        "dataforseo_labs/google/domain_rank_overview/live",
        [{"target": DOMAIN, "language_code": "en"}],
    )
    task, result = task_ok(data)
    return {
        "status": task.get("status_message"),
        "cost": task.get("cost"),
        "result": result,
    }


def fetch_ranked_keywords(limit: int = 1000, order_by: str = "ranked_serp_element.serp_item.etv,desc") -> dict:
    print(f"Ranked keywords (limit={limit}, order={order_by})...", flush=True)
    data = api_post(
        "dataforseo_labs/google/ranked_keywords/live",
        [
            {
                "target": DOMAIN,
                "location_code": US,
                "language_code": "en",
                "limit": limit,
                "order_by": [order_by],
                "item_types": ["organic"],
            }
        ],
        timeout=180,
    )
    task, result = task_ok(data)
    items = (result[0].get("items") if result else None) or []
    rows = []
    for item in items:
        kd = item.get("keyword_data") or {}
        info = kd.get("keyword_info") or {}
        serp = (item.get("ranked_serp_element") or {}).get("serp_item") or {}
        keyword = kd.get("keyword") or ""
        url = serp.get("url")
        cls = classify_keyword(keyword, url)
        rows.append(
            {
                "keyword": keyword,
                "search_volume": info.get("search_volume"),
                "cpc": info.get("cpc"),
                "competition": info.get("competition"),
                "keyword_difficulty": (kd.get("keyword_properties") or {}).get("keyword_difficulty"),
                "position": serp.get("rank_absolute") or serp.get("rank_group"),
                "url": url,
                "etv": serp.get("etv"),
                "is_featured_snippet": serp.get("is_featured_snippet"),
                **cls,
            }
        )
    return {
        "status": task.get("status_message"),
        "cost": task.get("cost"),
        "total_count": (result[0].get("total_count") if result else None),
        "items_count": len(rows),
        "rows": rows,
    }


def fetch_relevant_pages(limit: int = 50) -> dict:
    print("Relevant pages...", flush=True)
    data = api_post(
        "dataforseo_labs/google/relevant_pages/live",
        [
            {
                "target": DOMAIN,
                "location_code": US,
                "language_code": "en",
                "limit": limit,
                "order_by": ["metrics.organic.etv,desc"],
            }
        ],
        timeout=120,
    )
    task, result = task_ok(data)
    items = (result[0].get("items") if result else None) or []
    rows = []
    for item in items:
        metrics = (item.get("metrics") or {}).get("organic") or {}
        page_address = item.get("page_address") or item.get("page") or ""
        cls = classify_keyword("", page_address)
        rows.append(
            {
                "page": page_address,
                "etv": metrics.get("etv"),
                "count": metrics.get("count"),
                "pos_1": metrics.get("pos_1"),
                "pos_2_3": metrics.get("pos_2_3"),
                "pos_4_10": metrics.get("pos_4_10"),
                "pos_11_20": metrics.get("pos_11_20"),
                "pos_21_30": metrics.get("pos_21_30"),
                "pos_31_100": metrics.get("pos_31_100"),
                "estimated_paid_traffic_cost": metrics.get("estimated_paid_traffic_cost"),
                **cls,
            }
        )
    return {
        "status": task.get("status_message"),
        "cost": task.get("cost"),
        "total_count": (result[0].get("total_count") if result else None),
        "rows": rows,
    }


def fetch_competitors(limit: int = 20) -> dict:
    print("Domain competitors...", flush=True)
    data = api_post(
        "dataforseo_labs/google/competitors_domain/live",
        [
            {
                "target": DOMAIN,
                "location_code": US,
                "language_code": "en",
                "limit": limit,
                "filters": ["metrics.organic.count", ">", 50],
            }
        ],
        timeout=120,
    )
    task, result = task_ok(data)
    items = (result[0].get("items") if result else None) or []
    rows = []
    for item in items:
        metrics = (item.get("metrics") or {}).get("organic") or {}
        rows.append(
            {
                "domain": item.get("domain"),
                "avg_position": item.get("avg_position"),
                "intersections": item.get("intersections"),
                "etv": metrics.get("etv"),
                "count": metrics.get("count"),
                "pos_1": metrics.get("pos_1"),
                "pos_2_3": metrics.get("pos_2_3"),
                "pos_4_10": metrics.get("pos_4_10"),
            }
        )
    return {"status": task.get("status_message"), "cost": task.get("cost"), "rows": rows}


def fetch_intersection(competitor: str, limit: int = 50) -> dict:
    print(f"Keyword gap vs {competitor}...", flush=True)
    data = api_post(
        "dataforseo_labs/google/domain_intersection/live",
        [
            {
                "target1": competitor,
                "target2": DOMAIN,
                "location_code": US,
                "language_code": "en",
                "limit": limit,
                "intersections": False,
                "order_by": ["first_domain_serp_element.etv,desc"],
                "filters": [
                    "keyword_data.keyword_info.search_volume",
                    ">",
                    10,
                ],
            }
        ],
        timeout=180,
    )
    task, result = task_ok(data)
    items = (result[0].get("items") if result else None) or []
    rows = []
    for item in items:
        kd = item.get("keyword_data") or {}
        info = kd.get("keyword_info") or {}
        first = item.get("first_domain_serp_element") or {}
        second = item.get("second_domain_serp_element") or {}
        keyword = kd.get("keyword") or ""
        cls = classify_keyword(keyword, first.get("url"))
        if not cls["revenue_relevant"] and cls["bucket"] in {"medicaid", "snf", "other"}:
            continue
        rows.append(
            {
                "keyword": keyword,
                "search_volume": info.get("search_volume"),
                "cpc": info.get("cpc"),
                "competitor_pos": first.get("rank_absolute") or first.get("rank_group"),
                "competitor_url": first.get("url"),
                "our_pos": second.get("rank_absolute") if second else None,
                "our_url": second.get("url") if second else None,
                **cls,
            }
        )
        if len(rows) >= 25:
            break
    return {
        "competitor": competitor,
        "status": task.get("status_message"),
        "cost": task.get("cost"),
        "total_count": (result[0].get("total_count") if result else None),
        "rows": rows,
    }


def fetch_backlinks() -> dict:
    print("Backlink summary...", flush=True)
    data = api_post(
        "backlinks/summary/live",
        [{"target": DOMAIN, "include_subdomains": True}],
        timeout=60,
    )
    task, result = task_ok(data)
    row = result[0] if result else {}
    return {
        "status": task.get("status_message"),
        "cost": task.get("cost"),
        "rank": row.get("rank"),
        "backlinks": row.get("backlinks"),
        "referring_domains": row.get("referring_domains"),
        "referring_main_domains": row.get("referring_main_domains"),
        "referring_ips": row.get("referring_ips"),
        "broken_backlinks": row.get("broken_backlinks"),
        "referring_domains_nofollow": row.get("referring_domains_nofollow"),
        "referring_links_types": row.get("referring_links_types"),
        "referring_links_platform_types": row.get("referring_links_platform_types"),
        "referring_links_tlds": dict(list((row.get("referring_links_tlds") or {}).items())[:10]),
    }


def fetch_volumes(keywords: list[str]) -> dict[str, dict]:
    print("Search volumes...", flush=True)
    try:
        data = api_post(
            "keywords_data/google_ads/search_volume/live",
            [{"keywords": keywords, "location_code": US, "language_code": "en"}],
            timeout=60,
        )
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"Volume fetch failed: {exc}", flush=True)
        return {}
    task, result = task_ok(data)
    out: dict[str, dict] = {}
    for row in result:
        if row and row.get("keyword"):
            out[row["keyword"].lower()] = {
                "search_volume": row.get("search_volume"),
                "competition": row.get("competition"),
                "cpc": row.get("cpc"),
            }
    return out


def check_keyword(kw: str, target: str, lane: str, location_code: int) -> dict:
    print(f"  SERP [{location_code}]: {kw}", flush=True)
    try:
        data = api_post(
            "serp/google/organic/live/regular",
            [
                {
                    "keyword": kw,
                    "location_code": location_code,
                    "language_code": "en",
                    "depth": 100,
                }
            ],
        )
    except (urllib.error.URLError, TimeoutError) as exc:
        return {
            "keyword": kw,
            "lane": lane,
            "target": target,
            "location_code": location_code,
            "position": None,
            "url": None,
            "url_matches_target": None,
            "top_competitor": None,
            "top_url": None,
            "top5": [],
            "error": str(exc),
            "cost": None,
        }

    task, result = task_ok(data)
    if task.get("status_code") != 20000:
        return {
            "keyword": kw,
            "lane": lane,
            "target": target,
            "location_code": location_code,
            "position": None,
            "url": None,
            "url_matches_target": None,
            "top_competitor": None,
            "top_url": None,
            "top5": [],
            "error": task.get("status_message") or "unknown",
            "cost": task.get("cost"),
        }

    items = (result[0].get("items") if result else None) or []
    organic = [i for i in items if i.get("type") == "organic"]
    hit = next((i for i in organic if is_ours(i.get("domain"), i.get("url"))), None)
    top = organic[0] if organic else None
    actual = normalize_path(hit.get("url") if hit else None)
    target_path = target if target.startswith("/") else f"/{target}"
    top5 = [
        {"rank": i.get("rank_absolute"), "domain": i.get("domain"), "url": i.get("url")}
        for i in organic[:5]
    ]
    return {
        "keyword": kw,
        "lane": lane,
        "target": target_path,
        "location_code": location_code,
        "position": hit.get("rank_absolute") if hit else None,
        "url": actual,
        "url_matches_target": (
            actual in {target_path, target_path.rstrip("/")} if hit else None
        ),
        "top_competitor": top.get("domain") if top else None,
        "top_url": top.get("url") if top else None,
        "top5": top5,
        "error": None,
        "cost": task.get("cost"),
    }


def summarize_ranked(rows: list[dict]) -> dict:
    def bucket_count(name: str) -> int:
        return sum(1 for r in rows if r["bucket"] == name)

    revenue = [r for r in rows if r["revenue_relevant"]]
    medicaid = [r for r in rows if r["bucket"] == "medicaid"]
    top10 = [r for r in rows if r.get("position") and r["position"] <= 10]
    striking = [
        r
        for r in revenue
        if r.get("position") and 11 <= r["position"] <= 30
    ]
    page1_rev = [r for r in revenue if r.get("position") and r["position"] <= 10]
    etv_total = sum((r.get("etv") or 0) for r in rows)
    etv_rev = sum((r.get("etv") or 0) for r in revenue)
    etv_medicaid = sum((r.get("etv") or 0) for r in medicaid)
    return {
        "sampled_keywords": len(rows),
        "buckets": {
            "assisted-living": bucket_count("assisted-living"),
            "memory-care": bucket_count("memory-care"),
            "independent-living": bucket_count("independent-living"),
            "advisor": bucket_count("advisor"),
            "senior-living": bucket_count("senior-living"),
            "medicaid": bucket_count("medicaid"),
            "snf": bucket_count("snf"),
            "other": bucket_count("other"),
        },
        "geo": {
            "cleveland": sum(1 for r in rows if r["geo"] == "cleveland"),
            "columbus": sum(1 for r in rows if r["geo"] == "columbus"),
            "other": sum(1 for r in rows if r["geo"] == "other"),
        },
        "etv_sampled": round(etv_total, 2),
        "etv_revenue_relevant": round(etv_rev, 2),
        "etv_medicaid": round(etv_medicaid, 2),
        "top10_sampled": len(top10),
        "revenue_relevant": len(revenue),
        "revenue_page1": len(page1_rev),
        "revenue_striking_distance": len(striking),
    }


def main() -> int:
    load_env()
    if not os.environ.get("DATAFORSEO_LOGIN") or not os.environ.get("DATAFORSEO_PASSWORD"):
        print("Missing DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD", file=sys.stderr)
        return 1

    today = date.today().isoformat()
    costs: list[float] = []

    cleveland_loc = fetch_location("Cleveland,Ohio,United States") or {
        "name": "Cleveland,Ohio,United States",
        "code": 1016367,
    }
    print(f"Cleveland location: {cleveland_loc}", flush=True)

    overview = fetch_domain_overview()
    costs.append(overview.get("cost") or 0)

    ranked = fetch_ranked_keywords()
    costs.append(ranked.get("cost") or 0)

    pages = fetch_relevant_pages()
    costs.append(pages.get("cost") or 0)

    competitors = fetch_competitors()
    costs.append(competitors.get("cost") or 0)

    backlinks = fetch_backlinks()
    costs.append(backlinks.get("cost") or 0)

    gaps = []
    for domain in ("oasissenioradvisors.com", "aplaceformom.com"):
        gap = fetch_intersection(domain, limit=80)
        costs.append(gap.get("cost") or 0)
        gaps.append(gap)

    vol_map = fetch_volumes([k["keyword"] for k in PLACEMENT_KEYWORDS])

    print("\nPlacement SERP check (US)...", flush=True)
    serp_rows: list[dict] = []
    for i, item in enumerate(PLACEMENT_KEYWORDS):
        row = check_keyword(item["keyword"], item["target"], item["lane"], US)
        meta = vol_map.get(item["keyword"].lower(), {})
        row["search_volume"] = meta.get("search_volume")
        row["cpc"] = meta.get("cpc")
        row["competition"] = meta.get("competition")
        serp_rows.append(row)
        pos = f"#{row['position']}" if row["position"] else ("ERR" if row["error"] else "out")
        print(f"    {item['keyword']:<46} {pos}", flush=True)
        if i < len(PLACEMENT_KEYWORDS) - 1:
            time.sleep(0.15)
        costs.append(row.get("cost") or 0)

    # Local Cleveland SERP for the highest-value advisor + metro terms only.
    local_kws = [
        k
        for k in PLACEMENT_KEYWORDS
        if k["lane"] in {"advisor", "al-metro", "mc-metro"} and "columbus" not in k["keyword"]
    ][:6]
    print("\nPlacement SERP check (Cleveland local)...", flush=True)
    local_rows: list[dict] = []
    loc_code = cleveland_loc.get("code") or US
    for i, item in enumerate(local_kws):
        row = check_keyword(item["keyword"], item["target"], item["lane"], loc_code)
        local_rows.append(row)
        pos = f"#{row['position']}" if row["position"] else ("ERR" if row["error"] else "out")
        print(f"    {item['keyword']:<46} {pos}", flush=True)
        if i < len(local_kws) - 1:
            time.sleep(0.15)
        costs.append(row.get("cost") or 0)

    ranked_summary = summarize_ranked(ranked.get("rows") or [])
    serp_summary = {
        "total": len(serp_rows),
        "top10": sum(1 for r in serp_rows if r["position"] and r["position"] <= 10),
        "top30": sum(1 for r in serp_rows if r["position"] and r["position"] <= 30),
        "top100": sum(1 for r in serp_rows if r["position"]),
        "not_ranking": sum(1 for r in serp_rows if not r["position"] and not r["error"]),
        "wrong_url": sum(1 for r in serp_rows if r.get("url_matches_target") is False),
        "errors": sum(1 for r in serp_rows if r["error"]),
    }

    snapshot = {
        "date": today,
        "domain": DOMAIN,
        "focus": "private-pay AL/MC/IL city + advisor placement (Medicaid/SNF classified, not scored as wins)",
        "cleveland_location": cleveland_loc,
        "overview": overview,
        "backlinks": backlinks,
        "ranked_keywords": {
            "status": ranked.get("status"),
            "cost": ranked.get("cost"),
            "total_count": ranked.get("total_count"),
            "items_count": ranked.get("items_count"),
            "summary": ranked_summary,
            "top_by_etv": (ranked.get("rows") or [])[:40],
            "revenue_relevant": [
                r for r in (ranked.get("rows") or []) if r["revenue_relevant"]
            ][:60],
            "medicaid_top": [
                r for r in (ranked.get("rows") or []) if r["bucket"] == "medicaid"
            ][:20],
        },
        "relevant_pages": pages,
        "competitors": competitors,
        "keyword_gaps": gaps,
        "serp": {
            "location": "United States",
            "location_code": US,
            "summary": serp_summary,
            "rows": serp_rows,
        },
        "serp_cleveland_local": {
            "location": cleveland_loc,
            "rows": local_rows,
        },
        "total_cost": round(sum(costs), 5),
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{today}.json"
    out_path.write_text(json.dumps(snapshot, indent=2))
    print("\nSERP summary:", json.dumps(serp_summary, indent=2), flush=True)
    print("Ranked summary:", json.dumps(ranked_summary, indent=2), flush=True)
    print("Total API cost:", snapshot["total_cost"], flush=True)
    print("Wrote", out_path, flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
