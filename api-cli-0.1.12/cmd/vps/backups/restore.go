package backups

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var RestoreCmd = &cobra.Command{
	Use:   "restore <virtual machine ID> <backup ID>",
	Short: "Restore backup",
	Long: `This endpoint restores a backup for a specified virtual machine.
The system will then initiate the restore process, which may take some time depending on the size of the backup.

All data on the virtual machine will be overwritten with the data from the backup.`,
	Args: cobra.MatchAll(cobra.ExactArgs(2)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSRestoreBackupV1WithResponse(context.TODO(), utils.StringToInt(args[0]), utils.StringToInt(args[1]))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}
