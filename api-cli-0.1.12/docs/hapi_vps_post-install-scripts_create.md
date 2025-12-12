## hapi vps post-install-scripts create

Create new post-install script

### Synopsis

This endpoint allows you to add a new post-install script to your account, which can then be used run after the installation of a virtual machine instance.

The script contents will be saved to the file /post_install with executable attribute set and will be executed once 
virtual machine is installed. The output of the script will be redirected to /post_install.log. Maximum script size is 48KB.

```
hapi vps post-install-scripts create [flags]
```

### Options

```
      --content string   Post-install script content
  -h, --help             help for create
      --name string      Post-install script name
```

### Options inherited from parent commands

```
      --config string   Config file (default is $HOME/.hapi.yaml)
      --format string   Output format type (json|table|tree), default: table
```

### SEE ALSO

* [hapi vps post-install-scripts](hapi_vps_post-install-scripts.md)	 - Post-install script management

