import React, { useEffect, useState, useRef } from "react";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Font,
  pdf,
} from "@react-pdf/renderer";
import moment from "moment";
import "moment/dist/locale/id";
import { RenderHibahPages } from "../Table/TableHibah";
import { RenderBarangPages } from "../Table/TableLampiran";
import { RenderVerifPages } from "../Table/TableVerif";

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
    left: "43%", // Posisi tengah horizontal
    transform: "translate(-50%, -50%) rotate(-45deg)", // Pusatkan dan miringkan 45 derajat ke kiri bawah
    fontSize: 90, // Ukuran font besar
    color: "red", // Warna merah
    opacity: 0.08, // Opacity rendah untuk efek watermark
    zIndex: -1, // Letakkan di belakang konten lain
  },
});

const GenerateVerif = async (jsonData, preview) => {
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
        <Text style={{ ...styles.watermark, left: preview ? "30%" : "43%" }}>
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
              <Text
                style={{
                  ...styles.helvetica,
                  lineHeight: 1.7,
                  letterSpacing: 0.1,
                  width: "100%",
                  fontSize: 10,
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                BERITA ACARA VERIFIKASI {"\n"} DINAS KESEHATAN{" "}
                {jsonData?.kabupaten}
                {"\n"}
                PROPOSAL USULAN PEMENUHAN ALAT KESEHATAN DI PUSKESMAS
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
                Berkaitan dengan proposal usulan pemenuhan alat kesehatan di
                Puskesmas oleh {jsonData?.kabupaten} melalui proyek
                STRENGTHENING ON PRIMARY HEALTH CARE IN INDONESIA (SOPHI), kami
                sampaikan bahwa telah dilakukan verifikasi terkait jumlah usulan
                alat kesehatan, ketersediaan SDM Kesehatan dan Sarana Prasarana,
                serta kesiapan Pukesmas untuk mengoperasikan alkes yang
                diusulkan (proposal terlampir). Selain itu, Dinas Kesehatan juga
                berkomitmen untuk:
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
              <Text style={{ marginRight: 8 }}>1.</Text>
              <Text>
                Melaksanakan Permenkes Nomor 31 tahun 2018 dengan melakukan
                update data sarana, prasarana dan alat kesehatan secara riil
                melalui aplikasi ASPAK dan telah divalidasi oleh Dinas
                Kesehatan, Inspektorat Daerah dan Bappeda.
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
              <Text style={{ marginRight: 8 }}>2.</Text>
              <Text>
                Memastikan SDM tetap ada agar barang tetap dapat digunakan
                secara optimal oleh tenaga kesehatan yang sesuai dengan
                kompetensinya sebelum alat didistribusikan.
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
              <Text style={{ marginRight: 8 }}>3.</Text>
              <Text>
                Memastikan bahwa sarana dan prasarana (luas ruangan, listrik,
                internet, IPAL, air bersih) memenuhi standar dan tersedia
                sebelum alat didistribusikan.
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
              <Text style={{ marginRight: 8 }}>4.</Text>
              <Text>
                Tidak menggarkan melalui pembiayaan lainnya untuk alat kesehatan
                yang diusulkan sampai dengan alat kesehatan tersebut sudah
                terdistribusi.
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
              <Text style={{ marginRight: 8 }}>5.</Text>
              <Text>
                Sanggup menerima alat sesuai dengan alat yang diusulkan dan akan
                melakukan pencatatan alat ke ASPAK setelah alat
                diserahterimakan.
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
              <Text style={{ marginRight: 8 }}>6.</Text>
              <Text>
                Ikut serta memastikan pendistribusian alat kesehatan hingga ke
                puskesmas, pustu, dan posyandu sesuai dengan Kepmenkes tentang
                Standar Peralatan dalam Rangka Penguatan Pelayanan Kesehatan
                Primer pada Pusat Kesehatan Masyarakat, Unit Pelayanan Kesehatan
                di Desa/Kelurahan, dan Pos Pelayanan Terpadu.
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
              <Text style={{ marginRight: 8 }}>7.</Text>
              <Text>
                Menyiapkan biaya operasional untuk pemeliharaan alat kesehatan,
                reagen dan BMHP, serta sarana prasarana lainnya (luas ruangan,
                listrik, internet, IPAL, air bersih).
              </Text>
            </View>

            {/* <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ marginRight: 8 }}>8.</Text>
              <Text>
                Menyiapkan biaya operasional dan biaya pemeliharaan seluruh alat
                kesehatan yang diusulkan.
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
              <Text style={{ marginRight: 8 }}>9.</Text>
              <Text>
                Menanggung biaya operasional alat laboratorium dalam bentuk
                reagen dan BMHP, serta sarana prasarana lainnya (listrik,
                internet, ruangan, dll.)
              </Text>
            </View> */}
          </View>

          {/* <View
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
              <Text
                style={{
                  ...styles.helvetica,
                  lineHeight: 1.7,
                  letterSpacing: 0.1,
                  width: "100%",
                  fontSize: 8,
                  textAlign: "left",
                }}
              >
                Rekomendasi:{"\n"}
              </Text>
              (update ASPAK dan SISDMK) dan ditambahkan menyesuaikan dengan
              kondisi kab/kota saat desk……………………………..{"\n"}Demikian berita acara
              ini dibuat dengan sesungguhnya serta disahkan dengan tanggung
              jawab penuh agar bisa digunakan sebagaimana mestinya. Jika
              dikemudian hari ditemukan ketidaksesuaian dari readiness criteria
              dari usulan yang disampaikan, pihak pengusul dapat bertanggung
              jawab sesuai dengan ketentuan berlaku.
            </Text>
          </View> */}
          <View style={styles.ttdContainer}>
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                ...............,...................2025
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
            Downloaded on {downloadDate}. [username ={" "}
            {jsonData?.user_download || ""}]
          </Text>
        </View>
      </Page>
      {/* <Page size="FOLIO" style={styles.page}>
        <Text style={{ ...styles.watermark, left: preview ? "25%" : "39%" }}>
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
              <Text
                style={{
                  ...styles.helvetica,
                  textAlign: "center",
                  textDecoration: "underline",
                }}
              >
                SURAT PERNYATAAN{" "}
              </Text>
              <Text style={{ ...styles.helvetica, textAlign: "center" }}>
                No. {"                   "}
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
                Jabatan :{"\n"}
                Instansi :{"\n\n"}
                Dengan ini menyatakan bahwa informasi yang tertera di proposal
                usulan alat kesehatan untuk alkes sudah sesuai dengan kebutuhan
                Puskesmas. {"\n"} Selain itu, Dinas Kesehatan juga berkomitmen
                untuk:{" "}
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
              <Text style={{ marginRight: 8 }}>1.</Text>
              <Text>
                Melaksanakan Permenkes 31 tahun 2018 dengan melakukan update
                data sarana, prasarana dan alat kesehatan secara riil melalui
                aplikasi ASPAK oleh puskesmas dan telah di validasi oleh Dinas
                Kesehatan Kabupaten/Kota.
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
              <Text style={{ marginRight: 8 }}>2.</Text>
              <Text>
                Memastikan SDM tetap ada agar barang tetap dapat digunakan
                secara optimal oleh tenaga kesehatan yang sesuai dengan
                kompetensinya sebelum alat didistribusikan.
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
              <Text style={{ marginRight: 8 }}>3.</Text>
              <Text>
                Memastikan bahwa sarana dan prasarana (luas ruangan, listrik,
                internet, IPAL, air bersih) memenuhi standar dan tersedia
                sebelum alat didistribusikan.
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
              <Text style={{ marginRight: 8 }}>4.</Text>
              <Text>
                Tidak menggarkan melalui pembiayaan lainnya untuk alat kesehatan
                yang diusulkan sampai dengan alat kesehatan tersebut sudah
                terdistribusi.
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
              <Text style={{ marginRight: 8 }}>5.</Text>
              <Text>
                Sanggup menerima alat sesuai dengan alat yang diusulkan dan akan
                melakukan pencatatan alat ke ASPAK setelah alat
                diserahterimakan.
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
              <Text style={{ marginRight: 8 }}>6.</Text>
              <Text>
                Ikut serta memastikan pendistribusian alat kesehatan hingga ke
                puskesmas sesuai dengan Kepmenkes tentang Standar Peralatan
                dalam Rangka Penguatan Pelayanan Kesehatan Primer pada Pusat
                Kesehatan Masyarakat.{" "}
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
              <Text style={{ marginRight: 8 }}>7.</Text>
              <Text>
                Menyiapkan biaya operasional untuk pemeliharaan alat kesehatan,
                reagen dan BMHP, serta sarana prasarana lainnya (luas ruangan,
                listrik, internet, IPAL, air bersih).{" "}
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
            <Text>
              Dinas Kesehatan {jsonData?.kabupaten} menyatakan akan
              bertanggungjawab atas kebenaran data yang disampaikan dalam usulan
              alat kesehatan untuk 50 alat jenis alkes melalui proyek SOPHI.{" "}
              {"\n"}Demikian pernyataan ini dibuat dengan sebenar-benarnya dalam
              keadaan sadar, untuk digunakan sebagaimana mestinya.{" "}
            </Text>
          </View>

          <View style={styles.ttdContainer}>
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                ...............,...................2025
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
            Downloaded on {downloadDate}. [username ={" "}
            {jsonData?.user_download || ""}]
          </Text>
        </View>
      </Page> */}

      {RenderVerifPages(jsonData, preview)}
      <Page size="FOLIO" style={styles.page}>
        <Text style={{ ...styles.watermark, left: preview ? "25%" : "39%" }}>
          {preview ? "PREVIEW" : "FINAL"}
        </Text>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            height: 800,
          }}
        >
          <>
            {/* <Text>*Eligible (SDM+ASPAK+Listrik{">"}10kVA)</Text> */}

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
                <Text
                  style={{
                    ...styles.helvetica,
                    lineHeight: 1.7,
                    letterSpacing: 0.1,
                    width: "100%",
                    fontSize: 8,
                    textAlign: "left",
                  }}
                >
                  Rekomendasi:{"\n"}
                </Text>
                .................................................................................................................................................................................................................................................................................
                {"\n"}
                .................................................................................................................................................................................................................................................................................{" "}
                {"\n"}{" "}
                .................................................................................................................................................................................................................................................................................
                {/* (update ASPAK dan SISDMK) dan ditambahkan menyesuaikan dengan
                  kondisi kab/kota saat desk……………………………..{"\n"}Demikian berita
                  acara ini dibuat dengan sesungguhnya serta disahkan dengan
                  tanggung jawab penuh agar bisa digunakan sebagaimana mestinya.
                  Jika dikemudian hari ditemukan ketidaksesuaian dari readiness
                  criteria dari usulan yang disampaikan, pihak pengusul dapat
                  bertanggung jawab sesuai dengan ketentuan berlaku. */}
              </Text>
            </View>
            <Text style={{ marginTop: 16 }}>
              Demikian berita acara ini dibuat dengan sesungguhnya serta
              disahkan dengan tanggung jawab penuh agar bisa digunakan
              sebagaimana mestinya. Jika dikemudian hari ditemukan
              ketidaksesuaian dari readiness criteria dari usulan yang
              disampaikan, pihak pengusul dapat bertanggung jawab sesuai dengan
              ketentuan berlaku.
            </Text>
            <View style={{ ...styles.ttdContainer, marginTop: 24 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...styles.text,
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  {/* Jakarta, dd mm 2025 */}
                </Text>
                Yang membuat pernyataan
                <Text
                  style={{
                    ...styles.text,
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Informan/Narasumber {"\n"} Kepala Dinas Kesehatan{"\n"}
                  {jsonData?.kabupaten}
                </Text>
                <View style={{ ...styles.imageTtd, marginVertical: 8 }}></View>
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: "Calibri",
                    marginTop: 8,
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
              <View style={{ flex: 1 }}>
                <Text style={{ ...styles.text, textAlign: "center" }}>
                  ...................., ...... Mei 2025
                </Text>
                Yang membuat pernyataan
                <Text
                  style={{
                    ...styles.text,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Verifikator {"\n"} ..........
                </Text>
                <View style={{ ...styles.imageTtd, marginVertical: 8 }}></View>
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: "Calibri",
                    marginTop: 8,
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
            {/* <Text
                style={{ ...styles.text, textAlign: "center", marginTop: 24 }}
              >
                Mengetahui,
              </Text> */}
            <View style={{ ...styles.ttdContainer, marginTop: 8 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...styles.text,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Informan/Narasumber {"\n"}Bappeda{"\n"}
                  {jsonData?.kabupaten}
                </Text>
                <View style={{ ...styles.imageTtd, marginVertical: 4 }}></View>
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: "Calibri",
                    marginTop: 8,
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
              <View style={{ flex: 1 }}>
                Yang membuat pernyataan
                <Text
                  style={{
                    ...styles.text,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Informan/Narasumber {"\n"}Inspektorat Daerah{"\n"}
                  {jsonData?.kabupaten}
                </Text>
                <View style={{ ...styles.imageTtd, marginVertical: 4 }}></View>
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: "Calibri",
                    marginTop: 8,
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
            <View
              style={{
                ...styles.ttdContainer,
                marginTop: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View>
                Yang membuat pernyataan
                <Text
                  style={{
                    ...styles.text,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Ketua Tim Kerja Sarana, Prasarana, dan Alat {"\n"} Kesehatan
                  Pelayanan Kesehatan Primer
                </Text>
                <View style={{ ...styles.imageTtd, marginVertical: 8 }}></View>
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: "Calibri",
                    marginTop: 8,
                    fontSize: 8,
                    paddingRight: 8,
                    lineHeight: 1.2,
                    textAlign: "center",
                    letterSpacing: 0.2,
                  }}
                >
                  Bondan Wicaksono Adhi, S.E., M.B.A
                </Text>
                <Text
                  style={{
                    ...styles.text,
                    fontFamily: "Calibri",
                    paddingRight: 16,
                    fontSize: 8,
                    lineHeight: 1.2,
                    textAlign: "center",
                    letterSpacing: 0.2,
                  }}
                >
                  NIP. 198705262010121002
                </Text>
              </View>
            </View>
          </>
        </View>
        <View style={styles.footer}>
          <Text>
            Downloaded on {downloadDate}. [username ={" "}
            {jsonData?.user_download || ""}]
          </Text>
        </View>
      </Page>
    </Document>
  );
  const blob = await pdf(<MyDocument />).toBlob();
  return blob;
};

export default GenerateVerif;
