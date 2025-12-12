package actions

import (
	"github.com/spf13/cobra"
)

var GroupCmd = &cobra.Command{
	Use:   "actions",
	Short: "VM actions information",
	Long:  `Track and review operations performed on your virtual machines. These endpoints provide details about specific actions—such as start, stop, or restart—including timestamps and statuses.`,
}

func init() {
	GroupCmd.AddCommand(GetCmd)
	GroupCmd.AddCommand(ListCmd)
}
