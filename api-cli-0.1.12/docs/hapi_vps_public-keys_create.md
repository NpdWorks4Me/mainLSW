## hapi vps public-keys create

Create new public key

### Synopsis

This endpoint allows you to add a new public key to your account, which can then be attached to virtual machine instances for secure access.

```
hapi vps public-keys create [flags]
```

### Options

```
  -h, --help              help for create
      --ids stringArray   Public key ID list
      --key string        Public key content
      --name string       Public key name
```

### Options inherited from parent commands

```
      --config string   Config file (default is $HOME/.hapi.yaml)
      --format string   Output format type (json|table|tree), default: table
```

### SEE ALSO

* [hapi vps public-keys](hapi_vps_public-keys.md)	 - Public key management

