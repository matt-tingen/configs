fpath=("$config_dir/.zfunc" $fpath)
autoload -Uz compinit && compinit
autoload -Uz bashcompinit && bashcompinit

if command -v fzf >/dev/null 2>&1; then
    source <(fzf --zsh)
fi

if command -v zoxide >/dev/null 2>&1; then
    eval "$(zoxide init zsh)"
fi

if command -v pandoc >/dev/null 2>&1; then
    eval "$(pandoc --bash-completion)"
fi

# Make fzf's Ctrl+R see commands from every shell, while up-arrow stays local.
# fc -RI reads only entries appended since the last read, so this is cheap.
_shared_fzf_history_widget() {
  fc -RI
  fzf-history-widget
}
if (( $+widgets[fzf-history-widget] )); then
  zle -N _shared_fzf_history_widget
  bindkey '^R' _shared_fzf_history_widget
fi
