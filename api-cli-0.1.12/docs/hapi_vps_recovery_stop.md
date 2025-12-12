## hapi vps recovery stop

Stop recovery mode

### Synopsis

This endpoint stops the recovery mode for a specified virtual machine. 
If virtual machine is not in recovery mode, this operation will fail.

```
hapi vps recovery stop <virtual machine ID> [flags]
```

### Options

```
  -h, --help   help for stop
```

### Options inherited from parent commands

```
      --config string   Config file (default is $HOME/.hapi.yaml)
      --format string   Output format type (json|table|tree), default: table
```

### SEE ALSO

* [hapi vps recovery](hapi_vps_recovery.md)	 - Recovery mode management

