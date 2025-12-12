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

var GetMetricsCmd = &cobra.Command{
	Use:   "metrics <virtual machine ID>",
	Short: "Get metrics",
	Long:  `This endpoint retrieves the historical metrics for a specified virtual machine.`,
	Args:  cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSGetMetricsV1WithResponse(context.TODO(), utils.StringToInt(args[0]), metricsRequestParameters(cmd))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	GetMetricsCmd.Flags().StringP("date-from", "f", "", "Date from")
	GetMetricsCmd.Flags().StringP("date-to", "t", "", "Date to")

	GetMetricsCmd.MarkFlagRequired("date-from")
	GetMetricsCmd.MarkFlagRequired("date-to")
}

func metricsRequestParameters(cmd *cobra.Command) *client.VPSGetMetricsV1Params {
	dateFrom, _ := cmd.Flags().GetString("date-from")
	dateTo, _ := cmd.Flags().GetString("date-to")

	return &client.VPSGetMetricsV1Params{
		DateFrom: utils.StringToTime(dateFrom),
		DateTo:   utils.StringToTime(dateTo),
	}
}
