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
    width: 40,
    height: 30,
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

const ITEMS_PER_PAGE = 8;

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

export const RenderHibahPages = (jsonData, basto) => {
  const distribusiData = getAllDetailDistribusi(jsonData?.distribusi || []);
  const pages = [];

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
                style={{
                  ...styles.titleContainer,
                  marginBottom: 0,
                  marginTop: 0,
                }}
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
                  LAMPIRAN {distribusi.lampiran}.{i + 1}
                  {"\n"}
                  {basto
                    ? "BERITA ACARA SERAH TERIMA OPERASIONAL BARANG MILIK NEGARA"
                    : "NASKAH HIBAH BARANG MILIK NEGARA                     "}
                  {"              "}
                  {"\n"}NOMOR: {jsonData?.nomorSurat}
                  {"\n"}TANGGAL: {jsonData?.tanggal}
                </Text>
              </View>

              <View
                style={{
                  ...styles.titleContainer,
                  width: "100%",
                  marginBottom: 8,
                  marginTop: 8,
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
                  DAFTAR BARANG MILIK NEGARA YANG DARI SEJAK AWAL DISERAHKAN
                  KEPADA MASYARAKAT/PEMERINTAH DAERAH PUSKESMAS{" "}
                  {distribusi?.nama_puskesmas}
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
                      <Text style={styles.tableCell}>{items.merk || ""}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {items.nomorBukti || ""}
                      </Text>
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
                        Rp. {formatRupiah(items.hargaSatuan) || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {formatRupiah(items.jumlahNilai) || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {items.keterangan || ""}
                      </Text>
                    </View>
                  </View>
                ))}

                {isLastPage && (
                  <View style={styles.tableRow}>
                    <View style={{ ...styles.tableCol1, width: `52.5%` }}>
                      <Text style={styles.tableCell}>Total</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "11.875%" }}>
                      <Text style={styles.tableCell}>{totalJumlahDikirim}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "11.875%" }}>
                      <Text style={styles.tableCell}>
                        Rp. {formatRupiah(totalHargaSatuan.toFixed(0))}
                      </Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "11.875%" }}>
                      <Text style={styles.tableCell}>
                        Rp. {formatRupiah(totalJumlahNilai.toFixed(0))}
                      </Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "11.875%" }}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={{ marginTop: 16 }}>
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
                      style={{ ...styles.imageTtd, marginVertical: 4 }}
                      src={`${jsonData?.tte_ppk}?not-from-cache-please`}
                      onError={(error) => {
                        error.target.src = defaultImage;
                      }}
                    />
                    <Text
                      style={{
                        ...styles.text,
                        fontFamily: "Arial",
                        marginTop: 4,
                        fontSize: 11,
                        lineHeight: 1.2,
                        textAlign: "center",
                        letterSpacing: 0.2,
                      }}
                    >
                      Nama :{" "}
                      {jsonData?.nama_ppk ||
                        "drg. R Vensya Sitohang, M.Epid, Ph.D"}{" "}
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
                      style={{ ...styles.imageTtd, marginVertical: 4 }}
                      src={`${jsonData?.tte_daerah}?not-from-cache-please`}
                      onError={(error) => {
                        error.target.src = defaultImage;
                      }}
                    />
                    <Text
                      style={{
                        ...styles.text,
                        fontFamily: "Arial",
                        marginTop: 4,
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
                {/* <View style={styles.table}>
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
                        Kementerian Kesehatan{" "}
                        {jsonData?.kepala_unit_pemberi ||
                          "Direktur Fasilitas dan Mutu Pelayanan Kesehatan Primer"}
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
                        Nama{" "}
                        {jsonData?.nama_ppk ||
                          "drg. R Vensya Sitohang, M.Epid, Ph.D"}
                      </Text>
                      <Text
                        style={{
                          ...styles.tableCell,
                          ...styles.text,
                          marginBottom: 0,
                        }}
                      >
                        NIP {jsonData?.nip_ppk || "196512131991012001"}
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
                </View> */}
              </View>
            </View>
          </Page>
        </>
      );
    }
  });

  return pages;
};
