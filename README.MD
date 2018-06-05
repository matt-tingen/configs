`.bash_profile` can be included with

```sh
base_config=~/.bash_profile
config_dir=~/Development/configs
source "$config_dir/.bash_profile"
```

Git files can be included with

```ini
[include]
    path = /path/to/.gitconfig
[core]
	excludesfile = /path/to/.gitignore_global
```

Hooks are installed per-repo. To install:

1. Confirm there are no existing hook files or Husky scripts which would be overwritten
1. Copy the files from `git-hooks` to `.git/hooks` in the target repo
1. Rename each moved file to remove `.sh`
1. `chmod +x` each of the files
