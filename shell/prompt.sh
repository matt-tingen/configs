export LSCOLORS=GxFxCxDxBxegedabagaced

RPROMPT="%{%F{008}%}%D{%m/%d} %t"

() {
  local cache=$HOME/.cache/prompt-command-node
  local pin=$config_dir/mise.toml
  if [[ -f $cache && $cache -nt $pin ]]; then
    prompt_command_node=$(<$cache)
  else
    mkdir -p ${cache:h}
    prompt_command_node=$(cd $config_dir && whence -p node)
    print -r -- "$prompt_command_node" > $cache
  fi
}

alias deactivatePrompt="export PROMPT_TYPE=bare"

# Monotonic generation; bumped each precmd. Stale background results check
# this against the gen captured at their spawn time and bail if newer.
typeset -gi _PROMPT_GEN=0
typeset -g  _PROMPT_INFLIGHT_PID=""
typeset -g  _PROMPT_INFLIGHT_FD=""
# zle -F doesn't accept extra args to forward to the handler, so we thread
# per-spawn (gen, pwd) through a map keyed by fd.
typeset -gA _PROMPT_FD_GEN
typeset -gA _PROMPT_FD_PWD

# Fires when the background node child closes its stdout (i.e. exits).
# zle -F passes only the fd; per-spawn gen/pwd come from the FD-keyed maps.
function _prompt_async_handler {
  emulate -L zsh
  local fd=$1
  local gen=${_PROMPT_FD_GEN[$fd]}
  local pwd_at_spawn=${_PROMPT_FD_PWD[$fd]}
  local new_ps1 line

  IFS= read -r -u $fd new_ps1
  while IFS= read -r -u $fd line; do new_ps1+=$'\n'$line; done

  zle -F $fd
  exec {fd}<&-
  unset "_PROMPT_FD_GEN[$fd]"
  unset "_PROMPT_FD_PWD[$fd]"
  _PROMPT_INFLIGHT_FD=""
  _PROMPT_INFLIGHT_PID=""

  # Drop stale results: a newer precmd has run, or the user cd'd away.
  (( gen < _PROMPT_GEN )) && return
  [[ $pwd_at_spawn != $PWD ]] && return
  [[ -z $new_ps1 ]] && return

  PS1=$new_ps1
  zle && zle reset-prompt
}

# Background rebuild trigger. Atomic `mkdir` serves as the lock: only one
# build runs at a time across all shells. Stale locks (crashed builds) are
# cleared after a TTL. The rebuild itself is fully detached (`&!`) so it
# survives shell exit and doesn't appear in the jobs table.
zmodload zsh/datetime 2>/dev/null
zmodload -F zsh/stat b:zstat 2>/dev/null
function _prompt_trigger_rebuild {
  local lock=$HOME/.cache/prompt-build.lock
  local ttl=60

  [[ -d ${lock:h} ]] || mkdir -p ${lock:h}

  if [[ -d $lock ]]; then
    local -a st
    zstat -A st +mtime $lock 2>/dev/null
    (( ${#st} && EPOCHSECONDS - st[1] > ttl )) && rmdir $lock 2>/dev/null
  fi

  mkdir $lock 2>/dev/null || return

  ( cd $config_dir && pnpm build:prompt >/dev/null 2>&1; rmdir $lock 2>/dev/null ) &!
}

function _prompt_spawn_async {
  emulate -L zsh
  setopt extended_glob
  local pwd_at_spawn=$PWD
  (( _PROMPT_GEN++ ))
  local gen=$_PROMPT_GEN

  if [[ -n $_PROMPT_INFLIGHT_PID ]] && kill -0 $_PROMPT_INFLIGHT_PID 2>/dev/null; then
    kill $_PROMPT_INFLIGHT_PID 2>/dev/null
  fi
  if [[ -n $_PROMPT_INFLIGHT_FD ]]; then
    zle -F $_PROMPT_INFLIGHT_FD 2>/dev/null
    # NOTE: no `2>/dev/null` here. `exec` with no command applies trailing
    # redirections to the shell itself, permanently — that would silence
    # all command stderr in this session. The close shouldn't fail anyway.
    exec {_PROMPT_INFLIGHT_FD}<&-
    unset "_PROMPT_FD_GEN[$_PROMPT_INFLIGHT_FD]"
    unset "_PROMPT_FD_PWD[$_PROMPT_INFLIGHT_FD]"
  fi

  # Prefer pre-built JS when fresh; fall back to TS (Node strip-types) when
  # any input to the build is newer than the build output. Each glob uses
  # `om[1]` to pick its newest member by mtime; dist must beat both. Inputs
  # are prompt sources/tsconfig plus the root package.json/pnpm-lock (dep
  # changes can affect emit semantics).
  local entry=$config_dir/prompt/index.ts
  local dist=$config_dir/prompt/dist/index.js
  local newest_src=( $config_dir/prompt/(*.ts|tsconfig*.json)(om[1]) )
  local newest_root=( $config_dir/(package.json|pnpm-lock.yaml)(om[1]) )
  if [[ -f $dist && $dist -nt $newest_src[1] && $dist -nt $newest_root[1] ]]; then
    entry=$dist
  else
    _prompt_trigger_rebuild
  fi

  local fd
  exec {fd}< <( "$prompt_command_node" "$entry" 2>/dev/null )
  _PROMPT_INFLIGHT_FD=$fd
  _PROMPT_INFLIGHT_PID=$!
  _PROMPT_FD_GEN[$fd]=$gen
  _PROMPT_FD_PWD[$fd]=$pwd_at_spawn

  zle -F $fd _prompt_async_handler
}

function prompt_command {
  if [[ $PROMPT_TYPE != bare && $PROMPT_TYPE != node ]]; then
    return
  fi

  if [[ ! -d $PWD ]]; then
    PS1="%F{red}ENOENT%f "
    return
  fi

  PS1="%F{cyan}%~%f "

  if [[ $PROMPT_TYPE == node ]]; then
    emulate -L zsh
    _prompt_spawn_async
  fi
}

precmd_functions+=(prompt_command)
