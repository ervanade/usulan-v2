import React from "react";
import Card from "../components/Card/Card";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import ContohLaporan from "../assets/contoh_laporan.pdf";

const LaporanPreview = () => {
  return (
    <Card>
      <Breadcrumb pageName="Preview Laporan" />
      <object
        width="100%"
        height="1000"
        data={ContohLaporan}
        type="application/pdf"
      >
        {" "}
      </object>
    </Card>
  );
};

export default LaporanPreview;
