# Windows Setup

Exclude `.bash_profile` and combine it into `.bashrc`, adding `config_node_path` based on the installation of `nvm install`:

```sh
config_node_path=$HOME/AppData/Roaming/nvm/v8.15.0/node64
config_dir=$HOME/Development/configs
source "$config_dir/.bashrc"
```