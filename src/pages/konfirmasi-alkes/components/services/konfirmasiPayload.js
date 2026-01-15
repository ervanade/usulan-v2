export const buildKonfirmasiPayload = ({
  formData,
  kesiapanSDM,
  upayaSDM,
  strategi,
  sarpras,
  alkes,
  relokasi,
  alasanRelokasi,
  sdmChecked,
  picNama,
  picHp,
  picDinkes,
  statusVerifikasi,
}) => {
  return {
    /* ===== IDENTITAS ===== */
    id_ihss: formData.id_ihss ? Number(formData.id_ihss) : null,
    id_provinsi: formData.id_provinsi ? Number(formData.id_provinsi) : null,
    id_kabupaten: formData.id_kabupaten ? Number(formData.id_kabupaten) : null,
    id_puskesmas: formData.id_puskesmas ? Number(formData.id_puskesmas) : null,

    provinsi: formData.provinsi || null,
    kab_kota: formData.kabKota || null,
    kode_puskesmas: formData.kode || null,
    nama_puskesmas: formData.puskesmas || null,

    nama_barang: formData.alat || null,
    jumlah_barang_unit: formData.jumlah ? Number(formData.jumlah) : null,

    /* ===== SDM ===== */
    kesiapan_sdmk: kesiapanSDM || null,
    upaya_memenuhi_sdm: upayaSDM?.value || null,
    strategi_pemenuhan_sdm: strategi.length
      ? strategi.map((x) => x.value).join(", ")
      : null,

    kriteria_puskesmas: Object.entries(sdmChecked).map(([id, val]) => ({
      id_kriteria: Number(id),
      nama_sdm: val.nama,
    })),

    /* ===== SARPRAS & ALKES ===== */
    siap_sarana_prasarana: sarpras?.value || null,
    kondisi_alkes_baik: alkes?.value || null,

    /* ===== RELOKASI ===== */
    relokasi_status: relokasi || null,
    alasan_relokasi: alasanRelokasi.length
      ? alasanRelokasi.map((x) => x.value).join(", ")
      : null,

    /* ===== PIC ===== */
    pic_puskesmas_nama: picNama || null,
    pic_puskesmas_hp: picHp || null,
    pic_dinkes_nama: picDinkes || null,

    /* ===== VERIFIKASI ===== */
    status_verifikasi: statusVerifikasi || null,
  };
};
