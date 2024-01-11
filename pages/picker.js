import { useEffect, useCallback, useRef, useState } from "react";
import Layout from "../components/Layout";
import useParagon from "../hooks/useParagon";
import styles from "../styles/file-picker.module.css";

export default function Picker({ paragonUserToken }) {
  const { paragon } = useParagon(paragonUserToken);
  const [loadedPicker, setLoadedPicker] = useState(false);
  const picker = useRef(null);

  useEffect(() => {
    if (paragon && paragon.getUser().authenticated) {
      picker.current = new paragon.ExternalFilePicker("googledrive", {
        onFileSelect(files) {
          console.log("User selected files", files);
        },
      });
      picker.current
        .init({
          developerKey: "AIzaSyBMs728KLQ1XkkKn6bfGEPTe9OalXOw27A",
        })
        .then(() => {
          setLoadedPicker(true);
        });
    }
  }, [paragon]);

  return (
    <Layout title="FilePicker">
      <section className="todoapp">
        {loadedPicker ? (
          <button
            className={styles.button}
            onClick={() => picker.current.open()}
          >
            Select Files
          </button>
        ) : (
          <div>Loading...</div>
        )}
      </section>
    </Layout>
  );
}
