package firewall

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/client"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var ListCmd = &cobra.Command{
	Use:   "list",
	Short: "Get firewall list",
	Long:  `This endpoint retrieves a list of all firewalls available.`,
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSGetFirewallListV1WithResponse(context.TODO(), firewallListRequestParameters(cmd))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	ListCmd.Flags().IntP("page", "", 1, "Page number")
}

func firewallListRequestParameters(cmd *cobra.Command) *client.VPSGetFirewallListV1Params {
	pageId, _ := cmd.Flags().GetInt("page")

	return &client.VPSGetFirewallListV1Params{
		Page: utils.IntPtrOrNil(pageId),
	}
}
