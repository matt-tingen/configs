# Route `mise use -g …` writes into the symlinked repo file so they're tracked.
export MISE_GLOBAL_CONFIG_FILE="$HOME/.config/mise/conf.d/personal.toml"

# On macOS, use `Escape+C` to invoke this
export FZF_ALT_C_COMMAND="fd --type directory"
export FZF_ALT_C_OPTS="--preview 'tree -C {}'"

export STORYBOOK_DISABLE_TELEMETRY="1"
export TURBO_TELEMETRY_DISABLED=1
export GH_TELEMETRY=false
export DO_NOT_TRACK=true
export CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1