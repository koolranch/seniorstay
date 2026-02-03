#!/bin/bash

# Backlink Recovery - Redirect Chain Test Script
# Tests the most valuable backlink URLs to ensure redirect chains are minimized
# Run after deployment to verify configuration

echo "=========================================="
echo "Backlink Recovery Redirect Test"
echo "Testing redirect chains for top backlinks"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domain to test
DOMAIN="${1:-www.guideforseniors.com}"
PROTOCOL="https"

echo "Testing domain: ${PROTOCOL}://${DOMAIN}"
echo ""

# Function to test a URL and count redirects
test_url() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo "Testing: $description"
    echo "URL: $url"
    
    # Get HTTP response chain
    response=$(curl -sI -L -w "\nFinal Status: %{http_code}\nRedirect Count: %{num_redirects}\nFinal URL: %{url_effective}\n" "$url")
    
    # Extract redirect count
    redirect_count=$(echo "$response" | grep "Redirect Count:" | awk '{print $3}')
    final_status=$(echo "$response" | grep "Final Status:" | awk '{print $3}')
    final_url=$(echo "$response" | grep "Final URL:" | awk '{print $3}')
    
    # Check if within acceptable range
    if [ "$redirect_count" -le 2 ]; then
        echo -e "${GREEN}✓ PASS${NC} - $redirect_count redirect(s)"
    elif [ "$redirect_count" -le 3 ]; then
        echo -e "${YELLOW}⚠ WARNING${NC} - $redirect_count redirects (target: ≤2)"
    else
        echo -e "${RED}✗ FAIL${NC} - $redirect_count redirects (too many!)"
    fi
    
    echo "Final Status: $final_status"
    echo "Final URL: $final_url"
    echo ""
}

echo "=========================================="
echo "TIER 1: High-Value Blog Posts (300+ RDs)"
echo "=========================================="
echo ""

# Test the most valuable blog post URLs with various patterns
test_url "https://guideforseniors.com/blog/senior-online-games/" \
    "200" \
    "Senior Online Games (309 RDs) - non-www, trailing slash"

test_url "http://guideforseniors.com/blog/senior-online-games" \
    "200" \
    "Senior Online Games - HTTP, non-www, no trailing slash"

test_url "${PROTOCOL}://${DOMAIN}/blog/senior-online-games" \
    "200" \
    "Senior Online Games - Canonical URL"

test_url "https://guideforseniors.com/blog/cruises-for-seniors/" \
    "200" \
    "Cruises for Seniors (263 RDs) - non-www, trailing slash"

test_url "${PROTOCOL}://${DOMAIN}/blog/cruises-for-seniors" \
    "200" \
    "Cruises for Seniors - Canonical URL"

test_url "https://guideforseniors.com/blog/apps-for-seniors/" \
    "200" \
    "Apps for Seniors (100 RDs) - non-www, trailing slash"

echo "=========================================="
echo "TIER 2: Resources & Legacy URLs"
echo "=========================================="
echo ""

test_url "https://guideforseniors.com/resources/" \
    "200" \
    "Resources page (50+ backlinks) - trailing slash"

test_url "${PROTOCOL}://${DOMAIN}/resources" \
    "200" \
    "Resources page - Canonical URL"

test_url "${PROTOCOL}://${DOMAIN}/senior-entertainment/games/senior-online-games/" \
    "200" \
    "Legacy games URL (DR 22 backlink) - should redirect to blog"

test_url "${PROTOCOL}://${DOMAIN}/blog/entertainment-ideas" \
    "200" \
    "Entertainment Ideas (DR 75 backlink)"

echo "=========================================="
echo "TIER 3: Lost Backlink Recovery URLs"
echo "=========================================="
echo ""

test_url "${PROTOCOL}://${DOMAIN}/blog/cleveland-winter-safety-tips-for-seniors" \
    "200" \
    "Winter Safety (DR 72 backlink)"

test_url "${PROTOCOL}://${DOMAIN}/blog/person-centered-dementia-care-assisted-living" \
    "200" \
    "Dementia Care (DR 70 backlink)"

test_url "${PROTOCOL}://${DOMAIN}/blog/questions-to-ask-assisted-living-facilities" \
    "200" \
    "Questions to Ask (DR 29 backlink)"

echo "=========================================="
echo "Test Complete"
echo "=========================================="
echo ""
echo "✓ = Passed (0-2 redirects)"
echo "⚠ = Warning (3 redirects)"
echo "✗ = Failed (4+ redirects)"
echo ""
echo "Target: All URLs should have ≤2 redirects"
echo ""
echo "If you see 3+ redirects, check:"
echo "1. Vercel domain settings (www redirect)"
echo "2. DNS configuration"
echo "3. Cloudflare/CDN settings (if applicable)"
echo ""
