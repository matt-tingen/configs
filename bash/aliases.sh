alias ls='ls -GFh'
alias ll='ls -l'

alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ......="cd ../../../../.."
alias .......="cd ../../../../../.."

alias localip="ipconfig getifaddr en0"
alias ip="curl -s http://checkip.dyndns.org/ | sed 's/[a-zA-Z<>/ :]//g'"
alias refreshConfig='source $base_config'
alias config='code $config_dir'
alias trim="awk '{\$1=\$1};1'"
alias g="git"
alias c="calc"
