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
alias refreshConfig='source $base_config'
alias config='e $config_dir'
alias trim="awk '{\$1=\$1};1'"
# Remove trailing new line
alias strip="awk '{printf $1}'"
alias g="git"
alias c="calc"
