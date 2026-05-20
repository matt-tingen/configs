#!/bin/zsh
# Apply a patch zip created by export.sh using `git am --3way`.
# Run from inside the configs repo.

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

if (( $# != 1 )); then
    echo "usage: ./import.sh <patches.zip>" >&2
    exit 1
fi

zip_path=$1
if [[ ! -f $zip_path ]]; then
    echo "error: not a file: $zip_path" >&2
    exit 1
fi
if [[ $zip_path != *.zip ]]; then
    echo "error: expected a .zip file: $zip_path" >&2
    exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "error: working tree is dirty; commit or stash first" >&2
    exit 1
fi

tmp=$(mktemp -d)
unzip -q "$zip_path" -d "$tmp"

patches=("$tmp"/*.patch(N))
if (( ${#patches} == 0 )); then
    rm -rf "$tmp"
    echo "error: no .patch files found in zip" >&2
    exit 1
fi

before=$(git rev-parse HEAD)

if git am --3way "${patches[@]}"; then
    rm -rf "$tmp"
    after=$(git rev-parse HEAD)
    echo "applied ${#patches} commit(s); HEAD: ${before:0:7} → ${after:0:7}"
else
    cat >&2 <<EOF

Conflicts detected. Resolve, then run \`git am --continue\`,
or \`git am --abort\` to roll back.
Patches extracted at: $tmp
EOF
    exit 1
fi
