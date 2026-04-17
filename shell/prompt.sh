export LSCOLORS=GxFxCxDxBxegedabagaced

RPROMPT="%{%F{008}%}%D{%m/%d} %t"

prompt_command_node=$(cd $config_dir && echo $(which node))

alias deactivatePrompt="export CUSTOM_PROMPT=0"

function prompt_command {
  if [ "$CUSTOM_PROMPT" = "0" ]; then
    export PS1="$PWD "
  elif [ -d "$PWD" ]; then
    export PS1=$(eval $prompt_command_node $config_dir/prompt)
  else
    export PS1="%F{red}ENOENT%f "
  fi
}

precmd_functions+=(prompt_command)