package snapshots

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var CreateCmd = &cobra.Command{
	Use:   "create <virtual machine ID>",
	Short: "Create snapshot",
	Long: `This endpoint creates a snapshot of a specified virtual machine. A snapshot captures the state and data of 
the virtual machine at a specific point in time, allowing users to restore the virtual machine to that state if needed. 
This operation is useful for backup purposes, system recovery, and testing changes without affecting the current state
of the virtual machine.

Creating new snapshot will overwrite the existing snapshot!`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSCreateSnapshotV1WithResponse(context.TODO(), utils.StringToInt(args[0]))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}
