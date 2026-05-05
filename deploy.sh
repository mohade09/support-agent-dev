#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

TARGET="${TARGET:-dev}"
APP_KEY="support-agent-ui-app"

# BUILD: should this run `apx build` to produce .build/?
#   "auto" (default) — true on laptop, false in a Databricks workspace shell
#                      (workspace shells don't ship apx/uv/bun, and the
#                      caller is expected to have synced .build/ already)
#   "true"           — always run apx build
#   "false"          — never run apx build; .build/ must already exist
BUILD="${BUILD:-auto}"
if [[ "$BUILD" == "auto" ]]; then
  if [[ -n "${DATABRICKS_RUNTIME_VERSION:-}" ]]; then
    BUILD="false"
  else
    BUILD="true"
  fi
fi

ensure_path() {
  case ":$PATH:" in
    *":$1:"*) ;;
    *) export PATH="$1:$PATH" ;;
  esac
}
ensure_path "$HOME/.local/bin"
ensure_path "$HOME/.bun/bin"
ensure_path "$HOME/.cargo/bin"

ensure_tool() {
  local tool="$1"
  local install_cmd="$2"
  if command -v "$tool" >/dev/null 2>&1; then
    return 0
  fi
  echo "==> Installing missing tool: $tool"
  bash -c "$install_cmd"
  ensure_path "$HOME/.local/bin"
  ensure_path "$HOME/.bun/bin"
  ensure_path "$HOME/.cargo/bin"
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "ERROR: '$tool' install ran but it's still not on PATH." >&2
    exit 1
  fi
}

echo "==> Checking prerequisites (BUILD=$BUILD)"
ensure_tool databricks "curl -fsSL https://raw.githubusercontent.com/databricks/setup-cli/main/install.sh | sh"
if [[ "$BUILD" == "true" ]]; then
  ensure_tool uv         "curl -LsSf https://astral.sh/uv/install.sh | sh"
  ensure_tool apx        "curl -fsSL https://databricks-solutions.github.io/apx/install.sh | sh"
  ensure_tool bun        "curl -fsSL https://bun.sh/install | bash"
fi

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

PROFILE="${DATABRICKS_CONFIG_PROFILE:-}"
PROFILE_ARGS=()
if [[ -n "$PROFILE" ]]; then
  PROFILE_ARGS=(-p "$PROFILE")
  echo "==> Using profile: $PROFILE | target: $TARGET"
elif [[ -n "${DATABRICKS_HOST:-}" || -n "${DATABRICKS_RUNTIME_VERSION:-}" ]]; then
  echo "==> Using ambient databricks auth (workspace runtime / env vars) | target: $TARGET"
else
  echo "ERROR: no databricks auth configured. Set DATABRICKS_CONFIG_PROFILE in .env" >&2
  echo "       (laptop) or run inside a Databricks workspace where DATABRICKS_HOST" >&2
  echo "       is auto-injected." >&2
  exit 1
fi

echo "==> Checking auth"
databricks auth describe "${PROFILE_ARGS[@]}" >/dev/null

if [[ "$BUILD" == "true" ]]; then
  echo "==> Building frontend (apx build)"
  apx build
else
  echo "==> Skipping build (BUILD=false). Expecting .build/ already present."
  if [[ ! -d .build ]]; then
    echo "ERROR: BUILD=false but .build/ does not exist." >&2
    echo "       Build on your laptop with 'apx build' (or run with BUILD=true)" >&2
    echo "       and re-sync .build/ to this location before retrying." >&2
    exit 1
  fi
fi

echo "==> Validating bundle"
databricks bundle validate -t "$TARGET" "${PROFILE_ARGS[@]}"

echo "==> Deploying bundle"
databricks bundle deploy "${PROFILE_ARGS[@]}" -t "$TARGET"

echo "==> Starting app"
databricks bundle run "$APP_KEY" -t "$TARGET" "${PROFILE_ARGS[@]}"

echo "==> Done. Tail logs with:"
if [[ -n "$PROFILE" ]]; then
  echo "    databricks apps logs support-agent-ui -p $PROFILE"
else
  echo "    databricks apps logs support-agent-ui"
fi
