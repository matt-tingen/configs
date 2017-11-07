export LSCOLORS=GxFxCxDxBxegedabagaced

source "$config_dir/prompt.bash"

[ -f $(brew --prefix)/etc/bash_completion ] && . $(brew --prefix)/etc/bash_completion

alias ls='ls -GFh'
alias ll='ls -l'

alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ......="cd ../../../../.."
alias .......="cd ../../../../../.."

alias config='code $config_dir'

alias trim="tr -d '[:space:]'"

killPort() {
	if [ -z "$1" ]; then
    echo "Usage: killPort [port]" >&2
    return 1
	fi
	lsof -i TCP:$1 | grep LISTEN | awk '{print $2}' | xargs kill -9
	echo "Process using port" $1 "killed."
}

pw() {
	python ~/Development/pw/pw.py "$@" | tr -d '\n' | pbcopy
}

genFile() {
	if [ -z "$1" ]; then
    echo "Usage: genFile [# MB] [name]" >&2
    return 1
	fi
	dd if=/dev/zero of=$2 bs=1m count=$1
}
