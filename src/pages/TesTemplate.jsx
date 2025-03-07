import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import { Viewer, TextLayer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { pdfjs } from 'pdfjs-dist';

// Import the styles
import { Worker } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const TesTemplate = () => {


  const viewer = useRef(null);
  const newPlugin = defaultLayoutPlugin()
  const jsonData = {
    nomorSurat: "Tes Mbah BMN",
  };

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    // If you prefer to use the Iframe implementation, you can replace this line with: WebViewer.Iframe(...)
    WebViewer.WebComponent(
      {
        path: "/lib",
        initialDoc: "/contoh_laporan.pdf",
        licenseKey:
          "demo:1720496789493:7f83802803000000004e54129f2f3719a3c9f13bf36126a9140bf4c7e0", // sign up to get a free trial key at https://dev.apryse.com
      },
      viewer.current
    ).then((instance) => {
      //   instance.UI.loadDocument("/DokumenBMN.docx");

      const { documentViewer, annotationManager } = instance.Core;
      annotationManager.enableReadOnlyMode();

      documentViewer.addEventListener("documentLoaded", async () => {
        const doc = documentViewer.getDocument();
        documentViewer.updateView();
        // await doc.applyTemplateValues(jsonData);
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="webviewer" ref={viewer}></div>
      <Worker
        workerUrl={
          "/pdf.worker.min.js"
        }
      >  <div className="w-full h-[80vh]">
    <Viewer fileUrl={"/contoh_laporan.pdf"} plugins={[newPlugin]}>
      {(viewer) => {
        try {
          return <TextLayer />;
        } catch (error) {
          console.error(error);
          return null;
        }
      }}
    </Viewer>
  </div>
</Worker>
    </div>
  );
};

export default TesTemplate;
