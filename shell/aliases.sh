alias ls='ls -GFh'
alias ll='ls -la'

alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ......="cd ../../../../.."
alias .......="cd ../../../../../.."

alias localip="ipconfig getifaddr en0"
alias ip="curl -s http://checkip.dyndns.org/ | sed 's/[a-zA-Z<>/ :]//g'"
alias refreshConfig='exec zsh -l'
alias config='e $config_dir'
alias trim="awk '{\$1=\$1};1'"
# Remove trailing new line
alias strip="awk '{printf $1}'"
alias joinspace="paste -sd \" \" -"
alias g="git"
alias p="pnpm"
alias pi="pnpm install"
alias c="calc"
alias history='history -t $HISTTIMEFORMAT'
alias rgf='rg --files | rg'
alias cphash='git hash | pbcopy'
