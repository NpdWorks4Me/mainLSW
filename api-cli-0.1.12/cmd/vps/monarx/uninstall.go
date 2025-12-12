package monarx

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var UninstallCmd = &cobra.Command{
	Use:   "uninstall <virtual machine ID>",
	Short: "Uninstall malware scanner",
	Long:  `This endpoint uninstalls the Monarx malware scanner on a specified virtual machine. If Monarx is not installed, the request will still be processed without any effect.`,
	Args:  cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSUninstallMonarxV1WithResponse(context.TODO(), utils.StringToInt(args[0]))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}
