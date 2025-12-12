package templates

import (
	"github.com/spf13/cobra"
)

var GroupCmd = &cobra.Command{
	Use:   "templates",
	Short: "OS Templates",
	Long:  `Retrieve details of operating system templates or list all available templates to choose the right configuration when deploying or recreating virtual machines.`,
}

func init() {
	GroupCmd.AddCommand(ListCmd)
	GroupCmd.AddCommand(GetCmd)
}
