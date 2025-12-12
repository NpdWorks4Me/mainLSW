package post_install_scripts

import "github.com/spf13/cobra"

var GroupCmd = &cobra.Command{
	Use:   "post-install-scripts",
	Short: "Post-install script management",
	Long: `This category allows you to create, update, delete, and retrieve scripts that can be used for automated 
tasks after the operating system installation. 
Use case includes setting up software, configuring settings, or running custom commands.`,
}

func init() {
	GroupCmd.AddCommand(GetCmd)
	GroupCmd.AddCommand(ListCmd)
	GroupCmd.AddCommand(DeleteCmd)
	GroupCmd.AddCommand(CreateCmd)
}
