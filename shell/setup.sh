fpath=("$config_dir/.zfunc" $fpath)
autoload -Uz compinit && compinit
autoload -Uz bashcompinit && bashcompinit

source <(fzf --zsh)
eval "$(zoxide init zsh)"
eval "$(pandoc --bash-completion)"
eval "$(git wt --init zsh)"

if [ -d "$PWD" ]; then
    [ -f /usr/local/etc/profile.d/autojump.sh ] && . /usr/local/etc/profile.d/autojump.sh
fi

# Including this in the path allows git to effectively create automatic aliases
# for `git-X` executables so they can be run with `git-X`.
export PATH=$HOME/.local/bin:$config_dir/git-commands:$PATH

if command -v mise >/dev/null 2>&1; then
    eval "$(mise activate zsh)"
fi

# Variables
base_config=$HOME/.zshrc

# https://github.com/zloirock/core-js/issues/548#issuecomment-495388335
export ADBLOCK="1"

# https://docs.brew.sh/Analytics#opting-out
export HOMEBREW_NO_ANALYTICS=1
export DO_NOT_TRACK=1

# History
# https://scriptingosx.com/2019/06/moving-to-zsh-part-3-shell-options/
setopt EXTENDED_HISTORY
setopt APPEND_HISTORY
setopt INC_APPEND_HISTORY   # write each command to $HISTFILE immediately
unsetopt SHARE_HISTORY      # ...but don't auto-import others' commands (keeps up-arrow per-shell)
setopt HIST_REDUCE_BLANKS
# http://man7.org/linux/man-pages/man3/strftime.3.html
HISTTIMEFORMAT="%a %F %I:%M:%S %p - " # Thu 2019-05-16 02:44:14 PM
HISTFILE=$HOME/.zsh_history
HISTSIZE=100000
SAVEHIST=100000

# Correct commands
setopt CORRECT

# Key-bindings
bindkey "^[[H" beginning-of-line
bindkey "^[[F" end-of-line
bindkey "^[[3~" delete-char
