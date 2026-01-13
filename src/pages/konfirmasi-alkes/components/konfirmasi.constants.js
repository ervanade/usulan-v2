export const yaTidakOptions = [
  { value: "YA", label: "YA" },
  { value: "TIDAK", label: "TIDAK" },
];

export const strategiOptions = [
  { value: "REKRUTMEN ASN", label: "Rekrutmen ASN (CPNS & PPPK)" },
  { value: "PENUGASAN PUSAT", label: "Penugasan Khusus Pusat" },
  { value: "PENUGASAN DAERAH", label: "Penugasan Khusus Daerah" },
  { value: "BLUD", label: "Rekrutmen BLUD" },
  { value: "REDISTRIBUSI", label: "Redistribusi SDMK antar fasilitas" },
  { value: "KEMITRAAN", label: "Kemitraan institusi pendidikan" },
];

export const sdmList = [
  "Dokter",
  "Dokter Gigi",
  "Perawat",
  "Bidan",
  "ATLM",
  "Terapis Gigi & Mulut",
  "Kesling",
  "Epidemiolog",
  "Gizi",
  "Kesmas",
];

export const skemaRelokasiOptions = [
  { value: "DALAM_KAB", label: "Dalam 1 Kab/Kota yang sama" },
  { value: "ANTAR_KAB", label: "Antar Kab/Kota (1 Provinsi)" },
  { value: "ANTAR_PROV", label: "Antar Provinsi" },
];

export const alasanRelokasiOptions = [
  { value: "SDM", label: "Tidak dapat memenuhi SDMK" },
  { value: "SARPRAS", label: "Sarana prasarana tidak siap" },
  { value: "ALKES", label: "Alat kesehatan tersedia (relokasi)" },
];

export const dbData = {
  provinsi: "Jawa Barat",
  kabKota: "Sukabumi",
  puskesmas: "PALABUHANRATU",
  kode: "32020200019",
  alat: "Spirometer",
  jumlah: 1,
  sdmWajib: ["Dokter", "Perawat"],
};
