import { useCallback, useEffect, useState } from "react";

export default function useGoogleGlobal(googleToken) {
  const [gapiReady, setGapiReady] = useState(false);

  const gapiLoaded = useCallback(async () => {
    gapi.load('picker', setGapiReady(true));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !gapiReady) {
      if (window.gapi) {
        gapiLoaded();
      } else {
        // load gapi
        const gapiSrc = document.createElement("script");
        gapiSrc.src = "https://apis.google.com/js/api.js";
        gapiSrc.onload = gapiLoaded;
        document.body.appendChild(gapiSrc);
      }
    }
  }, [gapiReady, gapiLoaded]);

  if (gapiReady && window.gapi) {
    return window.gapi;
  }

  return undefined;

}
