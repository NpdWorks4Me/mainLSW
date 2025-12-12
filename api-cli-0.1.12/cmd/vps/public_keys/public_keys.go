package public_keys

import "github.com/spf13/cobra"

var GroupCmd = &cobra.Command{
	Use:   "public-keys",
	Short: "Public key management",
	Long:  `Manage SSH keys for secure access. This category covers adding new public keys, attaching them to virtual machines, retrieving key lists, and deleting keys.`,
}

func init() {
	GroupCmd.AddCommand(ListCmd)
	GroupCmd.AddCommand(DeleteCmd)
	GroupCmd.AddCommand(CreateCmd)
	GroupCmd.AddCommand(AttachCmd)
}
