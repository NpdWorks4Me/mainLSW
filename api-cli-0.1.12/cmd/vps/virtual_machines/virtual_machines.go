package virtual_machines

import (
	"github.com/spf13/cobra"
)

var GroupCmd = &cobra.Command{
	Use:   "vm",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
}

func init() {
	GroupCmd.AddCommand(GetAttachedKeysCmd)
	GroupCmd.AddCommand(GetCmd)
	GroupCmd.AddCommand(ListCmd)
	GroupCmd.AddCommand(GetMetricsCmd)
	GroupCmd.AddCommand(StartCmd)
	GroupCmd.AddCommand(StopCmd)
	GroupCmd.AddCommand(SetHostnameCmd)
	GroupCmd.AddCommand(SetNameserversCmd)
	GroupCmd.AddCommand(SetPanelPasswordCmd)
	GroupCmd.AddCommand(SetRootPasswordCmd)
	GroupCmd.AddCommand(ResetHostnameCmd)
	GroupCmd.AddCommand(RecreateCmd)
}
