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
