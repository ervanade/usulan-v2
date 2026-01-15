export const validateKonfirmasiPayload = (payload) => {
  const errors = [];

  if (!payload.nama_puskesmas) errors.push("Nama puskesmas wajib diisi");

  if (!payload.nama_barang) errors.push("Nama alkes wajib diisi");

  payload.kriteria_puskesmas.forEach((x) => {
    if (!x.nama_sdm)
      errors.push(`Nama SDM wajib diisi untuk kriteria ID ${x.id_kriteria}`);
  });

  if (payload.relokasi_status === "YA" && !payload.alasan_relokasi) {
    errors.push("Alasan relokasi wajib dipilih");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
