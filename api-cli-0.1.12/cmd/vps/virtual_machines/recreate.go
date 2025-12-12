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

var RecreateCmd = &cobra.Command{
	Use:   "recreate <virtual machine ID>",
	Short: "Recreate virtual machine",
	Long: `This endpoint will recreate a virtual machine from scratch. The recreation process involves reinstalling the 
operating system and resetting the virtual machine to its initial state. Snapshots, if there are any, will be deleted.`,
	Args: cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSRecreateVirtualMachineV1WithResponse(context.TODO(), utils.StringToInt(args[0]), recreateRequestFromFlags(cmd))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	RecreateCmd.Flags().IntP("template_id", "", -1, "Template ID")
	RecreateCmd.Flags().StringP("password", "", "", "Root or panel Password")
	RecreateCmd.Flags().IntP("post_install_script_id", "", -1, "Post install script")

	RecreateCmd.MarkFlagRequired("template_id")
}

func recreateRequestFromFlags(cmd *cobra.Command) client.VPSV1VirtualMachineRecreateRequest {
	templateId, _ := cmd.Flags().GetInt("template_id")
	password, _ := cmd.Flags().GetString("password")
	postInstallScriptId, _ := cmd.Flags().GetInt("post_install_script_id")

	return client.VPSV1VirtualMachineRecreateRequest{
		TemplateId:          templateId,
		Password:            utils.StringPtrOrNil(password),
		PostInstallScriptId: utils.IntPtrOrNil(postInstallScriptId),
	}
}
