import React, { useEffect, useState, useRef } from "react";
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
  pdf,
} from "@react-pdf/renderer";
import ReactDOMServer from "react-dom/server";
import moment from "moment";
import "moment/dist/locale/id";
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
import { FaDownload } from "react-icons/fa";
import { RenderHibahPages } from "../Table/TableHibah";
import { RenderBarangPages } from "../Table/TableLampiran";
import { formatTanggal } from "../../data/data";

const defaultImage =
  "https://media.istockphoto.com/id/1472819341/photo/background-white-light-grey-total-grunge-abstract-concrete-cement-wall-paper-texture-platinum.webp?b=1&s=170667a&w=0&k=20&c=yoY1jUAKlKVdakeUsRRsNEZdCx2RPIEgaIxSwQ0lS1k=";
var today = new Date();
moment.locale("id"); // Set default locale ke Indonesia
const defaultDate = today.toISOString().substring(0, 10);
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
Font.register({
  family: "Calibri",
  fonts: [
    {
      src: "/fonts/calibri-regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/calibri-bold.ttf",
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
    fontSize: 8,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
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
    fontFamily: "Calibri",
    justifyContent: "space-between",
  },
  reportTitle: {
    fontFamily: "Calibri",
    color: "#000",
    fontSize: 8,
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
  helvetica: {
    color: "#000",
    fontSize: 8,
    lineHeight: 1.5,
    fontWeight: "normal",
    textAlign: "left",
    fontFamily: "Helvetica-Bold",
    textOverflow: "clip",
  },
  text: {
    color: "#000",
    fontSize: 8,
    lineHeight: 1.5,
    fontWeight: "normal",
    textAlign: "left",
    fontFamily: "Calibri",
    textOverflow: "clip",
  },
  textBold: {
    color: "#000",
    fontSize: 8,
    lineHeight: 1.5,
    fontWeight: "bold",
    textAlign: "left",
    fontFamily: "Calibri",
  },
  textBoldTitle: {
    color: "#000",
    fontSize: 8,
    lineHeight: 1.5,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Calibri",
    marginBottom: 24,
  },
  imageTtd: {
    width: 50,
    height: 50,
    marginLeft: 90,
  },
  TableHeader: {
    color: "#000",
    fontSize: 8,
    lineHeight: 1.5,
    textAlign: "center",
    fontFamily: "Calibri",
    verticalAlign: "middle",
    paddingVertical: 5,
  },
  TableRow: {
    color: "#000",
    fontSize: 8,
    lineHeight: 1,
    textAlign: "center",
    fontFamily: "Calibri",
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
    fontSize: 8,
    lineHeight: 1.2,
    fontWeight: 500,
    textAlign: "center",
    verticalAlign: "middle",
  },
  tableCell: {
    margin: 5,
    fontSize: 8,
    lineHeight: 1,
    textAlign: "center",
    verticalAlign: "middle",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 24,
    fontSize: 7,
    color: "#666666",
  },
  watermark: {
    position: "absolute",
    top: "50%", // Posisi tengah vertikal
    left: "45%", // Posisi tengah horizontal
    transform: "translate(-50%, -50%)", // Pusatkan teks
    fontSize: 80, // Ukuran font besar
    color: "red", // Warna merah
    opacity: 0.2, // Opacity rendah untuk efek watermark
    zIndex: -1, // Letakkan di belakang konten lain
  },
});

const GenerateDokumen = async (jsonData, preview) => {
  const downloadDate = (jsonData?.tgl_download || new Date()).toLocaleString(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
  const MyDocument = () => (
    <Document title={`Dokumen ${jsonData?.kabupaten}`}>
      <Page size="FOLIO" style={styles.page}>
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            width: "100%",
            height: "100%",
            textAlign: "center",
            display: "flex",
          }}
        >
          <Text
            style={{
              ...styles.helvetica,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              marginTop: 340,
              width: "100%",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            dibuat oleh kab/kota {"\n\n"}PROPOSAL {"\n\n"}PEMENUHAN ALAT
            KESEHATAN DI PUSKESMAS,{"\n\n"}
            KABUPATEN/KOTA {jsonData?.kabupaten}
          </Text>
          <Text
            style={{
              ...styles.helvetica,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              marginTop: 240,
              width: "100%",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            DINAS KESEHATAN KABUPATEN/KOTA {jsonData?.kabupaten} {"\n\n"}
            PROVINSI {jsonData?.provinsi} {"\n\n"}TAHUN 2024
          </Text>
        </View>
        <View style={styles.footer}>
          <Text>
            Downloaded on {downloadDate}. [Backend use only: location_group_id =
            117, username = {jsonData?.user_download || "jawa_barat"}]
          </Text>
        </View>
      </Page>

      <Page size="FOLIO" style={styles.page}>
        <View
          style={{
            paddingHorizontal: 16,
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
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>A.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                LATAR BELAKANG
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 24,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text>
                Kementerian Kesehatan telah melakukan transformasi sistem
                kesehatan melalui 6 pilar, dengan pilar pertama yaitu
                transformasi layanan primer. Transformasi layanan primer
                difokuskan untuk meningkatkan layanan promotif dan preventif,
                termasuk upaya pencegahan, deteksi dini, promosi kesehatan,
                membangun infrastruktur, melengkapi sarana, prasarana, SDM,
                serta memperkuat manajemen di seluruh layanan primer.
                Transformasi layanan kesehatan primer yang akan dijalankan
                menerapkan konsep kewilayahan difokuskan pada pendekatan siklus
                hidup serta mendekatkan layanan kesehatan melalui jejaring
                hingga ke tingkat dusun.
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 24,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text>
                Menindaklanjuti usulan kami sebelumnya di tahun 2023 dan untuk
                pelaksanaan Penyelenggaraan pelayanan kesehatan primer
                dilaksanakan di Posyandu tingkat dusun/RT/RW, dan Puskesmas di
                tingkat kecamatan. Kami melakukan perbaikan usulan terhadap
                alat-alat kesehatan di Puskesmas, dan Posyandu yang sebelumnya
                sudah diusulkan dan perlu penyesuain terhadap kondisi di tahun
                2024 ini.
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 24,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text>
                Keterbatasan sumber daya dan pembiayaan terutama di sisi
                pemerintah daerah mengakibatkan pemenuhan alat kesehatan belum
                dapat dilakukan dalam kurun waktu cepat untuk mendukung
                transformasi layanan primer. Atas dasar pertimbangan tersebut,
                tahun 2024 ini kami mengajukan perbaikan usulan pemenuhan alat
                kesehatan di puskesmas, pustu, dan posyandu kepada Kementerian
                Kesehatan.
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
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                marginBottom: 8,
                width: "100%",
              }}
            >
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>B.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                TUJUAN
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
              <Text style={{ marginRight: 8 }}>1.</Text>
              <Text>
                Terpenuhinya jumlah dan jenis alat kesehatan di puskesmas sesuai
                standar.
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
              <Text style={{ marginRight: 8 }}>2.</Text>
              <Text>
                Terpenuhinya jumlah dan jenis alat kesehatan di puskesmas
                pembantu sesuai standar.
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
              <Text style={{ marginRight: 8 }}>3.</Text>
              <Text>
                Terpenuhinya jumlah dan jenis alat kesehatan di posyandu sesuai
                standar.
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
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                marginBottom: 8,
                width: "100%",
              }}
            >
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>C.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                Usulan Peralatan dan Ketersediaan SDM
              </Text>
            </View>

            <View
              style={{
                ...styles.helvetica,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>1.</Text>
              <Text>
                Data usulan alat, jumlah dan peralatan pada puskesmas.
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 40,
                display: "flex",
                marginTop: 4,
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text>
                Usulan peralatan puskesmas dalam lampiran ini diusulkan dengan
                memasukkan kriteria SDM di puskesmas lengkap yang terdiri dari
                minimal 5 jenis tenaga kesehatan yaitu terdiri dari: Dokter,
                Dokter Gigi, Bidan, Perawat dan ATLM (Ahli Teknisi Laboratorium
                Medik). {"\n"}
                <Text style={{ ...styles.helvetica }}>Nama alat terlampir</Text>
              </Text>
            </View>
            <View
              style={{
                ...styles.helvetica,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 24,
                marginTop: 8,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>2.</Text>
              <Text>
                Data usulan alat, jumlah dan peralatan pada puskesmas pembantu.
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 40,
                display: "flex",
                marginTop: 4,
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text>
                Usulan peralatan puskesmas pembantu dalam lampiran ini diusulkan
                dengan memasukkan kriteria SDM di puskesmas pembantu lengkap
                sesuai data SISDMK per Juni 2024 yang terdiri dari minimal 2
                jenis tenaga kesehatan yaitu terdiri dari Bidan, dan Perawat.{" "}
                {"\n"}
                <Text style={{ ...styles.helvetica }}>Nama alat terlampir</Text>
              </Text>
            </View>
            <View
              style={{
                ...styles.helvetica,
                lineHeight: 1.7,
                marginTop: 8,
                letterSpacing: 0.1,
                paddingLeft: 24,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>3.</Text>
              <Text>Data usulan alat, jumlah dan peralatan pada posyandu.</Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 40,
                display: "flex",
                marginTop: 4,
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text>
                Usulan peralatan posyandu dalam lampiran ini diusulkan dengan
                memasukkan kriteria posyandu aktif (memiliki 5 orang kader).{" "}
                {"\n"}
                <Text style={{ ...styles.helvetica }}>Nama alat terlampir</Text>
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
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>D.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                PENUTUP
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 24,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "100%",
              }}
            >
              <Text>
                Demikian proposal yang dapat kami usulkan dengan kondisi
                sebenarnya. Besar harapan kami usulan alat kesehatan di
                puskesmas, puskesmas pembantu dan posyandu ini dapat dipenuhi
                oleh Kementerian Kesehatan. Terima kasih.
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                paddingLeft: 24,
                display: "flex",
                flexDirection: "row",
                marginTop: 16,
                width: "100%",
              }}
            >
              <Text>
                Narahubung dari kegiatan ini adalah: {"\n"}
                Nama:{"\n"}
                Jabatan:{"\n"}
                No.HP :{"\n"}
              </Text>
            </View>
          </View>
          <View style={styles.ttdContainer}>
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                Tempat, ............................
              </Text>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                Kepala Dinas Kesehatan {"\n"} {jsonData?.kabupaten || ""}
              </Text>
              <View style={{ ...styles.imageTtd, marginVertical: 8 }}></View>
              <Text
                style={{
                  ...styles.text,
                  fontFamily: "Calibri",
                  marginTop: 12,
                  fontSize: 8,
                  paddingRight: 64,
                  lineHeight: 1.2,
                  textAlign: "center",
                  letterSpacing: 0.2,
                }}
              >
                Nama
              </Text>
              <Text
                style={{
                  ...styles.text,
                  fontFamily: "Calibri",
                  paddingRight: 70,
                  fontSize: 8,
                  lineHeight: 1.2,
                  textAlign: "center",
                  letterSpacing: 0.2,
                }}
              >
                NIP
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>
            Downloaded on {downloadDate}. [Backend use only: location_group_id =
            117, username = {jsonData?.user_download || "jawa_barat"}]
          </Text>
        </View>
      </Page>

      <Page size="FOLIO" style={styles.page}>
        <Text style={{ ...styles.watermark, left: preview ? "30%" : "45%" }}>
          {preview ? "PREVIEW" : "FINAL"}
        </Text>
        <View
          style={{
            paddingHorizontal: 16,
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
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Text style={{ ...styles.helvetica, textAlign: "center" }}>
                SURAT PERNYATAAN{" "}
              </Text>
              <Text
                style={{ ...styles.text, marginTop: 8, textAlign: "center" }}
              >
                Nomor :
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
              <Text>
                Yang bertanda tangan di bawah ini :{"\n"}
                Nama :{"\n"}
                Jabatan :{"\n\n"}
                dengan ini menyatakan bahwa :
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
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>a.</Text>
              <Text>
                Seluruh puskesmas telah melaksanakan Permenkes 31 tahun 2018
                dengan melakukan melakukan update data sarana, prasarana dan
                alat kesehatan secara riil melalui aplikasi ASPAK dan telah di
                validasi oleh Dinas Kesehatan Kabupaten/Kota{" "}
                {jsonData?.kabupaten}.
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>b.</Text>
              <Text>
                Puskesmas, Pustu dan posyandu mengusulkan alat yang dibutuhkan
                dalam menjalankan Integrasi layanan Primer (ILP).
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 9 }}>c.</Text>
              <Text>
                Alat yang dimiliki saat ini belum memenuhi standar untuk
                pelayanan di puskesmas, pustu dan posyandu.
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>d.</Text>
              <Text>
                Alat yang diusulkan tersebut belum diusulkan melalui pembiayaan
                lainnya.
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>e.</Text>
              <Text>
                Dinas Kesehatan sanggup menerima alat sesuai dengan alat yang
                diusulkan dan akan melakukan pencatatan alat ke ASPAK setelah
                alat diserahterimakan.{" "}
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 10 }}>f.</Text>
              <Text>
                Dinas Kesehatan ikut serta memastikan pendistribusikan alat
                kesehatan hingga ke puskesmas, pustu dan posyandu sesuai dengan
                Permenkes 1047 tahun 2024 tentang Standar Peralatan Dalam Rangka
                Penguatan Pelayanan Kesehatan Primer Pada Pusat Kesehatan
                Masyarakat, Unit Pelayanan Kesehatan Di Desa/Kelurahan, Dan Pos
                Pelayanan Terpadu.
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>g.</Text>
              <Text>
                Dinas Kesehatan akan menyiapkan biaya operasional dan biaya
                pemeliharaan seluruh alat kesehatan yang diusulkan.
              </Text>
            </View>

            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>h.</Text>
              <Text>
                Dinas Kesehatan akan menanggung biaya operasionalisasi alat
                laboratorium dalam bentuk reagen dan BMHP.
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 10 }}>i.</Text>
              <Text>
                Dinas Kesehatan akan mendukung pemenuhan kebutuhan alat
                kesehatan yang tidak disediakan oleh pemerintah pusat.
              </Text>
            </View>
          </View>

          <View style={styles.ttdContainer}>
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                ...............,...................2024
              </Text>
              Yang membuat pernyataan
              <Text
                style={{ ...styles.text, textAlign: "center", marginTop: 48 }}
              >
                Kepala Dinas Kesehatan {"\n"} {jsonData?.kabupaten || ""}
              </Text>
              <View style={{ ...styles.imageTtd, marginVertical: 8 }}></View>
              <Text
                style={{
                  ...styles.text,
                  fontFamily: "Calibri",
                  marginTop: 12,
                  fontSize: 8,
                  paddingRight: 64,
                  lineHeight: 1.2,
                  textAlign: "center",
                  letterSpacing: 0.2,
                }}
              >
                Nama
              </Text>
              <Text
                style={{
                  ...styles.text,
                  fontFamily: "Calibri",
                  paddingRight: 70,
                  fontSize: 8,
                  lineHeight: 1.2,
                  textAlign: "center",
                  letterSpacing: 0.2,
                }}
              >
                NIP
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>
            Downloaded on {downloadDate}. [Backend use only: location_group_id =
            117, username = {jsonData?.user_download || "jawa_barat"}]
          </Text>
        </View>
      </Page>

      {RenderBarangPages(jsonData, preview)}
      {RenderHibahPages(jsonData, preview)}
    </Document>
  );
  const blob = await pdf(<MyDocument />).toBlob();
  return blob;
};

export default GenerateDokumen;
