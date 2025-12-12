# Enabling shell auto-completion

`hapi` has auto-complete support. This makes it easier to use the CLI and improves user experience by completing command
names by clicking TAB key. For example if you type `hapi vps dat<TAB>` with auto-completion enabled, shell will automatically append
rest of the command: `hapi vps data-centers`.

Auto-completion can be generated for multiple shells. The currently supported shells are:
- Bash
- Zsh
- fish
- PowerShell

After adding shell auto-completion, remember to refresh your shell profile by logging out from the shell and log back in.

## Bash
### Linux:
```bash
hapi completion bash > /etc/bash_completion.d/hapi
````
### macOS:
```bash
myapp completion bash > /usr/local/etc/bash_completion.d/hapi
```

## Zsh
If shell completion is not already enabled in your environment, you will need to enable it.  You can execute the following once:
```bash
echo "autoload -U compinit; compinit" >> ~/.zshrc
```

To load completions for each session, execute once:
```bash
hapi completion zsh > "${fpath[1]}/_hapi"
```
You will need to start a new shell for this setup to take effect.

## Fish
```bash
hapi completion fish | source
```
To load completions for each session, execute once:
```bash
hapi completion fish > ~/.config/fish/completions/hapi.fish
```

## PowerShell
```powershell
hapi completion powershell | Out-String | Invoke-Expression
```
To load completions for every new session, run:
```powershell
hapi completion powershell > hapi.ps1
```
and source this file from your PowerShell profile.