#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if [ "$#" -lt 1 ]; then
    echo "usage: $0 <command> [args...]"
    exit 1
fi

cmd="$1"
shift

cmd_path="$SCRIPT_DIR/$cmd.sh"

if [ ! -f "$cmd_path" ]; then
    echo "Unknown command: $cmd"
    echo "Available commands:"
    ls "$SCRIPT_DIR"/*.sh | xargs -n1 basename | sed 's/\.sh$//'
    exit 1
fi

exec bash "$cmd_path" "$@"
