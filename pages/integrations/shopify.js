import { useEffect } from 'react';
import useParagon from "../../hooks/useParagon";

export default function InstallShopify({ paragonUserToken }) {
  const { user, paragon } = useParagon(paragonUserToken);

  useEffect(() => {
    if (window.location.search && paragon) {
      let params = new URLSearchParams(window.location.search);
      if (params.get("code")) {
         paragon.completeInstall("shopify", {
          authorizationCode: params.get("code"),
          redirectUrl: "https://w4tdtq-3000.csb.app/integrations/shopify",
          SHOP_NAME: params.get("shop"),
          showPortalAfterInstall: true
        });
      }
    }
  }, [paragon]);

  return "Connecting..."
};