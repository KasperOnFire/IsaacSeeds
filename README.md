# Isaac Seeds

A community seed finder for *The Binding of Isaac: Repentance+*. Browse challenge-worthy seed codes by character, submit your own, and vote on the best ones — all wrapped in a UI styled after the game's own gothic paper-note aesthetic.

## Overview

- **"Who Am I?" character select** — a 3D ring carousel of every character (Normal + Tainted), rendered on a torn paper note pulled from the game's actual UI textures.
- **Browse seeds by character** — sorted by community upvotes, with difficulty rating, tags, notable items, and version info at a glance.
- **Submit seeds** — share a seed code with a description, difficulty rating, and tags for what makes it interesting.
- **Vote & moderate** — upvote good seeds, flag bad ones; a seed is automatically hidden once it collects enough flags.

This project is under active development — expect the feature set to keep growing.

## Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) 2 (Svelte 5 runes) + [Tailwind CSS](https://tailwindcss.com/) v4 + Vite
- **Backend**: [PocketBase](https://pocketbase.io/) — a single-binary Go backend with an embedded SQLite database
- **Optional**: [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) for CAPTCHA on seed submission

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3 (used only for one-time collection setup; standard library only, no pip installs needed)
- A [PocketBase](https://pocketbase.io/docs/) binary matching the version in `backend/` (currently `0.38.0`) — not committed to the repo, download it separately and place it at `backend/pocketbase.exe`
- Windows + PowerShell (the current dev scripts are Windows-only)

### Setup

1. Clone the repo, then download a [PocketBase 0.38.0 release](https://github.com/pocketbase/pocketbase/releases/tag/v0.38.0) for your platform and unzip `pocketbase.exe` into `backend/`.
2. Install frontend dependencies:
   ```powershell
   cd frontend
   npm install
   cd ..
   ```
3. Copy the env template (in `frontend/`) and fill in Turnstile keys if you have them (optional in dev):
   ```powershell
   copy frontend\.env.example frontend\.env
   ```
4. Start PocketBase on its own the first time, so you can create an admin account through its web UI:
   ```powershell
   .\backend\pocketbase.exe serve
   ```
   Visit `http://localhost:8090/_/`, create the admin account, then stop this process (Ctrl+C) — `start.ps1` will take over from here.
5. From the repo root, run the setup script to start both services and create the required collections (uses the admin account you just made):
   ```powershell
   .\start.ps1 -Setup
   ```
6. Visit `http://localhost:5173`.

### Everyday use

```powershell
.\start.ps1           # start PocketBase + Vite dev server (localhost:5173)
.\start.ps1 -Prod     # build and run the production Node server (localhost:3000)
.\stop.ps1            # stop all background services
.\status.ps1           # check what's running and tail the logs
```

## Project Structure

```
IsaacSeeds/
├── frontend/              SvelteKit app — routes, components, PocketBase client
├── backend/               PocketBase binary + data (gitignored except migrations)
├── setup_pocketbase.py    One-time collection bootstrap
├── start.ps1              Start PocketBase + frontend in the background
├── stop.ps1               Stop all background services
└── status.ps1             Check service status and tail logs
```

## License

The code in this repository is [MIT licensed](LICENSE).

This does **not** extend to the game assets used by the app (character sprites, paper textures) — those are property of Nicalis / Edmund McMillen and are used here under fair-use as a fan project, not relicensed in any way.

## Credits & Disclaimer

Fan project — not affiliated with or endorsed by Nicalis or Edmund McMillen. Character sprites and paper textures are extracted from *The Binding of Isaac: Repentance+* game files for fan/personal use.

Built with [Claude Code](https://claude.com/claude-code).
