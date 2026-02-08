import Swal from "sweetalert2";

export const showErrorAlert = (title, errors = []) => {
  return Swal.fire({
    icon: "warning",
    title: title || "Data Belum Lengkap",
    html: `
      <div style="
        text-align:left;
        font-size:13px;
        line-height:1.6;
        color:#374151;
      ">
        <p style="margin-bottom:8px;">
          Mohon lengkapi beberapa informasi berikut sebelum melanjutkan:
        </p>

        <ul style="
          padding-left:18px;
          margin:0;
          list-style-type:disc;
        ">
          ${errors
            .map(
              (e) => `
            <li style="margin-bottom:4px;">
              ${e}
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
    `,
    confirmButtonText: "Saya Mengerti",
    confirmButtonColor: "#ef4444",
    width: 440,
    focusConfirm: true,
  });
};

export const showPayloadPreview = (payload) => {
  return Swal.fire({
    title: "Konfirmasi Simpan",
    icon: "info",
    html: `
      <div style="text-align:left;font-size:13px;">
        <p style="margin-bottom:8px;">
          Pastikan data berikut sudah benar sebelum disimpan:
        </p>

        <div style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:6px;
          padding:10px;
          max-height:220px;
          overflow:auto;
          font-family:monospace;
          font-size:11px;
        ">
<pre style="margin:0;white-space:pre-wrap;">
${JSON.stringify(payload, null, 2)}
</pre>
        </div>

        <p style="margin-top:8px;font-size:12px;color:#64748b;">
          Data akan diproses setelah Anda menekan <b>YA, SIMPAN</b>.
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "YA, SIMPAN",
    cancelButtonText: "BATAL",
    confirmButtonColor: "#0ea5e9",
    cancelButtonColor: "#94a3b8",
    width: 520,
  });
};

export const buildHumanPreview = (payload) => {
  const isRelokasi = payload.relokasi_status === "YA";

  return [
    /* ===== IDENTITAS ===== */
    {
      label: "Nama Puskesmas",
      value: payload.nama_puskesmas || "-",
    },
    {
      label: "Kabupaten / Kota",
      value: payload.kab_kota || "-",
    },
    {
      label: "Alat Kesehatan",
      value: payload.nama_barang
        ? `${payload.nama_barang} (${payload.jumlah_barang_unit} unit)`
        : "-",
    },

    /* ===== SDM ===== */
    {
      label: "Kesiapan SDM",
      value:
        payload.kesiapan_sdmk === "YA"
          ? "Siap"
          : payload.kesiapan_sdmk === "TIDAK"
            ? "Belum Siap"
            : "-",
    },

    payload.kesiapan_sdmk === "TIDAK" && {
      label: "Upaya Pemenuhan SDM",
      value:
        payload.upaya_memenuhi_sdm === "YA"
          ? "Ada upaya pemenuhan"
          : payload.upaya_memenuhi_sdm === "TIDAK"
            ? "Belum ada upaya"
            : "-",
    },

    payload.strategi_pemenuhan_sdm && {
      label: "Strategi Pemenuhan SDM",
      value: payload.strategi_pemenuhan_sdm,
    },

    payload.kriteria_puskesmas?.length > 0 && {
      label: "SDM yang Dimiliki",
      value: payload.kriteria_puskesmas
        .map((s) => s.nama_sdm)
        .filter(Boolean)
        .join(", "),
    },

    /* ===== SARPRAS & ALKES ===== */
    {
      label: "Kesiapan Sarana & Prasarana",
      value:
        payload.siap_sarana_prasarana === "YA"
          ? "Siap"
          : payload.siap_sarana_prasarana === "TIDAK"
            ? "Belum Siap"
            : "-",
    },
    {
      label: "Kondisi Alat Kesehatan",
      value:
        payload.kondisi_alkes_baik === "YA"
          ? "Baik"
          : payload.kondisi_alkes_baik === "TIDAK"
            ? "Tidak Baik"
            : "-",
    },

    /* ===== RELOKASI ===== */
    {
      label: "Relokasi Alat Kesehatan",
      value: isRelokasi ? "Ya" : "Tidak",
    },

    isRelokasi && {
      label: "Alasan Relokasi",
      value: payload.alasan_relokasi || "-",
    },

    isRelokasi && {
      label: "Puskesmas Relokasi",
      value: payload.nama_puskesmas_penerima_relokasi || "-",
    },

    isRelokasi && {
      label: "Alamat Relokasi",
      value: payload.alamat_relokasi || "-",
    },

    isRelokasi && {
      label: "PIC Puskesmas Relokasi",
      value: payload.pic_penerima_relokasi_nama
        ? `${payload.pic_penerima_relokasi_nama} (${payload.pic_penerima_relokasi_hp})`
        : "-",
    },

    /* ===== PIC ===== */
    {
      label: "PIC Puskesmas",
      value: payload.pic_puskesmas_nama
        ? `${payload.pic_puskesmas_nama} (${payload.pic_puskesmas_hp})`
        : "-",
    },
    {
      label: "PIC Dinas Kesehatan",
      value: payload.pic_dinkes_nama
        ? `${payload.pic_dinkes_nama} (${payload.pic_dinkes_hp})`
        : "-",
    },
  ].filter(Boolean);
};

export const showPayloadPreviewUser = (payload) => {
  const items = buildHumanPreview(payload);

  return Swal.fire({
    title: "Konfirmasi Data",
    icon: "question",
    html: `
      <div style="text-align:left;font-size:14px;color:#374151;">
        <p style="margin-bottom:10px;">
          Mohon periksa kembali data yang telah Anda isi:
        </p>

        <div style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:8px;
          padding:12px;
        ">
          ${items
            .map(
              (i) => `
            <div style="margin-bottom:8px;display:flex;justify-content:space-between;">
              <div style="font-weight:600;font-size:12px;color:#475569;">
                ${i.label}
              </div>
              <div style="font-size:13px;">
                ${i.value}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <p style="margin-top:10px;font-size:12px;color:#64748b;">
          Jika sudah benar, klik <b>Simpan</b> untuk melanjutkan.
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Periksa Ulang",
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#94a3b8",
    width: 480,
  });
};

export const showSuccessAlert = () => {
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: "Data berhasil diproses",
    timer: 2000,
    showConfirmButton: false,
  });
};
