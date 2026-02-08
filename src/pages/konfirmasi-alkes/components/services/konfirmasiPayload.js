export const buildKonfirmasiPayload = ({
  formData,
  kesiapanSDM,
  upayaSDM,
  strategi,
  sarpras,
  alkes,
  relokasi,
  alasanRelokasi,
  skemaRelokasi,
  sdmChecked,
  provRelokasi,
  kabRelokasi,
  pusRelokasi,
  alamatRelokasi,
  cpRelokasi,
  cpHpRelokasi,
  cpDinkes,
  cpHpDinkes,
  picNama,
  picHp,
  picDinkesRelokasi,
  picHpDinkesRelokasi,
  statusVerifikasi,
}) => {
  const isRelokasi = relokasi === "YA";
  const isSDMTidakSiap = kesiapanSDM === "TIDAK";
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
    upaya_memenuhi_sdm: isSDMTidakSiap ? upayaSDM?.value || null : null,

    strategi_pemenuhan_sdm:
      isSDMTidakSiap && upayaSDM?.value === "YA" && strategi.length
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
    alasan_relokasi:
      isRelokasi && alasanRelokasi.length
        ? alasanRelokasi.map((x) => x.value).join(", ")
        : null,

    keterangan_relokasi: isRelokasi ? skemaRelokasi?.value || null : null,

    id_provinsi_relokasi:
      isRelokasi && provRelokasi?.value ? Number(provRelokasi.value) : null,
    id_kabupaten_relokasi:
      isRelokasi && kabRelokasi?.value ? Number(kabRelokasi.value) : null,

    id_puskesmas_relokasi:
      isRelokasi && pusRelokasi?.value ? Number(pusRelokasi.value) : null,
    nama_kab_kota_relokasi:
      isRelokasi && kabRelokasi?.label ? kabRelokasi.label : null,

    nama_puskesmas_penerima_relokasi:
      isRelokasi && pusRelokasi?.label ? pusRelokasi.label : null,

    alamat_relokasi: isRelokasi ? alamatRelokasi || null : null,

    /* ===== PIC ===== */
    pic_penerima_relokasi_nama: isRelokasi ? cpRelokasi || null : null,
    pic_penerima_relokasi_hp: isRelokasi ? cpHpRelokasi || null : null,
    pic_dinkes_kab_kota_relokasi_cp: isRelokasi
      ? picDinkesRelokasi || null
      : null,
    pic_dinkes_kab_kota_relokasi_hp: isRelokasi
      ? picHpDinkesRelokasi || null
      : null,
    pic_puskesmas_nama: picNama || null,
    pic_puskesmas_hp: picHp || null,
    pic_dinkes_nama: cpDinkes || null,
    pic_dinkes_hp: cpHpDinkes || null,

    /* ===== VERIFIKASI ===== */
    status_verifikasi: statusVerifikasi || null,
  };
};
