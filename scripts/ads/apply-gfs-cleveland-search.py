#!/usr/bin/env python3
"""Create GFS Cleveland — Search in account 3466711027.

Creates new budget, campaign, keywords, RSA, sitelinks, call asset,
negative list, and GFS-only conversion actions. Does not mutate GFC
Employer (24158336820) or GFC Operator (24184008234).

Default is dry-run (no writes). Pass --apply to mutate. Pass --enable
with --apply to turn serving on after isolation checks pass.

  /Users/christopherray/.mcp-servers/mcp-google-ads/.venv/bin/python \
    scripts/ads/apply-gfs-cleveland-search.py --apply --enable
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

MCP_DIR = "/Users/christopherray/.mcp-servers/mcp-google-ads"
sys.path.insert(0, MCP_DIR)

from dotenv import load_dotenv  # noqa: E402
from google.auth.transport.requests import Request  # noqa: E402
from google.oauth2.credentials import Credentials  # noqa: E402
import requests  # noqa: E402

load_dotenv(os.path.join(MCP_DIR, ".env"))

API_VERSION = "v24"
CUSTOMER_ID = "3466711027"
PROTECTED = {
    "24158336820": "GFC Employer — Search",
    "24184008234": "GFC Operator — Search",
}
APPLY = "--apply" in sys.argv
ENABLE = "--enable" in sys.argv
BASE = f"https://googleads.googleapis.com/{API_VERSION}/customers/{CUSTOMER_ID}"
SPEC_DIR = Path(__file__).resolve().parent
NEGATIVES_PATH = SPEC_DIR / "gfs-cleveland-negatives.txt"

GEO_IDS = [
    "1023631",
    "1024088",
    "1023967",
    "1023779",
    "1023558",
    "1023618",
    "1023993",
    "1023544",
    "9052645",
    "9052828",
    "9052881",
]
KEYWORDS = [
    "cleveland senior living advisor",
    "assisted living advisor cleveland",
    "senior living placement cleveland",
    "memory care advisor cleveland",
    "help finding assisted living cleveland",
    "cleveland assisted living advisor",
    "assisted living placement cleveland",
    "senior living consultant cleveland",
    "memory care placement cleveland",
]
HEADLINES = [
    "Cleveland Senior Advisor",
    "Talk to Jocelynn Directly",
    "Free Family Placement Consult",
    "Assisted Living Help Nearby",
    "Memory Care Help in Cleveland",
    "Local Cleveland Family Help",
    "Westlake to Chagrin Valley",
    "Compare Communities, Then Tour",
    "You Talk to a Local Advisor",
    "Guide for Seniors — Cleveland",
    "Chagrin Valley Placement Help",
    "Find the Right Fit Nearby",
    "No Cost to Families",
    "Speak With Jocelynn Today",
    "Shaker Heights & Lakewood",
]
DESCRIPTIONS = [
    "I help Cleveland families compare assisted living and memory care, then schedule tours.",
    "Free local help for Cleveland families. You talk to Jocelynn, not a call center.",
    "Tell me what you need. I will narrow communities that fit and help you schedule tours.",
]
SITELINKS = [
    ("Talk with an advisor", "https://www.guideforseniors.com/contact"),
    ("Assisted Living Cleveland", "https://www.guideforseniors.com/assisted-living-cleveland"),
    ("Memory Care Cleveland", "https://www.guideforseniors.com/memory-care-cleveland"),
    ("Senior Living Costs", "https://www.guideforseniors.com/senior-living-costs-cleveland"),
]
FINAL_URL = "https://www.guideforseniors.com/cleveland-senior-living-advisor"
DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]


def assert_copy_limits() -> None:
    for headline in HEADLINES:
        if len(headline) > 30:
            raise SystemExit(f"Headline too long ({len(headline)}): {headline}")
    for description in DESCRIPTIONS:
        if len(description) > 90:
            raise SystemExit(f"Description too long ({len(description)}): {description}")
    for text, _url in SITELINKS:
        if len(text) > 25:
            raise SystemExit(f"Sitelink too long ({len(text)}): {text}")


def get_headers() -> dict[str, str]:
    creds_path = os.environ["GOOGLE_ADS_CREDENTIALS_PATH"]
    creds = Credentials.from_authorized_user_info(
        json.load(open(creds_path)),
        scopes=["https://www.googleapis.com/auth/adwords"],
    )
    if not creds.valid:
        creds.refresh(Request())
    headers = {
        "Authorization": f"Bearer {creds.token}",
        "developer-token": os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "Content-Type": "application/json",
    }
    login_cid = os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID", "").replace("-", "")
    if login_cid:
        headers["login-customer-id"] = login_cid
    return headers


def search(headers: dict[str, str], query: str) -> list[dict]:
    body: dict = {"query": query}
    rows: list[dict] = []
    while True:
        resp = requests.post(f"{BASE}/googleAds:search", headers=headers, json=body)
        if resp.status_code != 200:
            raise SystemExit(f"Search failed {resp.status_code}: {resp.text[:2000]}")
        data = resp.json()
        rows.extend(data.get("results", []))
        token = data.get("nextPageToken")
        if not token:
            return rows
        body["pageToken"] = token


def mutate(headers: dict[str, str], path: str, operations: list[dict], label: str) -> dict:
    body = {"operations": operations}
    if not APPLY:
        body["validateOnly"] = True
    resp = requests.post(f"{BASE}/{path}", headers=headers, json=body)
    mode = "APPLY" if APPLY else "VALIDATE"
    if resp.status_code != 200:
        print(f"[{mode}] {label} FAILED {resp.status_code}")
        print(json.dumps(resp.json(), indent=2)[:5000])
        raise SystemExit(1)
    print(f"[{mode}] {label}: OK ({len(operations)} ops)")
    return resp.json()


def resource_id(resource_name: str) -> str:
    return resource_name.rsplit("/", 1)[-1]


def snapshot_protected(headers: dict[str, str]) -> dict[str, dict]:
    ids = ", ".join(PROTECTED)
    rows = search(
        headers,
        "SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros "
        f"FROM campaign WHERE campaign.id IN ({ids})",
    )
    out = {}
    for row in rows:
        campaign = row["campaign"]
        budget = row.get("campaignBudget", {})
        out[str(campaign["id"])] = {
            "name": campaign["name"],
            "status": campaign["status"],
            "budget": budget.get("amountMicros"),
        }
    if set(out) != set(PROTECTED):
        raise SystemExit(f"Protected campaign snapshot incomplete: {out}")
    return out


def assert_protected_unchanged(before: dict[str, dict], after: dict[str, dict]) -> None:
    if before != after:
        print("PROTECTED CAMPAIGNS CHANGED — aborting")
        print("before", json.dumps(before, indent=2))
        print("after", json.dumps(after, indent=2))
        raise SystemExit(2)


def load_negatives() -> list[str]:
    return [
        line.strip()
        for line in NEGATIVES_PATH.read_text().splitlines()
        if line.strip() and not line.startswith("#")
    ]


def chunks(items: list, size: int):
    for i in range(0, len(items), size):
        yield items[i : i + size]


def created_name(result: dict) -> str:
    name = result.get("resourceName")
    if not name and APPLY:
        raise SystemExit(f"Mutate returned no resourceName: {result}")
    return name or "dry-run"


def main() -> None:
    assert_copy_limits()
    if ENABLE and not APPLY:
        raise SystemExit("--enable requires --apply")

    headers = get_headers()
    before = snapshot_protected(headers)
    print("Protected snapshot:")
    for cid, meta in before.items():
        print(f"  {meta['name']} ({cid}) {meta['status']} budget={meta['budget']}")

    existing = search(
        headers,
        "SELECT campaign.id, campaign.name, campaign.status FROM campaign "
        "WHERE campaign.name = 'GFS Cleveland — Search' AND campaign.status != 'REMOVED'",
    )
    if existing:
        campaign_id = str(existing[0]["campaign"]["id"])
        campaign_rn = f"customers/{CUSTOMER_ID}/campaigns/{campaign_id}"
        print(f"Campaign already exists: {campaign_id} {existing[0]['campaign']['status']}")
        ads = search(
            headers,
            "SELECT ad_group_ad.resource_name FROM ad_group_ad "
            f"WHERE campaign.id = {campaign_id} AND ad_group_ad.status != 'REMOVED'",
        )
        if not ads:
            groups = search(
                headers,
                "SELECT ad_group.resource_name FROM ad_group "
                f"WHERE campaign.id = {campaign_id} AND ad_group.status != 'REMOVED'",
            )
            if not groups:
                raise SystemExit("Campaign exists but has no ad group")
            ad_group_rn = groups[0]["adGroup"]["resourceName"]
            mutate(
                headers,
                "adGroupAds:mutate",
                [
                    {
                        "create": {
                            "adGroup": ad_group_rn,
                            "status": "ENABLED",
                            "ad": {
                                "finalUrls": [FINAL_URL],
                                "responsiveSearchAd": {
                                    "headlines": [{"text": text} for text in HEADLINES],
                                    "descriptions": [{"text": text} for text in DESCRIPTIONS],
                                    "path1": "Cleveland",
                                    "path2": "Advisor",
                                },
                            },
                        }
                    }
                ],
                "GFS RSA",
            )
        assets = search(
            headers,
            "SELECT campaign.id, campaign_asset.resource_name, campaign_asset.field_type "
            f"FROM campaign_asset WHERE campaign.id = {campaign_id} "
            "AND campaign_asset.status != 'REMOVED'",
        )
        have_sitelink = any(row["campaignAsset"].get("fieldType") == "SITELINK" for row in assets)
        have_call = any(row["campaignAsset"].get("fieldType") == "CALL" for row in assets)
        if APPLY and (not have_sitelink or not have_call):
            sitelink_ops = [
                {
                    "create": {
                        "name": text,
                        "type": "SITELINK",
                        "finalUrls": [url],
                        "sitelinkAsset": {"linkText": text},
                    }
                }
                for text, url in SITELINKS
            ]
            sitelink_ops.append(
                {
                    "create": {
                        "name": "GFS call (216) 677-4630",
                        "type": "CALL",
                        "callAsset": {
                            "countryCode": "US",
                            "phoneNumber": "216-677-4630",
                        },
                    }
                }
            )
            asset_result = mutate(headers, "assets:mutate", sitelink_ops, "Sitelink and call assets")
            asset_rns = [created_name(item) for item in asset_result.get("results", [])]
            campaign_assets = []
            if not have_sitelink:
                for asset_rn in asset_rns[:-1]:
                    campaign_assets.append(
                        {
                            "create": {
                                "campaign": campaign_rn,
                                "asset": asset_rn,
                                "fieldType": "SITELINK",
                            }
                        }
                    )
            if not have_call:
                campaign_assets.append(
                    {
                        "create": {
                            "campaign": campaign_rn,
                            "asset": asset_rns[-1],
                            "fieldType": "CALL",
                        }
                    }
                )
            if campaign_assets:
                mutate(headers, "campaignAssets:mutate", campaign_assets, "Attach sitelinks and call extension")
    else:
        conversion_rns = []
        existing_actions = search(
            headers,
            "SELECT conversion_action.resource_name, conversion_action.name "
            "FROM conversion_action "
            "WHERE conversion_action.name IN ('GFS Phone Click', 'GFS Booked Callback') "
            "AND conversion_action.status != 'REMOVED'",
        )
        by_name = {row["conversionAction"]["name"]: row["conversionAction"]["resourceName"] for row in existing_actions}
        missing = [name for name in ("GFS Phone Click", "GFS Booked Callback") if name not in by_name]
        if missing:
            conversion_result = mutate(
                headers,
                "conversionActions:mutate",
                [
                    {
                        "create": {
                            "name": name,
                            "type": "WEBPAGE",
                            "category": "CONTACT",
                            "status": "ENABLED",
                            "primaryForGoal": False,
                            "countingType": "ONE_PER_CLICK",
                            "clickThroughLookbackWindowDays": 30,
                            "viewThroughLookbackWindowDays": 1,
                            "valueSettings": {
                                "defaultValue": 1,
                                "alwaysUseDefaultValue": True,
                            },
                        }
                    }
                    for name in missing
                ],
                "GFS conversion actions",
            )
            created = [created_name(item) for item in conversion_result.get("results", [])]
            conversion_rns = [by_name[name] for name in ("GFS Phone Click", "GFS Booked Callback") if name in by_name] + created
        else:
            conversion_rns = [by_name["GFS Phone Click"], by_name["GFS Booked Callback"]]
            print("Reusing existing GFS conversion actions")

        existing_goals = search(
            headers,
            "SELECT custom_conversion_goal.resource_name, custom_conversion_goal.name "
            "FROM custom_conversion_goal "
            "WHERE custom_conversion_goal.name = 'GFS Cleveland conversions' "
            "AND custom_conversion_goal.status != 'REMOVED'",
        )
        goal_rn = ""
        if existing_goals:
            goal_rn = existing_goals[0]["customConversionGoal"]["resourceName"]
            print(f"Reusing custom conversion goal {goal_rn}")
        elif APPLY:
            goal_result = mutate(
                headers,
                "customConversionGoals:mutate",
                [
                    {
                        "create": {
                            "name": "GFS Cleveland conversions",
                            "status": "ENABLED",
                            "conversionActions": conversion_rns,
                        }
                    }
                ],
                "GFS custom conversion goal",
            )
            goal_rn = created_name(goal_result.get("results", [{}])[0])
        else:
            print("[VALIDATE] GFS custom conversion goal: skipped until real conversion IDs exist")

        existing_budgets = search(
            headers,
            "SELECT campaign_budget.resource_name, campaign_budget.name "
            "FROM campaign_budget "
            "WHERE campaign_budget.name = 'GFS Cleveland — Search budget' "
            "AND campaign_budget.status != 'REMOVED'",
        )
        if existing_budgets:
            budget_rn = existing_budgets[0]["campaignBudget"]["resourceName"]
            print(f"Reusing budget {budget_rn}")
        else:
            budget_result = mutate(
                headers,
                "campaignBudgets:mutate",
                [
                    {
                        "create": {
                            "name": "GFS Cleveland — Search budget",
                            "amountMicros": "15000000",
                            "deliveryMethod": "STANDARD",
                            "explicitlyShared": False,
                            "type": "STANDARD",
                        }
                    }
                ],
                "GFS exclusive budget",
            )
            budget_rn = created_name(budget_result.get("results", [{}])[0])

        if not APPLY:
            print("[VALIDATE] Remaining campaign ops skipped until --apply (need real budget/conversion IDs)")
            campaign_id = "0"
        else:
            campaign_result = mutate(
                headers,
                "campaigns:mutate",
                [
                    {
                        "create": {
                            "name": "GFS Cleveland — Search",
                            "status": "PAUSED",
                            "advertisingChannelType": "SEARCH",
                            "campaignBudget": budget_rn,
                            "containsEuPoliticalAdvertising": "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
                            "networkSettings": {
                                "targetGoogleSearch": True,
                                "targetSearchNetwork": False,
                                "targetContentNetwork": False,
                                "targetPartnerSearchNetwork": False,
                            },
                            "geoTargetTypeSetting": {
                                "positiveGeoTargetType": "PRESENCE",
                                "negativeGeoTargetType": "PRESENCE",
                            },
                            "targetSpend": {
                                "cpcBidCeilingMicros": "8000000",
                            },
                        }
                    }
                ],
                "GFS campaign",
            )
            campaign_rn = created_name(campaign_result.get("results", [{}])[0])
            campaign_id = resource_id(campaign_rn)

        if APPLY:
            mutate(
                headers,
                "conversionGoalCampaignConfigs:mutate",
                [
                    {
                        "update": {
                            "resourceName": f"customers/{CUSTOMER_ID}/conversionGoalCampaignConfigs/{campaign_id}",
                            "goalConfigLevel": "CAMPAIGN",
                            "customConversionGoal": goal_rn,
                        },
                        "updateMask": "goalConfigLevel,customConversionGoal",
                    }
                ],
                "Attach GFS conversions only to GFS campaign",
            )

        criterion_ops = [
            {
                "create": {
                    "campaign": campaign_rn if APPLY else f"customers/{CUSTOMER_ID}/campaigns/0",
                    "language": {"languageConstant": "languageConstants/1000"},
                }
            }
        ]
        for geo_id in GEO_IDS:
            criterion_ops.append(
                {
                    "create": {
                        "campaign": campaign_rn if APPLY else f"customers/{CUSTOMER_ID}/campaigns/0",
                        "location": {"geoTargetConstant": f"geoTargetConstants/{geo_id}"},
                    }
                }
            )
        for day in DAYS:
            criterion_ops.append(
                {
                    "create": {
                        "campaign": campaign_rn if APPLY else f"customers/{CUSTOMER_ID}/campaigns/0",
                        "adSchedule": {
                            "dayOfWeek": day,
                            "startHour": 9,
                            "startMinute": "ZERO",
                            "endHour": 17,
                            "endMinute": "ZERO",
                        },
                    }
                }
            )
        mutate(headers, "campaignCriteria:mutate", criterion_ops, "Geo, language, weekday 9-17 ET")

        shared_result = mutate(
            headers,
            "sharedSets:mutate",
            [
                {
                    "create": {
                        "name": "GFS Cleveland — Negatives",
                        "type": "NEGATIVE_KEYWORDS",
                    }
                }
            ],
            "New GFS negative list",
        )
        shared_rn = created_name(shared_result.get("results", [{}])[0])
        negatives = load_negatives()
        for batch in chunks(negatives, 50):
            mutate(
                headers,
                "sharedCriteria:mutate",
                [
                    {
                        "create": {
                            "sharedSet": shared_rn if APPLY else f"customers/{CUSTOMER_ID}/sharedSets/0",
                            "keyword": {"text": term, "matchType": "PHRASE"},
                        }
                    }
                    for term in batch
                ],
                f"GFS negatives +{len(batch)}",
            )
        mutate(
            headers,
            "campaignSharedSets:mutate",
            [
                {
                    "create": {
                        "campaign": campaign_rn if APPLY else f"customers/{CUSTOMER_ID}/campaigns/0",
                        "sharedSet": shared_rn if APPLY else f"customers/{CUSTOMER_ID}/sharedSets/0",
                    }
                }
            ],
            "Attach GFS negatives only to GFS campaign",
        )

        ad_group_result = mutate(
            headers,
            "adGroups:mutate",
            [
                {
                    "create": {
                        "campaign": campaign_rn if APPLY else f"customers/{CUSTOMER_ID}/campaigns/0",
                        "name": "Cleveland placement advisor",
                        "status": "ENABLED",
                        "type": "SEARCH_STANDARD",
                    }
                }
            ],
            "GFS ad group",
        )
        ad_group_rn = created_name(ad_group_result.get("results", [{}])[0])
        mutate(
            headers,
            "adGroupCriteria:mutate",
            [
                {
                    "create": {
                        "adGroup": ad_group_rn if APPLY else f"customers/{CUSTOMER_ID}/adGroups/0",
                        "status": "ENABLED",
                        "keyword": {"text": keyword, "matchType": "EXACT"},
                    }
                }
                for keyword in KEYWORDS
            ],
            "Exact-match keywords only",
        )
        mutate(
            headers,
            "adGroupAds:mutate",
            [
                {
                    "create": {
                        "adGroup": ad_group_rn if APPLY else f"customers/{CUSTOMER_ID}/adGroups/0",
                        "status": "ENABLED",
                        "ad": {
                            "finalUrls": [FINAL_URL],
                            "responsiveSearchAd": {
                                "headlines": [{"text": text} for text in HEADLINES],
                                "descriptions": [{"text": text} for text in DESCRIPTIONS],
                                "path1": "Cleveland",
                                "path2": "Advisor",
                            },
                        },
                    }
                }
            ],
            "GFS RSA",
        )

        sitelink_ops = [
            {
                "create": {
                    "name": text,
                    "type": "SITELINK",
                    "finalUrls": [url],
                    "sitelinkAsset": {"linkText": text},
                }
            }
            for text, url in SITELINKS
        ]
        sitelink_ops.append(
            {
                "create": {
                    "name": "GFS call (216) 677-4630",
                    "type": "CALL",
                    "callAsset": {
                        "countryCode": "US",
                        "phoneNumber": "216-677-4630",
                    },
                }
            }
        )
        asset_result = mutate(headers, "assets:mutate", sitelink_ops, "Sitelink and call assets")
        asset_rns = [created_name(item) for item in asset_result.get("results", [])]
        if APPLY:
            campaign_assets = []
            for asset_rn in asset_rns[:-1]:
                campaign_assets.append(
                    {
                        "create": {
                            "campaign": campaign_rn,
                            "asset": asset_rn,
                            "fieldType": "SITELINK",
                        }
                    }
                )
            campaign_assets.append(
                {
                    "create": {
                        "campaign": campaign_rn,
                        "asset": asset_rns[-1],
                        "fieldType": "CALL",
                    }
                }
            )
            mutate(headers, "campaignAssets:mutate", campaign_assets, "Attach sitelinks and call extension")

    after = snapshot_protected(headers)
    assert_protected_unchanged(before, after)
    print("GFC campaigns unchanged.")

    if APPLY:
        rows = search(
            headers,
            "SELECT conversion_action.id, conversion_action.name, conversion_action.primary_for_goal, "
            "conversion_action.tag_snippets FROM conversion_action "
            "WHERE conversion_action.name IN ('GFS Phone Click', 'GFS Booked Callback')",
        )
        print("Conversion actions:")
        for row in rows:
            action = row["conversionAction"]
            print(
                f"  {action['name']} id={action['id']} primaryForGoal={action.get('primaryForGoal')}"
            )
            for snippet in action.get("tagSnippets") or []:
                event = snippet.get("eventSnippet") or ""
                if "send_to" in event or "AW-" in event:
                    print(f"    snippet: {event[:240]}")

    if APPLY and ENABLE:
        campaign_rn = f"customers/{CUSTOMER_ID}/campaigns/{campaign_id}"
        mutate(
            headers,
            "campaigns:mutate",
            [
                {
                    "update": {
                        "resourceName": campaign_rn,
                        "status": "ENABLED",
                    },
                    "updateMask": "status",
                }
            ],
            "Enable GFS Cleveland — Search",
        )
        final = snapshot_protected(headers)
        assert_protected_unchanged(before, final)
        print("GFS campaign ENABLED. GFC still unchanged.")
    elif APPLY:
        print(f"GFS campaign {campaign_id} left PAUSED. Re-run with --apply --enable to serve.")


if __name__ == "__main__":
    print(f"Mode: {'APPLY' if APPLY else 'DRY RUN (validateOnly)'} enable={ENABLE}\n")
    main()
    print("\nDone.")
