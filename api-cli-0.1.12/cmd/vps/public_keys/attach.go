package public_keys

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/client"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var AttachCmd = &cobra.Command{
	Use:   "attach <virtual machine ID>",
	Short: "Attach public keys",
	Long: `This endpoint attaches an existing public keys from your account to a specified virtual machine.

Multiple keys can be attached to a single virtual machine.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSAttachPublicKeyV1WithResponse(context.TODO(), utils.StringToInt(args[0]), publickKeyAttachRequest(cmd, args))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	CreateCmd.Flags().StringArrayP("ids", "", []string{}, "Public key ID list")

	CreateCmd.MarkFlagRequired("ids")
}

func publickKeyAttachRequest(cmd *cobra.Command, args []string) client.VPSAttachPublicKeyV1JSONRequestBody {
	ids, _ := cmd.Flags().GetStringArray("ids")

	return client.VPSAttachPublicKeyV1JSONRequestBody{
		Ids: utils.StringArrayToIntArray(ids),
	}
}
