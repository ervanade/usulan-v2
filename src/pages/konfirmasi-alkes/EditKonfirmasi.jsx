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
  checkKesiapanSDMByString,
  dbData,
  resolveStatusVerifikasi,
  skemaRelokasiOptions,
  strategiOptions,
  yaTidakOptions,
} from "./components/konfirmasi.constants";
import FormInput from "./components/form/FormInput";
import FormSelect from "./components/form/FormSelect";
import ReadOnly from "./components/form/ReadOnly";
import { validateKonfirmasiPayload } from "./components/services/konfirmasiValidation";
import { putKonfirmasi } from "./components/services/konfirmasiApi";
import { buildKonfirmasiPayload } from "./components/services/konfirmasiPayload";
import {
  showErrorAlert,
  showPayloadPreview,
  showSuccessAlert,
} from "./components/alert";

export default function EditKonfirmasi() {
  const user = useSelector((a) => a.auth.user);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id_ihss: "1",
    id_provinsi: "32",
    id_kabupaten: "3202",
    id_puskesmas: "3146",
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
  const [sdmWajib, setSdmWajib] = useState("");

  const [sdmChecked, setSdmChecked] = useState({});
  const [sdmList, setSdmList] = useState([]);
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
  const [provRelokasi, setProvRelokasi] = useState(null);
  const [provOptions, setProvOptions] = useState([]);
  const [loadingProv, setLoadingProv] = useState(false);

  const fetchKriteriaSDM = useCallback(async () => {
    try {
      const res = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kriteria`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      return res.data.data
        .filter((x) => x.stat === 1)
        .map((x) => ({
          id: x.id,
          nama: x.kriteria,
        }));
    } catch (err) {
      console.error("Gagal fetch kriteria SDM", err);
      return [];
    }
  }, [user?.token]);

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
  const fetchProvinsi = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/provinsi`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      return res.data.data
        .filter((p) => p.id !== formData.id_provinsi) // ⬅️ exclude current
        .map((p) => ({
          value: p.id,
          label: p.name,
        }));
    } catch (err) {
      console.error("Gagal fetch provinsi", err);
      return [];
    }
  }, [user?.token, formData.id_provinsi]);

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

    setProvRelokasi(null);
    setKabRelokasi(null);
    setPusRelokasi(null);
    setProvOptions([]);
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
        setLoadingProv(true);
        const prov = await fetchProvinsi();
        setProvOptions(prov);
        setLoadingProv(false);
      }

      setLoadingKab(false);
    };

    load();
  }, [skemaRelokasi]);

  useEffect(() => {
    if (!provRelokasi) return;

    setKabRelokasi(null);
    setPusRelokasi(null);
    setKabOptions([]);
    setPusOptions([]);
    setAlamatRelokasi("");

    const loadKab = async () => {
      setLoadingKab(true);
      const kab = await fetchKabupatenByProvinsi(provRelokasi.value);
      setKabOptions(kab);
      setLoadingKab(false);
    };

    loadKab();
  }, [provRelokasi]);

  useEffect(() => {
    if (!kabRelokasi) return;

    let isActive = true; // ⬅️ proteksi

    const loadPuskesmas = async () => {
      setLoadingPus(true);
      const targetProvinsi =
        skemaRelokasi?.value === "ANTAR_PROV"
          ? provRelokasi?.value
          : formData.id_provinsi;

      const list = await fetchPuskesmas({
        id_provinsi: targetProvinsi || "",
        id_kabupaten: kabRelokasi.value || "",
        id_kecamatan: "",
      });

      const filtered = list.filter((p) => p.value !== formData.id_puskesmas);

      if (isActive) {
        setPusOptions(filtered);
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
  useEffect(() => {
    if (skemaRelokasi?.value === "ANTAR_PROV") {
      setKabRelokasi(null);
      setPusRelokasi(null);
      setKabOptions([]);
      setPusOptions([]);
    }
  }, [provRelokasi]);

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
        id_ihss: d.id_ihss,
        id_provinsi: d.id_provinsi,
        id_kabupaten: d.id_kabupaten,
        id_puskesmas: d.id_puskesmas,
        provinsi: d.provinsi,
        kabKota: d.kab_kota,
        puskesmas: d.nama_puskesmas,
        kode: d.kode_puskesmas,
        alat: d.nama_barang,
        jumlah: d.jumlah_barang_unit,
      });

      /* ---------- SDM WAJIB PER ALKES ---------- */
      setSdmWajib(d.jenis_sdmk_per_alat);

      /* ---------- SDM DIMILIKI PUSKESMAS ---------- */
      const checked = {};
      d.puskesmas.kriteria_puskesmas.forEach((x) => {
        checked[x.kriteria.id] = {
          nama: x.nama_sdm || "",
          jenis: x.kriteria.kriteria, // ⬅️ INI PENTING
        };
      });
      setSdmChecked(checked);

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
  useEffect(() => {
    const loadKriteria = async () => {
      const list = await fetchKriteriaSDM();
      setSdmList(list);
    };

    loadKriteria();
  }, [fetchKriteriaSDM]);

  /* ================== COMPUTED ================== */
  const kesiapanSDM = useMemo(() => {
    const siap = checkKesiapanSDMByString(sdmWajib, sdmChecked);
    return siap ? "YA" : "TIDAK";
  }, [sdmWajib, sdmChecked]);

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

  const handleSubmit = async () => {
    // 1. Build payload
    const finalStatusVerifikasi = resolveStatusVerifikasi({
      role: user?.role,
      currentStatus: statusVerifikasi?.value || null,
    });

    const payload = buildKonfirmasiPayload({
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
      statusVerifikasi: finalStatusVerifikasi,
    });

    // 2. Validasi
    const validation = validateKonfirmasiPayload(payload);
    if (!validation.isValid) {
      await showErrorAlert("Validasi Gagal", validation.errors);
      return;
    }

    // 3. Preview payload (SweetAlert)
    const confirm = await showPayloadPreview(payload);

    if (!confirm.isConfirmed) {
      return; // user klik TIDAK
    }

    // 4. (sementara) console + success alert
    await putKonfirmasi(payload);
    await showSuccessAlert();
  };
  const isKabDisabled = useMemo(() => {
    if (!skemaRelokasi) return true;

    if (skemaRelokasi.value === "DALAM_KAB") return true;

    if (skemaRelokasi.value === "ANTAR_PROV" && !provRelokasi) return true;

    return false;
  }, [skemaRelokasi, provRelokasi]);

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
              <li>{sdmWajib}</li>
            </ul>
          </section>

          {/* SDM DIMILIKI */}
          <section className="mt-8">
            <h2 className="font-semibold mb-3">SDM Dimiliki Puskesmas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sdmList.map((s) => {
                const isChecked = !!sdmChecked[s.id];

                return (
                  <div
                    key={s.id}
                    className={`border rounded-md p-3 ${
                      isChecked
                        ? "border-primary bg-primary/5"
                        : "border-[#cacaca]"
                    }`}
                  >
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSdmChecked((prev) => {
                            const copy = { ...prev };
                            if (copy[s.id]) delete copy[s.id];
                            else
                              copy[s.id] = {
                                nama: "",
                                jenis: s.nama, // ⬅️ INI PENTING
                              };
                            return copy;
                          })
                        }
                      />
                      {s.nama}
                    </label>

                    {isChecked && (
                      <input
                        type="text"
                        className="mt-2 w-full border rounded-md px-2 py-1 text-sm"
                        placeholder={`Nama ${s.nama}`}
                        value={sdmChecked[s.id]?.nama || ""}
                        onChange={(e) =>
                          setSdmChecked((prev) => ({
                            ...prev,
                            [s.id]: {
                              ...prev[s.id],
                              nama: e.target.value,
                            },
                          }))
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
                  {skemaRelokasi?.value === "ANTAR_PROV" && (
                    <FormSelect
                      label="Provinsi Tujuan Relokasi"
                      placeholder="Pilih provinsi tujuan relokasi"
                      value={provRelokasi}
                      onChange={setProvRelokasi}
                      options={provOptions}
                      isLoading={loadingProv}
                    />
                  )}
                  <FormSelect
                    label="Kab/Kota Tujuan Relokasi"
                    placeholder={
                      !skemaRelokasi
                        ? "Pilih skema relokasi dahulu"
                        : skemaRelokasi.value === "ANTAR_PROV" && !provRelokasi
                        ? "Pilih provinsi tujuan terlebih dahulu"
                        : "Pilih kabupaten / kota tujuan"
                    }
                    value={kabRelokasi}
                    onChange={setKabRelokasi}
                    options={kabOptions}
                    isDisabled={isKabDisabled}
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
              label={`Nama PIC Puskesmas${
                skemaRelokasi?.value == "ANTAR_KAB" ? "  (lokus awal)" : ""
              }`}
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
              label={`PIC Dinkes Kab/Kota ${
                skemaRelokasi?.value == "ANTAR_KAB" ? "  (lokus awal)" : ""
              }`}
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
            <button
              className="bg-primary text-white px-6 py-2 rounded-md font-semibold"
              onClick={handleSubmit}
            >
              Simpan
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
