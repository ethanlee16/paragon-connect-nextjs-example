import { useCallback, useEffect, useState } from "react";

export default function useParagon(paragonUserToken) {
  const [user, setUser] = useState({ authenticated: false });
  const [error, setError] = useState();
  const [paragonReady, setParagonReady] = useState(false);

  const initParagon = useCallback(async () => {
    if (paragonUserToken) {
      await paragon.authenticate(
        process.env.NEXT_PUBLIC_PARAGON_PROJECT_ID,
        paragonUserToken,
      );
      setParagonReady(true);
    }
  }, [paragonUserToken]);

  useEffect(() => {
    if (typeof window !== "undefined" && !paragonReady) {
      if (window.paragon) {
        initParagon();
      } else {
        const paragonSrc = document.createElement("script");
        paragonSrc.src =
          "https://ocho-connect.paragonsandbox.com/ui/scripts/sdk.js";
        paragonSrc.onload = initParagon;
        document.body.appendChild(paragonSrc);
      }
    }
  }, [paragonReady, initParagon]);

  const updateUser = useCallback(() => {
    const authedUser = paragon.getUser();
    if (authedUser.authenticated) {
      setUser({ ...authedUser });
    }
  }, []);

  // Listen for account state changes
  useEffect(() => {
    if (paragonReady) {
      paragon.subscribe("onIntegrationInstall", updateUser);
      paragon.subscribe("onIntegrationUninstall", updateUser);
    }
    return () => {
      paragon.unsubscribe("onIntegrationInstall", updateUser);
      paragon.unsubscribe("onIntegrationUninstall", updateUser);
    };
  }, [paragonReady]);

  return {
    paragon: paragonReady ? window.paragon : undefined,
    user,
    error,
    updateUser,
    initParagon,
  };
}
