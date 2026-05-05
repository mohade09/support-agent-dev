# Support Agent — Voltway Workspace

Two-pane support tool for an electronics e-commerce platform:

- **`/agent`** — live-call workspace for a support agent (call panel, customer profile, order details, transcript, AI assistant rail).
- **`/supervisor`** — floor-supervisor view with **Live floor** (12-agent grid + KPIs) and **Performance** (last-month dashboard) tabs, plus the same AI assistant rail.

Both AI assistant rails stream from `/api/chat` → Mosaic AI Agent Bricks multi-agent supervisor (`mas-c15b1e56-endpoint`).

## Tech stack

- **Backend** — Python + FastAPI (`src/elegant_whale/backend`)
- **Frontend** — React + Vite + TanStack Router + shadcn/ui (`src/elegant_whale/ui`)
- **Infra** — Databricks Asset Bundles (`databricks.yml`), apx-managed dev loop

## Run locally (laptop)

### Install apx

The dev loop is driven by [apx](https://github.com/databricks-solutions/apx). One-line install:

```bash
curl -fsSL https://databricks-solutions.github.io/apx/install.sh | sh
```

The installer drops the binary in `~/.local/bin/apx`. Add it to your `PATH` if it isn't already:

```bash
export PATH="$HOME/.local/bin:$PATH"   # add to ~/.zshrc or ~/.bashrc
```

Verify:

```bash
apx --version
```

apx bootstraps `uv` (Python) and `bun` (JS) the first time you run a command that needs them — no extra installs required for the dev loop.

You also need the Databricks CLI for the deploy step:

```bash
# macOS
brew tap databricks/tap && brew install databricks
# any platform
curl -fsSL https://raw.githubusercontent.com/databricks/setup-cli/main/install.sh | sh
```

(`./deploy.sh` will install whatever is missing on first run, so this is only needed if you want to run `databricks` commands directly.)

### Dev mode (hot reload)

```bash
cd /path/to/support_agent

# Start backend + Vite + OpenAPI watcher (detached)
apx dev start

# Open http://localhost:9001
#   /agent       — agent workspace
#   /supervisor  — supervisor view (lands on Performance tab)
```

Useful while running:

```bash
apx dev logs       # one-shot logs
apx dev logs -f    # stream
apx dev status     # which servers are up + ports
apx dev check      # tsc + ty type-checks
apx dev restart    # restart all servers, preserve port
apx dev stop       # stop everything
```

### Deploy to Databricks (laptop)

```bash
# .env must contain DATABRICKS_CONFIG_PROFILE=<your-profile>
./deploy.sh                # target=dev (default), build=auto (true on laptop)
TARGET=prod ./deploy.sh    # override target
BUILD=false ./deploy.sh    # skip apx build, use existing .build/
```

What it does (in order): prereq install → auth check → `apx build` → bundle validate → bundle deploy → app start. Missing CLIs (`databricks`, `uv`, `apx`, `bun`) are installed automatically on first run.

## Deploy parameters

`deploy.sh` reads these env vars (all optional):

| Variable | Default | Purpose |
|---|---|---|
| `TARGET` | `dev` | Bundle target — picks the `targets.<name>` block in `databricks.yml`. |
| `BUILD` | `auto` | `auto` → `true` on laptop, `false` in a Databricks runtime. `true` always runs `apx build`; `false` requires `.build/` to already exist. |
| `DATABRICKS_CONFIG_PROFILE` | — | Profile name from `~/.databrickscfg`. Required on laptop. Ignored when running inside a Databricks runtime where `DATABRICKS_HOST` is auto-injected. |

**Auth resolution:**

| Where you run | Required env | CLI calls use |
|---|---|---|
| Laptop | `DATABRICKS_CONFIG_PROFILE` (in `.env`) | `-p $PROFILE` |
| Databricks workspace shell / cluster web terminal / job | `DATABRICKS_HOST` (auto-injected) | ambient (no `-p`) |

## Run from a Databricks workspace shell

Use a cluster's **Web Terminal** (Compute → cluster → Apps → Web Terminal) or a notebook `%sh` cell.

You have two ways to get the code into the workspace — pick whichever fits your situation:

### Option A — clone the GitHub repo directly into the workspace (recommended)

If your workspace can reach github.com, this is the fastest setup. No laptop sync needed.

1. In the Databricks workspace UI, go to **Workspace → your user folder → ⊕ Add → Git folder**.
2. Paste the repo URL: `https://github.com/mohade09/support-agent-dev`.
3. Click **Create Git folder**. The repo lands at `/Workspace/Users/<you>@databricks.com/support-agent-dev`.

Open a cluster's **Web Terminal** and run:

```bash
cp -r /Workspace/Users/<you>@databricks.com/support-agent-dev /tmp/support-agent-dev
cd /tmp/support-agent-dev
chmod +x deploy.sh
./deploy.sh                # auto-detects BUILD=false, uses the committed .build/
```

The repo already includes the latest committed `.build/` artifacts, so the workspace shell doesn't need `apx`/`uv`/`bun` — only `databricks` (auto-installed by `deploy.sh` if missing).

To pull the latest commits later: in the workspace UI, open the Git folder and click **Pull**, then re-run `cp -r ... && ./deploy.sh`.

### Option B — sync from your laptop (if the workspace can't reach GitHub)

### One-time setup from the laptop — push source + build

You run **all three commands** every time you want the workspace folder to reflect a fresh local build:

```bash
# 1. Build the frontend + Python wheel locally
apx build

# 2. Sync source code to the workspace
#    (databricks sync skips dot-prefixed dirs by default, so .build/
#    is uploaded separately in step 3)
databricks sync . /Users/<you>@databricks.com/support-agent-deb-source \
  --exclude "node_modules/**" --exclude ".venv/**" --exclude ".build/**" \
  --exclude ".databricks/**" --exclude ".tanstack/**" --exclude "__pycache__/**" \
  --exclude "*.pyc" --exclude ".env" \
  -p <your-profile>

# 3. Upload .build/ (the deploy target) — required for BUILD=false
#    runs from a workspace shell, since the workspace can't run apx build.
databricks workspace import-dir .build \
  /Users/<you>@databricks.com/support-agent-deb-source/.build \
  --overwrite -p <your-profile>
```

After steps 1–3, the workspace folder has both the source tree and a fresh `.build/` ready to deploy.

### Deploy from the workspace shell

```bash
# Copy to a writable filesystem (the /Workspace mount may be read-only)
cp -r /Workspace/Users/<you>@databricks.com/support-agent-deb-source /tmp/support-agent-deb
cd /tmp/support-agent-deb
chmod +x deploy.sh

./deploy.sh                # auto-detects BUILD=false, uses .build/, ambient auth
TARGET=prod ./deploy.sh    # override target
```

`deploy.sh` detects it's running in the workspace (`DATABRICKS_RUNTIME_VERSION` is auto-injected), so:
- It picks `BUILD=false` automatically — only the `databricks` CLI is required, not `apx`/`uv`/`bun`.
- It uses ambient auth — no `DATABRICKS_CONFIG_PROFILE` needed.

**After any code change on your laptop:** rebuild + re-sync both source and `.build/` (steps 1-3 above), then re-run `./deploy.sh` from the workspace shell.

### Post-deploy data grants (one-time)

The app's service principal needs `SELECT` on the underlying data. Bundle `uc_securable` only supports table-level grants, so schema-wide grants live in `setup-grants.sql`:

```bash
# 1. Find the app SP applicationId
databricks service-principals list -o json -p <your-profile> | \
  python3 -c "import sys,json; [print(s['applicationId'], s['displayName']) for s in json.load(sys.stdin) if 'support-agent' in s.get('displayName','')]"

# 2. Edit setup-grants.sql:
#      - replace <APP_SP_APPLICATION_ID> with the UUID from step 1
#      - replace <YOUR_CATALOG>.<YOUR_SCHEMA> with your actual catalog/schema
# 3. Paste setup-grants.sql into the Databricks SQL editor → Run
```

What it grants to the app SP:

- `USE_CATALOG` on your catalog
- `USE_SCHEMA` + `SELECT` on the schema you fill in (covers all tables in that schema, present and future)

## Project layout

```
src/elegant_whale/
├── backend/
│   ├── app.py                     # FastAPI entrypoint
│   ├── chat_router.py             # POST /api/chat → serving endpoint stream
│   ├── core/
│   │   ├── _config.py             # AppConfig (env-driven)
│   │   └── dependencies.py        # Dependencies.Client / .UserClient / .Config
│   └── router.py
└── ui/
    ├── routes/
    │   ├── agent.tsx              # /agent
    │   ├── supervisor.tsx         # /supervisor
    │   └── __root.tsx
    └── components/voltway/
        ├── agent-workspace.tsx    # left rail + center + AI rail
        ├── supervisor-view.tsx    # tabs, grid, performance, AI rail
        ├── data.ts                # mock scenarios + suggestions
        └── icons.tsx              # VWIcon set
```

## Resources attached to the app

Declared in `databricks.yml` under `resources.apps.support-agent-deb-app.resources`:

- `serving-endpoint` — `mas-c15b1e56-endpoint` (CAN_QUERY)
- `sql-warehouse` — `44ee24c6c1a1d03f` (CAN_USE)
- `genie-space` — Support Agent Genie (CAN_RUN)
- `genie-space-returns` — Return Policy Analytics (CAN_RUN)

UC table grants are managed via `setup-grants.sql` (bundle `uc_securable` doesn't support schema scope).
