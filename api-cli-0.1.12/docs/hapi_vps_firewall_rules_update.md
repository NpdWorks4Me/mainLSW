## hapi vps firewall rules update

Update firewall rule

### Synopsis

This endpoint updates a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.

```
hapi vps firewall rules update <firewall ID> <rule ID> [flags]
```

### Options

```
  -h, --help                   help for update
      --port string            Port or port range (eg: 1024:2048)
      --protocol string        Protocol (one of: TCP, UDP, ICMP, GRE, ESP, AH, ICMPv6, SSH, HTTP, HTTPS, MySQL, PostgreSQL or any
      --source string          Source type (any or custom)
      --source_detail string   Source details (IP range, CIDR, single IP or any)
```

### Options inherited from parent commands

```
      --config string   Config file (default is $HOME/.hapi.yaml)
      --format string   Output format type (json|table|tree), default: table
```

### SEE ALSO

* [hapi vps firewall rules](hapi_vps_firewall_rules.md)	 - Firewall rule management

