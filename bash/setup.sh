# Use Homebrew install path first.
export PATH=/usr/local/bin:$PATH

[ -f $(brew --prefix)/etc/bash_completion ] && . $(brew --prefix)/etc/bash_completion

base_config=$HOME/.bashrc