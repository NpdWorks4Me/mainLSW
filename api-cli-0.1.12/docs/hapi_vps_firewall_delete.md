## hapi vps firewall delete

Delete firewall

### Synopsis

This endpoint deletes a specified firewall.

Any virtual machine that has this firewall activated will automatically have it deactivated.

```
hapi vps firewall delete <firewall ID> [flags]
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

* [hapi vps firewall](hapi_vps_firewall.md)	 - Firewall management

