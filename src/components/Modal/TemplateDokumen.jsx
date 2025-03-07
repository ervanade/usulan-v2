import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import { json, useNavigate, useParams } from "react-router-dom";
import { dataDistribusiBekasi } from "../../data/data";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

const TemplateDokumen = () => {
  const viewer = useRef(null);
  const { id } = useParams();
  const [jsonData, setJsonData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = dataDistribusiBekasi.find((a) => a.id === parseInt(id));
    if (!data) {
      navigate("/not-found");
    }
    setJsonData({
      nomorSurat: new Date().toISOString().substring(0, 10),
      tanggal: new Date().toISOString().substring(0, 10),
      kecamatan: data.kecamatan,
      puskesmas: data.Puskesmas,
      namaKapus: data.nama_kapus,
      nipKapus: "nip.121212",
      namaBarang: data.nama_barang,
      jumlahDikirim: data.jumlah_barang_dikirim.toString(),
      jumlahDiterima: data.jumlah_barang_diterima.toString(),
      tte: "",
      tteDaerah: {
        image_url:
          "https://www.shutterstock.com/image-vector/fake-autograph-samples-handdrawn-signatures-260nw-2332469589.jpg",
        width: 50,
        height: 50,
      },
      ket_daerah: "",
      ket_ppk: data.keterangan_ppk,
    });
  }, []);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    // If you prefer to use the Iframe implementation, you can replace this line with: WebViewer.Iframe(...)
    if (jsonData) {
      WebViewer.WebComponent(
        {
          path: "/lib",
          initialDoc: "/DokumenBMN.docx",
          licenseKey:
            "demo:1720496789493:7f83802803000000004e54129f2f3719a3c9f13bf36126a9140bf4c7e0", // sign up to get a free trial key at https://dev.apryse.com
        },
        viewer.current
      ).then(async (instance) => {
        //   instance.UI.loadDocument("/DokumenBMN.docx");

        const { documentViewer } = instance.Core;
        // instance.UI.disableFeatures(instance.UI.Feature.Annotations);

        documentViewer.addEventListener("documentLoaded", async () => {
          const doc = documentViewer.getDocument();
          documentViewer.zoomTo(1);
          documentViewer.updateView();
          await doc.applyTemplateValues(jsonData);
        });
      });
    }
  }, [jsonData]);

  return (
    <div className="App">
      <Breadcrumb
        pageName={`Dokumen BMN ${jsonData?.nomorSurat}`}
        back={true}
        tte={true}
        jsonData={jsonData}
      />

      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default TemplateDokumen;
