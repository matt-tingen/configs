export LSCOLORS=GxFxCxDxBxegedabagaced

function prompt_command {
	# Using nvm exec outputs a message from nvm before running node.
  export PS1=$(eval $config_node_cmd $config_dir/prompt)
}
config_node_cmd=$(nvm which $(cat $config_dir/.nvmrc))
export PROMPT_COMMAND=prompt_command
