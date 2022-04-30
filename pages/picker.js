import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import TodoApp from "../components/TodoApp";
import TodoModel from "../components/TodoModel";
import useGoogleGlobal from "../hooks/useGoogleGlobal";
import useParagonGlobal from "../hooks/useParagonGlobal";
import useGapiGlobal from "../hooks/useGapiGlobal";
import useDrivePicker from 'react-google-drive-picker'
import styles from "../styles/file-picker.module.css";



export default function Home({ user, paragonUserToken }) {
  const paragon = useParagonGlobal(paragonUserToken);
  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    openPicker({
      // from Paragon SDK
      clientId: "790369129761-b6u1cdp6jgg6lvg8lvpvdja008nm9btr.apps.googleusercontent.com",
      // from developer JS env
      developerKey: "AIzaSyAsZJT9LjAqfxzYe9V8k8jjXnwkzwuk7CQ",
      // token from Paragon SDK
      token: "ya29.a0AfB_byCzHTEDEXHNje_zisJgysZ1txzvs5R61gEu7SZz-tQ33-EBpUlEWCZA0ejs7aEZ5Ar3FuvfM_6JCNuLCwiIhqpk3RVoPDIw4yvktCwvB3R27VzHqBh3ORgFnB8pk7C8qz-wtw1wHD1rByG0H285QOxXXKxX-BDBc497MAaCgYKAacSARISFQHsvYlsEhpp7uBT7atwvhHad24BPg0177",
      viewId: "DOCS",
      setIncludeFolders: true,
      setSelectFolderEnabled: true,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        if (data.action === 'picked') {

          // Downloading just one file
          if (data.docs.length === 1 && data.docs[0].type != "folder"){
            const toParagon = paragon.event("Drive_file", {
              "fileId": data.docs[0].id
            }); 
            toParagon.then((data) => {
              console.log(data)
            })
          } else {

            // attempting to do recursive
            fetch('https://zeus.useparagon.com/projects/d1074003-ae31-4d0d-86df-1e9d4e1714dd/sdk/triggers/0a9b54f6-3246-4a00-90e2-ca4b934673ec', {
              method: "POST",
              body: JSON.stringify({
                "docs": data.docs,
              }),
              headers: {
                "Authorization": `Bearer ${paragonUserToken}`,
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err.message);
            });

          }
        } // picked
      },
    })
  }



  return (
    <Layout title="FilePicker">
      <section className="todoapp">
        <button className={styles.button} onClick={() => handleOpenPicker()}>Select Files</button>
      </section>
    </Layout>
  );
}
