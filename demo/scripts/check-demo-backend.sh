#!/usr/bin/env bash
set -euo pipefail

backend_url="${DEMO_BACKEND_URL:-http://127.0.0.1:8000/}"

http_code="$(curl --silent --show-error --max-time 5 --output /dev/null --write-out "%{http_code}" "$backend_url" || true)"
if [[ "$http_code" == "000" ]]; then
  echo "Demo backend check failed: $backend_url is unreachable (no HTTP response)." >&2
  echo "Start the local API at http://127.0.0.1:8000/ before recording demos." >&2
  exit 1
fi

echo "Demo backend reachable: $backend_url (HTTP $http_code)"
