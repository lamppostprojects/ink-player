#!/bin/sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

setup() {
    echo "=== Building ink-player... ==="
    (cd "$ROOT_DIR/packages/ink-player" && pnpm build)

    echo ""
    echo "=== Creating test-env... ==="
    rm -rf "$ROOT_DIR/test-env"
    (cd "$ROOT_DIR" && ./packages/create-ink-player/index.js test-env)

    # Replace ink-player with the workspace:* version
    sed -i '' 's/@lamppost\/ink-player": ".*"/@lamppost\/ink-player": "workspace:*"/g' "$ROOT_DIR/test-env/package.json"

    (cd "$ROOT_DIR" && pnpm install)
    echo ""
}

rebuild() {
    echo ""
    echo "=== Rebuilding ink-player... ==="
    (cd "$ROOT_DIR/packages/ink-player" && pnpm build)
    echo "=== Rebuild complete. Starting dev server... ==="
    echo ""
}

start_dev() {
    (cd "$ROOT_DIR/test-env" && exec pnpm dev) &
    DEV_PID=$!
}

stop_dev() {
    if [ -n "$DEV_PID" ]; then
        kill "$DEV_PID" 2>/dev/null
        wait "$DEV_PID" 2>/dev/null
        DEV_PID=""
    fi
}

cleanup() {
    stop_dev
    stty sane 2>/dev/null
    echo ""
    echo "=== Removing test-env... ==="
    rm -rf "$ROOT_DIR/test-env"
    echo "=== Running pnpm install... ==="
    (cd "$ROOT_DIR" && pnpm install)
    exit 0
}

trap cleanup INT TERM

setup
start_dev

# Read single keystrokes
stty -echo -icanon min 1 time 0 2>/dev/null

while true; do
    key=$(dd bs=1 count=1 2>/dev/null)
    case "$key" in
        r|R)
            stop_dev
            rebuild
            start_dev
            ;;
        q|Q)
            cleanup
            ;;
    esac
done
