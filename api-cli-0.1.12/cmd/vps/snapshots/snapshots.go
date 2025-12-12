package snapshots

import "github.com/spf13/cobra"

var GroupCmd = &cobra.Command{
	Use:   "snapshots",
	Short: "Snapshot management",
	Long: `Create, restore, or delete snapshots that capture the state of your virtual machines at a given point, 
allowing you to quickly recover or test changes without affecting current operations.`,
}

func init() {
	GroupCmd.AddCommand(GetCmd)
	GroupCmd.AddCommand(CreateCmd)
	GroupCmd.AddCommand(DeleteCmd)
	GroupCmd.AddCommand(RestoreCmd)
}
