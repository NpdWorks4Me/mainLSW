package firewall

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/client"
	"github.com/hostinger/api-cli/output"
	"github.com/spf13/cobra"
	"log"
)

var CreateCmd = &cobra.Command{
	Use:   "create",
	Short: "Create new firewall",
	Long:  `This endpoint creates a new firewall.`,
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSCreateNewFirewallV1WithResponse(context.TODO(), firewallCreateRequest(cmd, args))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	CreateCmd.Flags().StringP("name", "", "", "Firewall name")

	CreateCmd.MarkFlagRequired("name")
}

func firewallCreateRequest(cmd *cobra.Command, args []string) client.VPSCreateNewFirewallV1JSONRequestBody {
	name, _ := cmd.Flags().GetString("name")

	return client.VPSCreateNewFirewallV1JSONRequestBody{
		Name: name,
	}
}
