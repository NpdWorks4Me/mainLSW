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

var SetPanelPasswordCmd = &cobra.Command{
	Use:   "set-panel-password <virtual machine ID>",
	Short: "Set panel password",
	Long: `This endpoint sets the panel password for a specified virtual machine. 
If virtual machine does not use panel OS, the request will still be processed without any effect.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSSetPanelPasswordV1WithResponse(context.TODO(), utils.StringToInt(args[0]), setPanelPasswordRequest(cmd))

		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	SetHostnameCmd.Flags().StringP("password", "", "", "Password")

	SetHostnameCmd.MarkFlagRequired("password")
}

func setPanelPasswordRequest(cmd *cobra.Command) client.VPSSetPanelPasswordV1JSONRequestBody {
	password, _ := cmd.Flags().GetString("password")

	return client.VPSSetPanelPasswordV1JSONRequestBody{
		Password: password,
	}
}
