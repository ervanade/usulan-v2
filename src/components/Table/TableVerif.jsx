import {
  Page,
  Document,
  Image,
  StyleSheet,
  View,
  Text,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { alkesDokumen } from "../../data/data";

const defaultImage =
  "https://media.istockphoto.com/id/1472819341/photo/background-white-light-grey-total-grunge-abstract-concrete-cement-wall-paper-texture-platinum.webp?b=1&s=170667a&w=0&k=20&c=yoY1jUAKlKVdakeUsRRsNEZdCx2RPIEgaIxSwQ0lS1k=";

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
// Define column widths
const COL1_WIDTH = 5; // No
const COLN_WIDTH = (100 - COL1_WIDTH) / 4;
const COL2_WIDTH = 25; // Nama Alkes (divided into 2 sub-columns)
const COL3_WIDTH = 35; // Puskesmas (divided into 3 sub-columns with one having 2 sub-sub-columns)
const COL4_WIDTH = 35; // Hasil Deck (divided into 2 sub-columns)

// Sub-column widths for Nama Alkes
const SUBCOL2_WIDTH = COL2_WIDTH / 2; // Nama Alkes and Jumlah Minimal Standar Alat
const SUBCOL2_SUB_WIDTH = SUBCOL2_WIDTH / 2; // For Ranap and Non Ranap (but will be merged in row)

// Sub-column widths for Puskesmas
const SUBCOL3_WIDTH = COL3_WIDTH / 3; // Total PKM, Jumlah PKM Memiliki Alat Sesuai Standar
const SUBCOL3_PROPOSAL_WIDTH = SUBCOL3_WIDTH / 2; // Mengusulkan (proposal) sub-columns

// Sub-column widths for Hasil Deck
const SUBCOL4_WIDTH = COL4_WIDTH / 2; // Jumlah PKM yang Mengusulkan Alat and Jumlah Alat yang Diusulkan

const styles = StyleSheet.create({
  viewer: {
    width: "100%", //the pdf viewer will take up all of the width and height
    height: "100%",
  },
  page: {
    fontSize: 8,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    lineHeight: 1.5,
    flexDirection: "column",
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
    height: 600,
    paddingVertical: "24px",
    paddingLeft: "10px",
    paddingRight: "16px",
  },
  ttdContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    //   alignItems: "flex-start",
    marginTop: 0,
    display: "flex",
    width: "100%",
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
    width: 30,
    height: 25,
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
    paddingVertical: 2,
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
    margin: 2, // Margin dihilangkan
    lineHeight: 1.2,
    fontWeight: 500,
    textAlign: "center",
    verticalAlign: "middle",
    padding: 0, // Padding dihilangkan
  },
  tableCell: {
    margin: 5,
    fontSize: 8,
    lineHeight: 1,
    textAlign: "center",
    verticalAlign: "middle",
  },
  nestedHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
  },
  nestedHeaderCell: {
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
  },
  mainHeaderCell: {
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 24,
    fontSize: 8,
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
const formatRupiah = (price) => {
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};
const ITEMS_PER_PAGE = 20;

const getAllDetailDistribusi = (distribusi) => {
  return distribusi?.map((item, index) => ({
    no: index + 1 || "",
    namaAlkes: item?.nama_alkes || "",
    standard_rawat_inap: item.total_standard_rawat_inap || "",
    standard_non_inap: item.total_standard_non_inap || "",
    totalPkm: item?.total_puskesmas || "",
    pkmMemilikiAlat: item?.total_puskesmas_berfungsi || "",
    proposalDidukungSdm: item?.proposal_didukung_sdm || "",
    proposalTidakDidukungSdm: item?.total_puskesmas_non_sdm || "",
    pkmMengusulkanAlat: item?.pkm_mengusulkan_alat || "",
    jumlahAlatDiusulkan: item?.jumlah_alat_diusulkan || "",
  }));
};

export const RenderVerifPages = (jsonData, preview) => {
  const dataBarang = getAllDetailDistribusi(jsonData?.ba_verif || []);
  const pages = [];
  const totalItems = dataBarang?.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
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

  for (let i = 0; i < totalPages; i++) {
    const start = i * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const currentData = dataBarang.slice(start, end);
    const isLastPage = i === totalPages - 1;
    const isFirstPage = i === 0;

    pages.push(
      <Page
        key={i}
        size="FOLIO"
        style={{ paddingTop: 0, ...styles.page }}
        orientation="landscape"
      >
        <Text style={{ ...styles.watermark, left: preview ? "25%" : "43%" }}>
          {preview ? "PREVIEW" : "FINAL"}
        </Text>
        {isFirstPage && (
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
                Catatan hasil verifikasi:{"\n"}
              </Text>
              Dari total {jsonData?.distribusi?.length || ""} Puskesmas di
              Kab/Kota {jsonData?.kabupaten}, Dinas Kesehatan mengajukan usulan
              proposal pengadaan alat untuk Puskesmas untuk pemenuhan standar
              alat dalam penguatan pelayanan kesehatan primer di Puskesmas.
            </Text>
          </View>
        )}

        <View
          style={{
            paddingVertical: 0,
            marginTop: 8,
            height: 530,
          }}
        >
          <View style={styles.table}>
            {/* Main Header Row */}
            <View style={styles.nestedHeaderRow}>
              {/* No */}
              <View
                style={[
                  styles.mainHeaderCell,
                  { width: `${COL1_WIDTH}%` },
                  { borderBottomWidth: 0, borderBottomColor: "transparent" },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, marginBottom: -18 }}>
                  No
                </Text>
              </View>

              {/* Nama Alkes */}
              <View
                style={[styles.mainHeaderCell, { width: `${COL2_WIDTH}%` }]}
              >
                <Text style={styles.tableCellHeader}>Alat Kesehatan</Text>
              </View>

              {/* Puskesmas */}
              <View
                style={[styles.mainHeaderCell, { width: `${COL3_WIDTH}%` }]}
              >
                <Text style={styles.tableCellHeader}>Puskesmas</Text>
              </View>

              {/* Hasil Deck */}
              <View
                style={[styles.mainHeaderCell, { width: `${COL4_WIDTH}%` }]}
              >
                <Text style={styles.tableCellHeader}>Hasil Deck</Text>
              </View>
            </View>

            {/* Second Header Row (Sub-columns) */}
            <View style={styles.nestedHeaderRow}>
              {/* No - empty */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${COL1_WIDTH}%` },
                  { borderBottomWidth: 0, borderBottomColor: "transparent" },
                ]}
              ></View>

              {/* Nama Alkes sub-columns */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL2_WIDTH}%` },
                  { borderBottomWidth: 0, borderBottomColor: "transparent" },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, marginBottom: -2 }}>
                  Nama Alkes
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL2_WIDTH}%` },
                ]}
              >
                <Text style={styles.tableCellHeader}>
                  Jumlah Minimal Standar Alat
                </Text>
              </View>

              {/* Puskesmas sub-columns */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_WIDTH}%` },
                  { borderBottomWidth: 0, borderBottomColor: "transparent" },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, marginBottom: -2 }}>
                  Total PKM
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_WIDTH}%` },
                  { borderBottomWidth: 0, borderBottomColor: "transparent" },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, marginBottom: -2 }}>
                  Jumlah PKM Memiliki Alat Sesuai Standar
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_WIDTH}%` },
                ]}
              >
                <Text style={styles.tableCellHeader}>
                  Mengusulkan (proposal)
                </Text>
              </View>

              {/* Hasil Deck sub-columns */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL4_WIDTH}%` },
                  { borderBottomWidth: 0, borderBottomColor: "transparent" },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, marginBottom: -2 }}>
                  Jumlah PKM yang Mengusulkan Alat
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL4_WIDTH}%` },
                  { borderBottomWidth: 0, borderBottomColor: "transparent" },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, marginBottom: -2 }}>
                  Jumlah Alat yang Diusulkan
                </Text>
              </View>
            </View>

            {/* Third Header Row (Sub-sub-columns) */}
            <View style={styles.nestedHeaderRow}>
              {/* No - empty */}
              <View
                style={[styles.nestedHeaderCell, { width: `${COL1_WIDTH}%` }]}
              ></View>

              {/* Nama Alkes sub-sub-columns */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL2_WIDTH}%` },
                ]}
              ></View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL2_SUB_WIDTH}%` },
                ]}
              >
                <Text style={styles.tableCellHeader}>Ranap</Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL2_SUB_WIDTH}%` },
                ]}
              >
                <Text style={styles.tableCellHeader}>Non Ranap</Text>
              </View>

              {/* Puskesmas sub-sub-columns (only for proposal) */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_WIDTH}%` },
                ]}
              ></View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_WIDTH}%` },
                ]}
              ></View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_PROPOSAL_WIDTH}%` },
                ]}
              >
                <Text style={styles.tableCellHeader}>
                  Didukung Ketersediaan SDM
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_PROPOSAL_WIDTH}%` },
                ]}
              >
                <Text style={styles.tableCellHeader}>
                  Tidak didukung Ketersediaan SDM
                </Text>
              </View>

              {/* Hasil Deck - no sub-sub-columns */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL4_WIDTH}%` },
                ]}
              ></View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL4_WIDTH}%` },
                ]}
              ></View>
            </View>

            {/* Data rows */}
            {currentData.map((items, index) => (
              <View style={styles.tableRow} key={index}>
                {/* No */}
                <View style={[styles.tableCol1, { width: `${COL1_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>{start + index + 1}</Text>
                </View>

                {/* Nama Alkes */}
                <View style={[styles.tableCol, { width: `${SUBCOL2_WIDTH}%` }]}>
                  <Text style={{ ...styles.tableCell, textAlign: "left" }}>
                    {items.namaAlkes || ""}
                  </Text>
                </View>

                {/* Jumlah Minimal Standar Alat (merged Ranap and Non Ranap) */}
                <View
                  style={[styles.tableCol, { width: `${SUBCOL2_SUB_WIDTH}%` }]}
                >
                  <Text style={styles.tableCell}>
                    {items.standard_rawat_inap || "0"}
                  </Text>
                </View>
                <View
                  style={[styles.tableCol, { width: `${SUBCOL2_SUB_WIDTH}%` }]}
                >
                  <Text style={styles.tableCell}>
                    {items.standard_non_inap || "0"}
                  </Text>
                </View>

                {/* Puskesmas columns */}
                <View style={[styles.tableCol, { width: `${SUBCOL3_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>{items.totalPkm || "0"}</Text>
                </View>
                <View style={[styles.tableCol, { width: `${SUBCOL3_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.pkmMemilikiAlat || "0"}
                  </Text>
                </View>

                {/* Proposal columns */}
                <View
                  style={[
                    styles.tableCol,
                    { width: `${SUBCOL3_PROPOSAL_WIDTH}%` },
                  ]}
                >
                  <Text style={styles.tableCell}>
                    {items.proposalDidukungSdm || "0"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: `${SUBCOL3_PROPOSAL_WIDTH}%` },
                  ]}
                >
                  <Text style={styles.tableCell}>
                    {items.proposalTidakDidukungSdm || "0"}
                  </Text>
                </View>

                {/* Hasil Deck columns */}
                <View style={[styles.tableCol, { width: `${SUBCOL4_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.pkmMengusulkanAlat || ""}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: `${SUBCOL4_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.jumlahAlatDiusulkan || ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <Text>
            Downloaded on {downloadDate}. [username ={" "}
            {jsonData?.user_download || ""}]
          </Text>
        </View>
      </Page>
    );
  }

  return pages;
};
