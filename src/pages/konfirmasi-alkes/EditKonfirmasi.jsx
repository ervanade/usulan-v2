import { useState, useMemo, useEffect, useCallback } from "react";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Card from "../../components/Card/Card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { decryptId, selectThemeColors } from "../../data/utils";
import { useSelector } from "react-redux";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";

/* ================== CONSTANTS ================== */
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

const skemaRelokasiOptions = [
  { value: "dalam_kab", label: "Dalam 1 Kab/Kota yang sama" },
  { value: "antar_kab", label: "Antar Kab/Kota (1 Provinsi)" },
  { value: "antar_prov", label: "Antar Provinsi" },
];

const alasanRelokasiOptions = [
  { value: "sdm", label: "Tidak dapat memenuhi SDMK" },
  { value: "sarpras", label: "Sarana prasarana tidak siap" },
  { value: "alkes", label: "Alat kesehatan tersedia (relokasi)" },
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
  const user = useSelector((a) => a.auth.user);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    provinsi: "Jawa Barat",
    kabKota: "Sukabumi",
    puskesmas: "PALABUHANRATU",
    kode: "32020200019",
    alat: "Spirometer",
    jumlah: 1,
    kriteria_alkes: ["Dokter", "Perawat"],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const navigate = useNavigate();
  const [sdmChecked, setSdmChecked] = useState([]);
  const [sdmNama, setSdmNama] = useState({});
  const [upayaSDM, setUpayaSDM] = useState(null);
  const [strategi, setStrategi] = useState([]);
  const [sarpras, setSarpras] = useState(null);
  const [alkes, setAlkes] = useState(null);

  const [skemaRelokasi, setSkemaRelokasi] = useState(null);
  const [alasanRelokasi, setAlasanRelokasi] = useState([]);
  const [alamatRelokasi, setAlamatRelokasi] = useState("");
  const [cpRelokasi, setCpRelokasi] = useState("");
  const [cpDinkes, setCpDinkes] = useState("");
  const [kabRelokasi, setKabRelokasi] = useState(null);
  const [pusRelokasi, setPusRelokasi] = useState(null);

  const [picNama, setPicNama] = useState("");
  const [picHp, setPicHp] = useState("");
  const [picDinkes, setPicDinkes] = useState("");
  const [statusVerifikasi, setStatusVerifikasi] = useState(null);
  const [fileSurat, setFileSurat] = useState(null);

  const fetchKonfirmasiData = useCallback(
    async (periodeId = null) => {
      setLoading(true);
      setGetLoading(true);

      setError(false);
      const decryptedId = decryptId(id);
      if (!decryptedId) {
        // Jika decryptId gagal (mengembalikan null atau nilai falsy lainnya)
        navigate("/not-found"); // Arahkan ke halaman "not found"
        return; // Hentikan eksekusi fungsi
      }
      let url = `${
        import.meta.env.VITE_APP_API_URL
      }/api/konfirmasidetail/${encodeURIComponent(decryptedId)}`;
      if (periodeId) {
        url += `/${periodeId}`;
      }
      try {
        const response = await axios({
          method: "get",
          url: url,

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = response.data.data;

        setFormData({
          provinsi: data?.provinsi || "Jawa Barat",
          kabKota: data?.kab_kota || "Sukabumi",
          puskesmas: data?.nama_puskesmas || "PALABUHANRATU",
          kode: data?.kode_puskesmas || "32020200019",
          alat: data?.nama_barang || "Spirometer",
          jumlah: data?.jumlah_barang_unit || 1,
          kriteria_alkes: data?.jenis_sdmk_per_alat || ["Dokter", "Perawat"],
        });
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
        setGetLoading(false);
      }
    },
    [user?.token]
  );

  useEffect(() => {
    fetchKonfirmasiData();
    // fetchProvinsi();
  }, []);

  /* ================== COMPUTED ================== */
  const kesiapanSDM = useMemo(() => {
    return dbData.sdmWajib.every((x) => sdmChecked.includes(x))
      ? "Ya"
      : "Tidak";
  }, [sdmChecked]);

  const relokasi = useMemo(() => {
    if (kesiapanSDM === "Tidak" && upayaSDM?.value === "Tidak") return "Ya";
    if (sarpras?.value === "Tidak") return "Ya";
    if (alkes?.value === "Ya") return "Ya";
    return "Tidak";
  }, [kesiapanSDM, upayaSDM, sarpras, alkes]);

  useMemo(() => {
    const alasan = [];
    if (kesiapanSDM === "Tidak" && upayaSDM?.value === "Tidak")
      alasan.push(alasanRelokasiOptions[0]);
    if (sarpras?.value === "Tidak") alasan.push(alasanRelokasiOptions[1]);
    if (alkes?.value === "Ya") alasan.push(alasanRelokasiOptions[2]);
    setAlasanRelokasi(alasan);
  }, [kesiapanSDM, upayaSDM, sarpras, alkes]);

  /* ================== UI ================== */
  if (getLoading) {
    return (
      <div className="flex justify-center items-center">
        <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <Breadcrumb title="Konfirmasi Ulang Alkes" pageName="Konfirmasi Alkes" />
      <Card>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-end mb-4">
            <Link
              to="/konfirmasi-alkes"
              className="px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>

          {/* IDENTITAS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-md">
            <ReadOnly label="Provinsi" value={formData.provinsi} />
            <ReadOnly label="Kab/Kota" value={formData.kabKota} />
            <ReadOnly label="Kode Puskesmas" value={formData.kode} />
            <ReadOnly label="Nama Puskesmas" value={formData.puskesmas} />
            <ReadOnly label="Nama Alkes" value={formData.alat} />
            <ReadOnly label="Jumlah" value={formData.jumlah} />
          </div>

          {/* SDM WAJIB */}
          <section className="mt-6 bg-white p-4 rounded-md">
            <h2 className="font-semibold mb-2">SDM Wajib per Alat</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {dbData.sdmWajib.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          {/* SDM DIMILIKI */}
          <section className="mt-8">
            <h2 className="font-semibold mb-3">SDM Dimiliki Puskesmas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sdmList.map((s) => {
                const isChecked = sdmChecked.includes(s);
                return (
                  <div
                    key={s}
                    className={`border rounded-md p-3 border-[#cacaca] ${
                      isChecked ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSdmChecked((p) =>
                            p.includes(s) ? p.filter((x) => x !== s) : [...p, s]
                          )
                        }
                      />
                      {s}
                    </label>
                    {isChecked && (
                      <input
                        type="text"
                        className="mt-2 w-full border rounded-md px-2 py-1 text-sm"
                        placeholder={`Nama ${s}`}
                        value={sdmNama[s] || ""}
                        onChange={(e) =>
                          setSdmNama({ ...sdmNama, [s]: e.target.value })
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-4">
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

          {/* SARPRAS */}
          <section className="mt-6 grid grid-cols-2 gap-4">
            <FormSelect
              label="Kesiapan Sarpras"
              placeholder="Pilih kesiapan sarana & prasarana"
              value={sarpras}
              onChange={setSarpras}
              options={yaTidakOptions}
            />
            <FormSelect
              label="Alkes Berfungsi"
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
              <>
                <FormSelect
                  label="Skema Relokasi"
                  placeholder="Pilih Skema Relokasi"
                  value={skemaRelokasi}
                  onChange={setSkemaRelokasi}
                  options={skemaRelokasiOptions}
                />
                <FormSelect
                  label="Alasan Relokasi"
                  placeholder="Pilih Alasan Relokasi"
                  isMulti
                  value={alasanRelokasi}
                  onChange={setAlasanRelokasi}
                  options={alasanRelokasiOptions}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {" "}
                  <FormSelect
                    label="Kab/Kota Tujuan Relokasi"
                    placeholder="Pilih kabupaten / kota tujuan"
                    value={kabRelokasi}
                    onChange={setKabRelokasi}
                    options={kabKotaOptions}
                  />{" "}
                  <FormSelect
                    label="Puskesmas Tujuan Relokasi"
                    placeholder="Pilih puskesmas penerima relokasi"
                    value={pusRelokasi}
                    onChange={setPusRelokasi}
                    options={puskesmasOptions}
                  />{" "}
                </div>

                <FormInput
                  label="Alamat Puskesmas Relokasi"
                  value={alamatRelokasi}
                  onChange={(e) => setAlamatRelokasi(e.target.value)}
                />
                <FormInput
                  label="Contact Person Puskesmas Relokasi"
                  value={cpRelokasi}
                  placeholder="Contoh: 081234567890"
                  onChange={(e) => setCpRelokasi(e.target.value)}
                />
                <FormInput
                  label="Contact Person Dinkes Penerima"
                  placeholder="Contoh: 081234567890"
                  value={cpDinkes}
                  onChange={(e) => setCpDinkes(e.target.value)}
                />
              </>
            )}
          </section>

          {/* PIC */}
          <section className="mt-8 grid grid-cols-2 gap-4">
            <FormInput
              label="Nama PIC Puskesmas"
              placeholder="Contoh: Dr. Ahmad Fauzi"
              value={picNama}
              onChange={(e) => setPicNama(e.target.value)}
            />
            <FormInput
              label="No HP PIC Puskesmas"
              value={picHp}
              placeholder="Contoh: 081234567890"
              onChange={(e) => setPicHp(e.target.value)}
            />
            <FormInput
              label="PIC Dinkes Kab/Kota"
              placeholder="Contoh: Dr. Ahmad Fauzi"
              value={picDinkes}
              onChange={(e) => setPicDinkes(e.target.value)}
            />
            <FormSelect
              label="Status Verifikasi"
              value={statusVerifikasi}
              onChange={setStatusVerifikasi}
              options={[
                { value: "OK", label: "OK" },
                { value: "Perlu Revisi", label: "Perlu Revisi" },
              ]}
            />
          </section>

          {/* <section className="mt-6">
            <label className="text-xs font-semibold block mb-1">
              Upload Surat Balasan (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFileSurat(e.target.files[0])}
            />
          </section> */}

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

/* ================== HELPERS ================== */
function ReadOnly({ label, value }) {
  return (
    <div>
      {" "}
      <label className="text-xs text-[#3f4750] font-semibold">
        {label}
      </label>{" "}
      <div className="mt-1 border rounded-md px-3 py-2 bg-white text-sm text-[#3f4750] border-[#cacaca]">
        {" "}
        {value}{" "}
      </div>{" "}
    </div>
  );
}
function FormSelect({ label, placeholder, isMulti, ...props }) {
  return (
    <div>
      {" "}
      <label className="text-xs text-[#272b2f] font-semibold mb-1 block">
        {" "}
        {label}{" "}
      </label>{" "}
      <Select
        className="text-sm"
        theme={selectThemeColors}
        placeholder={
          placeholder ??
          (isMulti ? "Pilih satu atau lebih opsi" : "Pilih salah satu")
        }
        isMulti={isMulti}
        {...props}
      />{" "}
    </div>
  );
}
function FormInput({ label, helper, type = "text", ...props }) {
  return (
    <div>
      {" "}
      <label className="text-xs text-[#272b2f] font-semibold mb-1 block">
        {" "}
        {label}{" "}
      </label>{" "}
      <input
        type={type}
        className="w-full border border-[#cacaca] rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        {...props}
      />{" "}
      {helper && <p className="text-xs text-[#728294] mt-1">{helper}</p>}{" "}
    </div>
  );
}
