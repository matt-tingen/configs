autoload -Uz compinit && compinit

[ -f /usr/local/etc/profile.d/autojump.sh ] && . /usr/local/etc/profile.d/autojump.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

if [ -x "$(command -v brew)" ]; then
    # Use Homebrew install path first.
    export PATH=/usr/local/bin:$PATH
fi

# Variables
base_config=$HOME/.zshrc

# http://man7.org/linux/man-pages/man3/strftime.3.html
HISTTIMEFORMAT="%a %F %I:%M:%S %p - " # Thu 2019-05-16 02:44:14 PM

# https://github.com/zloirock/core-js/issues/548#issuecomment-495388335
export ADBLOCK="1"

# https://docs.brew.sh/Analytics#opting-out
export HOMEBREW_NO_ANALYTICS=1