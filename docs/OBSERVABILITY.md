# Observability MVP

## Logging

- **stdout (JSON):** All logs go to stdout. Railway captures this natively.
- **Better Stack:** Set `LOGTAIL_SOURCE_TOKEN` to duplicate logs for retention,
  search, and alerting.

## Alerts (Better Stack)

1. Go to [Better Stack](https://logs.betterstack.com) → your source → Alerts.
2. Create an alert rule:
   - **5xx rate:**
     `SELECT count(*) FROM logs WHERE level = 'error' AND status >= 500` over a
     5‑minute window; alert if count > 2% of total requests (or absolute
     threshold).
   - **Fatal:** `SELECT * FROM logs WHERE level = 'fatal'` → alert on any match.

## Dashboards (Better Stack)

Create a dashboard with:

- **Requests/min:** `SELECT count(*) FROM logs WHERE msg IS NOT NULL` grouped by
  1‑min buckets.
- **Latency p95:** Use `responseTime` from HTTP logs.
- **4xx/5xx:** Filter by `status >= 400` and `status >= 500`.
- **Top failing endpoints:** Group by `path` where `status >= 400`.

## Smoke Checks

Run after deploy to verify request correlation:

```bash
SERVICE_URL=https://your-app.railway.app ./scripts/smoke-observability.sh
```

This script:

- Hits `/health` and a 404 route.
- Verifies `X-Request-Id` is present on responses.
- Generates a small amount of traffic for log verification.
