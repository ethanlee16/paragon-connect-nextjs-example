import { useEffect, useCallback, useState } from "react";
import Layout from "../components/Layout";
import useParagon from "../hooks/useParagon";
import useDrivePicker from "react-google-drive-picker";
import styles from "../styles/file-picker.module.css";

export default function Picker({ paragonUserToken }) {
  const { paragon } = useParagon(paragonUserToken);
  const [token, setToken] = useState(null);
  const [openPicker] = useDrivePicker();

  useEffect(() => {
    if (paragon && paragon.getUser().authenticated) {
      paragon
        .getIntegrationAccount("googledrive", {
          includeAccountAuth: true,
        })
        .then((credential) => {
          setToken(credential.accountAuth.OAUTH_ACCESS_TOKEN);
        });
    }
  }, [paragon]);

  const handleOpenPicker = useCallback(() => {
    openPicker({
      developerKey: "AIzaSyAsZJT9LjAqfxzYe9V8k8jjXnwkzwuk7CQ",
      token,
      viewId: "DOCS",
      setIncludeFolders: true,
      setSelectFolderEnabled: true,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        if (data.action === "picked") {
          // Do something with data.docs
          console.log(data);
        }
      },
    });
  }, [token]);

  return (
    <Layout title="FilePicker">
      <section className="todoapp">
        {token ? (
          <button className={styles.button} onClick={() => handleOpenPicker()}>
            Select Files
          </button>
        ) : (
          <div>Loading...</div>
        )}
      </section>
    </Layout>
  );
}
