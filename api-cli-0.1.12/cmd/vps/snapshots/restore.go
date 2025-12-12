package snapshots

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var RestoreCmd = &cobra.Command{
	Use:   "restore <virtual machine ID>",
	Short: "Restore snapshot",
	Long: `This endpoint restores a specified virtual machine to a previous state using a snapshot. Restoring from a 
snapshot allows users to revert the virtual machine to that state, which is useful for system recovery, 
undoing changes, or testing.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSRestoreSnapshotV1WithResponse(context.TODO(), utils.StringToInt(args[0]))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}
