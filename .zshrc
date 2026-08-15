# PROMPT_TYPE: node | starship | bare (empty/invalid leaves the prompt at zsh default)
PROMPT_TYPE=${PROMPT_TYPE:-starship}

source "$config_dir/shell/setup.sh"
source "$config_dir/shell/completions.sh"
source "$config_dir/shell/aliases.sh"
source "$config_dir/shell/functions.sh"

case "$PROMPT_TYPE" in
  node|bare)
    source "$config_dir/shell/prompt.sh"
    ;;
  starship)
    export STARSHIP_CONFIG="$config_dir/starship.toml"
    [[ $TERM != dumb ]] && eval "$(starship init zsh)"
    ;;
esac
