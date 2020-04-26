export LSCOLORS=GxFxCxDxBxegedabagaced

RPROMPT="%{%F{008}%}%D{%m/%d}%t"

function prompt_command {
  if [ -d "$PWD" ]; then
    export PS1=$(eval node $config_dir/prompt)
  else
    export PS1="\w [\[\e[31m\]ENOENT\[\e[m\]] "
  fi
}

precmd_functions=(prompt_command)