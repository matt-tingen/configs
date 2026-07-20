# PROMPT_TYPE: p10k | node | starship | bare (empty/invalid leaves the prompt at zsh default)
PROMPT_TYPE=${PROMPT_TYPE:-starship}

if [[ "$PROMPT_TYPE" == "p10k" ]]; then
  source ~/Development/external/powerlevel10k/powerlevel10k.zsh-theme

  # Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
  # Initialization code that may require console input (password prompts, [y/n]
  # confirmations, etc.) must go above this block; everything else may go below.
  if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
    source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
  fi
fi

source "$config_dir/shell/setup.sh"
source "$config_dir/shell/completions.sh"
source "$config_dir/shell/aliases.sh"
source "$config_dir/shell/functions.sh"

case "$PROMPT_TYPE" in
  p10k)
    # To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
    [[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
    ;;
  node|bare)
    source "$config_dir/shell/prompt.sh"
    ;;
  starship)
    export STARSHIP_CONFIG="$config_dir/starship.toml"
    eval "$(starship init zsh)"
    ;;
esac
