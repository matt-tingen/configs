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

alias refreshConfig='source $base_config'
alias config='code $config_dir'
alias trim="tr -d '[:space:]'"
alias g="git"

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
	dd if=/dev/random of=$2 bs=1m count=$1
}

# Run Python one-liner expressions
# Useful as a calculator
calc() {
	if [ -z "$1" ]; then
		echo "Usage: calc 2 + 2 - 1" >&2
		return 1
	fi

	# Use python3 because it has float division by default
	# e.g. `1 / 3` is `.333333`.
	python3 -c "print($*)"
}