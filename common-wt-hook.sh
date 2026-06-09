#!/usr/bin/env bash
# Shared git-wt post-create hooks for bare-repo worktree layouts.
# git-wt runs hooks from inside the newly created worktree.
set -euo pipefail

# Locate the repo's main worktree: sibling of .bare named "main".
main="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")/main"

# Symlink a path from main into this worktree, if it exists in main.
link() {
  local rel="$1"
  [ -e "$main/$rel" ] || return 0
  mkdir -p "$(dirname "$rel")"
  ln -sfn "$main/$rel" "$rel"
}

link .claude/settings.local.json
link .semignore
link .ignore
link .vscode/settings.json
