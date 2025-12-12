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

var SetNameserversCmd = &cobra.Command{
	Use:   "set-nameservers <virtual machine ID>",
	Short: "Set nameservers",
	Long: `This endpoint sets the nameservers for a specified virtual machine. 
Be aware, that improper nameserver configuration can lead to the virtual machine being unable to resolve domain names.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSSetNameserversV1WithResponse(context.TODO(), utils.StringToInt(args[0]), setNameserversRequest(cmd))

		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	SetHostnameCmd.Flags().StringP("ns1", "", "", "Name server 1")
	SetHostnameCmd.Flags().StringP("ns2", "", "", "Name server 2")

	SetHostnameCmd.MarkFlagRequired("ns1")
}

func setNameserversRequest(cmd *cobra.Command) client.VPSSetNameserversV1JSONRequestBody {
	ns1, _ := cmd.Flags().GetString("ns1")
	ns2, _ := cmd.Flags().GetString("ns2")

	return client.VPSSetNameserversV1JSONRequestBody{
		Ns1: ns1,
		Ns2: utils.StringPtrOrNil(ns2),
	}
}
