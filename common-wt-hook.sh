#!/usr/bin/env zsh
# Shared git-wt post-create hooks.
# git-wt runs hooks from inside the newly created worktree.
set -euo pipefail
setopt null_glob glob_dots

# Locate the repo's main checkout
main="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"

# Symlink a path from main into this worktree, if it exists in main.
link() {
  local rel="$1"
  [ -e "$main/$rel" ] || return 0
  # Refuse to clobber a tracked path: replacing a checked-in file with a symlink
  # would dirty the worktree (show up in `git status`). Bail loudly instead.
  if git ls-files --error-unmatch -- "$rel" >/dev/null 2>&1; then
    echo "common-wt-hook: refusing to link '$rel': it is checked in here" >&2
    exit 1
  fi
  mkdir -p "$(dirname "$rel")"
  ln -sfn "$main/$rel" "$rel"
}

# Link the paths configured in the `wt-custom.link` git setting. Like `wt.copy`,
# it is multi-valued and uses .gitignore-style patterns matched against main.
while IFS= read -r pattern; do
  [ -n "$pattern" ] || continue
  # NB: avoid naming this `path` — in zsh `$path` is tied to `$PATH`.
  for match in "$main"/$pattern; do
    link "${match#"$main"/}"
  done
done < <(git config --get-all wt-custom.link)
