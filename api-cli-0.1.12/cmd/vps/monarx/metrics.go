package monarx

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var MetricsCmd = &cobra.Command{
	Use:   "metrics <virtual machine ID>",
	Short: "Get scan metrics",
	Long: `This endpoint retrieves the scan metrics for the Monarx malware scanner installed on a specified virtual machine. 
The scan metrics provide detailed information about the malware scans performed by Monarx, including the number of scans, 
detected threats, and other relevant statistics. 
This information is useful for monitoring the security status of the virtual machine and assessing the effectiveness of the malware scanner.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSGetScanMetricsV1WithResponse(context.TODO(), utils.StringToInt(args[0]))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}
