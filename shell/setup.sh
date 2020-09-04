autoload -Uz compinit && compinit

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

if [ -d "$PWD" ]; then
    [ -f /usr/local/etc/profile.d/autojump.sh ] && . /usr/local/etc/profile.d/autojump.sh
    eval "$(nodenv init -)"
fi

if [ -x "$(command -v brew)" ]; then
    export PATH=/usr/local/bin:$PATH
fi

# Including this in the path allows git to effectively create automatic aliases
# for `git-X` executables so they can be run with `git-X`.
export PATH=$config_dir/git-commands:$PATH

# Variables
base_config=$HOME/.zshrc
export PROMPT_CWD_ALT_ROOT=$HOME/Development

# https://github.com/zloirock/core-js/issues/548#issuecomment-495388335
export ADBLOCK="1"

# https://docs.brew.sh/Analytics#opting-out
export HOMEBREW_NO_ANALYTICS=1

# History
# https://scriptingosx.com/2019/06/moving-to-zsh-part-3-shell-options/
setopt EXTENDED_HISTORY
setopt APPEND_HISTORY
setopt HIST_REDUCE_BLANKS
# http://man7.org/linux/man-pages/man3/strftime.3.html
HISTTIMEFORMAT="%a %F %I:%M:%S %p - " # Thu 2019-05-16 02:44:14 PM
HISTFILE=$HOME/.zsh_history
SAVEHIST=5000
HISTSIZE=2000

# Correct commands
setopt CORRECT

# Key-bindings
bindkey "^[[H" beginning-of-line
bindkey "^[[F" end-of-line
bindkey "^[[3~" delete-char