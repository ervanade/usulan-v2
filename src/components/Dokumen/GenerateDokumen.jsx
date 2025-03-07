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
  helvetica: {
    color: "#000",
    fontSize: 11,
    lineHeight: 1.5,
    fontWeight: "normal",
    textAlign: "left",
    fontFamily: "Helvetica-Bold",
    textOverflow: "clip",
  },
  text: {
    color: "#000",
    fontSize: 11,
    lineHeight: 1.5,
    fontWeight: "normal",
    textAlign: "left",
    fontFamily: "Arial",
    textOverflow: "clip",
  },
  textBold: {
    color: "#000",
    fontSize: 11,
    lineHeight: 1.5,
    fontWeight: "bold",
    textAlign: "left",
    fontFamily: "Arial",
  },
  textBoldTitle: {
    color: "#000",
    fontSize: 11,
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
    fontSize: 11,
    lineHeight: 1.5,
    textAlign: "center",
    fontFamily: "Arial",
    verticalAlign: "middle",
    paddingVertical: 5,
  },
  TableRow: {
    color: "#000",
    fontSize: 11,
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
    fontSize: 11,
    lineHeight: 1.2,
    fontWeight: 500,
    textAlign: "center",
    verticalAlign: "middle",
  },
  tableCell: {
    margin: 5,
    fontSize: 11,
    lineHeight: 1,
    textAlign: "center",
    verticalAlign: "middle",
  },
});

const GenerateDokumen = async (jsonData, distributor) => {
  const MyDocument = () => (
    <Document title={`Dokumen ${jsonData?.nomorSurat}`}>
      <Page size="FOLIO" style={styles.page}>
        <View
          style={{
            ...styles.docContainerBorder,
            paddingHorizontal: 24,
            paddingVertical: 16,
          }}
        >
          <View
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {/* <Image
              style={{
                width: "490px",
                height: "96px",
                // marginVertical: 16,
              }}
              src="/kop_surat1.png"
            /> */}
          </View>
          <View
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <Image
              style={{
                width: "48px",
                height: "48px",
                // marginVertical: 16,
              }}
              src="/favicon.png"
            />
            <Image
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
              }}
              src={`${
                jsonData?.logo_daerah
                  ? jsonData?.logo_daerah + "?not-from-cache-please"
                  : "/favicon.png"
              }`}
              onError={(error) => {
                error.target.src = "/favicon.png";
              }}
            />
          </View>
          <Text
            style={{
              ...styles.textBoldTitle,
              marginBottom: 16,
              lineHeight: 1.7,
            }}
          >
            BERITA ACARA SERAH TERIMA OPERASIONAL {"\n"} BARANG MILIK NEGARA{" "}
            {"\n"} ANTARA {"\n"}
            KEMENTERIAN KESEHATAN {"\n"} DENGAN {"\n"} DINAS KESEHATAN DAERAH{" "}
            {jsonData?.kabupaten} {"\n"} NOMOR {jsonData?.nomorSurat} {"\n"}
            TENTANG {"\n"} HIBAH BARANG MILIK NEGARA YANG DARI SEJAK AWAL
            DISERAHKAN KEPADA {"\n"}
            MASYARAKAT/PEMERINTAH {"\n"} DAERAH DINAS KESEHATAN DAERAH{" "}
            {jsonData?.kabupaten} PADA {"\n"}{" "}
            {formatTanggal(jsonData?.tanggal) || ""}
          </Text>
          <Text style={styles.text}>
            Pada hari ini{" "}
            {moment(jsonData?.tanggal_tte_ppk || defaultDate)
              .locale("id")
              .format("dddd")}
            , tanggal{" "}
            {moment(jsonData?.tanggal_tte_ppk || defaultDate).format("D", "id")}{" "}
            bulan{" "}
            {moment(jsonData?.tanggal_tte_ppk || defaultDate).format("M", "id")}{" "}
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
            {") "} bertempat di Jakarta, yang bertanda tangan di bawah ini:
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
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "70%",
              }}
            >
              <Text style={{ marginRight: 24 }}>1.</Text>
              {/* <Text style={{ marginRight: 16, ...styles.textBold }}>
                (Nama lengkap{"             "}:{"\n"}Kepala Unit Kerja {"\n"}
                tanpa gelar)
              </Text> */}
              <Text
                style={{ marginRight: 16, maxWidth: 120, ...styles.textBold }}
              >
                R Vensya Sitohang
              </Text>
              <Text style={{ ...styles.textBold }}>:</Text>
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
                selaku pimpinan unit kerja pemberi barang milik negara, dalam
                hal ini bertindak untuk dan atas nama {jsonData?.nama_ppk} dan
                berkantor di Jakarta, selanjutnya disebut{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KESATU
                </Text>
              </Text>
            </View>
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
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                marginTop: 8,
                width: "70%",
              }}
            >
              <Text style={{ marginRight: 24 }}>2.</Text>
              <Text
                style={{ marginRight: 16, ...styles.textBold, maxWidth: 120 }}
              >
                {jsonData?.nama_daerah ||
                  `(Nama lengkap{"             "}: {"\n"}Kepala Dinas{"\n"}
                Kesehatan Daerah {"\n"}Provinsi, Kepala Dinas{"\n"}Kesehatan
                Daerah{"\n"}Kabupaten/Kota,{"\n"}Direktur Rumah Sakit {"\n"}
                milik pemerintah{"\n"}
                Daerah/rumah sakit {"\n"}milik swasta tanpa gelar)`}
              </Text>
              <Text style={{ ...styles.textBold }}>:</Text>
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
                selaku Kepala Dinas Kesehatan Daerah Provinsi/Kepala Dinas
                Kesehatan Daerah {jsonData?.kabupaten}/Direktur Rumah Sakit
                penerima hibah barang milik negara{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>
                , dalam hal ini bertindak untuk dan atas nama{" "}
                {jsonData?.nama_daerah} yang berkedudukan dan berkantor di{" "}
                {jsonData?.kabupaten}, selanjutnya disebut sebagai{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>
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
          <Text
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              marginTop: 16,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 16, ...styles.helvetica }}>
              PIHAK KESATU
            </Text>{" "}
            dan{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>
              PIHAK KEDUA
            </Text>{" "}
            selanjutnya secara sendiri-sendiri disebut{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>PIHAK</Text>{" "}
            dan secara bersama-sama disebut{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>
              PARA PIHAK
            </Text>
            {", "}
            terlebih dahulu menerangkan hal-hal sebagai berikut:
          </Text>
          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "row",
              marginTop: 4,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 16 }}>a.</Text>
            <Text style={{ marginRight: 16 }}>
              bahwa{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KESATU
              </Text>{" "}
              adalah Direktur Kementerian Kesehatan selaku{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PEMBERI HIBAH
              </Text>
              ;{" "}
            </Text>
          </View>
          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "row",
              marginTop: 4,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 16 }}>b.</Text>
            <Text style={{ marginRight: 16 }}>
              bahwa{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KEDUA
              </Text>{" "}
              adalah Kepala Dinas Kesehatan Daerah {jsonData?.kabupaten} selaku{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PENERIMA HIBAH
              </Text>
              ;{" "}
            </Text>
          </View>
          <View
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              display: "flex",
              flexDirection: "row",
              marginTop: 4,
              width: "100%",
            }}
          >
            <Text style={{ marginRight: 16 }}>c.</Text>
            <Text style={{ marginRight: 16 }}>
              bahwa{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PARA PIHAK
              </Text>{" "}
              sepakat melakukan serah terima operasional dalam rangka
              pengelolaan barang milik negara yang dari sejak awal diserahkan
              kepada masyarakat/pemerintah daerah di lingkungan Kementerian
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
            Dengan memperhatikan ketentuan:
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
            <Text style={{ marginRight: 16 }}>1.</Text>
            <Text style={{ marginRight: 16 }}>
              Undang-Undang Nomor 1 Tahun 2004 tentang Perbendaharaan Negara
              (Lembaran Negara Republik Indonesia Tahun 2004 Nomor 5, Tambahan
              Lembaran Negara Republik Indonesia Nomor 4355);
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
            <Text style={{ marginRight: 16 }}>2.</Text>
            <Text style={{ marginRight: 16 }}>
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
            <Text style={{ marginRight: 16 }}>3.</Text>
            <Text style={{ marginRight: 16 }}>
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
            <Text style={{ marginRight: 16 }}>3.</Text>
            <Text style={{ marginRight: 16 }}>
              Peraturan Menteri Keuangan Nomor 181/PMK.06/2016 tentang
              Penatausahaan Barang Milik Negara (Berita Negara Republik
              Indonesia Tahun 2016 Nomor 1817);
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
            <Text style={{ marginRight: 16 }}>5.</Text>
            <Text style={{ marginRight: 16 }}>
              Keputusan Menteri Kesehatan Nomor HK.01.07/MENKES/155/2023 tentang
              Pendelegasian Sebagian Wewenang Menteri Kesehatan selaku Pengguna
              Barang kepada Pimpinan Tinggi Madya dan Kuasa Pengguna Barang
              dalam Pengelolaan Barang Milik Negara di Lingkungan Kementerian
              Kesehatan.
            </Text>
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
          <Text
            style={{
              ...styles.text,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              marginTop: 16,
              width: "100%",
            }}
          >
            Berdasarkan hal-hal yang telah diuraikan di atas,{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>
              PARA PIHAK
            </Text>{" "}
            sepakat untuk melakukan serah terima operasional hibah Barang Milik
            Negara yang selanjutnya disebut{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>
              OBJEK HIBAH
            </Text>
            , dari{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>
              PIHAK KESATU
            </Text>{" "}
            kepada{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>
              PIHAK KEDUA
            </Text>
            , dan dituangkan dalam Berita Acara Serah Terima Operasional yang
            selanjutnya disebut{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>BASTO</Text>,
            dengan ketentuan sebagai berikut:
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
              Hibah Barang Milik Negara ini bertujuan untuk mendukung dan
              menunjang penyelenggaraan Tugas Pokok dan Fungsi Dinas Kesehatan
              Daerah
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
              perolehan sebesar Rp {jsonData?.total_harga || ""} dengan rincian
              sebagaimana tercantum dalam lampiran, yang merupakan bagian tidak
              terpisahkan dari{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                BASTO
              </Text>{" "}
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

            <Text
              style={{
                ...styles.text,
                textAlign: "left",
                lineHeight: 1.7,
                letterSpacing: 0.1,
              }}
            >
              Dinas Kesehatan Daerah {jsonData?.kabupaten || ""} adalah sebagai
              penerima hibah atas{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                OBJEK HIBAH
              </Text>
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
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KESATU
              </Text>{" "}
              dan{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KEDUA
              </Text>{" "}
              menerangkan bahwa hibah barang milik negara ini dilakukan dengan
              syarat-syarat sebagai berikut:
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
              <Text style={{ marginRight: 16 }}>a.</Text>
              <Text style={{ marginRight: 16 }}>
                status kepemilikan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>{" "}
                berpindah dari semula barang milik negara pada Pemerintah Pusat
                menjadi barang milik daerah pada Dinas Kesehatan Daerah{" "}
                {jsonData?.kabupaten || ""}{" "}
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
              <Text style={{ marginRight: 16 }}>b.</Text>
              <Text style={{ marginRight: 16 }}>
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                mempergunakan OBJEK HIBAH sesuai dengan peruntukan sebagaimana
                dimaksud dalam Pasal 1.
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
              <Text style={{ marginRight: 16 }}>c.</Text>
              <Text style={{ marginRight: 16 }}>
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KESATU
                </Text>{" "}
                dan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                sepakat untuk melaksanakan hibah barang milik negara tersebut
                sesuai dengan ketentuan peraturan perundang-undangan.
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
              PASAL 5
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
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KESATU
              </Text>{" "}
              berkewajiban untuk:
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
              <Text style={{ marginRight: 16 }}>a.</Text>
              <Text style={{ marginRight: 16 }}>
                menyerahkan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>{" "}
                kepada{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                ; dan
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
              <Text style={{ marginRight: 16 }}>b.</Text>
              <Text style={{ marginRight: 16 }}>
                melakukan koordinasi dengan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                dalam pelaksanaan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  BASTO
                </Text>{" "}
                ini.
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
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                berhak untuk menggunakan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>{" "}
                ketentuan dan persyaratan dalam{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  BASTO
                </Text>{" "}
                ini
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
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                berkewajiban untuk:
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
                menerima penyerahan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>{" "}
                dari{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KESATU
                </Text>
                ;
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
                mencatat{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>
                ;
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
                mempergunakan dan memelihara{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>{" "}
                sesuai ketentuan yang berlaku;
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
                melakukan pengamanan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>{" "}
                yang meliputi pengamanan administrasi, pengamanan fisik,
                pengamanan hukum;
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
                kaitan dengan penggunaan, pemeliharaan, dan pengamanan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>{" "}
                berikut bagian-bagiannya;
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
                dengan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  OBJEK HIBAH
                </Text>{" "}
                ,dan
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
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KESATU
              </Text>{" "}
              menyatakan dan menjamin kepada{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KEDUA
              </Text>{" "}
              dan{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KEDUA
              </Text>{" "}
              menyatakan dan menjamin{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PIHAK KESATU
              </Text>
              , sebagai berikut:
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
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KESATU
                </Text>{" "}
                dan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                mempunyai wewenang penuh untuk menandatangani dan melaksanakan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  BASTO
                </Text>{" "}
                ini;
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
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KESATU
                </Text>{" "}
                dan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                telah melakukan seluruh tindakan yang dibutuhkan dalam
                pengikatan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  BASTO
                </Text>{" "}
                dan
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
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  BASTO
                </Text>{" "}
                ini setelah ditandatangani menjadi sah dan mengikat{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KESATU
                </Text>{" "}
                dan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                untuk melaksanakan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  BASTO
                </Text>{" "}
                ini.
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
              Segala ketentuan dan persyaratan dalam{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                BASTO
              </Text>{" "}
              ini berlaku dan mengikat{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PARA PIHAK
              </Text>
              .
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
              PASAL 9
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
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                BASTO
              </Text>{" "}
              ini dibuat sebanyak 2 (dua) rangkap asli, masing-masing dibubuhi
              meterai yang cukup serta mempunyai kekuatan hukum yang sama
              setelah ditandatangani oleh{" "}
              <Text style={{ marginRight: 16, ...styles.helvetica }}>
                PARA PIHAK
              </Text>{" "}
              dan dibubuhi cap instansi masing-masing. ini berlaku dan mengikat
              .
            </Text>
          </View>
          <Text
            style={{
              ...styles.text,
              textAlign: "left",
              lineHeight: 1.7,
              letterSpacing: 0.1,
              marginTop: 24,
              width: "100%",
            }}
          >
            Demikian{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>BASTO</Text>{" "}
            ini dibuat dengan itikad baik untuk dipatuhi dan dilaksanakan oleh{" "}
            <Text style={{ marginRight: 16, ...styles.helvetica }}>
              PARA PIHAK
            </Text>
            .
          </Text>
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
                  {jsonData?.kepala_unit_pemberi ||
                    "Direktur Fasilitas dan Mutu Pelayanan Kesehatan Primer"}
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
                    fontSize: 11,
                    lineHeight: 1.2,
                    textAlign: "center",
                    letterSpacing: 0.2,
                  }}
                >
                  Nama :{" "}
                  {jsonData?.nama_ppk || "drg. R Vensya Sitohang, M.Epid, Ph.D"}{" "}
                  {"\n"}
                  NIP : {jsonData?.nip_ppk || "196512131991012001"}
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
                    marginTop: 12,
                    fontSize: 11,
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
      {RenderHibahPages(jsonData, true)}
      {/* {RenderBarangPages(jsonData)} */}
      {!distributor && jsonData?.status_tte == "2" && (
        <>
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
                  marginBottom: 16,
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
                  marginBottom: 16,
                  lineHeight: 1.7,
                }}
              >
                NASKAH HIBAH {"\n"} DAN {"\n"} BERITA ACARA SERAH TERIMA {"\n"}{" "}
                BARANG MILIK NEGARA {"\n"} ANTARA {"\n"}
                KEMENTERIAN KESEHATAN {"\n"} DENGAN {"\n"} DINAS KESEHATAN
                DAERAH {jsonData?.kabupaten} {"\n"} NOMOR {jsonData?.nomorSurat}{" "}
                {"\n"}
                TENTANG {"\n"} HIBAH BARANG MILIK NEGARA YANG DARI SEJAK AWAL
                DISERAHKAN KEPADA {"\n"}
                MASYARAKAT/PEMERINTAH {"\n"}PADA {"\n"}{" "}
                {formatTanggal(jsonData?.tanggal) || ""}
              </Text>
              <Text style={styles.text}>
                Berdasarkan Peraturan Menteri Keuangan Nomor 111/PMK.06/2016
                tentang Tata Cara Pelaksanaan Pemindahtanganan Barang Milik
                Negara (Berita Negara Republik Indonesia Tahun 2016 Nomor 1018)
                sebagaimana telah diubah dengan Peraturan Menteri Keuangan Nomor
                165/PMK.06/2021 tentang Perubahan atas Peraturan Menteri
                Keuangan Nomor 111/PMK.06/2016 tentang Tata Cara Pelaksanaan
                Pemindahtanganan Barang Milik Negara (Berita Negara Republik
                Indonesia Tahun 2021 Nomor 1292), dengan ini kami sampaikan
                bahwa telah dilaksanakan pemindahtanganan BMN berupa Hibah
                antara{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KESATU{" "}
                </Text>{" "}
                dalam hal ini
                {jsonData?.kepala_unit_pemberi} yang diwakili{" "}
                {jsonData?.nama_ppk} oleh dan{" "}
                <Text style={{ marginRight: 16, ...styles.helvetica }}>
                  PIHAK KEDUA
                </Text>{" "}
                dalam hal ini Masyarakat/Pemerintah Daerah yang diwakili oleh
                Kepala Dinas Kesehatan {jsonData?.kabupaten} berupa BMN dengan
                rincian terlampir , sejumlah {jsonData?.total_barang_dikirim}{" "}
                dengan total nilai perolehan sebesar Rp{jsonData?.total_harga},
                sesuai dengan Berita Acara Serah Terima Operasional (BASTO)
                nomor {jsonData?.nomorSurat} tanggal {jsonData?.tanggal}{" "}
                (terlampir). Demikian Naskah Hibah dan BAST ini kami buat,
                selanjutnya agar digunakan sebagaimana mestinya.
              </Text>

              <View style={{ marginTop: 16, ...styles.ttdContainer }}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textBold}>
                    JAKARTA,{" "}
                    {moment(jsonData?.tanggal_tte_ppk).format(
                      "D-MM-YYYY",
                      "id"
                    )}{" "}
                  </Text>
                  <Text style={styles.text}>
                    {jsonData?.kepala_unit_pemberi}
                  </Text>
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
          {/* {RenderHibahPages(jsonData, true)} */}
        </>
      )}
    </Document>
  );
  const blob = await pdf(<MyDocument />).toBlob();
  return blob;
};

export default GenerateDokumen;
