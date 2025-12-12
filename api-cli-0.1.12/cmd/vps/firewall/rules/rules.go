package rules

import "github.com/spf13/cobra"

var GroupCmd = &cobra.Command{
	Use:   "rules",
	Short: "Firewall rule management",
}

func init() {
	GroupCmd.AddCommand(CreateCmd)
	GroupCmd.AddCommand(UpdateCmd)
	GroupCmd.AddCommand(DeleteCmd)
}
