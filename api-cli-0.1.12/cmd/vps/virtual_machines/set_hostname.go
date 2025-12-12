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

var SetHostnameCmd = &cobra.Command{
	Use:   "set-hostname <virtual machine ID>",
	Short: "Set hostname",
	Long: `This endpoint sets the hostname for a specified virtual machine. Changing hostname does not update PTR record automatically.
If you want your virtual machine to be reachable by a hostname, you need to point your domain A/AAAA records 
to virtual machine IP as well.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSSetHostnameV1WithResponse(context.TODO(), utils.StringToInt(args[0]), setHostnameRequest(cmd))

		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	SetHostnameCmd.Flags().StringP("hostname", "", "", "Virtual machine hostname")

	SetHostnameCmd.MarkFlagRequired("hostname")
}

func setHostnameRequest(cmd *cobra.Command) client.VPSSetHostnameV1JSONRequestBody {
	hostname, _ := cmd.Flags().GetString("hostname")

	return client.VPSSetHostnameV1JSONRequestBody{
		Hostname: hostname,
	}
}
