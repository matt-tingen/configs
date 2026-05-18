export LSCOLORS=GxFxCxDxBxegedabagaced

RPROMPT="%{%F{008}%}%D{%m/%d} %t"

prompt_command_node=$(cd $config_dir && echo $(which node))

alias deactivatePrompt="export PROMPT_TYPE=bare"

function prompt_command {
  case "$PROMPT_TYPE" in
    node)
      if [ -d "$PWD" ]; then
        export PS1=$(eval $prompt_command_node $config_dir/prompt)
      else
        export PS1="%F{red}ENOENT%f "
      fi
      ;;
    bare)
      export PS1="$PWD "
      ;;
  esac
}

precmd_functions+=(prompt_command)
