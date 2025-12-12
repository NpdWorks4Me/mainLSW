## hapi vps actions list

Get action list

### Synopsis

Actions are operations or events that have been executed on the virtual machine, such as starting, stopping, 
or modifying the machine. This endpoint allows you to view the history of these actions, providing details about each 
action, such as the action name, timestamp, and status.

```
hapi vps actions list <virtual machine ID> [flags]
```

### Options

```
  -h, --help       help for list
      --page int   Page number (default 1)
```

### Options inherited from parent commands

```
      --config string   Config file (default is $HOME/.hapi.yaml)
      --format string   Output format type (json|table|tree), default: table
```

### SEE ALSO

* [hapi vps actions](hapi_vps_actions.md)	 - VM actions information

