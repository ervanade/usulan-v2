import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  View,
  Text,
  PDFViewer,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import {
  Document as DocumentPreview,
  Page as PagePreview,
  pdfjs,
} from "react-pdf";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import ReactDOMServer from "react-dom/server";
import moment from "moment";
import "moment/locale/id";
import Html from "react-pdf-html";
import { dataDistribusiBekasi } from "../../data/data";
import { Link, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import {
  DataTableCell,
  Table,
  TableBody,
  TableCell,
  TableHeader,
} from "@david.kucsai/react-pdf-table";
import { TableRow } from "@david.kucsai/react-pdf-table/lib/TableRow";
import { useMediaQuery } from "react-responsive";
import ModalTTE from "../../components/Modal/ModalTTE";
import { decryptId } from "../../data/utils";
import axios from "axios";
import { useSelector } from "react-redux";
import { CgSpinner } from "react-icons/cg";
import HeaderDokumen from "../../components/Title/HeaderDokumen";
import { RenderBarangPages } from "../../components/Table/TableLampiran";
import { RenderHibahPages } from "../../components/Table/TableHibah";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { PDFDocument } from "pdf-lib";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
// Import the main component
import { Viewer, TextLayer, Worker, LoadError } from "@react-pdf-viewer/core";
import { pdfjs as PdfJs } from "pdfjs-dist";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { useResizeObserver } from "@wojtekmaj/react-hooks";
import Swal from "sweetalert2";
import GenerateDokumen from "../../components/Dokumen/GenerateDokumen";
import { MdWarning } from "react-icons/md";

// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const resizeObserverOptions = {};

const maxWidth = 800;

const PreviewDokumen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((a) => a.auth.user);
  const [jsonData, setJsonData] = useState(null);
  const [getLoading, setGetLoading] = useState(false);
  var today = new Date();
  const defaultDate = today.toISOString().substring(0, 10);
  const [showModal, setShowModal] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 500 }); // adjust the max width to your desired breakpoint
  const [pdfUrl, setPdfUrl] = useState(null); // Replace with your API link
  const [pdfBlob, setPdfBlob] = useState(null); // Replace with your API link
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState();

  const onResize = useCallback((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);
  const newPlugin = defaultLayoutPlugin();
  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const onLoadError = () => {
    setError(true);
  };
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 450) {
        setScale(0.5);
      } else if (width < 768) {
        setScale(0.7);
      } else if (width < 1366) {
        setScale(1);
      } else {
        setScale(1.2);
      }
    };

    // Set scale on component mount
    updateScale();

    // Add event listener for window resize
    window.addEventListener("resize", updateScale);

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", updateScale);
  }, []);
  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));

  const handleTTE = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const iframeRef = useRef(null);
  const [isIFrameLoaded, setIsIFrameLoaded] = useState(false);

  const defaultImage =
    "https://media.istockphoto.com/id/1472819341/photo/background-white-light-grey-total-grunge-abstract-concrete-cement-wall-paper-texture-platinum.webp?b=1&s=170667a&w=0&k=20&c=yoY1jUAKlKVdakeUsRRsNEZdCx2RPIEgaIxSwQ0lS1k=";

  const fetchDokumenData = async () => {
    setGetLoading(true);
    Swal.fire({
      title: "Generate dokumen...",
      text: "Tunggu Sebentar Dokumen Disiapkan...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      // eslint-disable-next-line
      const responseUser = await axios({
        method: "get",
        url: `${
          import.meta.env.VITE_APP_API_URL
        }/api/dokumen/${encodeURIComponent(decryptId(id))}`,
        headers: {
          "Content-Type": "application/json",
          //eslint-disable-next-line
          Authorization: `Bearer ${user?.token}`,
        },
      }).then(async function (response) {
        // handle success
        // console.log(response)
        const data = response.data.data;
        setJsonData({
          nama_dokumen: data.nama_dokumen || "",
          id: data.id,
          nomorSurat: data.nomor_bast || "",
          tanggal: data.tanggal_bast || defaultDate,
          tanggal_tte_ppk: data.tanggal_tte_ppk || defaultDate,
          tanggal_tte_daerah: data.tanggal_tte_daerah || defaultDate,
          kecamatan: data.kecamatan,
          puskesmas: data.Puskesmas,
          file_dokumen: data.file_dokumen || null,
          namaKapus: data.nama_kapus,
          provinsi: data.provinsi || "",
          kabupaten: data.kabupaten || "",
          penerima_hibah: data.penerima_hibah || "",
          kepala_unit_pemberi: data.kepala_unit_pemberi || "",
          distribusi: data.distribusi || [],
          nipKapus: "nip.121212",
          namaBarang: data.nama_barang,
          status_tte: data.status_tte || "",
          jumlahDikirim: "24",
          jumlahDiterima: "24",
          tte: "",
          tteDaerah: {
            image_url:
              "https://www.shutterstock.com/image-vector/fake-autograph-samples-handdrawn-signatures-260nw-2332469589.jpg",
            width: 50,
            height: 50,
          },
          ket_daerah: "",
          ket_ppk: data.keterangan_ppk,
          tte_daerah: data.tte_daerah || defaultImage,
          nama_daerah: data.nama_daerah || "",
          nip_daerah: data.nip_daerah || "",
          tte_ppk: data.tte_ppk || defaultImage,
          nama_ppk: data.nama_ppk || "",
          nip_ppk: data.nip_ppk || "",
          total_barang_dikirim: data.total_barang_dikirim || "",
          total_harga: data.total_harga || "",
        });
        if (data?.file_dokumen) {
          setPdfUrl(data?.file_dokumen);
          Swal.close();
          setGetLoading(false);
          return;
        }
        const dataJson = {
          nama_dokumen: data.nama_dokumen || "",
          id: data.id,
          nomorSurat: data.nomor_bast || "",
          tanggal: data.tanggal_bast || defaultDate,
          tanggal_tte_ppk: data.tanggal_tte_ppk || defaultDate,
          tanggal_tte_daerah: data.tanggal_tte_daerah || defaultDate,
          kecamatan: data.kecamatan,
          puskesmas: data.Puskesmas,
          namaKapus: data.nama_kapus,
          provinsi: data.provinsi || "",
          kabupaten: data.kabupaten || "",
          penerima_hibah: data.penerima_hibah || "",
          kepala_unit_pemberi: data.kepala_unit_pemberi || "",
          distribusi: data.distribusi || [],
          nipKapus: "nip.121212",
          namaBarang: data.nama_barang,
          status_tte: data.status_tte || "",
          jumlahDikirim: "24",
          jumlahDiterima: "24",
          tte: "",
          tteDaerah: {
            image_url:
              "https://www.shutterstock.com/image-vector/fake-autograph-samples-handdrawn-signatures-260nw-2332469589.jpg",
            width: 50,
            height: 50,
          },
          ket_daerah: "",
          ket_ppk: data.keterangan_ppk,
          tte_daerah: data.tte_daerah || defaultImage,
          nama_daerah:
            user?.role == "3"
              ? data.nama_daerah || user?.name || ""
              : data.nama_daerah || "",
          nip_daerah:
            user?.role == "3"
              ? data.nip_daerah || user?.nip || ""
              : data.nip_daerah || "",
          tte_ppk: data.tte_ppk || defaultImage,
          nama_ppk:
            user?.role == "4"
              ? data.nama_ppk || user?.name || ""
              : data.nama_ppk || "",
          nip_ppk:
            user?.role == "4"
              ? data.nip_ppk || user?.nip || ""
              : data.nip_ppk || "",
          total_barang_dikirim: data.total_barang_dikirim || "",
          total_harga: data.total_harga || "",
          file_dokumen: data.file_dokumen || null,
        };

        const pdfBlob = await GenerateDokumen(dataJson); // GenerateDokumen harus mengembalikan Blob PDF
        setPdfBlob(pdfBlob);

        setGetLoading(false);
        Swal.close();
      });
    } catch (error) {
      Swal.close();
      if (!jsonData) {
        navigate("/not-found");
      }

      console.log(error);
    }
  };
  useEffect(() => {
    fetchDokumenData();
    moment.locale("id");
  }, []);

  const renderError = (error) => {
    let message = "";
    setError(true);
    switch (error.name) {
      case "InvalidPDFException":
        message = "The document is invalid or corrupted";
        break;
      case "MissingPDFException":
        message = "The document is missing";
        break;
      case "UnexpectedResponseException":
        message = "Unexpected server response";
        break;
      default:
        message = "Cannot load the document";
        break;
    }
  };

  useEffect(() => {
    jsonData ? setIsIFrameLoaded(true) : "";
    // const iframeCurrent = iframeRef.current;

    // const handleLoad = () => setIsIFrameLoaded(true);

    // if (iframeCurrent) {
    //   iframeCurrent.addEventListener("load", handleLoad);
    // }

    // return () => {
    //   if (iframeCurrent) {
    //     iframeCurrent.removeEventListener("load", handleLoad);
    //   }
    // };
  }, [jsonData]);

  Font.register({
    family: "Arial",
    fonts: [
      {
        src: "/fonts/ARIAL.TTF",
        fontWeight: 400,
      },
      {
        src: "/fonts/ARIALBD.TTF",
        fontWeight: 700,
      },
    ],
  });

  const BORDER_COLOR = "#000";
  const BORDER_STYLE = "solid";
  const COL1_WIDTH = 5;
  const COLN_WIDTH = (100 - COL1_WIDTH) / 8;

  const styles = StyleSheet.create({
    viewer: {
      width: "100%", //the pdf viewer will take up all of the width and height
      height: (window.innerHeight * 4) / 5,
    },
    page: {
      fontSize: 11,
      paddingTop: 30,
      paddingLeft: 60,
      paddingRight: 60,
      lineHeight: 1.5,
      flexDirection: "column",
    },
    logo: {
      width: 74,
      height: 66,
      marginLeft: "auto",
      marginRight: "auto",
    },
    titleContainer: {
      flexDirection: "row",
      marginTop: 24,
      display: "flex",
      width: "100%",
      fontFamily: "Arial",
      justifyContent: "space-between",
    },
    reportTitle: {
      fontFamily: "Arial",
      color: "#000",
      fontSize: 11,
      fontWeight: "normal",
      width: "50%",
      letterSpacing: 0.3,
      lineHeight: 1.7,
      textAlign: "left",
    },
    docContainer: {
      marginTop: 24,
      width: "100%",
    },
    docContainerBorder: {
      flexDirection: "column",
      marginTop: 16,
      border: 1,
      borderWidth: 1.5,
      display: "flex",
      width: "100%",
      height: 800,
      paddingVertical: "24px",
      paddingLeft: "10px",
      paddingRight: "16px",
    },
    ttdContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      //   alignItems: "flex-start",
      marginTop: 24,
      display: "flex",
      width: "100%",
    },
    text: {
      color: "#000",
      fontSize: 10,
      lineHeight: 1.5,
      fontWeight: "normal",
      textAlign: "left",
      fontFamily: "Arial",
      textOverflow: "clip",
    },
    textBold: {
      color: "#000",
      fontSize: 10,
      lineHeight: 1.5,
      fontWeight: "bold",
      textAlign: "left",
      fontFamily: "Arial",
    },
    textBoldTitle: {
      color: "#000",
      fontSize: 10,
      lineHeight: 1.5,
      fontWeight: "bold",
      textAlign: "center",
      fontFamily: "Arial",
      marginBottom: 24,
    },
    imageTtd: {
      width: 50,
      height: 50,
      marginLeft: 90,
    },
    TableHeader: {
      color: "#000",
      fontSize: 10,
      lineHeight: 1.5,
      textAlign: "center",
      fontFamily: "Arial",
      verticalAlign: "middle",
      paddingVertical: 5,
    },
    TableRow: {
      color: "#000",
      fontSize: 10,
      lineHeight: 1,
      textAlign: "center",
      fontFamily: "Arial",
      verticalAlign: "middle",
      paddingVertical: 5,
    },
    table: {
      display: "table",
      width: "auto",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
      textAlign: "center",
      verticalAlign: "middle",
    },
    tableCol1Header: {
      width: COL1_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderBottomColor: "#000",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      textAlign: "center",
      verticalAlign: "middle",
    },
    tableColHeader: {
      width: COLN_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderBottomColor: "#000",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      textAlign: "center",
      verticalAlign: "middle",
    },
    tableCol1: {
      width: COL1_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      textAlign: "center",
      verticalAlign: "middle",
    },
    tableCol: {
      width: COLN_WIDTH + "%",
      borderStyle: BORDER_STYLE,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      textAlign: "center",
      verticalAlign: "middle",
    },
    tableCellHeader: {
      margin: 5,
      fontSize: 10,
      lineHeight: 1.2,
      fontWeight: 500,
      textAlign: "center",
      verticalAlign: "middle",
    },
    tableCell: {
      margin: 5,
      fontSize: 10,
      lineHeight: 1,
      textAlign: "center",
      verticalAlign: "middle",
    },
  });

  const handleSwalLoading = (loading) => {
    if (loading) {
      Swal.fire({
        title: "Generate dokumen...",
        text: "Tunggu Sebentar Dokumen Disiapkan...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Tampilkan loading spinner
        },
      });
    } else {
      Swal.close(); // Tutup swal ketika loading selesai
    }
  };
  if (getLoading) {
    return (
      <div className="flex justify-center items-center">
        <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  const dataBarang =
    jsonData?.distribusi?.detail_distribusi?.map((distribusi, index) => ({
      no: index + 1 || "",
      namaBarang: distribusi.jenis_alkes || "",
      merk: distribusi.merk || "",
      nomorBukti: distribusi.nomor_bukti || "",
      jumlah: distribusi.jumlah_total || "",
      jumlah_dikirim: distribusi.jumlah_dikirim || "",
      jumlah_diterima: distribusi.jumlah_diterima || "",
      hargaSatuan: distribusi.harga_satuan || "",
      jumlahNilai: `Rp. ${distribusi.jumlah_total || ""}` || "",
      keterangan: distribusi.keterangan || "",
    })) || [];

  const Dokumen = () => (
    <Document title={`Dokumen ${jsonData?.nomorSurat}`}>
      <Page size="FOLIO" style={styles.page}>
        {/* <View style={styles.titleContainer}>
          <Text style={{ ...styles.reportTitle, width: "40%" }}></Text>
          <Text style={{ ...styles.reportTitle, width: "50%" }}>
            LAMPIRAN{"\n"}SURAT EDARAN{"\n"}NOMOR HK.02.02/A/1902/2024{"\n"}
            TENTANG PEDOMAN PENGELOLAAN{"\n"}BARANG MILIK NEGARA YANG SEJAK
            {"\n"}AWAL DISERAHKAN KEPADA{"\n"}MASYARAKAT/PEMERINTAH DAERAH{"\n"}
            DI LINGKUNGAN KEMENTERIAN{"\n"}KESEHATAN
          </Text>
        </View>
        <View style={styles.docContainer}>
          <Text style={styles.text}>
            A. Format I Berita Acara dan Daftar BMN
          </Text>
        </View> */}
        <View
          style={{
            ...styles.docContainerBorder,
            paddingHorizontal: 24,
            paddingVertical: 16,
          }}
        >
          {/* <Text
            style={{ ...styles.text, textAlign: "center", marginBottom: 24 }}
          >
            --------------------------------------------Kop----------------------------------------
          </Text> */}
          <View
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Image
              style={{
                width: "490px",
                height: "96px",
                // marginVertical: 16,
              }}
              src="/kop_surat1.png"
            />
          </View>
          <Text
            style={{
              ...styles.textBoldTitle,
              marginBottom: 32,
              lineHeight: 1.8,
            }}
          >
            BERITA ACARA SERAH TERIMA OPERASIONAL {"\n"} BARANG MILIK NEGARA{" "}
            {"\n"} ANTARA {"\n"}
            KEMENTERIAN KESEHATAN {"\n"} DENGAN {"\n"} DINAS KESEHATAN
            {jsonData?.kabupaten} {"\n"} NOMOR {jsonData?.nomorSurat} {"\n"}
            TENTANG {"\n"} HIBAH BARANG MILIK NEGARA YANG DARI SEJAK AWAL
            DISERAHKAN KEPADA {"\n"}
            MASYARAKAT/PEMERINTAH {"\n"} DAERAH DINAS KESEHATAN{" "}
            {jsonData?.kabupaten}
          </Text>
          <Text style={styles.text}>
            Dalam rangka pengelolaan Barang Milik Negara (BMN) yang dari awal
            untuk diserahkan kepada Masyarakat/Pemerintah Daerah berupa BMN{" "}
            {jsonData?.namaBarang} (dengan rincian terlampir), maka PIHAK KESATU
            dalam hal ini {jsonData?.kepala_unit_pemberi} yang diwakili oleh{" "}
            {jsonData?.nama_ppk} berdasarkan Kontrak Pengadaan Nomor{" "}
            {jsonData?.nomorSurat} tanggal {jsonData?.tanggal} dan PIHAK KEDUA
            dalam hal ini Masyarakat/Pemerintah Daerah yang diwakili oleh Kepala
            Dinas Kesehatan {jsonData?.kabupaten}
            {"\n"}
            Berita Acara Serah Terima Operasional (BASTO) dibuat dan
            ditandatangani oleh PIHAK KESATU dan PIHAK KEDUA pada hari tanggal{" "}
            {moment(jsonData?.tanggal_tte_ppk || defaultDate).format(
              "d",
              "id"
            )}{" "}
            bulan{" "}
            {moment(jsonData?.tanggal_tte_ppk || defaultDate).format(
              "MM",
              "id"
            )}{" "}
            tahun{" "}
            {moment(jsonData?.tanggal_tte_ppk || defaultDate).format(
              "yyyy",
              "id"
            )}
            {" ("}
            {moment(jsonData?.tanggal_tte_ppk || defaultDate).format(
              "D-MM-YYYY",
              "id"
            )}
            {") "}
            sebagaimana tersebut di atas.
          </Text>
          <Text style={{ ...styles.text, marginTop: 8 }}>Berdasarkan :</Text>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "row",
              marginTop: 8,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 32 }}>1.</Text>
            <Text style={{ marginRight: 32 }}>
              Undang-Undang Nomor 1 Tahun 2004 tentang Perbendaharaan Negara
              (Lembaran Negara Republik Indonesia Tahun 2004 Nomor 5, Tambahan
              Lembaran NegaraRepublik Indonesia Nomor 4355);
            </Text>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "row",
              marginTop: 8,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 32 }}>2.</Text>
            <Text style={{ marginRight: 32 }}>
              Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan
              Barang Milik Negara/Daerah (Lembaran Negara Republik Indonesia
              Tahun 2014 Nomor 92, Tambahan Lembaran Negara Republik Indonesia
              Nomor 5533) sebagaimana telah diubah dengan Peraturan Pemerintah
              Nomor 28 Tahun 2020 tentang Perubahan atas Peraturan Pemerintah
              Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah
              (Lembaran Negara Republik Indonesia Tahun 2020 Nomor 142, Tambahan
              Lembaran Negara Republik Indonesia Nomor 6523);
            </Text>
          </View>

          {/* <View style={styles.ttdContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.textBold}>PIHAK KESATU</Text>
              <Text style={styles.text}>Kementerian Kesehatan {jsonData?.kepala_unit_pemberi || ""}</Text>
              <Image
                style={{ ...styles.imageTtd, marginVertical: 16 }}
                src={jsonData?.tte_ppk}
              />
              <Text style={{ marginTop: 8 }}>
                Nama : {jsonData?.nama_ppk || ""} {"\n"}
                NIP : {jsonData?.nip_ppk || ""}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.textBold}>PIHAK KEDUA</Text>
              <Text style={styles.text}>
                Kepala Dinas Kesehatan {jsonData?.kabupaten || ""}
                {jsonData?.puskesmas}
              </Text>
              <Image
                style={{ ...styles.imageTtd, marginVertical: 8 }}
                src={jsonData?.tte_daerah}
              />
              <Text style={{ marginTop: 8 }}>
                Nama : {jsonData?.penerima_hibah || ""} {"\n"}
                NIP : {jsonData?.nip_daerah || ""}
              </Text>
            </View>
          </View> */}
        </View>
      </Page>

      <Page size="FOLIO" style={styles.page}>
        <View
          style={{
            ...styles.docContainerBorder,
            paddingHorizontal: 24,
            paddingVertical: 16,
            height: 800,
          }}
        >
          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "row",
              marginTop: 8,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 32 }}>3.</Text>
            <Text style={{ marginRight: 32 }}>
              Peraturan Menteri Keuangan Nomor 111/PMK.06/2016 tentang Tata Cara
              Pelaksanaan Pemindahtanganan Barang Milik Negara (Berita Negara
              Republik Indonesia Tahun 2016 Nomor 1018) sebagaimana telah diubah
              dengan Peraturan Menteri Keuangan Nomor 165/PMK.06/2021 tentang
              Perubahan atas Peraturan Menteri Keuangan Nomor 111/PMK.06/2016
              tentang Tata Cara Pelaksanaan Pemindahtanganan Barang Milik Negara
              (Berita Negara Republik Indonesia Tahun 2021 Nomor 1292);
            </Text>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "row",
              marginTop: 8,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 32 }}>4.</Text>
            <Text style={{ marginRight: 32 }}>
              Peraturan Menteri Keuangan Nomor 181/PMK.06/2016 tentang
              Penatausahaan Barang Milik Negara (Berita Negara Republik
              Indonesia Tahun 2016 Nomor 1817); dan
            </Text>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "row",
              marginTop: 8,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 32 }}>5.</Text>
            <Text style={{ marginRight: 32 }}>
              Keputusan Menteri Kesehatan Nomor HK.01.07/MENKES/155/2023 tentang
              Pendelegasian Sebagian Wewenang Menteri Kesehatan selaku Pengguna
              Barang kepada Pimpinan Tinggi Madya dan Kuasa Pengguna Barang
              dalam Pengelolaan Barang Milik Negara di Lingkungan Kementerian
              Kesehatan.
            </Text>
          </View>

          <Text
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              marginTop: 16,
              width: "100%",
            }}
          >
            Pada hari tanggal {jsonData?.tanggal.substring(8)} bulan{" "}
            {jsonData?.tanggal.substring(6, 7)} tahun{" "}
            {jsonData?.tanggal.substring(6, 7)} {jsonData?.tanggal}, telah
            dilakukan serah terima operasional hibah BMN dari PIHAK KESATU
            kepada PIHAK KEDUA dan PIHAK KEDUA menyatakan menerima hibah BMN
            tersebut yang selanjutnya disebut sebagai OBJEK HIBAH, dengan
            ketentuan sebagai berikut:{" "}
          </Text>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...styles.textBold,
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PASAL 1
            </Text>
            <Text
              style={{
                ...styles.text,
                textAlign: "left",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              Hibah BMN ini bertujuan untuk mendukung dan menunjang
              penyelenggaraan Tugas Pokok dan Fungsi Dinas Kesehatan
              {jsonData?.kabupaten || ""} dalam rangka meningkatkan pelayanan
              kesehatan kepada masyarakat.
            </Text>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...styles.textBold,
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PASAL 2
            </Text>
            <Text
              style={{
                ...styles.text,
                textAlign: "left",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              Jumlah barang yang dihibahkan adalah{" "}
              {jsonData?.total_barang_dikirim || ""} unit dan jumlah nilai
              perolehan sebesar Rp {jsonData?.dtotal_harga || ""} dengan rincian
              sebagaimana tercantum dalam lampiran, yang merupakan bagian tidak
              terpisahkan dari Berita Acara Serah Terima Operasional (BASTO)
              ini.
            </Text>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...styles.textBold,
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PASAL 3
            </Text>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 2,
                width: "100%",
              }}
            >
              <Text
                style={{
                  ...styles.text,
                  textAlign: "left",
                  lineHeight: 1.7,
                  letterSpacing: 0.1,
                }}
              >
                Dinas Kesehatan {jsonData?.kabupaten || ""} adalah sebagai
                penerima hibah atas
              </Text>
              <Text
                style={{
                  ...styles.textBold,
                  textAlign: "left",
                  lineHeight: 1.7,
                  letterSpacing: 0.1,
                }}
              >
                OBJEK HIBAH
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...styles.textBold,
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PASAL 4
            </Text>
            <Text
              style={{
                ...styles.text,
                textAlign: "left",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PIHAK KESATU dan PIHAK KEDUA menerangkan bahwa hibah ini dilakukan
              dengan syarat-syarat sebagai berikut:
            </Text>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>(1)</Text>
              <Text style={{ marginRight: 16 }}>
                status kepemilikan OBJEK HIBAH berpindah dari semula BMN pada
                Pemerintah Pusat menjadi Barang Milik Daerah (BMD) pada Dinas
                Kesehatan {jsonData?.kabupaten || ""}{" "}
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>(2)</Text>
              <Text style={{ marginRight: 16 }}>
                PIHAK KEDUA mempergunakan OBJEK HIBAH sesuai dengan peruntukan
                sebagaimana dimaksud dalam Pasal 1.
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>(3)</Text>
              <Text style={{ marginRight: 16 }}>
                {" "}
                PIHAK KESATU dan PIHAK KEDUA sepakat untuk melaksanakan hibah
                atas BMN tersebut sesuai peraturan perundang-undangan.
              </Text>
            </View>
          </View>
        </View>
      </Page>

      <Page size="FOLIO" style={styles.page}>
        <View
          style={{
            ...styles.docContainerBorder,
            paddingHorizontal: 24,
            paddingVertical: 16,
            height: 800,
          }}
        >
          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...styles.textBold,
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PASAL 5
            </Text>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>(1)</Text>
              <Text style={{ marginRight: 16 }}>
                PIHAK KESATU berkewajiban untuk:
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>a.</Text>
              <Text style={{ marginRight: 16 }}>
                menyerahkan OBJEK HIBAH kepada PIHAK KEDUA; dan
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>b.</Text>
              <Text style={{ marginRight: 16 }}>
                melakukan koordinasi dengan PIHAK KEDUA dalam pelaksanaan Berita
                Acara Serah Terima Operasional (BASTO) ini.
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...styles.textBold,
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PASAL 6
            </Text>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>(1)</Text>
              <Text style={{ marginRight: 16 }}>
                PIHAK KEDUA berhak untuk menggunakan OBJEK HIBAH sesuai dengan
                ketentuan dan persyaratan dalam Berita Acara Serah Terima
                Operasional (BASTO) ini.
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>(2)</Text>
              <Text style={{ marginRight: 16 }}>
                PIHAK KEDUA berkewajiban untuk:
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>a.</Text>
              <Text style={{ marginRight: 16 }}>
                menerima penyerahan OBJEK HIBAH dari PIHAK KESATU;
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>b.</Text>
              <Text style={{ marginRight: 16 }}>mencatat OBJEK HIBAH;</Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>c.</Text>
              <Text style={{ marginRight: 16 }}>
                mempergunakan dan memelihara OBJEK HIBAH sesuai ketentuan yang
                berlaku;
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>d.</Text>
              <Text style={{ marginRight: 16 }}>
                melakukan pengamanan OBJEK HIBAH yang meliputi pengamanan
                administrasi, pengamanan fisik, pengamanan hukum;
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>e.</Text>
              <Text style={{ marginRight: 16 }}>
                bertanggung jawab atas segala biaya yang dikeluarkan dalam
                kaitan dengan penggunaan, pemeliharaan, dan pengamanan OBJEK
                HIBAH berikut bagian-bagiannya;
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>f.</Text>
              <Text style={{ marginRight: 16 }}>
                bertanggung jawab sepenuhnya atas segala risiko yang berkaitan
                dengan OBJEK HIBAH; dan
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>g.</Text>
              <Text style={{ marginRight: 16 }}>
                mengelola dan melaksanakan penerimaan hibah secara transparan
                dan akuntabel sesuai dengan peraturan perundang-undangan.
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...styles.textBold,
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PASAL 7
            </Text>
            <Text
              style={{
                ...styles.text,
                textAlign: "left",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PIHAK KESATU menyatakan dan menjamin kepada PIHAK KEDUA dan PIHAK
              KEDUA menyatakan dan menjamin PIHAK KESATU, sebagai berikut:
            </Text>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>a.</Text>
              <Text style={{ marginRight: 16 }}>
                PIHAK KESATU dan PIHAK KEDUA mempunyai wewenang penuh untuk
                menandatangani dan melaksanakan Berita Acara Serah Terima
                Operasional (BASTO) ini;
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>b.</Text>
              <Text style={{ marginRight: 16 }}>
                PIHAK KESATU dan PIHAK KEDUA telah melakukan seluruh tindakan
                yang dibutuhkan dalam pengikatan Berita Acara Serah Terima
                Operasional (BASTO); dan
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingHorizontal: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>c.</Text>
              <Text style={{ marginRight: 16 }}>
                Berita Acara Serah Terima Operasional (BASTO) ini setelah
                ditandatangani menjadi sah dan mengikat PIHAK KESATU dan PIHAK
                KEDUA untuk melaksanakan Berita Acara Serah Terima Operasional
                (BASTO) ini.
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                ...styles.textBold,
                textAlign: "center",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PASAL 8
            </Text>
            <Text
              style={{
                ...styles.text,
                textAlign: "left",
                lineHeight: 1.7,
                letterSpacing: 0.1,
                width: "100%",
              }}
            >
              PIHAK KESATU dan PIHAK KEDUA menerangkan bahwa hibah ini dilakukan
              dengan syarat-syarat sebagai berikut:
            </Text>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>(1)</Text>
              <Text style={{ marginRight: 16 }}>
                Segala ketentuan dan persyaratan dalam Berita Acara Serah Terima
                Operasional (BASTO) ini berlaku serta mengikat bagi PIHAK KESATU
                dan PIHAK KEDUA yang menandatangani.
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 16 }}>(2)</Text>
              <Text style={{ marginRight: 16 }}>
                Berita Acara Serah Terima Operasional (BASTO) ini dibuat
                sebanyak 3 (tiga) rangkap asli dan mempunyai kekuatan hukum yang
                sama, rangkap pertama dan rangkap kedua masingmasing bermeterai
                cukup, rangkap kesatu dan rangkap ketiga dipegang oleh PIHAK
                KESATU sedangkan rangkap kedua dipegang oleh PIHAK KEDUA.
              </Text>
            </View>
          </View>
        </View>
      </Page>

      <Page size="FOLIO" style={styles.page}>
        <View style={styles.docContainer}>
          <View style={{ ...styles.docContainerBorder, height: 800 }}>
            <View style={styles.ttdContainer}>
              <View style={{ flex: 1 }}>
                <Text style={{ ...styles.textBold, textAlign: "center" }}>
                  PIHAK KESATU
                </Text>
                <Text style={{ ...styles.text, textAlign: "center" }}>
                  Kementerian Kesehatan {"\n"}
                  {jsonData?.kepala_unit_pemberi || ""}
                </Text>
                <Image
                  style={{ ...styles.imageTtd, marginVertical: 8 }}
                  src={`${jsonData?.tte_ppk}?not-from-cache-please`}
                  onError={(error) => {
                    error.target.src = defaultImage;
                  }}
                />
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: "Arial",
                    marginTop: 8,
                    fontSize: 10,
                    lineHeight: 1.2,
                    textAlign: "center",
                    letterSpacing: 0.2,
                  }}
                >
                  Nama : {jsonData?.nama_ppk || ""} {"\n"}
                  NIP : {jsonData?.nip_ppk || ""}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...styles.textBold, textAlign: "center" }}>
                  PIHAK KEDUA
                </Text>
                <Text style={{ ...styles.text, textAlign: "center" }}>
                  Kepala Dinas Kesehatan {"\n"} {jsonData?.kabupaten || ""}
                </Text>
                <Image
                  style={{ ...styles.imageTtd, marginVertical: 8 }}
                  src={`${jsonData?.tte_daerah}?not-from-cache-please`}
                  onError={(error) => {
                    error.target.src = defaultImage;
                  }}
                />
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: "Arial",
                    marginTop: 8,
                    fontSize: 10,
                    lineHeight: 1.2,
                    textAlign: "center",
                    letterSpacing: 0.2,
                  }}
                >
                  Nama : {jsonData?.nama_daerah || ""} {"\n"}
                  NIP : {jsonData?.nip_daerah || ""}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
      {RenderBarangPages(jsonData)}

      {/* <Page
        size="FOLIO"
        style={{ paddingTop: 0, ...styles.page }}
        orientation="landscape"
      >
        <View
          style={{
            paddingVertical: 0,
            marginTop: 0,
            ...styles.docContainerBorder,
            height: 520,
          }}
        >
          <View
            style={{ ...styles.titleContainer, marginBottom: 0, marginTop: 0 }}
          >
            <Text
              style={{
                ...styles.reportTitle,
                width: "40%",
                letterSpacing: 1,
              }}
            ></Text>
            <Text
              style={{
                ...styles.reportTitle,
                letterSpacing: 0.7,
                width: "60%",
                lineHeight: 1.5,
              }}
            >
              LAMPIRAN{"\n"}BERITA ACARA SERAH TERIMA OPERASIONAL BARANG MILIK
              NEGARA{"\n"}NOMOR: {jsonData?.nomorSurat}
              {"\n"}TANGGAL: {jsonData?.tanggal}
            </Text>
          </View>

          <View
            style={{
              ...styles.titleContainer,
              width: "100%",
              marginBottom: 8,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                ...styles.reportTitle,
                width: "100%",
                textAlign: "center",
                letterSpacing: 1,
                marginTop: 8,
              }}
            >
              DAFTAR BARANG MILIK NEGARA YANG DARI SEJAK AWAL DISERAHKAN KEPADA
              MASYARAKAT/PEMERINTAH DAERAH DINAS KESEHATAN KOTA / KABUPATEN{" "}
              {jsonData?.kabupaten}
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol1Header}>
                <Text style={styles.tableCellHeader}>No</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Nama Barang</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Merk/Tipe</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>
                  Nomor Bukti Kepemilikan
                </Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Satuan</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Jumlah</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Harga Satuan</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>
                  Jumlah Total Nilai Perolehan (Rp)
                </Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Keterangan</Text>
              </View>
            </View>
            {dataBarang?.map((items, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{items.namaBarang || ""}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{items.merk || ""}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{items.nomorBukti || ""}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{items.satuan || ""}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {items.jumlah_dikirim || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {items.hargaSatuan || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {items.jumlahNilai || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{items.keterangan || ""}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 16 }}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View
                  style={{
                    ...styles.tableCol1Header,
                    width: "70%",
                    fontWeight: "bold",
                  }}
                >
                  <Text
                    style={{
                      ...styles.tableCellHeader,
                      color: "#000",
                      fontSize: 11,
                      lineHeight: 1.5,
                      fontWeight: "bold",
                      textAlign: "left",
                      fontFamily: "Arial",
                    }}
                  >
                    PIHAK KESATU
                  </Text>
                </View>
                <View style={{ ...styles.tableColHeader, width: "30%" }}>
                  <Text
                    style={{
                      ...styles.tableCellHeader,
                      color: "#000",
                      fontSize: 11,
                      lineHeight: 1.5,
                      fontWeight: "bold",
                      textAlign: "left",
                      fontFamily: "Arial",
                    }}
                  >
                    PIHAK KEDUA
                  </Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCol, width: "70%" }}>
                  <Text style={{ ...styles.tableCell, ...styles.text }}>
                    Kementerian Kesehatan {jsonData?.kepala_unit_pemberi || ""}
                  </Text>
                </View>
                <View style={{ ...styles.tableCol, width: "30%" }}>
                  <Text style={{ ...styles.tableCell, ...styles.text }}>
                    Kepala Dinas Kesehatan Kota/ Kabupaten{" "}
                    {jsonData?.penerima_hibah || ""}
                  </Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCol, width: "70%" }}>
                  <Text
                    style={{
                      ...styles.tableCell,
                      ...styles.text,
                      marginBottom: 0,
                    }}
                  >
                    Nama {jsonData?.nama_ppk || ""}
                  </Text>
                  <Text
                    style={{
                      ...styles.tableCell,
                      ...styles.text,
                      marginBottom: 0,
                    }}
                  >
                    NIP {jsonData?.nip_ppk || ""}
                  </Text>
                </View>
                <View style={{ ...styles.tableCol, width: "30%" }}>
                  <Text
                    style={{
                      ...styles.tableCell,
                      ...styles.text,
                      marginBottom: 0,
                    }}
                  >
                    Nama {jsonData?.nama_daerah || ""}
                  </Text>
                  <Text
                    style={{
                      ...styles.tableCell,
                      ...styles.text,
                      marginBottom: 0,
                    }}
                  >
                    NIP {jsonData?.nip_daerah || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page> */}

      {/* <Page size="FOLIO" style={styles.page}>
        <View style={styles.docContainer}>
          <Text style={styles.text}>
            B. Format II, Naskah Hibah dan Berita Acara Serah Terima BMN
          </Text>
        </View>
        <View
          style={{
            ...styles.docContainerBorder,
            paddingHorizontal: 24,
            paddingVertical: 16,
            height: 700,
          }}
        >
          <Text
            style={{ ...styles.text, textAlign: "center", marginBottom: 24 }}
          >
            --------------------------------------------Kop----------------------------------------
          </Text>
          <Text
            style={{
              ...styles.textBoldTitle,
              marginBottom: 32,
              lineHeight: 1.8,
            }}
          >
            NASKAH HIBAH {"\n"} DAN {"\n"} BERITA ACARA SERAH TERIMA {"\n"}{" "}
            BARANG MILIK NEGARA {"\n"} ANTARA {"\n"}
            KEMENTERIAN KESEHATAN {"\n"} DENGAN {"\n"} DINAS KESEHATAN
            {jsonData?.kabupaten} {"\n"} NOMOR {jsonData?.nomorSurat} {"\n"}
            TENTANG {"\n"} HIBAH BARANG MILIK NEGARA YANG DARI SEJAK AWAL
            DISERAHKAN KEPADA {"\n"}
            MASYARAKAT/PEMERINTAH {"\n"} DAERAH DINAS KESEHATAN{" "}
            {jsonData?.kabupaten}{" "}
          </Text>
          <Text style={styles.text}>
            Berdasarkan Peraturan Menteri Keuangan Nomor 111/PMK.06/2016 tentang
            Tata Cara Pelaksanaan Pemindahtanganan Barang Milik Negara (Berita
            Negara Republik Indonesia Tahun 2016 Nomor 1018) sebagaimana telah
            diubah dengan Peraturan Menteri Keuangan Nomor 165/PMK.06/2021
            tentang Perubahan atas Peraturan Menteri Keuangan Nomor
            111/PMK.06/2016 tentang Tata Cara Pelaksanaan Pemindahtanganan
            Barang Milik Negara (Berita Negara Republik Indonesia Tahun 2021
            Nomor 1292), dengan ini kami sampaikan bahwa telah dilaksanakan
            pemindahtanganan BMN berupa Hibah antara PIHAK KESATU dalam hal ini
            {jsonData?.kepala_unit_pemberi} yang diwakili {jsonData?.nama_ppk}{" "}
            oleh dan PIHAK KEDUA dalam hal ini Masyarakat/Pemerintah Daerah yang
            diwakili oleh Kepala Dinas Kesehatan {jsonData?.kabupaten} berupa
            BMN dengan rincian terlampir , sejumlah{" "}
            {jsonData?.total_barang_dikirim} dengan total nilai perolehan
            sebesar Rp{jsonData?.total_harga}, sesuai dengan Berita Acara Serah
            Terima Operasional (BASTO) nomor {jsonData?.nomorSurat} tanggal{" "}
            {jsonData?.tanggal} (terlampir). Demikian Naskah Hibah dan BAST ini
            kami buat, selanjutnya agar digunakan sebagaimana mestinya.
          </Text>

          <View style={styles.ttdContainer}>
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.textBold}>
                JAKARTA, {jsonData?.tanggal || ""}
              </Text>
              <Text style={styles.text}>
                Kepala Dinas Kesehatan {jsonData?.kabupaten || ""}
              </Text>
              <Image
                style={{
                  ...styles.imageTtd,
                  marginVertical: 8,
                  marginLeft: 16,
                }}
                src={jsonData?.tte_ppk}
              />
              <Text style={{ marginTop: 8 }}>
                Nama : {jsonData?.nama_ppk || ""} {"\n"}
                NIP : {jsonData?.nip_ppk || ""}
              </Text>
            </View>
          </View>
        </View>
      </Page> */}
      <Page size="FOLIO" style={styles.page}>
        {/* <View style={styles.docContainer}>
              <Text style={styles.text}>
                B. Format II, Naskah Hibah dan Berita Acara Serah Terima BMN
              </Text>
            </View> */}
        <View
          style={{
            ...styles.docContainerBorder,
            paddingHorizontal: 24,
            paddingVertical: 16,
            height: 800,
          }}
        >
          {/* <Text
                style={{
                  ...styles.text,
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                --------------------------------------------Kop----------------------------------------
              </Text> */}
          <View
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Image
              style={{
                width: "490px",
                height: "96px",
                // marginVertical: 16,
              }}
              src="/kop_surat1.png"
            />
          </View>
          <Text
            style={{
              ...styles.textBoldTitle,
              marginBottom: 32,
              lineHeight: 1.8,
            }}
          >
            NASKAH HIBAH {"\n"} DAN {"\n"} BERITA ACARA SERAH TERIMA {"\n"}{" "}
            BARANG MILIK NEGARA {"\n"} ANTARA {"\n"}
            KEMENTERIAN KESEHATAN {"\n"} DENGAN {"\n"} DINAS KESEHATAN{" "}
            {jsonData?.kabupaten} {"\n"} NOMOR {jsonData?.nomorSurat} {"\n"}
            TENTANG {"\n"} HIBAH BARANG MILIK NEGARA YANG DARI SEJAK AWAL
            DISERAHKAN KEPADA {"\n"}
            MASYARAKAT/PEMERINTAH {"\n"} DAERAH DINAS KESEHATAN{" "}
            {jsonData?.kabupaten}{" "}
          </Text>
          <Text style={styles.text}>
            Berdasarkan Peraturan Menteri Keuangan Nomor 111/PMK.06/2016 tentang
            Tata Cara Pelaksanaan Pemindahtanganan Barang Milik Negara (Berita
            Negara Republik Indonesia Tahun 2016 Nomor 1018) sebagaimana telah
            diubah dengan Peraturan Menteri Keuangan Nomor 165/PMK.06/2021
            tentang Perubahan atas Peraturan Menteri Keuangan Nomor
            111/PMK.06/2016 tentang Tata Cara Pelaksanaan Pemindahtanganan
            Barang Milik Negara (Berita Negara Republik Indonesia Tahun 2021
            Nomor 1292), dengan ini kami sampaikan bahwa telah dilaksanakan
            pemindahtanganan BMN berupa Hibah antara PIHAK KESATU dalam hal ini
            {jsonData?.kepala_unit_pemberi} yang diwakili {jsonData?.nama_ppk}{" "}
            oleh dan PIHAK KEDUA dalam hal ini Masyarakat/Pemerintah Daerah yang
            diwakili oleh Kepala Dinas Kesehatan {jsonData?.kabupaten} berupa
            BMN dengan rincian terlampir , sejumlah{" "}
            {jsonData?.total_barang_dikirim} dengan total nilai perolehan
            sebesar Rp{jsonData?.total_harga}, sesuai dengan Berita Acara Serah
            Terima Operasional (BASTO) nomor {jsonData?.nomorSurat} tanggal{" "}
            {jsonData?.tanggal} (terlampir). Demikian Naskah Hibah dan BAST ini
            kami buat, selanjutnya agar digunakan sebagaimana mestinya.
          </Text>

          <View style={styles.ttdContainer}>
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.textBold}>
                JAKARTA,{" "}
                {moment(jsonData?.tanggal_tte_ppk).format("D-MM-YYYY", "id")}{" "}
              </Text>
              <Text style={styles.text}>{jsonData?.kepala_unit_pemberi}</Text>
              <Image
                style={{
                  ...styles.imageTtd,
                  marginVertical: 8,
                  marginLeft: 16,
                }}
                src={`${jsonData?.tte_ppk}?not-from-cache-please`}
              />
              <Text style={{ marginTop: 8 }}>
                Nama : {jsonData?.nama_ppk || ""} {"\n"}
                NIP : {jsonData?.nip_ppk || ""}
              </Text>
            </View>
          </View>
        </View>
      </Page>
      {RenderHibahPages(jsonData)}
    </Document>
  );
  return (
    <div>
      <Breadcrumb
        pageName={`Dokumen ${jsonData?.nama_dokumen}`}
        back={true}
        linkBack="/dokumen"
        jsonData={jsonData}
      />
      <HeaderDokumen jsonData={jsonData} user={user} />
      {jsonData && jsonData?.file_dokumen ? (
        <div className="flex justify-end items-center">
          <a
            href={pdfUrl}
            download={`${jsonData.nama_dokumen || "document"}.pdf`}
            target="_blank"
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition flex items-center"
          >
            <FaDownload className="mr-2" />
            <span>Download Dokumen</span>
          </a>
        </div>
      ) : jsonData && !jsonData?.file_dokumen ? (
        <div className="flex justify-end items-center">
          {/* <PDFDownloadLink
            document={<Dokumen />}
            fileName={`Dokumen ${jsonData?.nama_dokumen}`}
            className="flex justify-center items-center bg-teal-500 text-white px-4 py-2 rounded-md"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Loading dokumen..."
              ) : (
                <>
                  <FaDownload size={16} className="mr-2" />
                  <span>Download Dokumen</span>
                </>
              )
            }
          </PDFDownloadLink> */}
          {pdfBlob ? (
            <a
              href={URL.createObjectURL(pdfBlob)}
              download={`${jsonData.nama_dokumen || "document"}.pdf`}
              target="_blank"
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition flex items-center"
            >
              <FaDownload className="mr-2" />
              <span>Download Dokumen</span>
            </a>
          ) : (
            <FaSpinner />
          )}
        </div>
      ) : (
        ""
      )}
      {error && (
        <div className="flex justify-center items-center flex-col h-[20vh] gap-2">
          <MdWarning className=" inline-block w-8 h-8 text-teal-400" />
          <span className="ml-2 font-semibold text-lg text-body">
            Sedang Terjadi Error Pada File PDF, Silahkan coba pada beberapa saat
            lagi
          </span>
        </div>
      )}
      {!jsonData?.file_dokumen && isIFrameLoaded === false ? (
        <div className="flex h-[81vh]">
          <div className="m-auto">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <p className="sr-only text-bodydark1">
                Loading Generate Dokumen...
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {jsonData && jsonData.file_dokumen ? (
        <Worker workerUrl={"/pdf.worker.min.js"}>
          {" "}
          <div className="w-full h-[80vh] mt-4">
            <Viewer
              fileUrl={pdfUrl || "/contoh_laporan.pdf"}
              plugins={[newPlugin]}
              renderError={renderError}
            >
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
      ) : // <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      //   <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-full max-w-4xl">
      //     <div className="mb-4 flex justify-between items-center">
      //       <button
      //         onClick={zoomOut}
      //         className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
      //       >
      //         - <span className="hidden sm:inline-block">Zoom Out</span>
      //       </button>
      //       <span className="text-gray-700">{Math.round(scale * 100)}%</span>
      //       <button
      //         onClick={zoomIn}
      //         className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
      //       >
      //         + <span className="hidden sm:inline-block">Zoom In</span>
      //       </button>
      //     </div>
      //     <div
      //       ref={containerRef}
      //       className="relative bg-gray-200 p-4 rounded-lg overflow-auto"
      //       style={{ height: "1200px", width: "100%" }}
      //     >
      //       <DocumentPreview
      //         file={pdfUrl}
      //         onLoadSuccess={onLoadSuccess}
      //         onLoadError={onLoadError}
      //         className="pdf-document"
      //       >
      //         {[...Array(numPages).keys()].map((_, index) => (
      //           <PagePreview
      //             key={index}
      //             pageNumber={index + 1}
      //             scale={scale}
      //             renderTextLayer={false}
      //             renderAnnotationLayer={false}
      //           />
      //         ))}
      //       </DocumentPreview>
      //     </div>
      //   </div>
      // </div>
      jsonData && !jsonData.file_dokumen ? (
        <>
          {/* <div
            className={`mt-4 flex [&>*]:w-full ${
              isIFrameLoaded ? "h-[81vh]" : "h-0"
            }`}
          >
            <PDFViewer
              height="100%"
              width="100%"
              showToolbar={true}
              className="rounded-md"
              innerRef={iframeRef}
            >
              <Dokumen />
            </PDFViewer>
          </div> */}
          <div className="flex flex-col items-center h-[80vh] w-full bg-gray-100 p-4">
            <div className="bg-gray-300 rounded-lg shadow-lg w-full ">
              <div className="mb-4 flex justify-between items-center bg-teal-500 py-2 md:py-3 rounded-lg md:px-2 px-3 text-xs md:flex-row flex-col gap-1 md:gap-2 md:text-sm">
                <span className="text-white font-semibold">
                  {jsonData?.nomorSurat}
                </span>
                <span className="text-white flex items-center gap-1">
                  Total Page : {numPages || <FaSpinner />}
                </span>
                <div className="flex items-center gap-2">
                  {pdfBlob ? (
                    <a
                      href={URL.createObjectURL(pdfBlob)}
                      download={`${jsonData.nama_dokumen || "document"}.pdf`}
                      target="_blank"
                      className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
                    >
                      <FaDownload />
                    </a>
                  ) : (
                    <FaSpinner />
                  )}
                  <button
                    onClick={zoomOut}
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
                  >
                    -
                  </button>
                  <span className="text-white">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={zoomIn}
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <div
                ref={containerRef}
                className="relative bg-gray-200 p-4 rounded-lg overflow-auto"
                style={{ height: "80vh", width: "100%" }}
              >
                <DocumentPreview
                  file={pdfBlob}
                  onLoadSuccess={onLoadSuccess}
                  onLoadError={onLoadError}
                  className="pdf-document"
                  loading={
                    <div className="flex justify-center items-center flex-col h-[20vh] gap-2">
                      <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
                      <span className="ml-2 font-semibold text-lg text-body">
                        Loading Generate Dokumen...
                      </span>
                    </div>
                  }
                >
                  {[...Array(numPages).keys()].map((_, index) => (
                    <PagePreview
                      key={index}
                      pageNumber={index + 1}
                      scale={scale}
                      className={`!bg-[#F5F9F9]`}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
                </DocumentPreview>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default PreviewDokumen;
