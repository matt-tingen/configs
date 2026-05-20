#!/bin/zsh
# Package commits ahead of @{upstream} on the current branch as a zip of
# patches, written to ./exports/. Run from inside the configs repo.
#
# Does NOT fetch first; staleness of @{upstream} is up to the caller.

set -euo pipefail

script_dir=${0:A:h}
repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || {
    echo "error: not inside a git repo" >&2
    exit 1
}
if [[ $repo_root != $script_dir ]]; then
    echo "error: run from inside the configs repo ($script_dir)" >&2
    exit 1
fi

confirm() {
    local ans
    read "ans?$1 [y/N] "
    [[ $ans == [yY] ]] || { echo "aborted." >&2; exit 1; }
}

branch=$(git branch --show-current)
if [[ -z $branch ]]; then
    echo "error: detached HEAD" >&2
    exit 1
fi
if [[ $branch != main ]]; then
    echo "warning: current branch is '$branch', not main" >&2
    confirm "continue anyway?"
fi

upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null) || {
    echo "error: no upstream configured for '$branch'" >&2
    exit 1
}

counts=$(git rev-list --left-right --count "@{upstream}...HEAD")
behind=${counts%%$'\t'*}
ahead=${counts##*$'\t'}

if (( behind > 0 )); then
    echo "warning: $branch is $behind commit(s) behind $upstream" >&2
    confirm "continue anyway?"
fi

if (( ahead == 0 )); then
    echo "nothing to export ($branch is up to date with $upstream)"
    exit 0
fi

mkdir -p exports
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

git format-patch "@{upstream}..HEAD" -o "$tmp" >/dev/null

ts=$(date -u +%Y%m%dT%H%M%SZ)
zip_path=$repo_root/exports/configs-patches-$ts.zip
(cd "$tmp" && zip -q "$zip_path" *.patch)

echo "exported $ahead commit(s) → $zip_path"
