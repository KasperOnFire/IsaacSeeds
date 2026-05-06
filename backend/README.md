# Backend — PocketBase

## Setup

1. Download the PocketBase binary for your platform from https://pocketbase.io/docs/
2. Place the `pocketbase` (or `pocketbase.exe`) binary in this directory
3. Run it: `./pocketbase serve`
4. Open the admin UI at http://localhost:8090/_/
5. Create an admin account on first run

## Collections to create

### `seeds`
| Field          | Type    | Required | Notes                              |
|----------------|---------|----------|------------------------------------|
| seed           | Text    | Yes      | Format: `XXXX XXXX`               |
| character      | Text    | Yes      | Character ID (e.g. `isaac`)       |
| version        | Text    | Yes      | `repentance` or `repentance_plus` |
| description    | Text    | No       | Max 500 chars                     |
| difficulty     | Number  | Yes      | 1–5                               |
| tags           | JSON    | No       | Array of tag IDs                  |
| notable_items  | Text    | No       | Max 200 chars                     |
| upvotes        | Number  | Yes      | Default: 0                        |
| flags          | Number  | Yes      | Default: 0                        |
| status         | Text    | Yes      | `active`, `flagged`, `removed`    |

**API rules for `seeds`:**
- List/View: `status = "active"`
- Create: leave open (server validates via form action)
- Update/Delete: locked (admin only)

### `votes`
| Field         | Type     | Required | Notes                       |
|---------------|----------|----------|-----------------------------|
| seed_id       | Relation | Yes      | → seeds collection          |
| session_token | Text     | Yes      | Ephemeral, not linked to user |
| ip_hash       | Text     | Yes      | SHA-256 of IP+salt, truncated |
| type          | Text     | Yes      | `upvote` or `flag`          |

**API rules for `votes`:**
- List/View: admin only
- Create: leave open (server validates)
- Update/Delete: locked

## Production deployment

```bash
# Run as a background service
./pocketbase serve --http="0.0.0.0:8090"
```

Use nginx to reverse-proxy `/api/` from your domain to port 8090.
Keep the admin UI (`/_/`) behind a firewall or bind to localhost only in prod.
