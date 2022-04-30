import { useCallback, useEffect, useState } from "react";

export default function useGoogleGlobal() {
  const [gisReady, setGisReady] = useState(false);
  const [tokenClient, setTokenClient] = useState("")

  const gisLoaded = useCallback(async () => {
    // tokenClient = google.accounts.oauth2.initTokenClient({
    //   client_id: '790369129761-b6u1cdp6jgg6lvg8lvpvdja008nm9btr.apps.googleusercontent.com',
    //   scope: 'https://www.googleapis.com/auth/drive',
    //   callback: setTokenClient, // defined later
    // });

    setGisReady(true);

  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !gisReady) {
      if (window.google) {
        gisLoaded();
      } else {
        // load gis
        const gisSrc = document.createElement("script");
        gisSrc.src = "https://accounts.google.com/gsi/client";
        gisSrc.onload = gisLoaded;
        document.body.appendChild(gisSrc);
      }
    }
  }, [gisReady, gisLoaded]);

  if (gisReady && window.google) {
    return window.google;
  }

  return undefined;

}
