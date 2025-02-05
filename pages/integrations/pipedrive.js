import { useEffect } from "react";
import useParagon from "../../hooks/useParagon";
import { useRouter } from "next/router";

// The URL of your Pipedrive Redirect Page
export const PIPEDRIVE_REDIRECT_URL =
  "http://localhost:3000/integrations/pipedrive";
// If using an on-prem installation, change this to your instance's Connect service hostname
const PARAGON_CONNECT_ORIGIN = "https://connect.useparagon.com";

export default function InstallPipedrive({ paragonUserToken }) {
  const { paragon } = useParagon(paragonUserToken);
  const router = useRouter();

  useEffect(() => {
    if (window.location.search && paragon) {
      let params = new URLSearchParams(window.location.search);
      let authorizationCode = params.get("code");
      if (authorizationCode) {
        paragon
          .completeInstall("pipedrive", {
            authorizationCode,
            redirectUrl: PIPEDRIVE_REDIRECT_URL,
          })
          .then(() => {
            if (window.opener) {
              // TODO: Notify your main window that the integration is installed
              window.close();
            } else {
              // If Pipedrive Marketplace-origin install: redirect to integrations page
              router.push("/integrations?pipedrive_install=true");
            }
          });
      }
    }
  }, [paragon]);

  return "Connecting Pipedrive...";
}
