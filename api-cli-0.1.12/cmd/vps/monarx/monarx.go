package monarx

import (
	"github.com/spf13/cobra"
)

var GroupCmd = &cobra.Command{
	Use:   "monarx",
	Short: "Malware scanner",
	Long:  `Monitor your virtual machines’ security using the Monarx malware scanner. Retrieve scan metrics or install/uninstall the scanner to help protect against malware threats.`,
}

func init() {
	GroupCmd.AddCommand(InstallCmd)
	GroupCmd.AddCommand(UninstallCmd)
	GroupCmd.AddCommand(MetricsCmd)
}
