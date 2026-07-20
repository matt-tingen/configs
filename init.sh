#!/usr/bin/env bash
set -euo pipefail

config_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

sentinel='>>> configs setup.sh >>>'

log() { printf '\n=== %s ===\n' "$*"; }

# 0. dirs needed during bootstrap
log "Creating target directories"
mkdir -p "$HOME/Library/Application Support/Code/User"
mkdir -p "$HOME/Library/KeyBindings"
mkdir -p "$HOME/.config/mise/conf.d"
mkdir -p "$HOME/.config"
mkdir -p "$HOME/.config/ghostty"

# 1. mise
mise_bin="$HOME/.local/bin/mise"
if [ ! -x "$mise_bin" ] && command -v mise >/dev/null 2>&1; then
  mise_bin="$(command -v mise)"
fi
if [ ! -x "$mise_bin" ]; then
  log "Installing mise"
  curl https://mise.run | sh
fi
if [ ! -x "$mise_bin" ]; then
  printf 'error: mise installer did not create an executable at %s\n' "$mise_bin" >&2
  exit 1
fi
export PATH="$HOME/.local/bin:$PATH"
export MISE_GLOBAL_CONFIG_FILE="$HOME/.config/mise/conf.d/personal.toml"

log "Linking mise config"
ln -sfn "$config_dir/global_mise.toml" "$MISE_GLOBAL_CONFIG_FILE"
eval "$("$mise_bin" activate bash)"

# 2. mise install + npm build
log "Running mise install"
(cd "$config_dir" && "$mise_bin" install)

log "Running npm run build"
(cd "$config_dir" && "$mise_bin" x -- npm run build)

log "Making git-commands executable"
(cd "$config_dir" && "$mise_bin" x -- npm run chmod)

# 3. gitconfig
log "Configuring ~/.gitconfig"
git config --global --replace-all include.path "$config_dir/.gitconfig"
git config --global core.excludesfile "$config_dir/.gitignore_global"

# 4. zshenv / zshrc snippets
append_block() {
  local file="$1"
  local body="$2"
  touch "$file"
  if grep -qF "$sentinel" "$file"; then
    return
  fi
  {
    printf '\n# %s\n' "$sentinel"
    printf '%s\n' "$body"
    printf '# <<< configs setup.sh <<<\n'
  } >> "$file"
}

log "Updating ~/.zshenv and ~/.zshrc"
append_block "$HOME/.zshenv" "export config_dir=\"$config_dir\"
source \"\$config_dir/.zshenv\""
append_block "$HOME/.zshrc" "source \"\$config_dir/.zshrc\""

# 5. symlinks
log "Creating symlinks"
ln -sfn "$config_dir/.prettierrc" "$HOME/.prettierrc"
ln -sfn "$config_dir/vscode/settings.json" "$HOME/Library/Application Support/Code/User/settings.json"
ln -sfn "$config_dir/vscode/keybindings.json" "$HOME/Library/Application Support/Code/User/keybindings.json"
ln -sfn "$config_dir/karabiner" "$HOME/.config/karabiner"
ln -sfn "$config_dir/DefaultKeyBinding.dict" "$HOME/Library/KeyBindings/DefaultKeyBinding.dict"

# 6. ghostty: ensure the machine-local config includes the shared repo config.
# The local file (config.ghostty) also holds per-machine overrides such as
# working-directory, so it can't be a plain symlink. Prepend the include line
# (later local settings then override the shared config) if it's not present.
log "Ensuring ghostty includes the shared config"
ghostty_config="$HOME/.config/ghostty/config.ghostty"
ghostty_include="config-file = $config_dir/config.ghostty"
touch "$ghostty_config"
if ! grep -qxF "$ghostty_include" "$ghostty_config"; then
  tmp="$(mktemp)"
  printf '%s\n' "$ghostty_include" > "$tmp"
  cat "$ghostty_config" >> "$tmp"
  mv "$tmp" "$ghostty_config"
fi

# 7. fzf keybindings/completion
fzf_install="$("$mise_bin" where fzf 2>/dev/null || true)/install"
if [ -x "$fzf_install" ]; then
  log "Running fzf installer"
  "$fzf_install" --key-bindings --completion --no-update-rc
else
  printf '\nSkipping fzf installer — %s not found or not executable\n' "$fzf_install"
fi

# 8. zsh completions for tools that emit a compdef file
# (mise, rg, fd). Dynamic ones — zoxide, pandoc, npm — are evaluated at shell
# startup from shell/completions.sh. jq has no canonical completion generator.
log "Generating zsh completion files"
zfunc="$config_dir/.zfunc"
mkdir -p "$zfunc"
"$mise_bin" completion zsh > "$zfunc/_mise"
"$mise_bin" x -- rg --generate complete-zsh > "$zfunc/_rg"
"$mise_bin" x -- fd --gen-completions zsh > "$zfunc/_fd"
"$mise_bin" x -- pnpm completion zsh > "$zfunc/_pnpm"

log "Done. Open a new shell to pick up changes."
