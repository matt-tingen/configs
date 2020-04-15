export LSCOLORS=GxFxCxDxBxegedabagaced

RPROMPT="%{%F{008}%}%D{%m/%d} %t"

prompt_command_node=$(cd $config_dir && echo $(nodenv which node))

function prompt_command {
  if [ -d "$PWD" ]; then
    # `NODENV_VERSION` cannot be used because of
    # https://github.com/ouchxp/nodenv-nvmrc/issues/5
    export PS1=$(eval $prompt_command_node $config_dir/prompt)
  else
    export PS1="%F{red}ENOENT%f "
  fi
}

precmd_functions=(prompt_command)