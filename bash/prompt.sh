export LSCOLORS=GxFxCxDxBxegedabagaced

function prompt_command {
	# Using nvm exec outputs a message from nvm before running node.
  export PS1=$(eval $config_node_path $config_dir/prompt)
}

if [ -z "$config_node_path" ]; then
  config_node_path=$(nvm which $(cat $config_dir/.nvmrc))
fi

export PROMPT_COMMAND=prompt_command
