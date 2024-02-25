killPort() {
	if [ -z "$1" ]; then
		echo "Usage: killPort [port]" >&2
		return 1
	fi
	lsof -i TCP:$1 | grep LISTEN | awk '{print $2}' | xargs kill -9
}

pw() {
	python $config_dir/pw/pw.py "$@" | tr -d '\n' | pbcopy
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
		echo "Usage: calc \"2 + 2 - 1\"" >&2
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

# Wrap git. On errors, print an additional line in red.
# Based on https://stackoverflow.com/a/35904417.
git(){
	command git "$@"
	local exitCode=$?
	# Ignores most error codes because they can correspond to things like
	# quitting `more` or cancelling `git cor`.
	if [ $exitCode -eq 1 ]; then
		printf "\033[0;31mERROR: git exited with code $exitCode\033[0m\n"
		return $exitCode
	fi
}

e(){
	if [ -z "$1" ]; then
		code .
	else
		command code "$@"
	fi
}

cdr(){
	cd $(git root)
}

# Open the package.json for the specified package
browsepackage() {
	if [ -z "$1" ]; then
		echo "Usage: browsepackage [package_name]" >&2
		return 1
	fi

	local file="$(git root)/node_modules/$1/package.json"

	if [ -f "$file" ]; then
		e "$file"
	else
		echo "$1 is not installed in this repo."
	fi
}