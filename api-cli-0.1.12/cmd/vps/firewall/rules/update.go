package rules

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/client"
	"github.com/hostinger/api-cli/output"
	"github.com/hostinger/api-cli/utils"
	"github.com/spf13/cobra"
	"log"
)

var UpdateCmd = &cobra.Command{
	Use:   "update <firewall ID> <rule ID>",
	Short: "Update firewall rule",
	Long: `This endpoint updates a specific firewall rule from a specified firewall.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.`,
	Args: cobra.MatchAll(cobra.ExactArgs(2)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSUpdateFirewallRuleV1WithResponse(context.TODO(), utils.StringToInt(args[0]), utils.StringToInt(args[1]), firewallRuleUpdateRequest(cmd, args))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	UpdateCmd.Flags().StringP("protocol", "", "", "Protocol (one of: TCP, UDP, ICMP, GRE, ESP, AH, ICMPv6, SSH, HTTP, HTTPS, MySQL, PostgreSQL or any")
	UpdateCmd.Flags().StringP("port", "", "", "Port or port range (eg: 1024:2048)")
	UpdateCmd.Flags().StringP("source", "", "", "Source type (any or custom)")
	UpdateCmd.Flags().StringP("source_detail", "", "", "Source details (IP range, CIDR, single IP or any)")

	UpdateCmd.MarkFlagRequired("protocol")
	UpdateCmd.MarkFlagRequired("port")
	UpdateCmd.MarkFlagRequired("source")
	UpdateCmd.MarkFlagRequired("source_detail")
}

func firewallRuleUpdateRequest(cmd *cobra.Command, args []string) client.VPSUpdateFirewallRuleV1JSONRequestBody {
	protocol, _ := cmd.Flags().GetString("protocol")
	port, _ := cmd.Flags().GetString("port")
	source, _ := cmd.Flags().GetString("source")
	sourceDetail, _ := cmd.Flags().GetString("source_detail")

	return client.VPSUpdateFirewallRuleV1JSONRequestBody{
		Protocol:     client.VPSV1FirewallRulesStoreRequestProtocol(protocol),
		Port:         port,
		Source:       client.VPSV1FirewallRulesStoreRequestSource(source),
		SourceDetail: sourceDetail,
	}
}
