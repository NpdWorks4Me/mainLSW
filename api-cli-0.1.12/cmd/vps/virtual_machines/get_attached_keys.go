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

var GetAttachedKeysCmd = &cobra.Command{
	Use:   "get-attached-keys <virtual machine ID>",
	Short: "Get attached public keys",
	Long:  `This endpoint retrieves a list of public keys attached to a specified virtual machine.`,
	Args:  cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSGetAttachedPublicKeysV1WithResponse(context.TODO(), utils.StringToInt(args[0]), attachedKeysRequestParameters(cmd))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	ListCmd.Flags().IntP("page", "", 1, "Page number")
}

func attachedKeysRequestParameters(cmd *cobra.Command) *client.VPSGetAttachedPublicKeysV1Params {
	pageId, _ := cmd.Flags().GetInt("page")

	return &client.VPSGetAttachedPublicKeysV1Params{
		Page: utils.IntPtrOrNil(pageId),
	}
}
