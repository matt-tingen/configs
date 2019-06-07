if [ -x "$(command -v brew)" ]; then
    # Use Homebrew install path first.
    export PATH=/usr/local/bin:$PATH

    # Autocomplete
    [ ${BASH_VERSION} ] && [ -f $(brew --prefix)/etc/bash_completion ] && . $(brew --prefix)/etc/bash_completion
fi

if [ ${BASH_VERSION} ]; then
    # Autocomplete git alias
    source $config_dir/git-completion.bash
    __git_complete g __git_main
fi

# Variables
base_config=$HOME/.bashrc
# http://man7.org/linux/man-pages/man3/strftime.3.html
export HISTTIMEFORMAT="%a %F %I:%M:%S %p - " # Thu 2019-05-16 02:44:14 PM