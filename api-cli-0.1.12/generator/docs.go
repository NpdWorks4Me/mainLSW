package main

import (
	"os"

	"github.com/hostinger/api-cli/cmd"
	"github.com/spf13/cobra/doc"
)

func main() {
	err := doc.GenMarkdownTree(cmd.RootCmd, "./docs")
	if err != nil {
		os.Exit(1)
	}
}
