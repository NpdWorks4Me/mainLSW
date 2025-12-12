## hapi vps snapshots restore

Restore snapshot

### Synopsis

This endpoint restores a specified virtual machine to a previous state using a snapshot. Restoring from a 
snapshot allows users to revert the virtual machine to that state, which is useful for system recovery, 
undoing changes, or testing.

```
hapi vps snapshots restore <virtual machine ID> [flags]
```

### Options

```
  -h, --help   help for restore
```

### Options inherited from parent commands

```
      --config string   Config file (default is $HOME/.hapi.yaml)
      --format string   Output format type (json|table|tree), default: table
```

### SEE ALSO

* [hapi vps snapshots](hapi_vps_snapshots.md)	 - Snapshot management

