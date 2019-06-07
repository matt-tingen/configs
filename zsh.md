# Migrating from bash to zsh

In June 2019, [Apple announced they would be changing the default shell](https://www.theverge.com/2019/6/4/18651872/apple-macos-catalina-zsh-bash-shell-replacement-features) from `bash` to `zsh` for new profiles. This seemed like a good time for me to try out `zsh`, as well.

To change the default shell:

```sh
chsh -s /bin/zsh
```

## TODO:

- Change the `.bashrc` and `.bash_profile` files in this repo to have more agnostic names
- Update installation instructions
- Get prompt working
- Alias `history` to use `HISTTIMEFORMAT`
