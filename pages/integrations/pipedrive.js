import { useEffect } from 'react';
import useParagon from "../../hooks/useParagon";
import { useRouter } from 'next/router';

// The URL of your Pipedrive Redirect Page
const PIPEDRIVE_REDIRECT_URL = "https://w4tdtq-3000.csb.app/integrations/pipedrive";
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
        if (window.opener) {
          // If the install flow begins in the Connect Portal
          window.opener.postMessage({
            messageType: 'SDK_FUNCTION_INVOCATION',
            type:'completeInstall',
            parameters: ['pipedrive', {
              authorizationCode,
              redirectUrl: PIPEDRIVE_REDIRECT_URL
            } ]
          }, PARAGON_CONNECT_ORIGIN);
          window.close();
        } else {
          // If the install flow begins in the Pipedrive Marketplace/install link
          paragon.completeInstall("pipedrive", {
            authorizationCode,
            redirectUrl: PIPEDRIVE_REDIRECT_URL
          }).then(() => {
              // Redirect to integrations page
              router.push('/integrations?pipedrive_install=true');
          });
        }
      }
    }
  }, [paragon]);

  return "Connecting Pipedrive..."
};