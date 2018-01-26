function prompt() {
	local BLACK="\[\033[0;30m\]"
	local BLACKBOLD="\[\033[1;30m\]"
	local RED="\[\033[0;31m\]"
	local REDBOLD="\[\033[1;31m\]"
	local GREEN="\[\033[0;32m\]"
	local GREENBOLD="\[\033[1;32m\]"
	local YELLOW="\[\033[0;33m\]"
	local YELLOWBOLD="\[\033[1;33m\]"
	local BLUE="\[\033[0;34m\]"
	local BLUEBOLD="\[\033[1;34m\]"
	local PURPLE="\[\033[0;35m\]"
	local PURPLEBOLD="\[\033[1;35m\]"
	local CYAN="\[\033[0;36m\]"
	local CYANBOLD="\[\033[1;36m\]"
	local WHITE="\[\033[0;37m\]"
	local WHITEBOLD="\[\033[1;37m\]"
	local RESETCOLOR="\[\e[00m\]"

	# chamge color if the prompt is root
	function is_root() {
		if [ $(id -u) -eq 0 ]; then
			echo "$RED[ROOT] "
		fi
	}

	function node_version() {
		if [ -e .nvmrc ]; then
			requested=`cat .nvmrc`

			if [ `node -v` == "v${requested}" ]; then
				echo "$GREEN"
			else
				echo "$RED"
			fi

			echo " (${requested})"
		fi
	}

	# get current branch in git repo
	function git_branch() {
		echo `git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`
	}

	function parse_git_branch() {
		BRANCH=`git_branch`
		if [ ! "${BRANCH}" == "" ]; then
			STAT=`parse_git_dirty`
			echo " [${BRANCH}${STAT}]"
		else
			echo ""
		fi
	}

	# get current status of git repo
	function parse_git_dirty {
		status=`git status 2>&1 | tee`
		diverged=`echo -n "${status}" 2> /dev/null | grep " have diverged" &> /dev/null; echo "$?"`
		upstream=`echo -n "${status}" 2> /dev/null | grep "Your branch is " &> /dev/null; echo "$?"`
		dirty=`echo -n "${status}" 2> /dev/null | grep "modified:" &> /dev/null; echo "$?"`
		untracked=`echo -n "${status}" 2> /dev/null | grep "Untracked files" &> /dev/null; echo "$?"`
		ahead=`echo -n "${status}" 2> /dev/null | grep "Your branch is ahead of" &> /dev/null; echo "$?"`
		behind=`echo -n "${status}" 2> /dev/null | grep "Your branch is behind" &> /dev/null; echo "$?"`
		newfile=`echo -n "${status}" 2> /dev/null | grep "new file:" &> /dev/null; echo "$?"`
		renamed=`echo -n "${status}" 2> /dev/null | grep "renamed:" &> /dev/null; echo "$?"`
		deleted=`echo -n "${status}" 2> /dev/null | grep "deleted:" &> /dev/null; echo "$?"`
		statusBits=''
		fileBits=''

		if [ "${diverged}" == "0" ]; then
			statusBits="${statusBits}:"
		elif [ ! "${upstream}" == "0" ]; then
			statusBits="${statusBits}v"
		fi
		if [ "${behind}" == "0" ]; then
			statusBits="${statusBits}<"
		fi
		if [ "${ahead}" == "0" ]; then
			statusBits="${statusBits}>"
		fi

		if [ "${dirty}" == "0" ]; then
			fileBits="${fileBits}M"
		fi
		if [ "${renamed}" == "0" ]; then
			fileBits="${fileBits}R"
		fi
		if [ "${newfile}" == "0" ]; then
			fileBits="${fileBits}A"
		fi
		if [ "${deleted}" == "0" ]; then
			fileBits="${fileBits}D"
		fi
		if [ "${untracked}" == "0" ]; then
			fileBits="${fileBits}?"
		fi

		if [ ! "${fileBits}" == "" ]; then
			echo -n " ${fileBits}"
		fi

		if [ ! "${statusBits}" == "" ]; then
			echo -n " ${statusBits}"
		fi
	}

	export PS1="`is_root`$CYAN\w$BLUE\`parse_git_branch\`$RESETCOLOR "
}

prompt
