package firewall

import (
	"github.com/hostinger/api-cli/cmd/vps/firewall/rules"
	"github.com/spf13/cobra"
)

var GroupCmd = &cobra.Command{
	Use:   "firewall",
	Short: "Firewall management",
	Long: `Enhance network security with endpoints for creating, activating, deactivating, syncing, updating, and deleting firewalls and firewall rules for your virtual machines. 
This firewall applies rules at the network level, so it will take precedence over the virtual machine's internal firewall.`,
}

func init() {
	GroupCmd.AddCommand(ActivateCmd)
	GroupCmd.AddCommand(DeactivateCmd)
	GroupCmd.AddCommand(GetCmd)
	GroupCmd.AddCommand(DeleteCmd)
	GroupCmd.AddCommand(ListCmd)
	GroupCmd.AddCommand(CreateCmd)
	GroupCmd.AddCommand(SyncCmd)

	GroupCmd.AddCommand(rules.GroupCmd)
}
