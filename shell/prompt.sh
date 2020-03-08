export LSCOLORS=GxFxCxDxBxegedabagaced

RPROMPT="%{%F{008}%}%D{%m/%d}%t"

function prompt_command {
  if [ -d "$PWD" ]; then
    # Using nvm exec outputs a message from nvm before running node.
    export PS1=$(eval $config_node_path $config_dir/prompt)
  else
    export PS1="\w [\[\e[31m\]ENOENT\[\e[m\]] "
  fi
}

if [ -z "$config_node_path" ]; then
  config_node_path=$(nvm which $(cat $config_dir/.nvmrc))
fi

precmd_functions=(prompt_command)