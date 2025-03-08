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
const COLN_WIDTH = (100 - COL1_WIDTH) / 4;

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

const ITEMS_PER_PAGE = 32;

const formatRupiah = (price) => {
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const getAllDetailDistribusi = (distribusi) => {
  return distribusi.map((d, distribusiIndex) => ({
    lampiran: distribusiIndex + 1,
    nama_puskesmas: d.nama_puskesmas,
    details: d.detail_distribusi.map((item, index) => ({
      no: index + 1 || "",
      namaBarang: item.jenis_alkes || "",
      merk: item.merk || "",
      nomorBukti: item.nomor_bukti || "",
      jumlah: item.jumlah_total || "",
      jumlah_dikirim: item.jumlah_dikirim || "",
      jumlah_diterima: item.jumlah_diterima || "",
      hargaSatuan: item.harga_satuan || "",
      jumlahNilai: `Rp. ${item.jumlah_total || ""}`,
      keterangan: item.keterangan || "",
    })),
  }));
};

export const RenderHibahPages = (jsonData, preview) => {
  const distribusiData = getAllDetailDistribusi(jsonData?.distribusi || []);
  const pages = [];
  const downloadDate = new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  distribusiData.forEach((distribusi, distribusiIndex) => {
    const totalItems = distribusi.details.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const totalJumlahDikirim = distribusi.details.reduce(
      (acc, item) => acc + (parseFloat(item.jumlah_dikirim) || 0),
      0
    );
    const totalHargaSatuan = distribusi.details.reduce(
      (acc, item) => acc + (parseFloat(item.hargaSatuan) || 0),
      0
    );
    const totalJumlahNilai = distribusi.details.reduce(
      (acc, item) =>
        acc +
        (parseFloat(item.jumlahNilai.replace(/Rp\. /, "").replace(/,/g, "")) ||
          0),
      0
    );

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
              style={{ ...styles.watermark, left: preview ? "30%" : "45%" }}
            >
              {preview ? "PREVIEW" : "FINAL"}
            </Text>
            <View
              style={{
                paddingVertical: 0,
                marginTop: 0,
                height: 800,
              }}
            >
              <View
                style={{
                  ...styles.titleContainer,
                  marginBottom: 16,
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
                  {"\n"}Kode Puskesmas: {jsonData?.kabupaten} {"   "} Nama
                  Puskesmas: {distribusi?.nama_puskesmas}
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
                    <Text style={styles.tableCellHeader}>Standard</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCellHeader}>Eksisting</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCellHeader}>Usulan</Text>
                  </View>
                </View>
                {currentData.map((items, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol1}>
                      <Text style={styles.tableCell}>{start + index + 1}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {items.namaBarang || ""}
                      </Text>
                    </View>

                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {items.jumlah_dikirim || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        Rp. {formatRupiah(items.hargaSatuan) || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {formatRupiah(items.jumlahNilai) || ""}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.footer}>
              <Text>
                Downloaded on {downloadDate}. [Backend use only:
                location_group_id = 117, username = jawa_barat]
              </Text>
            </View>
          </Page>
        </>
      );
    }
  });

  return pages;
};
