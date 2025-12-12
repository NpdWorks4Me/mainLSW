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

var CreateCmd = &cobra.Command{
	Use:   "create <firewall ID>",
	Short: "Create firewall rule",
	Long: `This endpoint creates new firewall rule from a specified firewall. By default, the firewall drops all incoming traffic.

Any virtual machine that has this firewall activated will loose sync with the firewall and will have to be synced again manually.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSCreateFirewallRuleV1WithResponse(context.TODO(), utils.StringToInt(args[0]), firewallRuleCreateRequest(cmd, args))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	CreateCmd.Flags().StringP("protocol", "", "", "Protocol (one of: TCP, UDP, ICMP, GRE, ESP, AH, ICMPv6, SSH, HTTP, HTTPS, MySQL, PostgreSQL or any")
	CreateCmd.Flags().StringP("port", "", "", "Port or port range (eg: 1024:2048)")
	CreateCmd.Flags().StringP("source", "", "", "Source type (any or custom)")
	CreateCmd.Flags().StringP("source_detail", "", "", "Source details (IP range, CIDR, single IP or any)")

	CreateCmd.MarkFlagRequired("protocol")
	CreateCmd.MarkFlagRequired("port")
	CreateCmd.MarkFlagRequired("source")
	CreateCmd.MarkFlagRequired("source_detail")
}

func firewallRuleCreateRequest(cmd *cobra.Command, args []string) client.VPSCreateFirewallRuleV1JSONRequestBody {
	protocol, _ := cmd.Flags().GetString("protocol")
	port, _ := cmd.Flags().GetString("port")
	source, _ := cmd.Flags().GetString("source")
	sourceDetail, _ := cmd.Flags().GetString("source_detail")

	return client.VPSCreateFirewallRuleV1JSONRequestBody{
		Protocol:     client.VPSV1FirewallRulesStoreRequestProtocol(protocol),
		Port:         port,
		Source:       client.VPSV1FirewallRulesStoreRequestSource(source),
		SourceDetail: sourceDetail,
	}
}
