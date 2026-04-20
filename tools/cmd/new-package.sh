#!/usr/bin/env bash
# new_package.sh — scaffold a new TypeScript package from template
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/../pkg-template"

# ── helpers ────────────────────────────────────────────────────────────────────

die()  { echo "error: $*" >&2; exit 1; }
info() { echo "  $*"; }

# ── validation ─────────────────────────────────────────────────────────────────

[ -d "$TEMPLATE_DIR" ] || die "template directory not found: $TEMPLATE_DIR"

# ── main ───────────────────────────────────────────────────────────────────────

cmd_new_package() {
  [ "$#" -ge 1 ] || { echo "usage: pnpm tool new-package <path>" >&2; exit 1; }

  local target="$1"
  local name
  name="$(basename "$target")"

  # Bail early if target already exists
  [ ! -e "$target" ] || die "target already exists: $target"

  # Prompt overrides — do this before touching the filesystem
  if [ -t 0 ]; then
    read -r -p "Package name [$name]: " input_name
    read -r -p "Description: "           input_desc
    name="${input_name:-$name}"
    local desc="${input_desc:-}"
  else
    local desc="A new package in the monorepo."
  fi

  # Validate package name (npm-safe: lowercase, alphanumeric + hyphens)
  [[ "$name" =~ ^[a-z0-9][a-z0-9-]*$ ]] \
    || die "invalid package name '$name' (use lowercase letters, numbers, hyphens)"

  # Create directory structure
  info "creating $target ..."
  mkdir -p "$target"/{src/lib,sketch/playground,sketch/report,test,build}
  
  # Copy template (handles empty dirs and dotfiles)
  cp -r "$TEMPLATE_DIR"/. "$target/"

  # Create initial source file if it doesn't exist
  [ -f "$target/src/main.ts" ] || echo "export const hello = () => 'world';" > "$target/src/main.ts"

  # Substitute placeholders in package.json
  local pkg="$target/package.json"
  if [ -f "$pkg" ]; then
    # Portable sed substitution
    sed -i "s/{pkg-name}/$name/g" "$pkg"
    sed -i "s/{pkg-description}/$desc/g" "$pkg"
  else
    info "warning: package.json not found in template, skipping substitution"
  fi

  echo "✔ package '$name' created at $target"
}

cmd_new_package "$@"
