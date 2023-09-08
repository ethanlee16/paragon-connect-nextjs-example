import { useEffect } from 'react';
import { useRouter } from 'next/router';

import useParagon from "../../hooks/useParagon";

export default function InstallShopify({ paragonUserToken }) {
  const { user, paragon } = useParagon(paragonUserToken);
  const router = useRouter();

  useEffect(() => {
    if (window.location.search && paragon) {
      let params = new URLSearchParams(window.location.search);
      if (params.get("code")) {
         paragon.completeInstall("shopify", {
          authorizationCode: params.get("code"),
          redirectUrl: "https://w4tdtq-3000.csb.app/integrations/shopify",
          integrationOptions: {
            SHOP_NAME: params.get("shop").split(".myshopify.com")[0],
          },
          showPortalAfterInstall: true
        }).then(() => {
           router.push('/integrations?shopify_install=true');
        });
      }
    }
  }, [paragon]);

  return "Connecting..."
};