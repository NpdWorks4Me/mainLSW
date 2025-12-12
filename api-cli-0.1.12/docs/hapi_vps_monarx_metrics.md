## hapi vps monarx metrics

Get scan metrics

### Synopsis

This endpoint retrieves the scan metrics for the Monarx malware scanner installed on a specified virtual machine. 
The scan metrics provide detailed information about the malware scans performed by Monarx, including the number of scans, 
detected threats, and other relevant statistics. 
This information is useful for monitoring the security status of the virtual machine and assessing the effectiveness of the malware scanner.

```
hapi vps monarx metrics <virtual machine ID> [flags]
```

### Options

```
  -h, --help   help for metrics
```

### Options inherited from parent commands

```
      --config string   Config file (default is $HOME/.hapi.yaml)
      --format string   Output format type (json|table|tree), default: table
```

### SEE ALSO

* [hapi vps monarx](hapi_vps_monarx.md)	 - Malware scanner

