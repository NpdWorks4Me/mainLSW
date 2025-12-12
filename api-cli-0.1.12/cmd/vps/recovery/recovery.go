package recovery

import "github.com/spf13/cobra"

var GroupCmd = &cobra.Command{
	Use:   "recovery",
	Short: "Recovery mode management",
	Long:  `Initiate or stop recovery mode to perform system rescue operations. This category enables you to boot a virtual machine into a state suitable for repairing file systems or recovering data.`,
}

func init() {
	GroupCmd.AddCommand(StartCmd)
	GroupCmd.AddCommand(StopCmd)
}
