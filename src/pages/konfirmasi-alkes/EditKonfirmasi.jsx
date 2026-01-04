// UPDATED VERSION – React Vite, react-select, mock data, UX aligned with existing theme
import { useState, useMemo } from "react";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Card from "../../components/Card/Card";
import { Link } from "react-router-dom";
import { selectThemeColors } from "../../data/utils";

/* ================== CONSTANTS & MOCK ================== */
const yaTidakOptions = [
  { value: "Ya", label: "Ya" },
  { value: "Tidak", label: "Tidak" },
];

const strategiOptions = [
  { value: "Rekrutmen ASN", label: "Rekrutmen ASN (CPNS & PPPK)" },
  { value: "Penugasan Pusat", label: "Penugasan Khusus Pusat" },
  { value: "Penugasan Daerah", label: "Penugasan Khusus Daerah" },
  { value: "BLUD", label: "Rekrutmen BLUD" },
  { value: "Redistribusi", label: "Redistribusi SDMK antar fasilitas" },
  { value: "Kemitraan", label: "Kemitraan institusi pendidikan" },
];

const sdmList = [
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

const dbData = {
  provinsi: "Jawa Barat",
  kabKota: "Sukabumi",
  puskesmas: "PALABUHANRATU",
  kode: "32020200019",
  alat: "Spirometer",
  jumlah: 1,
  sdmWajib: ["Dokter", "Perawat"],
};

const kabKotaOptions = [
  { value: "Bandung", label: "Kota Bandung" },
  { value: "Bogor", label: "Kab. Bogor" },
];

const puskesmasOptions = [
  { value: "PKM A", label: "Puskesmas A" },
  { value: "PKM B", label: "Puskesmas B" },
];

/* ================== COMPONENT ================== */
export default function EditKonfirmasi() {
  const [sdmChecked, setSdmChecked] = useState([]);
  const [upayaSDM, setUpayaSDM] = useState(null);
  const [strategi, setStrategi] = useState([]);
  const [sarpras, setSarpras] = useState(null);
  const [alkes, setAlkes] = useState(null);

  const [kabRelokasi, setKabRelokasi] = useState(null);
  const [pusRelokasi, setPusRelokasi] = useState(null);

  const kesiapanSDM = useMemo(() => {
    return dbData.sdmWajib.every((x) => sdmChecked.includes(x))
      ? "Ya"
      : "Tidak";
  }, [sdmChecked]);

  const relokasi = useMemo(() => {
    if (kesiapanSDM === "Tidak") return "Ya";
    if (sarpras?.value === "Tidak") return "Ya";
    if (alkes?.value === "Ya") return "Ya";
    return "Tidak";
  }, [kesiapanSDM, sarpras, alkes]);

  const [picNama, setPicNama] = useState("");
  const [picHp, setPicHp] = useState("");

  return (
    <div>
      <Breadcrumb title="Konfirmasi Ulang Alkes" pageName="Konfirmasi Alkes" />
      <Card>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="card-header flex justify-between">
            {/* <h1 className="mb-5 mt-1 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
                    Edit Usulan Alkes
                  </h1> */}
            <div className="ml-auto">
              <Link
                to="/konfirmasi-alkes"
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
              >
                Back
              </Link>
            </div>
          </div>
          {/* READ ONLY */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-md">
            <ReadOnly label="Provinsi" value={dbData.provinsi} />
            <ReadOnly label="Kab/Kota" value={dbData.kabKota} />
            <ReadOnly label="Kode Puskesmas" value={dbData.kode} />
            <ReadOnly label="Puskesmas" value={dbData.puskesmas} />
            <ReadOnly label="Nama Alkes" value={dbData.alat} />
            <ReadOnly label="Jumlah" value={dbData.jumlah} />
          </div>

          <section className="mt-8">
            <h2 className="font-semibold mb-3 text-[#1f2937]">
              SDM Dimiliki Puskesmas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sdmList.map((s) => {
                const isChecked = sdmChecked.includes(s);
                return (
                  <div
                    key={s}
                    className={`border rounded-md p-3 space-y-2 ${
                      isChecked
                        ? "border-primary bg-primary/5"
                        : "border-[#cacaca]"
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSdmChecked((prev) =>
                            prev.includes(s)
                              ? prev.filter((x) => x !== s)
                              : [...prev, s]
                          )
                        }
                      />
                      {s}
                    </label>

                    {isChecked && (
                      <input
                        type="text"
                        placeholder={`Nama ${s} (opsional)`}
                        className="w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* KESIAPAN SDM */}
          <div className="mt-6">
            <ReadOnly label="Kesiapan SDMK" value={kesiapanSDM} />
          </div>

          {/* UPAYA SDM */}
          {kesiapanSDM === "Tidak" && (
            <section className="mt-6 grid grid-cols-2 gap-4">
              <FormSelect
                label="Upaya Pemenuhan SDM"
                placeholder="Apakah akan dilakukan upaya pemenuhan SDM?"
                value={upayaSDM}
                onChange={setUpayaSDM}
                options={yaTidakOptions}
              />
              {upayaSDM?.value === "Ya" && (
                <FormSelect
                  label="Strategi Pemenuhan SDM"
                  placeholder="Pilih strategi pemenuhan SDM"
                  isMulti
                  value={strategi}
                  onChange={setStrategi}
                  options={strategiOptions}
                />
              )}
            </section>
          )}

          {/* SARPRAS & ALKES */}
          <section className="mt-6 grid grid-cols-2 gap-4">
            <FormSelect
              label="Kesiapan Sarpras"
              placeholder="Pilih kesiapan sarana & prasarana"
              value={sarpras}
              onChange={setSarpras}
              options={yaTidakOptions}
            />
            <FormSelect
              label="Alat Kesehatan Berfungsi"
              placeholder="Apakah alat berfungsi dengan baik?"
              value={alkes}
              onChange={setAlkes}
              options={yaTidakOptions}
            />
          </section>

          {/* RELOKASI */}
          <section className="mt-8 bg-white p-4 rounded-md">
            <ReadOnly label="Relokasi" value={relokasi} />

            {relokasi === "Ya" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormSelect
                  label="Kab/Kota Tujuan Relokasi"
                  placeholder="Pilih kabupaten / kota tujuan"
                  value={kabRelokasi}
                  onChange={setKabRelokasi}
                  options={kabKotaOptions}
                />
                <FormSelect
                  label="Puskesmas Tujuan Relokasi"
                  placeholder="Pilih puskesmas penerima relokasi"
                  value={pusRelokasi}
                  onChange={setPusRelokasi}
                  options={puskesmasOptions}
                />
              </div>
            )}
          </section>

          {/* PIC PUSKESMAS */}
          <section className="mt-8 bg-white p-4 rounded-md">
            <h2 className="font-semibold mb-4 text-[#1f2937]">
              PIC Puskesmas (Petugas ASPAK)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nama PIC Puskesmas"
                placeholder="Contoh: Dr. Ahmad Fauzi"
                value={picNama}
                onChange={(e) => setPicNama(e.target.value)}
              />

              <FormInput
                label="No. HP PIC Puskesmas"
                placeholder="Contoh: 081234567890"
                value={picHp}
                onChange={(e) => setPicHp(e.target.value)}
                type="tel"
                helper="Gunakan nomor aktif WhatsApp"
              />
            </div>
          </section>

          {/* FOOTER */}
          <div className="flex justify-end mt-8">
            <button className="bg-primary text-white px-6 py-2 rounded-md font-semibold">
              Simpan
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ================== UI HELPERS ================== */
function ReadOnly({ label, value }) {
  return (
    <div>
      <label className="text-xs text-[#3f4750] font-semibold">{label}</label>
      <div className="mt-1 border rounded-md px-3 py-2 bg-white text-sm text-[#3f4750] border-[#cacaca]">
        {value}
      </div>
    </div>
  );
}

function FormSelect({ label, placeholder, isMulti, ...props }) {
  return (
    <div>
      <label className="text-xs text-[#272b2f] font-semibold mb-1 block">
        {label}
      </label>
      <Select
        className="text-sm"
        theme={selectThemeColors}
        placeholder={
          placeholder ??
          (isMulti ? "Pilih satu atau lebih opsi" : "Pilih salah satu")
        }
        isMulti={isMulti}
        {...props}
      />
    </div>
  );
}

function FormInput({ label, helper, type = "text", ...props }) {
  return (
    <div>
      <label className="text-xs text-[#272b2f] font-semibold mb-1 block">
        {label}
      </label>

      <input
        type={type}
        className="w-full border border-[#cacaca] rounded-md px-3 py-2 text-sm text-gray-800 
                   focus:outline-none focus:ring-1 focus:ring-primary 
                   focus:border-primary"
        {...props}
      />

      {helper && <p className="text-xs text-[#728294] mt-1">{helper}</p>}
    </div>
  );
}
