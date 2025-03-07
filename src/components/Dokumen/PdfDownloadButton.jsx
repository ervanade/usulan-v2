import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaDownload } from "react-icons/fa";
import Dokumen from "./Dokumen";

const PDFDownloadButton = ({ jsonData }) => {
  return (
    <div className="flex justify-end items-center">
      <PDFDownloadLink
        document={<Dokumen jsonData={jsonData} />}
        fileName={`Dokumen_${jsonData?.nomorSurat}.pdf`}
        className="flex justify-center items-center bg-teal-500 text-white px-4 py-2 rounded-md"
      >
        {({ loading }) =>
          loading ? (
            "Loading dokumen..."
          ) : (
            <>
              <FaDownload size={16} className="mr-2" />
              <span>Download Dokumen</span>
            </>
          )
        }
      </PDFDownloadLink>
    </div>
  );
};

export default PDFDownloadButton;
