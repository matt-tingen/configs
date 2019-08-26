if [ -x "$(command -v brew)" ]; then
    # Use Homebrew install path first.
    export PATH=/usr/local/bin:$PATH

    # Autocomplete
    [ -f $(brew --prefix)/etc/bash_completion ] && . $(brew --prefix)/etc/bash_completion
fi

# Autocomplete git alias
source $config_dir/git-completion.bash
__git_complete g __git_main

# Variables
base_config=$HOME/.bashrc
# http://man7.org/linux/man-pages/man3/strftime.3.html
HISTTIMEFORMAT="%a %F %I:%M:%S %p - " # Thu 2019-05-16 02:44:14 PM

# https://github.com/zloirock/core-js/issues/548#issuecomment-495388335
export ADBLOCK="1"