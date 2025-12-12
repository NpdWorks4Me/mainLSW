## hapi vps firewall rules delete

Delete firewall rule

### Synopsis

This endpoint deletes a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.

```
hapi vps firewall rules delete <firewall ID> <rule ID> [flags]
```

### Options

```
  -h, --help   help for delete
```

### Options inherited from parent commands

```
      --config string   Config file (default is $HOME/.hapi.yaml)
      --format string   Output format type (json|table|tree), default: table
```

### SEE ALSO

* [hapi vps firewall rules](hapi_vps_firewall_rules.md)	 - Firewall rule management

