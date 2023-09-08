import { useEffect } from 'react';
import Layout from "../../components/Layout";
import useParagon from "../../hooks/useParagon";
import styles from "../../styles/Integrations.module.css";

const SHOPIFY_CLIENT_ID = '9816ebc9a91fa843d80505b8e56ca19e';
const SHOPIFY_SCOPES = 'read_content read_fulfillments read_script_tags write_fulfillments';
const REDIRECT_URL = 'https://w4tdtq-3000.csb.app/integrations/shopify';

export default function Integrations({ paragonUserToken }) {
  const { user, paragon, initParagon } = useParagon(paragonUserToken);

  useEffect(() => {
    let handler = (event) => {
      console.log(event.data);
      if (event.data.type === "COMPLETE_INSTALL") {
        initParagon();
      }
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [initParagon]);

  useEffect(() => {
    if (window.location.search) {
      let params = new URLSearchParams(window.location.search);
      if (params.get("shop")) {
        window.location = `https://${params.get("shop")}.myshopify.com/admin/oauth/authorize?client_id=${SHOPIFY_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SHOPIFY_SCOPES}`;
      }
      if (params.get("pipedrive_install") && paragon) {
        paragon.connect("pipedrive");
      }
      if (params.get("shopify_install") && paragon) {
        paragon.connect("shopify");
      }
    }
  }, [paragon]);

  return (
    <Layout title="Integrations">
      <div className={styles.container}>
        {paragon?.getIntegrationMetadata().map((integration) => {
          // Check the user state if this integration is enabled for the user
          const integrationEnabled =
            user.authenticated && user.integrations[integration.type]?.enabled;

          return (
            <div key={integration.type} className={styles.row}>
              <img src={integration.icon} style={{ maxWidth: "30px" }} />
              <p>{integration.name}</p>

              {/* When clicked, display the Connect Portal for this integration */}
              <button onClick={() => {
                if (integration.type === "pipedrive") {
                  paragon.connect("pipedrive", {
                    overrideRedirectUrl: "https://w4tdtq-3000.csb.app/integrations/pipedrive"
                  });
                } else {
                  paragon.connect(integration.type);
                }
              }}>
                {integrationEnabled ? "Manage" : "Enable"}
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
