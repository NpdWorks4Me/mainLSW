package recovery

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/client"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var StartCmd = &cobra.Command{
	Use:   "start <virtual machine ID>",
	Short: "Start recovery mode",
	Long: `This endpoint initiates the recovery mode for a specified virtual machine. 
Recovery mode is a special state that allows users to perform system rescue operations, such as repairing file systems, 
recovering data, or troubleshooting issues that prevent the virtual machine from booting normally.

Virtual machine will boot recovery disk image and original disk image will be mounted in /mnt directory.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSStartRecoveryModeV1WithResponse(context.TODO(), utils.StringToInt(args[0]), startRequestParameters(cmd))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	StartCmd.Flags().StringP("password", "", "", "Temporary root password for recovery mode")

	StartCmd.MarkFlagRequired("password")
}

func startRequestParameters(cmd *cobra.Command) client.VPSStartRecoveryModeV1JSONRequestBody {
	password, _ := cmd.Flags().GetString("password")

	return client.VPSStartRecoveryModeV1JSONRequestBody{
		RootPassword: password,
	}
}
