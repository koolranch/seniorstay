#!/usr/bin/env python3
"""Private-pay Cleveland placement rank snapshot via DataForSEO.

Tracks AL/MC/IL city + advisor keywords for guideforseniors.com (no Medicaid).
Usage: python3 scripts/seo/cleveland-placement-rank-check.py
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
OUT_DIR = Path(__file__).resolve().parent / "rank-snapshots" / "cleveland-placement"
DOMAIN = "guideforseniors.com"
LOCATION = 2840  # United States
DEPTH = 100

KEYWORDS = [
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


def fetch_volumes(keywords: list[str]) -> dict[str, dict]:
    print("Fetching search volumes...", flush=True)
    try:
        data = api_post(
            "keywords_data/google_ads/search_volume/live",
            [{"keywords": keywords, "location_code": LOCATION, "language_code": "en"}],
            timeout=60,
        )
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"Volume fetch failed: {exc}", flush=True)
        return {}

    task = (data.get("tasks") or [None])[0] or {}
    if task.get("status_code") != 20000:
        print(f"Volume fetch warning: {task.get('status_message')}", flush=True)
        return {}

    out: dict[str, dict] = {}
    for row in task.get("result") or []:
        if row and row.get("keyword"):
            out[row["keyword"].lower()] = {
                "search_volume": row.get("search_volume"),
                "competition": row.get("competition"),
                "cpc": row.get("cpc"),
            }
    print(f"Got volumes for {len(out)} keywords", flush=True)
    return out


def check_keyword(kw: str, target: str, lane: str) -> dict:
    print(f"  SERP: {kw}", flush=True)
    try:
        data = api_post(
            "serp/google/organic/live/regular",
            [
                {
                    "keyword": kw,
                    "location_code": LOCATION,
                    "language_code": "en",
                    "depth": DEPTH,
                }
            ],
        )
    except (urllib.error.URLError, TimeoutError) as exc:
        return {
            "keyword": kw,
            "lane": lane,
            "target": target,
            "position": None,
            "url": None,
            "url_matches_target": None,
            "top_competitor": None,
            "top_url": None,
            "top5": [],
            "error": str(exc),
            "cost": None,
        }

    task = (data.get("tasks") or [None])[0] or {}
    if task.get("status_code") != 20000:
        return {
            "keyword": kw,
            "lane": lane,
            "target": target,
            "position": None,
            "url": None,
            "url_matches_target": None,
            "top_competitor": None,
            "top_url": None,
            "top5": [],
            "error": task.get("status_message") or "unknown",
            "cost": task.get("cost"),
        }

    items = ((task.get("result") or [{}])[0].get("items") or [])
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


def main() -> int:
    load_env()
    if not os.environ.get("DATAFORSEO_LOGIN") or not os.environ.get("DATAFORSEO_PASSWORD"):
        print("Missing DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD", file=sys.stderr)
        return 1

    today = date.today().isoformat()
    vol_map = fetch_volumes([k["keyword"] for k in KEYWORDS])

    print(
        f"\nPrivate-pay Cleveland placement rank check — {today} — Google US top {DEPTH}",
        flush=True,
    )
    print(
        f"{'keyword':<42} {'lane':<10} {'vol':>5} {'pos':>6}  top competitor",
        flush=True,
    )
    print("-" * 100, flush=True)

    rows: list[dict] = []
    for i, item in enumerate(KEYWORDS):
        row = check_keyword(item["keyword"], item["target"], item["lane"])
        meta = vol_map.get(item["keyword"].lower(), {})
        row["search_volume"] = meta.get("search_volume")
        row["cpc"] = meta.get("cpc")
        row["competition"] = meta.get("competition")
        rows.append(row)

        pos = f"#{row['position']}" if row["position"] else ("ERR" if row["error"] else "out")
        vol = row["search_volume"] if row["search_volume"] is not None else "-"
        top = row["top_competitor"] or (row.get("error") or "-")
        print(
            f"{item['keyword']:<42} {item['lane']:<10} {str(vol):>5} {pos:>6}  {top}",
            flush=True,
        )
        if i < len(KEYWORDS) - 1:
            time.sleep(0.2)

    snapshot = {
        "date": today,
        "domain": DOMAIN,
        "location_code": LOCATION,
        "location": "United States",
        "depth": DEPTH,
        "focus": "private-pay AL/MC/IL city + advisor placement keywords (no Medicaid)",
        "rows": rows,
        "summary": {
            "total": len(rows),
            "top10": sum(1 for r in rows if r["position"] and r["position"] <= 10),
            "top30": sum(1 for r in rows if r["position"] and r["position"] <= 30),
            "top100": sum(1 for r in rows if r["position"]),
            "not_ranking": sum(1 for r in rows if not r["position"] and not r["error"]),
            "errors": sum(1 for r in rows if r["error"]),
            "total_cost": round(sum((r.get("cost") or 0) for r in rows), 5),
        },
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{today}.json"
    out_path.write_text(json.dumps(snapshot, indent=2))
    print("\nSummary:", json.dumps(snapshot["summary"], indent=2), flush=True)
    print("Wrote", out_path, flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
