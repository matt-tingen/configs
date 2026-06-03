# Setup

For a new machine:

```sh
./init.sh
```

This installs mise, bootstraps `~/.zshenv` / `~/.zshrc`, and creates symlinks for various configs. It is idempotent — safe to re-run.

# Git

## Hooks

Hooks are installed per-repo. To install:

1. Confirm there are no existing hook files or Husky scripts which would be overwritten
1. Copy the files from `git-hooks` to `.git/hooks` in the target repo
1. Rename each moved file to remove `.sh`
1. `chmod +x` each of the files
