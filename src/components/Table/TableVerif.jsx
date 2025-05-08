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
const COL1_WIDTH = 5;
const COLN_WIDTH = (100 - COL1_WIDTH) / 4;

// const COL1_WIDTH = 5; // Lebar kolom No
const COL2_WIDTH = 25; // Lebar kolom Nama Alkes
const COL3_WIDTH = 35; // Lebar kolom Standard (dibagi 3 subkolom)
const COL4_WIDTH = 35; // Lebar kolom Usulan (dibagi 4 subkolom)

const SUBCOL3_WIDTH = COL3_WIDTH / 3; // Lebar masing-masing subkolom Standard
const SUBCOL4_WIDTH = COL4_WIDTH / 4; // Lebar masing-masing subkolom Usulan

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
const ITEMS_PER_PAGE = 40;

const getAllDetailDistribusi = (distribusi) => {
  return distribusi?.map((item, index) => ({
    no: index + 1 || "",
    namaAlkes: item?.nama_alkes || "",
    standard: item?.standard_rawat_inap || "",
    berfungsi: item?.berfungsi || "",
    usulan: item?.usulan || "",
  }));
};

export const RenderVerifPages = (jsonData, preview) => {
  const dataBarang = getAllDetailDistribusi(jsonData?.alkes || []);
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

    pages.push(
      <Page key={i} size="FOLIO" style={{ paddingTop: 0, ...styles.page }}>
        <Text style={{ ...styles.watermark, left: preview ? "25%" : "43%" }}>
          {preview ? "PREVIEW" : "FINAL"}
        </Text>
        <View
          style={{
            paddingVertical: 0,
            marginTop: 0,
            height: 840,
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
                Lampiran {i + 1}. Data usulan alat, jumlah dan peralatan pada
                puskesmas Kabupaten: {jsonData?.kabupaten}
              </Text>
            </Text>
          </View>

          <View style={styles.table}>
            {/* Baris pertama header */}
            <View style={styles.nestedHeaderRow}>
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
              <View
                style={[
                  styles.mainHeaderCell,
                  { width: `${COL2_WIDTH}%` },
                  { borderBottomWidth: 0, borderBottomColor: "transparent" },
                ]}
              >
                <Text
                  style={{
                    ...styles.tableCellHeader,
                    borderBottomWidth: 0,
                    marginBottom: -18,
                  }}
                >
                  Nama Alkes
                </Text>
              </View>
              <View
                style={[styles.mainHeaderCell, { width: `${COL3_WIDTH}%` }]}
              >
                <Text style={{ ...styles.tableCellHeader, margin: 5 }}>
                  Puskesmas
                </Text>
              </View>
              <View
                style={[styles.mainHeaderCell, { width: `${COL4_WIDTH}%` }]}
              >
                <Text style={styles.tableCellHeader}>Hasil Deck</Text>
              </View>
            </View>

            {/* Baris kedua header (subkolom) */}
            <View style={styles.nestedHeaderRow}>
              {/* Kolom No dan Nama Alkes kosong karena sudah di header atas */}
              <View
                style={[styles.nestedHeaderCell, { width: `${COL1_WIDTH}%` }]}
              ></View>
              <View
                style={[styles.nestedHeaderCell, { width: `${COL2_WIDTH}%` }]}
              ></View>

              {/* Subkolom Standard */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_WIDTH}%` },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, fontSize: 8 }}>
                  Total
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_WIDTH}%` },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, fontSize: 8 }}>
                  Mengusulkan
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL3_WIDTH}%` },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, fontSize: 8 }}>
                  Tidak Mengusulkan
                </Text>
              </View>

              {/* Subkolom Usulan */}
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL4_WIDTH}%` },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, fontSize: 8 }}>
                  Tidak Memenuhi Syarat SDM + ASPAK
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL4_WIDTH}%` },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, fontSize: 8 }}>
                  Tidak Memenuhi Syarat SDM
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL4_WIDTH}%` },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, fontSize: 8 }}>
                  Tidak Memenuhi Syarat ASPAK
                </Text>
              </View>
              <View
                style={[
                  styles.nestedHeaderCell,
                  { width: `${SUBCOL4_WIDTH}%` },
                ]}
              >
                <Text style={{ ...styles.tableCellHeader, fontSize: 8 }}>
                  Memenuhi Syarat
                </Text>
              </View>
            </View>

            {/* Data rows */}
            {currentData.map((items, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={[styles.tableCol1, { width: `${COL1_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>{start + index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: `${COL2_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>{items.namaAlkes || ""}</Text>
                </View>

                {/* Kolom Standard (3 subkolom) */}
                <View style={[styles.tableCol, { width: `${SUBCOL3_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>{items.total || "0"}</Text>
                </View>
                <View style={[styles.tableCol, { width: `${SUBCOL3_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.mengusulkan || "0"}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: `${SUBCOL3_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.tidakMengusulkan || "0"}
                  </Text>
                </View>

                {/* Kolom Usulan (4 subkolom) */}
                <View style={[styles.tableCol, { width: `${SUBCOL4_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.tidakMemenuhiSdmAspak || "0"}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: `${SUBCOL4_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.tidakMemenuhiSdm || "0"}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: `${SUBCOL4_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.tidakMemenuhiAspak || "0"}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: `${SUBCOL4_WIDTH}%` }]}>
                  <Text style={styles.tableCell}>
                    {items.memenuhiSyarat || "0"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          {isLastPage && (
            <>
              <Text>*Eligible (SDM+ASPAK+Listrik{">"}10kVA)</Text>

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
                  (update ASPAK dan SISDMK) dan ditambahkan menyesuaikan dengan
                  kondisi kab/kota saat desk……………………………..{"\n"}Demikian berita
                  acara ini dibuat dengan sesungguhnya serta disahkan dengan
                  tanggung jawab penuh agar bisa digunakan sebagaimana mestinya.
                  Jika dikemudian hari ditemukan ketidaksesuaian dari readiness
                  criteria dari usulan yang disampaikan, pihak pengusul dapat
                  bertanggung jawab sesuai dengan ketentuan berlaku.
                </Text>
              </View>
              <View style={{ ...styles.ttdContainer, marginTop: 24 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...styles.text,
                      textAlign: "center",
                      marginTop: 24,
                    }}
                  >
                    {/* Jakarta, dd mm 2025 */}
                  </Text>
                  Yang membuat pernyataan
                  <Text
                    style={{
                      ...styles.text,
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    Informan/Narasumber {"\n"} Dinas Kesehatan (Jabatan)
                  </Text>
                  <View
                    style={{ ...styles.imageTtd, marginVertical: 8 }}
                  ></View>
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
                  <Text style={{ ...styles.text, textAlign: "center" }}>
                    Jakarta, dd mm 2025
                  </Text>
                  Yang membuat pernyataan
                  <Text
                    style={{
                      ...styles.text,
                      textAlign: "center",
                      marginTop: 24,
                    }}
                  >
                    Verifikator {"\n"} Jabatan
                  </Text>
                  <View
                    style={{ ...styles.imageTtd, marginVertical: 8 }}
                  ></View>
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
              <Text
                style={{ ...styles.text, textAlign: "center", marginTop: 24 }}
              >
                Mengetahui,
              </Text>
              <View style={{ ...styles.ttdContainer, marginTop: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...styles.text,
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    Dinas Kesehatan Provinsi {"\n"} (Jabatan)
                  </Text>
                  <View
                    style={{ ...styles.imageTtd, marginVertical: 8 }}
                  ></View>
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
                  <View
                    style={{ ...styles.imageTtd, marginVertical: 8 }}
                  ></View>
                  <Text
                    style={{
                      ...styles.text,
                      fontFamily: "Calibri",
                      marginTop: 12,
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
          )}
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
