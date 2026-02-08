export const validateKonfirmasiPayload = (payload) => {
  const errors = [];

  /* =====================================================
   * IDENTITAS WAJIB
   * ===================================================== */
  if (!payload.id_provinsi) errors.push("Provinsi tidak valid");
  if (!payload.id_kabupaten) errors.push("Kabupaten/Kota tidak valid");
  if (!payload.id_puskesmas) errors.push("Puskesmas tidak valid");

  if (!payload.nama_puskesmas) errors.push("Nama puskesmas wajib diisi");

  if (!payload.nama_barang) errors.push("Nama alat kesehatan wajib diisi");

  if (!payload.jumlah_barang_unit || payload.jumlah_barang_unit <= 0)
    errors.push("Jumlah alat kesehatan wajib diisi");

  /* =====================================================
   * SDM DIMILIKI PUSKESMAS
   * ===================================================== */
  if (
    !Array.isArray(payload.kriteria_puskesmas) ||
    payload.kriteria_puskesmas.length === 0
  ) {
    errors.push("Minimal satu SDM harus dipilih");
  } else {
    payload.kriteria_puskesmas.forEach((x) => {
      if (!x.id_kriteria) {
        errors.push("ID kriteria SDM tidak valid");
      }

      if (!x.nama_sdm || !x.nama_sdm.trim()) {
        errors.push("Nama SDM wajib diisi untuk setiap SDM yang dipilih");
      }
    });
  }

  /* =====================================================
   * KESIAPAN SDMK & UPAYA PEMENUHAN
   * ===================================================== */
  if (!payload.kesiapan_sdmk) errors.push("Kesiapan SDMK belum ditentukan");

  if (payload.kesiapan_sdmk === "TIDAK") {
    if (!payload.upaya_memenuhi_sdm)
      errors.push("Upaya pemenuhan SDM wajib dipilih");

    if (
      payload.upaya_memenuhi_sdm === "YA" &&
      (!payload.strategi_pemenuhan_sdm ||
        payload.strategi_pemenuhan_sdm.length === 0)
    ) {
      errors.push("Strategi pemenuhan SDM wajib dipilih");
    }
  }

  /* =====================================================
   * SARANA PRASARANA & ALKES
   * ===================================================== */
  if (!payload.siap_sarana_prasarana)
    errors.push("Kesiapan sarana prasarana wajib dipilih");

  if (!payload.kondisi_alkes_baik)
    errors.push("Kondisi alat kesehatan wajib dipilih");

  /* =====================================================
   * RELOKASI (AUTO DARI SISTEM)
   * ===================================================== */
  if (!payload.relokasi_status) errors.push("Status relokasi tidak valid");

  if (payload.relokasi_status === "YA") {
    /* skema */
    if (!payload.keterangan_relokasi)
      errors.push("Skema relokasi wajib dipilih");

    /* alasan */
    if (!payload.alasan_relokasi) errors.push("Alasan relokasi wajib dipilih");

    /* tujuan relokasi */
    if (!payload.id_provinsi_relokasi)
      errors.push("Provinsi tujuan relokasi wajib dipilih");

    if (!payload.id_kabupaten_relokasi)
      errors.push("Kab/Kota tujuan relokasi wajib dipilih");

    if (!payload.id_puskesmas_relokasi)
      errors.push("Puskesmas tujuan relokasi wajib dipilih");

    if (!payload.alamat_relokasi)
      errors.push("Alamat puskesmas relokasi wajib diisi");

    /* CP Puskesmas Penerima */
    if (!payload.pic_penerima_relokasi_nama)
      errors.push("Nama CP Puskesmas Relokasi wajib diisi");

    if (!payload.pic_penerima_relokasi_hp)
      errors.push("No HP CP Puskesmas Relokasi wajib diisi");

    /* CP Dinkes Tujuan */
    if (!payload.pic_dinkes_kab_kota_relokasi_cp)
      errors.push("Contact Person Dinkes tujuan relokasi wajib diisi");

    if (!payload.pic_dinkes_kab_kota_relokasi_hp)
      errors.push("CP No Hp Dinkes tujuan relokasi wajib diisi");
  }

  /* =====================================================
   * PIC LOKUS AWAL (WAJIB SELALU)
   * ===================================================== */
  if (!payload.pic_puskesmas_nama)
    errors.push("Nama PIC Puskesmas wajib diisi");

  if (!payload.pic_puskesmas_hp) errors.push("No HP PIC Puskesmas wajib diisi");

  if (!payload.pic_dinkes_nama)
    errors.push("Nama PIC Dinkes Kab/Kota wajib diisi");

  if (!payload.pic_dinkes_hp)
    errors.push("No HP PIC Dinkes Kab/Kota wajib diisi");

  /* =====================================================
   * STATUS VERIFIKASI (ROLE ADMIN)
   * ===================================================== */
  if (!payload.status_verifikasi)
    errors.push("Status verifikasi wajib ditentukan");

  /* =====================================================
   * RESULT
   * ===================================================== */
  return {
    isValid: errors.length === 0,
    errors,
  };
};
