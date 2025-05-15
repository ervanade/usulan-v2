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
import moment from "moment";

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
const COLN_WIDTH = (100 - COL1_WIDTH) / 5;
const COL2_WIDTH = 35; // Nama Alkes (divided into 2 sub-columns)
const COL3_WIDTH = 10; // Puskesmas (divided into 3 sub-columns with one having 2 sub-sub-columns)
const COL4_WIDTH = 10; // Hasil Desk (divided into 2 sub-columns)
const COL5_WIDTH = 10; // Hasil Desk (divided into 2 sub-columns)
const COL6_WIDTH = 10; // Hasil Desk (divided into 2 sub-columns)
const COL7_WIDTH = 20; // Hasil Desk (divided into 2 sub-columns)

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
    height: 30,
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
    margin: 3.5,
    fontSize: 8,
    lineHeight: 1.2,
    fontWeight: 500,
    textAlign: "center",
    verticalAlign: "middle",
  },
  tableCell: {
    margin: 3.5,
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

const ITEMS_PER_PAGE = 51;

const formatRupiah = (price) => {
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const getAllDetailDistribusi = (distribusi) => {
  return distribusi.map((d, distribusiIndex) => ({
    lampiran: distribusiIndex + 1,
    nama_puskesmas: d.nama_puskesmas,
    kode_puskesmas: d.kode_puskesmas,
    details: d.alkes.map((item, index) => ({
      no: index + 1 || "",
      namaAlkes: item.nama_alkes || "",
      standard_rawat_inap: item.standard_rawat_inap || "",
      standard_non_inap: item.standard_non_inap || "",
      berfungsi: item.berfungsi || "",
      usulan: item.usulan,
      alasan: item.keterangan_usulan || "",
    })),
  }));
};

export const RenderHibahPages = (jsonData, preview) => {
  const distribusiData = getAllDetailDistribusi(jsonData?.distribusi || []);
  const pages = [];
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

  distribusiData.forEach((distribusi, distribusiIndex) => {
    const totalItems = distribusi.details.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    for (let i = 0; i < totalPages; i++) {
      const start = i * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const currentData = distribusi.details.slice(start, end);
      const isLastPage = i === totalPages - 1;

      pages.push(
        <>
          <Page
            key={`${distribusi.lampiran}-${i}`}
            size="FOLIO"
            style={{ paddingTop: 0, ...styles.page }}
          >
            <Text
              style={{ ...styles.watermark, left: preview ? "25%" : "39%" }}
            >
              {preview ? "PREVIEW" : "FINAL"}
            </Text>
            <View
              style={{
                paddingVertical: 0,
                marginTop: 0,
                height: 865,
              }}
            >
              <View
                style={{
                  ...styles.titleContainer,
                  marginBottom: 0,
                  marginTop: 0,
                }}
              >
                <Text
                  style={{
                    ...styles.reportTitle,
                    letterSpacing: 0.7,
                    width: "100%",
                    lineHeight: 1.5,
                  }}
                >
                  <Text
                    style={{
                      ...styles.helvetica,
                      letterSpacing: 0.7,
                      width: "100%",
                      lineHeight: 1.5,
                    }}
                  >
                    Lampiran {distribusi.lampiran}.{i + 1}. Data usulan alat,
                    jumlah dan peralatan pada puskesmas.
                  </Text>
                  {"\n"}Kode Puskesmas: {distribusi?.kode_puskesmas} {"   "}{" "}
                  Nama Puskesmas: {distribusi?.nama_puskesmas}
                </Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View
                    style={{
                      ...styles.tableCol1Header,
                      width: `${COL1_WIDTH}%`,
                    }}
                  >
                    <Text style={styles.tableCellHeader}>No</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableColHeader,
                      width: `${COL2_WIDTH}%`,
                    }}
                  >
                    <Text style={styles.tableCellHeader}>Nama Alkes</Text>
                  </View>

                  <View
                    style={{
                      ...styles.tableColHeader,
                      width: `${COL3_WIDTH}%`,
                    }}
                  >
                    <Text style={styles.tableCellHeader}>
                      Standar Rawat Inap
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableColHeader,
                      width: `${COL4_WIDTH}%`,
                    }}
                  >
                    <Text style={styles.tableCellHeader}>
                      Standar Non Rawat Inap
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableColHeader,
                      width: `${COL5_WIDTH}%`,
                    }}
                  >
                    <Text style={styles.tableCellHeader}>Eksisting</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableColHeader,
                      width: `${COL6_WIDTH}%`,
                    }}
                  >
                    <Text style={styles.tableCellHeader}>Usulan</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableColHeader,
                      width: `${COL7_WIDTH}%`,
                    }}
                  >
                    <Text style={styles.tableCellHeader}>
                      Alasan Tidak Usul
                    </Text>
                  </View>
                </View>
                {currentData.map((items, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View
                      style={{ ...styles.tableCol1, width: `${COL1_WIDTH}%` }}
                    >
                      <Text style={styles.tableCell}>{start + index + 1}</Text>
                    </View>
                    <View
                      style={{ ...styles.tableCol, width: `${COL2_WIDTH}%` }}
                    >
                      <Text
                        style={{
                          ...styles.tableCell,
                          fontSize: 6.5,
                          textAlign: "left",
                        }}
                      >
                        {items.namaAlkes || ""}
                      </Text>
                    </View>

                    <View
                      style={{ ...styles.tableCol, width: `${COL3_WIDTH}%` }}
                    >
                      <Text style={styles.tableCell}>
                        {items.standard_rawat_inap || "0"}
                      </Text>
                    </View>
                    <View
                      style={{ ...styles.tableCol, width: `${COL4_WIDTH}%` }}
                    >
                      <Text style={styles.tableCell}>
                        {items.standard_non_inap || "0"}
                      </Text>
                    </View>
                    <View
                      style={{ ...styles.tableCol, width: `${COL5_WIDTH}%` }}
                    >
                      <Text style={styles.tableCell}>
                        {formatRupiah(items.berfungsi) || "0"}
                      </Text>
                    </View>
                    <View
                      style={{ ...styles.tableCol, width: `${COL6_WIDTH}%` }}
                    >
                      <Text style={styles.tableCell}>
                        {formatRupiah(items.usulan) || "0"}
                      </Text>
                    </View>
                    <View
                      style={{ ...styles.tableCol, width: `${COL7_WIDTH}%` }}
                    >
                      <Text
                        style={{
                          ...styles.tableCell,
                          fontSize: 6.5,
                          textAlign: "left",
                        }}
                      >
                        {items?.keterangan_usulan || "-"}
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
        </>
      );
    }
  });

  return pages;
};
