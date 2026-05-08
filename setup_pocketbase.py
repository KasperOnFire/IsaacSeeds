"""
Creates the required PocketBase collections for Isaac Seeds.
Run once after starting PocketBase for the first time.

Usage:
    python setup_pocketbase.py

You will be prompted for your PocketBase admin email and password
(set during first launch at http://localhost:8090/_/).
"""

import urllib.request
import urllib.error
import json
import getpass
import os

PB = "http://localhost:8090"


def api(method: str, path: str, body=None, token: str = ""):
    url = PB + path
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = token
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        resp = json.loads(e.read())
        raise RuntimeError(f"HTTP {e.code}: {resp.get('message', resp)}")


# ── Auth ────────────────────────────────────────────────────────────────────
# Credentials can be supplied via environment variables for headless/scripted use:
#   $env:PB_ADMIN_EMAIL    = "admin@example.com"
#   $env:PB_ADMIN_PASSWORD = "yourpassword"
print("PocketBase admin login (http://localhost:8090/_/)")
email    = os.environ.get("PB_ADMIN_EMAIL")    or input("Admin email: ").strip()
password = os.environ.get("PB_ADMIN_PASSWORD") or getpass.getpass("Admin password: ")

try:
    # PocketBase v0.23+ uses _superusers collection (replaces /api/admins)
    result = api("POST", "/api/collections/_superusers/auth-with-password",
                 {"identity": email, "password": password})
    token = result["token"]
    print("  Authenticated OK\n")
except RuntimeError as e:
    print(f"  Auth failed: {e}")
    raise SystemExit(1)


def create_collection(schema: dict):
    name = schema["name"]
    # check if it already exists
    try:
        api("GET", f"/api/collections/{name}", token=token)
        print(f"  {name}: already exists, skipping")
        return
    except RuntimeError:
        pass
    api("POST", "/api/collections", schema, token=token)
    print(f"  {name}: created OK")


# ── seeds collection ────────────────────────────────────────────────────────
# PocketBase v0.23+ uses plain field objects (no top-level min/max/options).
create_collection({
    "name": "seeds",
    "type": "base",
    "listRule": "",   # public read
    "viewRule": "",
    "createRule": "", # public create (rate-limited in SvelteKit)
    "updateRule": None,
    "deleteRule": None,
    "fields": [
        {"name": "seed",          "type": "text",   "required": True},
        {"name": "character",     "type": "text",   "required": True},
        {"name": "version",       "type": "text",   "required": False},
        {"name": "description",   "type": "text",   "required": False},
        {"name": "difficulty",    "type": "number", "required": False},
        {"name": "tags",          "type": "json",   "required": False},
        {"name": "notable_items", "type": "text",   "required": False},
        {"name": "upvotes",       "type": "number", "required": False},
        {"name": "flags",         "type": "number", "required": False},
        {"name": "status",        "type": "text",   "required": False},
    ]
})

# ── votes collection ─────────────────────────────────────────────────────────
create_collection({
    "name": "votes",
    "type": "base",
    "listRule": None,  # no public read
    "viewRule": None,
    "createRule": None,
    "updateRule": None,
    "deleteRule": None,
    "fields": [
        {"name": "seed_id",       "type": "text", "required": True},
        {"name": "session_token", "type": "text", "required": False},
        {"name": "ip_hash",       "type": "text", "required": False},
        {"name": "type",          "type": "text", "required": True},
    ]
})

print("\nDone. Your PocketBase collections are ready.")
print("Visit http://localhost:8090/_/ to view them.")
