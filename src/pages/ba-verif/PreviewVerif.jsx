import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, Font } from "@react-pdf/renderer";
import {
  Document as DocumentPreview,
  Page as PagePreview,
  pdfjs,
} from "react-pdf";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment from "moment";
import "moment/locale/id";
import { Link, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.jsx";
import { useMediaQuery } from "react-responsive";
import { decryptId } from "../../data/utils";
import axios from "axios";
import { useSelector } from "react-redux";
import { CgSpinner } from "react-icons/cg";
import HeaderDokumen from "../../components/Title/HeaderDokumen.jsx";
import { FaDownload, FaSpinner } from "react-icons/fa";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
// Import the main component
// import { pdfjs as PdfJs } from "pdfjs-dist";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { useResizeObserver } from "@wojtekmaj/react-hooks";
import Swal from "sweetalert2";
import GenerateDokumen from "../../components/Dokumen/GenerateDokumen";
import { MdWarning } from "react-icons/md";
import GenerateVerif from "../../components/Dokumen/GenerateVerif.jsx";

// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
// const worker = `/fonts/pdf.worker.min.mjs`;
const worker = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = worker;

const resizeObserverOptions = {};

const maxWidth = 800;

const PreviewVerif = () => {
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
    // setError(true);
  };
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 450) {
        setScale(0.5);
      } else if (width < 768) {
        setScale(0.7);
      } else if (width < 1200) {
        setScale(1);
      } else if (width < 1366) {
        setScale(1.2);
      } else {
        setScale(1.4);
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
    // const decryptedId = decryptId(id);
    // if (!decryptedId) {
    //   // Jika decryptId gagal (mengembalikan null atau nilai falsy lainnya)
    //   navigate("/not-found"); // Arahkan ke halaman "not found"
    //   return; // Hentikan eksekusi fungsi
    // }
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
        }/api/usulanverif/${encodeURIComponent(decryptId(id))}`,
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
          id: data.id,
          tgl_download: data.tgl_download || defaultDate,
          tgl_upload: data.tgl_upload || defaultDate,
          file_dokumen: data.file_dokumen || null,
          provinsi: data.provinsi || "",
          kabupaten: data.kabupaten || "",
          user_download: data.user_download || "",
          user_upload: data.user_upload || "",
          distribusi: data.usulan_detail || [],
          total_alkes: data.total_alkes || [],
        });
        const dataJson = {
          id: data.id,
          tgl_download: data.tgl_download || defaultDate,
          tgl_upload: data.tgl_upload || defaultDate,
          provinsi: data.provinsi || "",
          kabupaten: data.kabupaten || "",
          user_download: data.user_download || "",
          user_upload: data.user_upload || "",
          distribusi: data.usulan_detail || [],
          total_alkes: data.total_alkes || [],
          alkes: data || [],
          ba_verif: data.ba_verif || [],
        };

        const pdfBlob = await GenerateVerif(dataJson, true); // GenerateDokumen harus mengembalikan Blob PDF
        setPdfBlob(pdfBlob);

        setGetLoading(false);
        Swal.close();
      });
    } catch (error) {
      Swal.close();
      // if (!jsonData) {
      //   navigate("/not-found");
      // }

      console.log(error);
    }
  };
  useEffect(() => {
    fetchDokumenData();
    moment.locale("id");
  }, []);
  const renderError = (error) => {
    let message = "";
    // setError(true);
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

  return (
    <div>
      <Breadcrumb
        pageName={`PDF Usulan ${jsonData?.kabupaten}`}
        back={true}
        linkBack="/pdf-usulan-alkes"
        jsonData={jsonData}
      />
      <HeaderDokumen jsonData={jsonData} user={user} />

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
      <div className="flex flex-col items-center h-[80vh] w-full bg-gray-100 p-4">
        <div className="bg-gray-300 rounded-lg shadow-lg w-full ">
          <div className="mb-4 flex justify-between items-center bg-teal-600 py-2 md:py-3 rounded-lg md:px-2 px-3 text-xs md:flex-row flex-col gap-1 md:gap-2 md:text-sm">
            <span className="text-white font-semibold">
              PDF Usulan {jsonData?.kabupaten}
            </span>
            <span className="text-white flex items-center gap-1">
              Total Page : {numPages || <FaSpinner />}
            </span>
            <div className="flex items-center gap-2">
              {/* {pdfBlob ? (
                <a
                  href={URL.createObjectURL(pdfBlob)}
                  download={`${jsonData.nama_dokumen || "document"}.pdf`}
                  target="_blank"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
                >
                  <FaDownload />
                </a>
              ) : (
                <FaSpinner />
              )} */}
              <button
                onClick={zoomOut}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
              >
                -
              </button>
              <span className="text-white">{Math.round(scale * 100)}%</span>
              <button
                onClick={zoomIn}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
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
    </div>
  );
};

export default PreviewVerif;
