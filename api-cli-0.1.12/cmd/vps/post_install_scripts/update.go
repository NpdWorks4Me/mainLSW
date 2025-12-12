package post_install_scripts

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
	Use:   "update <post-install script ID>",
	Short: "Update post-install script",
	Long:  `This endpoint updates a specific post-install script.`,
	Args:  cobra.MatchAll(cobra.ExactArgs(1)),
	Run: func(cmd *cobra.Command, args []string) {
		r, err := api.Request().VPSUpdatePostInstallScriptV1WithResponse(context.TODO(), utils.StringToInt(args[0]), postInstallScriptUpdateRequest(cmd, args))
		if err != nil {
			log.Fatal(err)
		}

		output.Format(cmd, r.Body, r.StatusCode())
	},
}

func init() {
	UpdateCmd.Flags().StringP("name", "", "", "Post-install script name")
	UpdateCmd.Flags().StringP("content", "", "", "Post-install script content")

	UpdateCmd.MarkFlagRequired("name")
	UpdateCmd.MarkFlagRequired("content")
}

func postInstallScriptUpdateRequest(cmd *cobra.Command, args []string) client.VPSUpdatePostInstallScriptV1JSONRequestBody {
	name, _ := cmd.Flags().GetString("name")
	content, _ := cmd.Flags().GetString("content")

	return client.VPSUpdatePostInstallScriptV1JSONRequestBody{
		Name:    name,
		Content: content,
	}
}
