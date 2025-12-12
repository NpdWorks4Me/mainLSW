package post_install_scripts

import (
	"context"
	"github.com/hostinger/api-cli/api"
	"github.com/hostinger/api-cli/client"
	"github.com/hostinger/api-cli/output"
	"github.com/spf13/cobra"
	"log"
)

var CreateCmd = &cobra.Command{
	Use:   "create",
	Short: "Create new post-install script",
	Long: `This endpoint allows you to add a new post-install script to your account, which can then be used run after the installation of a virtual machine instance.

The script contents will be saved to the file /post_install with executable attribute set and will be executed once 
virtual machine is installed. The output of the script will be redirected to /post_install.log. Maximum script size is 48KB.`,
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSCreatePostInstallScriptV1WithResponse(context.TODO(), postInstallScriptCreateRequest(cmd, args))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	CreateCmd.Flags().StringP("name", "", "", "Post-install script name")
	CreateCmd.Flags().StringP("content", "", "", "Post-install script content")

	CreateCmd.MarkFlagRequired("name")
	CreateCmd.MarkFlagRequired("content")
}

func postInstallScriptCreateRequest(cmd *cobra.Command, args []string) client.VPSCreatePostInstallScriptV1JSONRequestBody {
	name, _ := cmd.Flags().GetString("name")
	content, _ := cmd.Flags().GetString("content")

	return client.VPSCreatePostInstallScriptV1JSONRequestBody{
		Name:    name,
		Content: content,
	}
}
