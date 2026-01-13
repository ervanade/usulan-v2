import { useState, useMemo, useEffect, useCallback } from "react";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Card from "../../components/Card/Card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { decryptId, selectThemeColors } from "../../data/utils";
import { useSelector } from "react-redux";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import {
  alasanRelokasiOptions,
  dbData,
  sdmList,
  skemaRelokasiOptions,
  strategiOptions,
  yaTidakOptions,
} from "./components/konfirmasi.constants";
import FormInput from "./components/form/FormInput";
import FormSelect from "./components/form/FormSelect";
import ReadOnly from "./components/form/ReadOnly";

export default function EditKonfirmasi() {
  const user = useSelector((a) => a.auth.user);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id_provinsi: "32",
    id_kabupaten: "3202",
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
  const [sdmWajib, setSdmWajib] = useState([]);

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
  const [cpHpRelokasi, setCpHpRelokasi] = useState("");
  const [cpHpDinkes, setCpHpDinkes] = useState("");
  const [kabRelokasi, setKabRelokasi] = useState(null);
  const [pusRelokasi, setPusRelokasi] = useState(null);

  const [picNama, setPicNama] = useState("");
  const [picHp, setPicHp] = useState("");
  const [picDinkes, setPicDinkes] = useState("");
  const [statusVerifikasi, setStatusVerifikasi] = useState(null);
  const [fileSurat, setFileSurat] = useState(null);

  const [kabOptions, setKabOptions] = useState([]);
  const [pusOptions, setPusOptions] = useState([]);
  const [loadingKab, setLoadingKab] = useState(false);
  const [loadingPus, setLoadingPus] = useState(false);

  const fetchKabupatenByProvinsi = useCallback(
    async (idProvinsi) => {
      try {
        const res = await axios({
          method: "get",
          url: `${
            import.meta.env.VITE_APP_API_URL
          }/api/getkabupaten/${idProvinsi}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        return res.data.data.map((k) => ({
          value: k.id,
          label: k.name,
        }));
      } catch (err) {
        console.error("Gagal fetch kabupaten", err);
        return [];
      }
    },
    [user?.token]
  );
  const fetchAllKabupaten = useCallback(async () => {
    try {
      const res = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kabupaten`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      return res.data.data.map((k) => ({
        value: k.id,
        label: k.name,
      }));
    } catch (err) {
      console.error("Gagal fetch semua kabupaten", err);
      return [];
    }
  }, [user?.token]);
  const fetchPuskesmas = useCallback(
    async ({ id_provinsi = "", id_kabupaten = "", id_kecamatan = "" }) => {
      try {
        const res = await axios({
          method: "post",
          url: `${import.meta.env.VITE_APP_API_URL}/api/puskesmas/filter`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          data: {
            id_provinsi: id_provinsi.toString() || "",
            id_kabupaten: id_kabupaten.toString() || "",
            id_kecamatan: id_kecamatan?.toString() || "",
          },
        });

        return res.data.data.map((p) => ({
          value: p.id,
          label: p.nama_puskesmas,
          alamat: p.alamat,
        }));
      } catch (err) {
        console.error("Gagal fetch puskesmas", err);
        return [];
      }
    },
    [user?.token]
  );

  useEffect(() => {
    if (!skemaRelokasi) return;

    setKabRelokasi(null);
    setPusRelokasi(null);
    setKabOptions([]);
    setPusOptions([]);
    setAlamatRelokasi("");

    const load = async () => {
      setLoadingKab(true);

      if (skemaRelokasi.value === "DALAM_KAB") {
        const kab = await fetchKabupatenByProvinsi(formData.id_provinsi);
        const currentKab = kab.find((k) => k.value === formData.id_kabupaten);
        setKabOptions(kab);
        setKabRelokasi(currentKab);
      }

      if (skemaRelokasi.value === "ANTAR_KAB") {
        const kab = await fetchKabupatenByProvinsi(formData.id_provinsi);
        setKabOptions(kab.filter((k) => k.value !== formData.id_kabupaten));
      }

      if (skemaRelokasi.value === "ANTAR_PROV") {
        const kab = await fetchAllKabupaten();
        setKabOptions(kab.filter((k) => k.value !== formData.id_kabupaten));
      }

      setLoadingKab(false);
    };

    load();
  }, [skemaRelokasi]);

  useEffect(() => {
    if (!kabRelokasi) return;

    let isActive = true; // ⬅️ proteksi

    const loadPuskesmas = async () => {
      setLoadingPus(true);
      const targetProvinsi =
        skemaRelokasi?.value !== "ANTAR_PROV" ? formData.id_provinsi : "";

      const list = await fetchPuskesmas({
        id_provinsi: targetProvinsi || "",
        id_kabupaten: kabRelokasi.value || "",
        id_kecamatan: "",
      });

      if (isActive) {
        setPusOptions(list);
        setLoadingPus(false);
      }
    };

    loadPuskesmas();

    return () => {
      isActive = false; // ⬅️ matikan response lama
    };
  }, [kabRelokasi]);

  useEffect(() => {
    if (pusRelokasi?.alamat) {
      setAlamatRelokasi(pusRelokasi.alamat);
    }
  }, [pusRelokasi]);
  useEffect(() => {
    // setiap ganti kabupaten → reset puskesmas
    setPusRelokasi(null);
    setPusOptions([]);
    setAlamatRelokasi("");
  }, [kabRelokasi]);

  const fetchKonfirmasiData = useCallback(async () => {
    try {
      const decryptedId = decryptId(id);
      if (!decryptedId) return navigate("/not-found");

      const res = await axios.get(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/konfirmasidetail/${decryptedId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const d = res.data.data;

      /* ---------- IDENTITAS ---------- */
      setFormData({
        id_provinsi: d.id_provinsi,
        id_kabupaten: d.id_kabupaten,
        provinsi: d.provinsi,
        kabKota: d.kab_kota,
        puskesmas: d.nama_puskesmas,
        kode: d.kode_puskesmas,
        alat: d.nama_barang,
        jumlah: d.jumlah_barang_unit,
      });

      /* ---------- SDM WAJIB PER ALKES ---------- */
      const wajib = d.alkes.kriteria_alkes.map((x) => x.kriteria.kriteria);
      setSdmWajib(wajib);

      /* ---------- SDM DIMILIKI PUSKESMAS ---------- */
      const pkmSDM = d.puskesmas.kriteria_puskesmas.map(
        (x) => x.kriteria.kriteria
      );
      setSdmChecked(pkmSDM);

      setSdmNama({
        Dokter: d.sdmk_nama_dokter,
        "Dokter Gigi": d.sdmk_nama_dokter_gigi,
        Perawat: d.sdmk_nama_perawat,
        Bidan: d.sdmk_nama_bidan,
        ATLM: d.sdmk_nama_atlm,
      });

      /* ---------- SELECT VALUE ---------- */
      setSarpras(
        yaTidakOptions.find((o) => o.value === d.siap_sarana_prasarana)
      );
      setAlkes(yaTidakOptions.find((o) => o.value === d.kondisi_alkes_baik));
      setUpayaSDM(yaTidakOptions.find((o) => o.value === d.upaya_memenuhi_sdm));

      setStrategi(
        d.strategi_pemenuhan_sdm
          ? d.strategi_pemenuhan_sdm
              .split(",")
              .map((x) => strategiOptions.find((o) => o.value === x.trim()))
          : []
      );

      setAlasanRelokasi(
        d.alasan_relokasi
          ? d.alasan_relokasi
              .split(",")
              .map((x) =>
                alasanRelokasiOptions.find((o) => o.value === x.trim())
              )
          : []
      );

      setPicNama(d.pic_puskesmas_nama);
      setPicHp(d.pic_puskesmas_hp);
      setPicDinkes(d.pic_dinkes_nama);

      setStatusVerifikasi(
        d.status_verifikasi
          ? { value: d.status_verifikasi, label: d.status_verifikasi }
          : null
      );
    } finally {
      setGetLoading(false);
    }
  }, [id, user.token, navigate]);
  useEffect(() => {
    fetchKonfirmasiData();
    // fetchProvinsi();
  }, []);

  /* ================== COMPUTED ================== */
  const kesiapanSDM = useMemo(() => {
    return dbData.sdmWajib.every((x) => sdmChecked.includes(x))
      ? "YA"
      : "TIDAK";
  }, [sdmChecked]);

  const relokasi = useMemo(() => {
    if (kesiapanSDM === "TIDAK" && upayaSDM?.value === "TIDAK") return "YA";
    if (sarpras?.value === "TIDAK") return "YA";
    if (alkes?.value === "YA") return "YA";
    return "TIDAK";
  }, [kesiapanSDM, upayaSDM, sarpras, alkes]);

  useMemo(() => {
    const alasan = [];
    if (kesiapanSDM === "TIDAK" && upayaSDM?.value === "TIDAK")
      alasan.push(alasanRelokasiOptions[0]);
    if (sarpras?.value === "TIDAK") alasan.push(alasanRelokasiOptions[1]);
    if (alkes?.value === "YA") alasan.push(alasanRelokasiOptions[2]);
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
          {/* STATUS VERIFIKASI (ROLE 1 ONLY) */}
          {user?.role == "1" && (
            <section className="mt-6 bg-yellow-50 border border-yellow-300 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-yellow-800">
                    Status Verifikasi
                  </h2>
                  <p className="text-xs text-yellow-700 mt-1">
                    Keputusan akhir verifikasi kelayakan data puskesmas
                  </p>
                </div>

                <div className="w-60">
                  <FormSelect
                    value={statusVerifikasi}
                    onChange={setStatusVerifikasi}
                    options={[
                      { value: "OK", label: "✅ OK (Data Sesuai)" },
                      { value: "REVISI", label: "⚠️ Perlu Revisi" },
                    ]}
                  />
                </div>
              </div>
            </section>
          )}

          {/* SDM WAJIB */}
          <section className="mt-6 bg-white p-4 rounded-md">
            <h2 className="font-semibold mb-2">SDM Wajib per Alat</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {sdmWajib.map((s) => (
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
          {kesiapanSDM === "TIDAK" && (
            <section className="mt-6 grid grid-cols-2 gap-4">
              <FormSelect
                label="Upaya Pemenuhan SDM"
                placeholder="Apakah akan dilakukan upaya pemenuhan SDM?"
                value={upayaSDM}
                onChange={setUpayaSDM}
                options={yaTidakOptions}
              />
              {upayaSDM?.value === "YA" && (
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
              label="Ketersediaan Alkes berfungsi dengan baik
"
              placeholder="Alkes Existing berfungsi dengan baik?"
              value={alkes}
              onChange={setAlkes}
              options={yaTidakOptions}
            />
          </section>

          {/* RELOKASI */}
          <section className="mt-8 bg-white p-4 rounded-md">
            <ReadOnly label="Relokasi" value={relokasi} />

            {relokasi === "YA" && (
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
                    placeholder={
                      !skemaRelokasi
                        ? "Pilih Skema Relokasi Dahulu"
                        : "Pilih kabupaten / kota tujuan"
                    }
                    value={kabRelokasi}
                    onChange={setKabRelokasi}
                    options={kabOptions}
                    isDisabled={
                      skemaRelokasi?.value === "DALAM_KAB" || !skemaRelokasi
                    }
                    isLoading={loadingKab}
                  />{" "}
                  <FormSelect
                    label="Puskesmas Tujuan Relokasi"
                    placeholder={
                      !kabRelokasi
                        ? "Pilih kabupaten / kota dahulu"
                        : "Pilih puskesmas penerima relokasi"
                    }
                    value={pusRelokasi}
                    onChange={setPusRelokasi}
                    isDisabled={!kabRelokasi}
                    options={pusOptions}
                    isLoading={loadingPus}
                  />{" "}
                </div>

                <FormInput
                  label={
                    !pusRelokasi
                      ? "Pilih puskesmas relokasi dahulu"
                      : "Alamat Puskesmas Relokasi"
                  }
                  placeholder={"Alamat puskesmas penerima relokasi"}
                  disabled={!pusRelokasi}
                  value={alamatRelokasi}
                  onChange={(e) => setAlamatRelokasi(e.target.value)}
                />

                <section className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="CP Nama Puskesmas Relokasi"
                    value={cpRelokasi}
                    placeholder={
                      !pusRelokasi
                        ? "Pilih puskesmas relokasi dahulu"
                        : "Contoh: Dr. Ahmad Fauzi"
                    }
                    disabled={!pusRelokasi}
                    onChange={(e) => setCpRelokasi(e.target.value)}
                  />
                  <FormInput
                    label="CP No HP Puskesmas Relokasi"
                    value={cpHpRelokasi}
                    placeholder={
                      !pusRelokasi
                        ? "Pilih puskesmas relokasi dahulu"
                        : "Contoh: 081234567890"
                    }
                    disabled={!pusRelokasi}
                    onChange={(e) => setCpHpRelokasi(e.target.value)}
                  />
                  <FormInput
                    label="CP Nama Dinkes Penerima"
                    placeholder={
                      !pusRelokasi
                        ? "Pilih puskesmas relokasi dahulu"
                        : "Contoh: Dr. Ahmad Fauzi"
                    }
                    value={cpDinkes}
                    disabled={!pusRelokasi}
                    onChange={(e) => setCpDinkes(e.target.value)}
                  />
                  <FormInput
                    label="CP No HP Dinkes Penerima"
                    placeholder={
                      !pusRelokasi
                        ? "Pilih puskesmas relokasi dahulu"
                        : "Contoh: 081234567890"
                    }
                    value={cpHpDinkes}
                    disabled={!pusRelokasi}
                    onChange={(e) => setCpHpDinkes(e.target.value)}
                  />
                </section>
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
              placeholder="Contoh: Dr. Ahmad Fauzi_081234567890"
              value={picDinkes}
              onChange={(e) => setPicDinkes(e.target.value)}
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
