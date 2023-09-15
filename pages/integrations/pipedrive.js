import { useEffect } from 'react';
import useParagon from "../../hooks/useParagon";
import { useRouter } from 'next/router';

export default function InstallPipedrive({ paragonUserToken }) {
  const { paragon } = useParagon(paragonUserToken);
  const router = useRouter();

  useEffect(() => {
    if (window.location.search && paragon) {
      let params = new URLSearchParams(window.location.search);
      if (params.get("code")) {
         paragon.completeInstall("pipedrive", {
          authorizationCode: params.get("code"),
          redirectUrl: "https://w4tdtq-3000.csb.app/integrations/pipedrive",
        }).then(() => {
            if (window.opener) {
                window.opener.postMessage({ msg: "hello can you hear me" });
                window.opener.postMessage({
                  messageType: "UI_UPDATE",
                  nextContext: { user: paragon.getUser() }
                }, "*");
                // window.close();
            } else {
                router.push('/integrations?pipedrive_install=true');
            }
        });
      }
    }
  }, [paragon]);

  return "Connecting Pipedrive..."
};