#!/usr/bin/env python3
"""Create a PAUSED GFS Cleveland Search campaign in account 3466711027.

Does not touch GFC Employer / GFC Operator campaigns, budgets, or shared lists.
Does not enable serving. Default is dry-run.

Requires Google Ads API credentials in the environment (not present in GFS
.env.local as of 2026-09-15). The Google Ads MCP in this workspace is read-only.

Usage:
  python3 scripts/ads/create-gfs-cleveland-search.py
  python3 scripts/ads/create-gfs-cleveland-search.py --apply
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

SPEC_PATH = Path(__file__).with_name("gfs-cleveland-search.json")
NEGATIVES_PATH = Path(__file__).with_name("gfs-cleveland-negatives.txt")
PROTECTED_CAMPAIGNS = {
    "GFC Employer — Search",
    "GFC Operator — Search",
}


def load_spec() -> dict:
    return json.loads(SPEC_PATH.read_text())


def load_negatives() -> list[str]:
    return [
        line.strip()
        for line in NEGATIVES_PATH.read_text().splitlines()
        if line.strip() and not line.startswith("#")
    ]


def print_plan(spec: dict, negatives: list[str]) -> None:
    campaign = spec["campaign"]
    print("GFS Cleveland — Search (PAUSED draft)")
    print(f"  Account: {spec['account_id']} (manager {spec['manager_id']})")
    print(f"  Daily cap: ${campaign['budget_micros_per_day'] / 1_000_000:.0f} (unshared)")
    print(f"  Bidding: {campaign['bidding']['strategy']} CPC ceiling ${campaign['bidding']['cpc_bid_ceiling_micros'] / 1_000_000:.0f}")
    print(f"  Geo: {len(campaign['geo']['locations'])} Ohio cities, presence only")
    print(f"  Keywords: {len(spec['keywords_exact_only'])} exact-match only")
    print(f"  Negatives: {len(negatives)} phrase terms, new list (not GFC)")
    print(f"  Schedule: Mon–Fri {campaign['schedule']['start_hour']}:00–{campaign['schedule']['end_hour']}:00 ET (confirm before enable)")
    print(f"  Landing: {campaign['landing_pages']['primary']}")
    print("  Conversions to create (campaign-only, not account-default primary):")
    for conversion in spec["conversions"]["create"]:
        print(f"    - {conversion['name']}")
    print()
    print("Current GFC vs proposed GFS cap:")
    state = spec["current_account_state_2026_09_15"]
    print(f"  GFC Employer: ENABLED ${state['gfc_employer_search']['budget_per_day']}/day, ${state['gfc_employer_search']['spend_30d']} last 30d")
    print(f"  GFC Operator: PAUSED ${state['gfc_operator_search']['budget_per_day']}/day, ${state['gfc_operator_search']['spend_30d']} last 30d")
    print(f"  Proposed GFS: PAUSED ${state['proposed_gfs_daily_cap']}/day until owner says yes")
    print()
    print("Protected campaigns (will abort if a mutate would touch them):")
    for name in sorted(PROTECTED_CAMPAIGNS):
        print(f"  - {name}")


def apply_via_api(_spec: dict, _negatives: list[str]) -> int:
    try:
        from google.ads.googleads.client import GoogleAdsClient  # type: ignore
    except ImportError:
        print("google-ads library is not installed and GFS has no Ads API credentials.")
        print("Campaign spec is saved. Do not enable spend until the owner approves.")
        return 2

    _ = GoogleAdsClient
    print("API mutate path is intentionally not implemented in this session:")
    print("  the installed Google Ads MCP is read-only, and creating account-default")
    print("  conversions would risk attaching GFS actions to GFC campaigns.")
    print("Create the paused campaign + custom conversion goal in the UI from the spec,")
    print("or add a one-off mutate after owner approval.")
    return 3


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Attempt a live mutate (still leaves campaign PAUSED)")
    args = parser.parse_args()

    spec = load_spec()
    negatives = load_negatives()
    print_plan(spec, negatives)

    if not args.apply:
        print("Dry-run only. Re-run with --apply after owner approval if API credentials exist.")
        return 0

    return apply_via_api(spec, negatives)


if __name__ == "__main__":
    raise SystemExit(main())
