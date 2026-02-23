#!/usr/bin/env bash
# Smoke test for observability: verifies X-Request-Id header and generates log traffic.
# Usage: SERVICE_URL=https://your-app.example.com ./scripts/smoke-observability.sh

set -e

SERVICE_URL="${SERVICE_URL:?Set SERVICE_URL to the deployed service base URL}"

check_request_id() {
  local url="$1"
  local expected_code="${2:-200}"
  local headers
  headers=$(curl -sS -D - -o /dev/null "$url")
  local http_code
  http_code=$(echo "$headers" | head -n 1 | awk '{print $2}')
  local request_id
  request_id=$(echo "$headers" | grep -i '^x-request-id:' | cut -d' ' -f2- | tr -d '\r')

  if [ "$http_code" != "$expected_code" ]; then
    echo "WARN: $url returned $http_code (expected $expected_code)"
  fi

  if [ -z "$request_id" ]; then
    echo "FAIL: X-Request-Id header missing on $url"
    return 1
  fi

  echo "OK: $url $http_code, X-Request-Id=$request_id"
  return 0
}

echo "Smoke test: observability (SERVICE_URL=$SERVICE_URL)"

check_request_id "$SERVICE_URL/health" 200
check_request_id "$SERVICE_URL/api/unknown-route-404" 404

echo "Smoke test passed. Check logs for requestId correlation."
