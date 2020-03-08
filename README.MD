# Shell

## Setup

```sh
cd configs
nvm install
npm run build
echo 'npm run build' > .git/hooks/post-merge && chmod +x .git/hooks/post-merge
```

See [Windows setup guide](./WINDOWS.md) for adjustments needed on Windows.

## `.zshenv`

```sh
export config_dir=$HOME/Development/configs
```

## `.zshrc`

```sh
source "$config_dir/.zshrc"
```

# Git

## `.git_config`

```ini
[include]
    path = /path/to/.gitconfig
[core]
    excludesfile = /path/to/.gitignore_global
```

## Hooks

Hooks are installed per-repo. To install:

1. Confirm there are no existing hook files or Husky scripts which would be overwritten
1. Copy the files from `git-hooks` to `.git/hooks` in the target repo
1. Rename each moved file to remove `.sh`
1. `chmod +x` each of the files

# Configs

Config files can be linked to their corresponding directory:

```sh
ln -si $config_dir/.prettierrc ~/.prettierrc
ln -si $config_dir/karabiner ~/.config
mkdir -p ~/Library/KeyBindings
ln -si $config_dir/DefaultKeyBinding.dict ~/Library/KeyBindings/DefaultKeyBinding.dict
```

# Tools

nvm:

```sh
# https://github.com/nvm-sh/nvm/blob/master/README.md#manual-install
export NVM_DIR="$HOME/.nvm" && (
  git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR"
  cd "$NVM_DIR"
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
) && \. "$NVM_DIR/nvm.sh"
```

Homebrew:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

brew install \
autojump \
ripgrep \
jq \
shellcheck \
fzf

/usr/local/opt/fzf/install --key-bindings --completion --no-update-rc
```
