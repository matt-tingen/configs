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