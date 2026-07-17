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

# Find a random unused TCP port in [min, max).
random-open-port() {
	if [ -z "$2" ]; then
		echo "Usage: random-open-port <min> <max>" >&2
		return 1
	fi

	python3 "$config_dir/util/random_open_port.py" "$1" "$2"
}

# Semantic diff via `sem`, excluding files matched by .semignore (which
# `sem diff` itself ignores). Reads the repo's .semignore patterns and converts
# them to git `:(exclude)` pathspecs so git filters before `sem diff --patch`
# renders. With no args, diffs against the common ancestor with the base branch
# (same scope as `git l` / `git rb`); otherwise the args pass through.
semdiff() {
	local -a range exclude
	local root line pat
	if [ $# -eq 0 ]; then
		range=("$(git basebranch)...HEAD")
	else
		range=("$@")
	fi
	root="$(git rev-parse --show-toplevel)" || return
	if [ -f "$root/.semignore" ]; then
		while IFS= read -r line || [ -n "$line" ]; do
			pat="${line%%#*}"                    # strip comments
			pat="${pat#"${pat%%[![:space:]]*}"}" # ltrim
			pat="${pat%"${pat##*[![:space:]]}"}" # rtrim
			[ -z "$pat" ] && continue
			case "$pat" in
			*/) exclude+=(":(exclude)${pat}**") ;; # dir -> its contents
			*) exclude+=(":(exclude)${pat}") ;;
			esac
		done < "$root/.semignore"
	fi
	git diff "${range[@]}" -- . "${exclude[@]}" | sem diff --patch
}

function wt() {
	[[ $(git rev-parse --is-inside-git-dir 2>/dev/null) == "true" ]] && { echo "Can't run inside \".git\" dir" >&2; return 128; }
	[[ $(git rev-parse --is-inside-work-tree 2>/dev/null) != "true" ]] && { echo "Not a Git repo" >&2; return 128; }

	local __git_prefix="/$(git rev-parse --show-prefix 2>/dev/null)"
	local -a __fzf_args=()
	# With an arg: pre-fill the filter and auto-select if only one fuzzy match.
	[[ -n $1 ]] && __fzf_args=(--query="$1" --select-1)
	local __wtcdpath=$(
		git wt --json | \
		jq -r '.[] | "\(.path)\t\(if .current then "*" else " " end) \(.branch)\t\(.head)"' | \
		fzf \
			"${__fzf_args[@]}" \
			--cycle \
			--wrap \
			--layout=reverse \
			--ghost=search \
			--height=80% \
			--delimiter=$'\t' \
			--with-nth=2,3 \
			--nth=1 \
			--preview 'echo {} | cut -f1' \
			--preview-label="[PATH | PWD: $__git_prefix]" \
			--preview-label-pos=3 \
			--preview-window='down,1,wrap,noinfo' \
			--color 'preview-border:#99ffff,preview-label:#99ccff,preview-fg:#99cc99' \
		| cut -f1
	)
	[[ $__wtcdpath && -d $__wtcdpath$__git_prefix ]] && __wtcdpath="$__wtcdpath$__git_prefix"
	[[ $__wtcdpath && $__wtcdpath != $PWD ]] && cd -- "$__wtcdpath"
}

check-wt() {
	local d root abs
	d=$(git config --default .wt wt.basedir)
	root=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)") || return
	abs=$(realpath "$root/$d" 2>/dev/null)

	if [ -f "$abs/.gitignore" ]; then
		echo "$abs"
	else
		echo "no .gitignore in worktree basedir: $root/$d" >&2
		return 1
	fi
}