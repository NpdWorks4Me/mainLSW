package virtual_machines

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var ResetHostnameCmd = &cobra.Command{
	Use:   "reset-hostname <virtual machine ID>",
	Short: "Reset hostname",
	Long:  `This endpoint resets the hostname and PTR record of a specified virtual machine to the default value.`,
	Args:  cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSResetHostnameV1WithResponse(context.TODO(), utils.StringToInt(args[0]))

		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}
