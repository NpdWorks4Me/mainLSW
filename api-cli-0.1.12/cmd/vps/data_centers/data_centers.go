package data_centers

import (
	"github.com/spf13/cobra"
)

var GroupCmd = &cobra.Command{
	Use:   "data-centers",
	Short: "Data center information",
	Long:  `Access information on available data centers, including location details, so you can choose the optimal region for deploying your virtual machines.`,
}

func init() {
	GroupCmd.AddCommand(ListCmd)
}
