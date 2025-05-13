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
import { RenderAlkesPages } from "../Table/TableAlkes";

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
    fontSize: 100, // Ukuran font besar
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: 0.5,
    color: "red", // Warna merah
    opacity: 0.08, // Opacity rendah untuk efek watermark
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
            PROVINSI {jsonData?.provinsi} {"\n\n"}TAHUN 2025
          </Text>
        </View>
        <View style={styles.footer}>
          <Text>
            Downloaded on {downloadDate}. [username ={" "}
            {jsonData?.user_download || ""}]
          </Text>
        </View>
      </Page>

      <Page size="FOLIO" style={styles.page}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            height: 850,
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
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>1.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                Kerangka Proposal SOPHI
              </Text>
            </View>
            <View
              style={{
                ...styles.text,
                lineHeight: 1.7,
                letterSpacing: 0.1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginVertical: 16,
              }}
            >
              <Text style={{ ...styles.helvetica, textAlign: "center" }}>
                OUTLINE PROPOSAL USULAN PEMENUHAN ALAT KESEHATAN {"\n"}
                DI PUSKESMAS {"\n"}
                KABUPATEN/ KOTA ………
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
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>A.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                LATAR BELAKANG
              </Text>
            </View>
            {/* <View
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
                2025 ini.
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
                tahun 2025 ini kami mengajukan perbaikan usulan pemenuhan alat
                kesehatan di puskesmas, pustu, dan posyandu kepada Kementerian
                Kesehatan.
              </Text>
            </View> */}
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

            {/* <View
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
            </View> */}
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
                Data Usulan Alat Kesehatan
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
              <Text>Data usulan alat, jumlah dan peralatan pada puskesmas</Text>
            </View>

            {/* <View
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
                Data usulan alat, jumlah dan peralatan pada puskesmas pembantu
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
              <Text>Data usulan alat, jumlah dan peralatan pada posyandu</Text>
            </View> */}
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
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>D.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                Ketersediaan SDM Kesehatan
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
              <Text>Data ketersediaan SDM kesehatan pada puskesmas</Text>
            </View>

            {/* <View
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
                Data ketersediaan SDM kesehatan pada puskesmas pembantu
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
              <Text>Data ketersediaan SDM kesehatan pada posyandu</Text>
            </View> */}
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
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>E.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                Ketersediaan Sarpras Pendukung
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
              <Text>Data ketersediaan sarana dan prasarana pada puskesmas</Text>
            </View>

            {/* <View
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
                Data ketersediaan sarana dan prasarana pada puskesmas pembantu
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
              <Text>Data ketersediaan sarana dan prasarana pada posyandu</Text>
            </View> */}
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
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>F.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                Penutup
              </Text>
            </View>
          </View>

          {/* <View
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
                sesuai data SISDMK per Juni 2025 yang terdiri dari minimal 2
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
          </View> */}

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
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>G.</Text>
              <Text style={{ ...styles.helvetica, marginRight: 16 }}>
                Lampiran
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
                No.HP :{"\n"}
                Bagian:{"\n"}
              </Text>
            </View>
          </View>

          {/* <View
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
          </View> */}

          <Text
            style={{
              ...styles.text,
              textAlign: "right",
              paddingRight: 92,
              marginTop: 16,
            }}
          >
            Tempat, ............................
          </Text>

          <View style={{ ...styles.ttdContainer, marginTop: 0 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ ...styles.helvetica, textAlign: "center" }}>
                Direviu atau diverifikasi:
              </Text>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                Inspektorat Daerah {"\n"} {jsonData?.kabupaten || ""}
              </Text>
              <View style={{ ...styles.imageTtd, marginVertical: 0 }}></View>
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
            <View style={{ flex: 1 }}>
              <Text style={{ ...styles.helvetica, textAlign: "center" }}>
                Yang Mengajukan:
              </Text>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                Kepala Dinas Kesehatan {"\n"} {jsonData?.kabupaten || ""}
              </Text>
              <View style={{ ...styles.imageTtd, marginVertical: 0 }}></View>
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
          <View style={styles.ttdContainer}>
            <View style={{ flex: 1 }}>
              <Text style={{ ...styles.helvetica, textAlign: "center" }}>
                Ditelaah:{" "}
              </Text>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                Bappeda {"\n"} {jsonData?.kabupaten || ""}
              </Text>
              <View style={{ ...styles.imageTtd, marginVertical: 0 }}></View>
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
            <View style={{ flex: 1 }}></View>
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
                2025 ini.
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
                tahun 2025 ini kami mengajukan perbaikan usulan pemenuhan alat
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
                sesuai data SISDMK per Juni 2025 yang terdiri dari minimal 2
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
            Downloaded on {downloadDate}. [username ={" "}
            {jsonData?.user_download || ""}]
          </Text>
        </View>
      </Page> */}

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
              <Text style={{ ...styles.helvetica, textAlign: "center" }}>
                SURAT PERNYATAAN{" "}
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
                Dengan ini menyatakan bahwa informasi yang tertera di proposal
                usulan alkes untuk 7 alat (Opthalmoskop, otoskop, garpu tala,
                spray can, sanitarian kit, CO analyzer, dan thermal ablation)
                sudah sesuai dengan kebutuhan Puskesmas. Selain itu, Dinas
                Kesehatan juga berkomitmen untuk:{" "}
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
                Memastikan bahwa sarana dan prasarana (Listrik, internet, luas
                ruangan, luas bangunan, dll.) memenuhi standar dan tersedia
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
                Menjalankan Integrasi layanan Primer (ILP) pada Puskesmas, Pustu
                dan posyandu yang mengusulkan alat kesehatan.
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
                Tidak menganggarkan melalui pembiayaan lainnya untuk alat
                kesehatan yang diusulkan sampai dengan alat kesehatan tersebut
                sudah terdistribusi.
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
              <Text style={{ marginRight: 8 }}>7.</Text>
              <Text>
                Ikut serta memastikan pendistribusikan alat kesehatan hingga ke
                puskesmas, pustu dan posyandu sesuai dengan Keputusan Menteri
                Kesehatan Nomor HK.01.07/MENKES/1578/2024, Perubahan atas
                Keputusan Menteri Kesehatan Nomor HK.01.07/MENKES/1047/2024
                tentang Standar Peralatan Dalam Rangka Penguatan Pelayanan
                Kesehatan Primer Pada Pusat Kesehatan Masyarakat, Unit Pelayanan
                Kesehatan di Desa/Kelurahan, dan Pos Pelayanan Terpadu.
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
              <Text style={{ marginRight: 8 }}>8.</Text>
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
              <Text style={{ marginRight: 8 }}>9.</Text>
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
              <Text style={{ marginRight: 4 }}>10.</Text>
              <Text>
                Menanggung biaya operasional alat laboratorium dalam bentuk
                reagen dan BMHP, serta sarana prasana lainnya (Listrik,
                internet, ruangan, dll.){" "}
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
              Alkes untuk 7 alat (Opthalmoskop, otoskop, garpu tala, spray can,
              sanitarian kit, CO analyzer, dan thermal ablation) melalui proyek
              SOPHI. Demikian pernyataan ini dibuat dengan sebenar-benarnya
              dalam keadaan sadar, untuk digunakan sebagaimana mestinya.{" "}
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
      {RenderAlkesPages(jsonData, preview)}

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
      </Page>

      {RenderBarangPages(jsonData, preview)}
      {RenderHibahPages(jsonData, preview)}
    </Document>
  );
  const blob = await pdf(<MyDocument />).toBlob();
  return blob;
};

export default GenerateDokumen;
