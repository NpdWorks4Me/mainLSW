package ptr

import (
	"github.com/spf13/cobra"
)

var GroupCmd = &cobra.Command{
	Use:   "ptr",
	Short: "PTR records management",
	Long:  `Manage reverse DNS settings by creating or deleting PTR records for your virtual machines, ensuring that IP addresses correctly resolve to hostnames.`,
}

func init() {
	GroupCmd.AddCommand(CreateCmd)
	GroupCmd.AddCommand(DeleteCmd)
}
