# Bash

## `.bash_profile`

```sh
config_dir=$HOME/Development/configs
source "$config_dir/.bash_profile"
```

## `.bashrc`

```sh
source "$config_dir/.bashrc"
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

Config files can be linked to the home directory:

```sh
ln -s $config_dir/.prettierrc ~/.prettierrc
```
