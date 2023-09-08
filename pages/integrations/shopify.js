import { useEffect } from 'react';
import { useRouter } from 'next/router';

import useParagon from "../../hooks/useParagon";

// The URL of your Shhopfy Redirect Page
const SHOPIFY_REDIRECT_URL = "https://w4tdtq-3000.csb.app/integrations/shopify";

export default function InstallShopify({ paragonUserToken }) {
  const { paragon } = useParagon(paragonUserToken);
  const router = useRouter();

  // Shopify Redirect Callback implementation
  useEffect(() => {
    if (window.location.search && paragon) {
      let params = new URLSearchParams(window.location.search);
      let authorizationCode = params.get("code");
      let [, shopName] = params.get("shop").match(/^([a-zA-Z0-9][a-zA-Z0-9\-]*)\.myshopify\.com/);

      if (authorizationCode && shopName) {
         paragon.completeInstall("shopify", {
          authorizationCode: authorizationCode,
          redirectUrl: SHOPIFY_REDIRECT_URL,
          integrationOptions: {
            SHOP_NAME: shopName,
          }
        }).then(() => {
           router.push('/integrations?shopify_install=true');
        });
      } else {
        let error = params.get("error");
        // Handle error
      }
    }
  }, [paragon]);

  return "Connecting..."
};