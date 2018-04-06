export LSCOLORS=GxFxCxDxBxegedabagaced

function prompt_command {
	# Using nvm exec outputs a message from nvm before running node.
  export PS1=$(eval $config_node_cmd $config_dir/prompt)
}
config_node_cmd=$(nvm which $(cat $config_dir/.nvmrc))
export PROMPT_COMMAND=prompt_command


# Use Homebrew install path first.
export PATH=/usr/local/bin:$PATH

[ -f $(brew --prefix)/etc/bash_completion ] && . $(brew --prefix)/etc/bash_completion

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
alias trim="tr -d '[:space:]'"
alias g="git"
alias c="calc"

alias cra="create-react-app --scripts-version @matt-tingen/react-scripts"

killPort() {
	if [ -z "$1" ]; then
		echo "Usage: killPort [port]" >&2
		return 1
	fi
	lsof -i TCP:$1 | grep LISTEN | awk '{print $2}' | xargs kill -9
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

# Convert a unix timestamp to a human readable date.
timestamp() {
	if [ -z "$1" ]; then
		echo "Usage: timestamp [seconds|milliseconds]" >&2
		return 1
	fi

	date -r $(echo $1| cut -c 1-10)
}
