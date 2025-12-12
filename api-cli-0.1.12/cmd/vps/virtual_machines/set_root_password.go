package virtual_machines

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/client"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var SetRootPasswordCmd = &cobra.Command{
	Use:   "set-root-password <virtual machine ID>",
	Short: "Set root password",
	Long:  `This endpoint sets the root password for a specified virtual machine.`,
	Args:  cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSSetRootPasswordV1WithResponse(context.TODO(), utils.StringToInt(args[0]), setRootPasswordRequest(cmd))

		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	SetRootPasswordCmd.Flags().StringP("password", "", "", "Password")

	SetRootPasswordCmd.MarkFlagRequired("password")
}

func setRootPasswordRequest(cmd *cobra.Command) client.VPSSetRootPasswordV1JSONRequestBody {
	password, _ := cmd.Flags().GetString("password")

	return client.VPSSetRootPasswordV1JSONRequestBody{
		Password: password,
	}
}
