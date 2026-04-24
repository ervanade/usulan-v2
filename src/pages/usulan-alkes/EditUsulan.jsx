import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.jsx";
import {
  AlasanOptions,
  allowedKabupaten,
  dayaOptions,
  pelayananOptions,
  SelectOptions,
  StrategiPemenuhanOptions,
} from "../../data/data.js";
import { checkKesiapanSDMByString } from "../konfirmasi-alkes/components/konfirmasi.constants";
import { decryptId, isAdmin, isDesker, selectThemeColors } from "../../data/utils.js";
import { FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";
import { mutate } from "swr";
import Card from "../../components/Card/Card";
import UsulanForm from "./components/UsulanForm";
import UsulanItemsTable from "./components/UsulanItemsTable";
import {
  useUsulanDetail,
  useKriteria,
  usePeriode,
  useLimbah,
  useSumberListrik,
} from "../../hooks/useUsulan";
import { updateUsulan } from "../../api/services/usulanService";

const EditUsulan = () => {
  const user = useSelector((a) => a.auth.user);
  const { id } = useParams();
  const decryptedId = useMemo(() => decryptId(id), [id]);
  const [idPeriode, setIdPeriode] = useState(null);

  const {
    usulan: usulanDetail,
    isLoading: usulanLoading,
    mutate: mutateDetail,
  } = useUsulanDetail(decryptedId, idPeriode);
  const { kriteria: dataKriteriaRaw } = useKriteria();
  const { periode: dataPeriodeRaw } = usePeriode();
  const { limbah: dataLimbahRaw } = useLimbah();
  const { sumberListrik: dataSumberListrikRaw } = useSumberListrik();

  const [formData, setFormData] = useState({
    id_provinsi: "",
    id_kabupaten: "",
    id_kecamatan: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    nama_puskesmas: "",
    kode_pusdatin_baru: "",
    id: "",
    tahun_lokus: "2026",
    pelayanan: "",
    ketersediaan_listrik: "",
    kapasitas_listrik: "",
    internet: "",
    tgl_upload: null,
    id_kriteria: [],
    usulan: [],
    wilayah_kerja: "",
    persalinan: "",
    poned: "",
    pengelolaan_limbah: [],
    master_sumber_listrik: [],
    total_daya_listrik: "",
  });

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isDisabled = false;

  // Verifikasi state (desker only)
  const [statusVerifikasi, setStatusVerifikasi] = useState("");
  const [catatanVerifikasi, setCatatanVerifikasi] = useState("");

  const isDeskerUser = isDesker(user?.role);
  const isAdminUser = isAdmin(user?.role);
  // const isAllowedKab = useMemo(
  //   () => isAdmin || allowedKabupaten.includes(formData.kabupaten),
  //   [formData.kabupaten, isAdmin],
  // );
  const isAllowedKab = true;

  const [dataKriteria, setDataKriteria] = useState([]);
  const [dataPeriode, setDataPeriode] = useState([]);
  const [dataLimbah, setDataLimbah] = useState([]);
  const [dataSumberListrik, setDataSumberListrik] = useState([]);

  const [selectedPelayanan, setSelectedPelayanan] = useState(null);
  const [selectedPeriode, setSelectedPeriode] = useState(null);
  const [selectedKriteria, setSelectedKriteria] = useState(null);
  const [selectedDaya, setSelectedDaya] = useState(null);
  const [selectedListrik, setSelectedListrik] = useState(null);
  const [selectedInternet, setSelectedInternet] = useState(null);
  const [selectedPersalinan, setSelectedPersalinan] = useState(null);
  const [selectedPoned, setSelectedPoned] = useState(null);
  const [selectedLimbah, setSelectedLimbah] = useState(null);
  const [selectedSumberListrik, setSelectedSumberListrik] = useState(null);
  const [selectedTotalDaya, setSelectedTotalDaya] = useState(null);

  const [editedData, setEditedData] = useState({});
  const [errors, setErrors] = useState({});

  const ownedSDMObj = useMemo(() => {
    const obj = {};
    formData.id_kriteria?.forEach((id) => {
      const kriteria = dataKriteriaRaw?.find((k) => k.id == id);
      if (kriteria) {
        obj[id] = { jenis: kriteria.kriteria };
      }
    });
    return obj;
  }, [formData.id_kriteria, dataKriteriaRaw]);

  const navigate = useNavigate();

  useEffect(() => {
    if (dataKriteriaRaw) {
      setDataKriteria([
        { value: "all", label: "Pilih Semua" },
        ...dataKriteriaRaw.map((item) => ({
          label: item.kriteria,
          value: item.id,
        })),
      ]);
    }
  }, [dataKriteriaRaw]);

  useEffect(() => {
    if (dataPeriodeRaw) {
      setDataPeriode(
        dataPeriodeRaw.map((item) => ({
          label: item.periode_name,
          value: item.id,
          stat: item.stat,
        })),
      );
    }
  }, [dataPeriodeRaw]);

  useEffect(() => {
    if (dataLimbahRaw) {
      setDataLimbah(
        dataLimbahRaw.map((item) => ({
          label: item.nama_pengelolaan_limbah,
          value: item.id,
        })),
      );
    }
  }, [dataLimbahRaw]);

  useEffect(() => {
    if (dataSumberListrikRaw) {
      setDataSumberListrik(
        dataSumberListrikRaw.map((item) => ({
          label: item.nama_sumber_listrik,
          value: item.id,
        })),
      );
    }
  }, [dataSumberListrikRaw]);

  useEffect(() => {
    if (usulanDetail) {
      setFormData({
        id_provinsi: String(usulanDetail.id_provinsi) || "",
        id_kabupaten: String(usulanDetail.id_kabupaten) || "",
        id_kecamatan: String(usulanDetail.id_kecamatan) || "",
        provinsi: usulanDetail.provinsi || "",
        kabupaten: usulanDetail.kabupaten || "",
        kecamatan: usulanDetail.kecamatan || "",
        nama_puskesmas: usulanDetail.nama_puskesmas || "",
        kode_pusdatin_baru: usulanDetail.kode_pusdatin_baru || "",
        id: usulanDetail.id || "",
        tahun_lokus: "2026",
        pelayanan: usulanDetail.pelayanan || "",
        ketersediaan_listrik: usulanDetail.ketersediaan_listrik || "",
        kapasitas_listrik: usulanDetail.kapasitas_listrik || "",
        internet: usulanDetail.internet || "",
        tgl_upload: usulanDetail.usulan_alkes[0]?.tgl_upload || null,
        usulan: usulanDetail.usulan || [],
        id_kriteria: usulanDetail.id_kriteria || [],
        wilayah_kerja: usulanDetail.wilayah_kerja || "",
        persalinan: usulanDetail.persalinan || "",
        poned: usulanDetail.poned || "",
        pengelolaan_limbah: usulanDetail.pengelolaan_limbah
          ? usulanDetail.pengelolaan_limbah.map((limb) =>
              typeof limb === "object" && limb !== null ? limb.id : limb
            )
          : [],
        master_sumber_listrik: usulanDetail.master_sumber_listrik
          ? usulanDetail.master_sumber_listrik.map((src) =>
              typeof src === "object" && src !== null ? src.id : src
            )
          : [],
        total_daya_listrik: usulanDetail.total_daya_listrik || "",
      });
      setFilteredData(usulanDetail.usulan || []);
      if (!idPeriode) {
        setIdPeriode(usulanDetail.usulan_alkes[0]?.periode_id);
      }
      // Init verifikasi fields
      setStatusVerifikasi(usulanDetail.status_verifikasi || "");
      setCatatanVerifikasi(usulanDetail.keterangan || "");
    }
  }, [usulanDetail]);

  const handlePeriodeChange = (selectedOption) => {
    setSelectedPeriode(selectedOption);
    setIdPeriode(selectedOption?.value);
  };

  const handleAlasanChange = (rowId, value) => {
    setEditedData((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        keterangan_usulan: value,
        ...(value !== "Lainnya" && { catatanAlasan: undefined }),
      },
    }));
  };

  const handleCatatanAlasanChange = (rowId, value) => {
    setEditedData((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        catatanAlasan: value,
      },
    }));
  };

  const handleStrategiPemenuhanChange = (rowId, value) => {
    setEditedData((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        strategi_pemenuhan: value,
      },
    }));
  };

  // Unused manual fetch functions removed (fetchPuskesmas, fetchProvinsi, etc.)
  // Handled by hooks or not needed for EditUsulan
  // Initialization of states from formData
  useEffect(() => {
    if (formData.pelayanan) {
      const initialOption = pelayananOptions.find(
        (kec) => kec.value == formData.pelayanan,
      );
      if (initialOption) {
        setSelectedPelayanan({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    if (formData.ketersediaan_listrik) {
      const initialOption = SelectOptions.find(
        (kec) => kec.value == formData.ketersediaan_listrik,
      );
      if (initialOption) {
        setSelectedListrik({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    if (formData.kapasitas_listrik) {
      const initialOption = dayaOptions.find(
        (kec) => kec.value == formData.kapasitas_listrik,
      );
      if (initialOption) {
        setSelectedDaya({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    if (formData.internet) {
      const initialOption = SelectOptions.find(
        (kec) => kec.value == formData.internet,
      );
      if (initialOption) {
        setSelectedInternet({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    if (formData.persalinan) {
      const initialOption = SelectOptions.find(
        (kec) => kec.value == formData.persalinan,
      );
      if (initialOption) {
        setSelectedPersalinan({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    if (formData.poned) {
      const initialOption = SelectOptions.find(
        (kec) => kec.value == formData.poned,
      );
      if (initialOption) {
        setSelectedPoned({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    if (formData.pengelolaan_limbah && formData.pengelolaan_limbah.length > 0 && dataLimbah.length > 0) {
      const initialOptions = formData.pengelolaan_limbah
        .map((val) => {
          const limbahId = typeof val === "object" && val !== null ? val.id : val;
          const found = dataLimbah.find((opt) => opt.value == limbahId);
          return found ? { label: found.label, value: found.value } : null;
        })
        .filter(Boolean);
      setSelectedLimbah(initialOptions);
    }

    if (formData.master_sumber_listrik && formData.master_sumber_listrik.length > 0 && dataSumberListrik.length > 0) {
      const initialOptions = formData.master_sumber_listrik
        .map((val) => {
          const sourceId = typeof val === "object" && val !== null ? val.id : val;
          const found = dataSumberListrik.find((opt) => opt.value == sourceId);
          return found ? { label: found.label, value: found.value } : null;
        })
        .filter(Boolean);
      setSelectedSumberListrik(initialOptions);
    }

    if (formData.total_daya_listrik) {
      const initialOption = dayaOptions.find(
        (opt) => opt.value == formData.total_daya_listrik
      );
      if (initialOption) {
        setSelectedTotalDaya({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }
  }, [
    formData?.internet,
    formData?.pelayanan,
    formData?.ketersediaan_listrik,
    formData?.kapasitas_listrik,
    formData?.persalinan,
    formData?.poned,
    formData?.pengelolaan_limbah,
    formData?.master_sumber_listrik,
    formData?.total_daya_listrik,
    dataLimbah,
    dataSumberListrik,
  ]);

  useEffect(() => {
    if (formData.id_kriteria && dataKriteria.length > 0) {
      const initialSelectedKriteria = formData.id_kriteria
        .map((kriteriaId) => {
          const foundKriteria = dataKriteria.find(
            (kriteria) => kriteria.value == kriteriaId,
          );
          return foundKriteria
            ? { value: foundKriteria.value, label: foundKriteria.label }
            : null;
        })
        .filter(Boolean);
      setSelectedKriteria(initialSelectedKriteria);
    }
  }, [formData.id_kriteria, dataKriteria]);

  useEffect(() => {
    if (idPeriode && dataPeriode.length > 0) {
      const initialOption = dataPeriode.find((kec) => kec.value == idPeriode);
      if (initialOption) {
        setSelectedPeriode({
          label: initialOption.label,
          value: initialOption.value,
          stat: initialOption.stat,
        });
      }
    }
  }, [idPeriode, dataPeriode]);

  useEffect(() => {
    if (formData?.usulan && AlasanOptions) {
      const initialEditedData = {};
      formData.usulan.forEach((item) => {
        const alasanToUse = item.alasan_tidak_mengusulkan ?? null;
        const isStandardAlasan = AlasanOptions.some(
          (opt) => opt.value === alasanToUse,
        );

        const berfungsi = item.berfungsi ?? 0;
        const usulan = item.usulan ?? 0;

        // Tentukan standard berdasarkan pelayanan yang sudah dipilih,
        // atau fallback ke keduanya untuk auto-clear saat init
        const pelayanan = selectedPelayanan?.value || formData.pelayanan;
        const standard = pelayanan === "Non Rawat Inap"
          ? item.standard_non_inap
          : item.standard_rawat_inap;

        const required = standard != null ? Math.max(0, standard - berfungsi) : null;

        // Auto-clear alasan kalau kondisi sudah terpenuhi saat init
        const shouldClearAlasan = required !== null && usulan >= required;

        initialEditedData[item.id] = {
          berfungsi,
          usulan,
          keterangan_usulan: shouldClearAlasan
            ? null
            : isStandardAlasan
              ? alasanToUse
              : alasanToUse === null || alasanToUse === false || alasanToUse === ""
                ? ""
                : "Lainnya",
          catatanAlasan: shouldClearAlasan
            ? undefined
            : isStandardAlasan
              ? undefined
              : alasanToUse === null || alasanToUse === false || alasanToUse === ""
                ? undefined
                : alasanToUse,
          strategi_pemenuhan: item.strategi_pemenuhan || null,
        };
      });

      setEditedData((prev) => ({
        ...prev,
        ...initialEditedData,
      }));
    }
  }, [formData.usulan, AlasanOptions]);

  // Handlers for Select components
  const handlePelayananChange = (selectedOption) => {
    setSelectedPelayanan(selectedOption);
    setFormData((prev) => ({ ...prev, pelayanan: selectedOption?.value }));
  };

  const handleDayaChange = (selectedOption) => {
    setSelectedDaya(selectedOption);
    setFormData((prev) => ({
      ...prev,
      kapasitas_listrik: selectedOption?.value,
    }));
  };

  const handleListrikChange = (selectedOption) => {
    setSelectedListrik(selectedOption);
    setFormData((prev) => ({
      ...prev,
      ketersediaan_listrik: selectedOption?.value,
    }));
  };

  const handleInternetChange = (selectedOption) => {
    setSelectedInternet(selectedOption);
    setFormData((prev) => ({ ...prev, internet: selectedOption?.value }));
  };

  const handlePersalinanChange = (selectedOption) => {
    setSelectedPersalinan(selectedOption);
    setFormData((prev) => ({
      ...prev,
      persalinan: selectedOption?.value,
    }));
  };

  const handlePonedChange = (selectedOption) => {
    setSelectedPoned(selectedOption);
    setFormData((prev) => ({
      ...prev,
      poned: selectedOption?.value,
    }));
  };

  const handleLimbahChange = (selectedOptions) => {
    setSelectedLimbah(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      pengelolaan_limbah: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    }));
  };

  const handleSumberListrikChange = (selectedOptions) => {
    setSelectedSumberListrik(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      master_sumber_listrik: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    }));
  };

  const handleTotalDayaChange = (selectedOption) => {
    setSelectedTotalDaya(selectedOption);
    setFormData((prev) => ({
      ...prev,
      total_daya_listrik: selectedOption?.value,
    }));
  };

  const handleKriteriaChange = (selectedOptions) => {
    setSelectedKriteria(selectedOptions);

    if (!selectedOptions) {
      setFormData((prev) => ({ ...prev, id_kriteria: [] }));
      return;
    }

    if (selectedOptions.some((option) => option.value === "all")) {
      const allKriteriaValues = dataKriteria
        .filter((option) => option.value !== "all")
        .map((option) => option.value);

      setSelectedKriteria(
        dataKriteria.filter((option) => option.value !== "all"),
      );
      setFormData((prev) => ({ ...prev, id_kriteria: allKriteriaValues }));
    } else {
      const kriteriaValues = selectedOptions.map((option) => option.value);
      setFormData((prev) => ({ ...prev, id_kriteria: kriteriaValues }));
    }
  };

  const handleInputChange = (rowId, columnName, value) => {
    const newValue = parseInt(value, 10);
    const finalValue = isNaN(newValue) ? 0 : newValue;

    // Ambil data row yang sedang diubah
    const row = filteredData.find((row) => row.id === rowId);

    // Ambil standard berdasarkan jenis pelayanan
    const standard =
      selectedPelayanan?.value === "Non Rawat Inap"
        ? row.standard_non_inap
        : row.standard_rawat_inap;

    // Ambil nilai yang ada di state atau data awal
    const masihBerfungsi = editedData[rowId]?.berfungsi ?? row.berfungsi ?? 0;
    const currentUsulan = editedData[rowId]?.usulan ?? row.usulan ?? 0;

    // Cek apakah memenuhi kriteria SDM
    const memenuhiKriteria = checkKesiapanSDMByString(row.jenis_sdmk_per_alat, ownedSDMObj);

    const isSdmkStrategyEnabled = import.meta.env.VITE_ENABLE_SDMK_STRATEGY === 'true';

    // 1. Handle perubahan usulan untuk alkes yang memenuhi kriteria SDM
    if (columnName === "usulan" && memenuhiKriteria) {
      const currentKeterangan = editedData[rowId]?.keterangan_usulan;

      // Bersihkan alasan "Tidak Siap SDM" jika sebelumnya ada
      if (currentKeterangan === "Tidak Siap SDM") {
        setEditedData((prevData) => ({
          ...prevData,
          [rowId]: {
            ...prevData[rowId],
            [columnName]: finalValue,
            keterangan_usulan: null,
            catatanAlasan: null,
          },
        }));
        return;
      }
    }

    // 2. Handle perubahan usulan untuk alkes yang TIDAK memenuhi kriteria SDM
    if (
      columnName === "usulan" &&
      !memenuhiKriteria &&
      row.jenis_sdmk_per_alat && row.jenis_sdmk_per_alat.trim() !== ""
    ) {
      if (!isSdmkStrategyEnabled) {
        setEditedData((prevData) => ({
          ...prevData,
          [rowId]: {
            ...prevData[rowId],
            [columnName]: finalValue,
            keterangan_usulan: "Tidak Siap SDM",
            catatanAlasan: undefined,
          },
        }));
        return;
      }
    }

    // 3. Skip validasi jika standard tidak terdefinisi
    if (standard === null || standard === undefined) {
      setEditedData((prevData) => ({
        ...prevData,
        [rowId]: {
          ...prevData[rowId],
          [columnName]: finalValue,
        },
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [rowId]: "",
      }));
      return;
    }

    // 4. Handle perubahan usulan (validasi dan alasan)
    if (columnName === "usulan") {
      const requiredUsulan = Math.max(0, standard - masihBerfungsi);

      // Validasi maksimal usulan
      if (finalValue > requiredUsulan) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [rowId]: `Usulan tidak boleh melebihi ${requiredUsulan}`,
        }));
        return;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [rowId]: "",
        }));
      }

      // Set needAlasan berdasarkan kondisi
      const newState = {
        ...editedData[rowId],
        [columnName]: finalValue,
        needAlasan: finalValue < requiredUsulan,
      };

      // Jika usulan sekarang memenuhi syarat, bersihkan alasan yang ada
      if (finalValue >= requiredUsulan) {
        newState.keterangan_usulan = undefined;
        newState.catatanAlasan = undefined;
        newState.needAlasan = false;
      }

      // Jika usulan dirubah menjadi 0, bersihkan strategi_pemenuhan
      if (finalValue === 0) {
        newState.strategi_pemenuhan = undefined;
      }

      setEditedData((prev) => ({
        ...prev,
        [rowId]: newState,
      }));
      return;
    }

    // 5. Handle perubahan masih_berfungsi
    if (columnName === "berfungsi") {
      const newRequiredUsulan = Math.max(0, standard - finalValue);

      // Sesuaikan usulan jika melebihi kebutuhan baru
      const adjustedUsulan = Math.min(currentUsulan, newRequiredUsulan);

      const newState = {
        ...editedData[rowId],
        [columnName]: finalValue,
        usulan: adjustedUsulan,
      };

      // Jika sudah memenuhi syarat, bersihkan alasan
      if (adjustedUsulan >= newRequiredUsulan) {
        newState.keterangan_usulan = undefined;
        newState.catatanAlasan = undefined;
        newState.needAlasan = false;
      }

      // Jika usulan menyesuaikan menjadi 0, bersihkan strategi_pemenuhan
      if (adjustedUsulan === 0) {
        newState.strategi_pemenuhan = undefined;
      }

      setEditedData((prevData) => ({
        ...prevData,
        [rowId]: newState,
      }));
      return;
    }

    // Default: update nilai biasa untuk kolom lainnya
    setEditedData((prevData) => ({
      ...prevData,
      [rowId]: {
        ...prevData[rowId],
        [columnName]: finalValue,
      },
    }));
  };

  const getResultData = () => {
    const isSdmkStrategyEnabled = import.meta.env.VITE_ENABLE_SDMK_STRATEGY === 'true';
    return filteredData.map((row) => {
      const memenuhiKriteria = checkKesiapanSDMByString(row.jenis_sdmk_per_alat, ownedSDMObj);

      const currentKeterangan = editedData[row.id]?.keterangan_usulan;

      // Handle case where criteria was added but reason was "Tidak Siap SDM"
      let finalAlasan;
      if (isSdmkStrategyEnabled) {
          finalAlasan = currentKeterangan === "Lainnya" ? editedData[row.id]?.catatanAlasan : currentKeterangan;
          if (memenuhiKriteria && currentKeterangan === "Tidak Siap SDM") {
              finalAlasan = null;
          }
      } else {
          finalAlasan =
            // If now meets criteria but had "Tidak Siap SDM" reason
            memenuhiKriteria && currentKeterangan === "Tidak Siap SDM"
              ? null
              : // If doesn't meet criteria
                !memenuhiKriteria && row.jenis_sdmk_per_alat && row.jenis_sdmk_per_alat.trim() !== ""
                ? "Tidak Siap SDM"
                : // If meets criteria and has other reason
                  currentKeterangan === "Lainnya"
                  ? editedData[row.id]?.catatanAlasan
                  : currentKeterangan;
      }

      return {
        id: row.id,
        berfungsi: editedData[row.id]?.berfungsi ?? row.berfungsi ?? 0,
        usulan: editedData[row.id]?.usulan ?? row.usulan ?? 0,
        alasan_tidak_mengusulkan: finalAlasan,
        strategi_pemenuhan: isSdmkStrategyEnabled ? (editedData[row.id]?.strategi_pemenuhan || null) : null,
      };
    });
  };

  const buildBackUrl = () => {
    if (!isDeskerUser) return "/usulan-alkes";
    const params = new URLSearchParams();
    if (formData.id_provinsi) params.set("prov", formData.id_provinsi);
    if (formData.id_kabupaten) params.set("kab", formData.id_kabupaten);
    const qs = params.toString();
    return qs ? `/usulan-alkes?${qs}` : "/usulan-alkes";
  };

  const editUsulan = async () => {
    const resultUsulan = getResultData();
    const updatedFormData = {
      ...formData,
      usulan: resultUsulan,
      ...(isDeskerUser && { keterangan: catatanVerifikasi }),
      ...(isDeskerUser && statusVerifikasi && { status_verifikasi: Number(statusVerifikasi) || 1 }),
    };

    setLoading(true);
    Swal.fire({
      title: "Menyimpan usulan...",
      text: "Tunggu Sebentar Menyimpan Usulan...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await updateUsulan(decryptedId, updatedFormData);
      Swal.fire("Data Berhasil di Simpan!", "", "success");

      // Invalidate SWR caches for usulan list and detail
      mutate("usulan-list");
      mutate((key) => Array.isArray(key) && key[0] === "usulan-detail" && key[1] == decryptedId, undefined, { revalidate: true });
      
      navigate(buildBackUrl());
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error || null;
      Swal.fire("Gagal Menyimpan", serverMsg || "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Contoh penggunaan getResultData (misalnya, saat tombol "Simpan" ditekan)
  const handleSimpan = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    let hasErrorAlasan = false;
    let hasErrorStrategi = false;

    filteredData.forEach((row) => {
      const standard =
        selectedPelayanan?.value === "Non Rawat Inap"
          ? row.standard_non_inap
          : row.standard_rawat_inap;

      // Handle case where standard might be undefined/null
      if (standard === null || standard === undefined) {
        return; // Skip validation if no standard defined
      }

      const masihBerfungsi =
        editedData[row.id]?.berfungsi ?? row.berfungsi ?? 0;
      const usulan = editedData[row.id]?.usulan ?? row.usulan ?? 0;
      const keterangan = editedData[row.id]?.keterangan_usulan;
      const catatan = editedData[row.id]?.catatanAlasan;

      // Check if equipment meets SDM criteria
      const memenuhiKriteria = checkKesiapanSDMByString(row.jenis_sdmk_per_alat, ownedSDMObj);

      const isSdmkStrategyEnabled = import.meta.env.VITE_ENABLE_SDMK_STRATEGY === 'true';

      // Special case: Skip validation if SDM doesn't meet criteria
      if (!isSdmkStrategyEnabled && !memenuhiKriteria && row.jenis_sdmk_per_alat && row.jenis_sdmk_per_alat.trim() !== "") {
        return;
      }

      const kekurangan = standard - masihBerfungsi;

      if (isSdmkStrategyEnabled && !memenuhiKriteria && row.jenis_sdmk_per_alat && row.jenis_sdmk_per_alat.trim() !== "" && usulan > 0) {
        const strategi = editedData[row.id]?.strategi_pemenuhan;
        if (!strategi) {
          validationErrors[row.id] = "Harap pilih strategi pemenuhan SDMK";
          hasErrorStrategi = true;
        }
      }

      // Only validate if usulan is less than required
      if (usulan < kekurangan && kekurangan > 0) {
        // Case 1: No reason provided
        if (!keterangan) {
          validationErrors[row.id] = "Harap pilih alasan tidak usul";
          hasErrorAlasan = true;
        }
        // Case 2: 'Lainnya' selected but no note
        else if (keterangan === "Lainnya" && !catatan?.trim()) {
          validationErrors[row.id] = "Harap isi alasan tidak usul lainnya";
          hasErrorAlasan = true;
        }
      }
    });

    if (hasErrorAlasan || hasErrorStrategi) {
      setErrors(validationErrors);
      let errorMsg = "Harap periksa kembali usulan Anda.";
      if (hasErrorAlasan && hasErrorStrategi) {
        errorMsg = "Harap lengkapi alasan untuk usulan yang kurang dari standar dan strategi pemenuhan SDMK.";
      } else if (hasErrorAlasan) {
        errorMsg = "Harap lengkapi alasan untuk usulan yang kurang dari standar.";
      } else if (hasErrorStrategi) {
        errorMsg = "Harap pilih strategi pemenuhan SDMK untuk usulan yang tidak memenuhi kriteria SDM.";
      }
      // Scroll ke tabel usulan agar user bisa lihat error di row
      const firstErrorId = Object.keys(validationErrors)[0];
      if (firstErrorId) {
        setTimeout(() => {
          const tableEl = document.querySelector(".overflow-x-auto");
          if (tableEl) tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: errorMsg,
      });
      return;
    }
    Swal.fire({
      title: "Perhatian",
      text: "Data yang diisi adalah sebenarnya dan dapat dipertanggungjawabkan?",
      showCancelButton: true,
      confirmButtonColor: "#28B3A9",
      confirmButtonText: "Ya, Simpan Data",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        editUsulan();
      }
    });
  };

  const handleShowKeterangan = (keterangan, nama_alkes) => {
    // Detect plain URL (bare link) or bracketed [url] format
    const isPlainUrl = /^https?:\/\//i.test(keterangan.trim());
    const bracketMatch = keterangan.match(/\[(https?:\/\/[^\]]*)\]/);

    let imageUrl = null;
    let detailString = keterangan;

    if (isPlainUrl) {
      // Entire value is just a URL — treat it as the link directly
      imageUrl = keterangan.trim();
      detailString = "";
    } else if (bracketMatch) {
      imageUrl = bracketMatch[1];
      detailString = keterangan.replace(`[${imageUrl}]`, "");
    }

    const detailList = detailString
      .split("|")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const isDriveLink =
      imageUrl && imageUrl.includes("drive.google.com");

    // Build a preview embed URL for Google Drive
    const getEmbedUrl = (url) => {
      const match = url.match(/\/d\/([^/]+)\//);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
      return null;
    };

    const embedUrl = isDriveLink && imageUrl ? getEmbedUrl(imageUrl) : null;

    let htmlContent = "";

    if (imageUrl) {
      if (embedUrl) {
        htmlContent += `
          <div style="margin-bottom:12px;">
            <iframe
              src="${embedUrl}"
              width="100%"
              height="320"
              style="border:none; border-radius:8px;"
              allow="autoplay"
            ></iframe>
          </div>
          <div style="text-align:center; margin-bottom:8px;">
            <a
              href="${imageUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="display:inline-block; background-color:#0FAD91; color:white; padding:9px 20px; border-radius:6px; font-size:14px; text-decoration:none; font-weight:600;"
            >
              🔗 Buka di Google Drive
            </a>
          </div>
        `;
      } else {
        htmlContent += `
          <div style="margin-bottom:12px; text-align:center;">
            <a
              href="${imageUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="display:inline-block; background-color:#0FAD91; color:white; padding:9px 20px; border-radius:6px; font-size:14px; text-decoration:none; font-weight:600;"
            >
              🔗 Lihat Gambar Alkes
            </a>
          </div>
        `;
      }
    }

    if (detailList.length > 0) {
      const daftarBarang = detailList
        .map((item, index) => `<li style="margin-bottom:4px;">${index + 1}. ${item}</li>`)
        .join("");
      htmlContent += `
        <div style="text-align:left; max-height:200px; overflow-y:auto; margin-top:8px; background:#f8fafc; border-radius:6px; padding:10px;">
          <strong style="font-size:13px; color:#475569;">Detail Alkes:</strong>
          <ul style="margin-top:6px; padding-left:4px; list-style:none; font-size:13px; color:#334155;">
            ${daftarBarang}
          </ul>
        </div>
      `;
    } else if (!imageUrl) {
      htmlContent += `<div style="text-align:left; max-height:300px; overflow-y:auto; font-size:13px;">${keterangan}</div>`;
    }

    Swal.fire({
      title: `<span style="font-size:16px; font-weight:700;">${nama_alkes || "Detail Alkes"}</span>`,
      html: htmlContent,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#0FAD91",
      width: "600px",
    });
  };

  const columns = useMemo(
    () => [
      {
        name: <div className="text-wrap">Nama Alkes</div>,
        selector: (row) => row.nama_alkes,
        cell: (row) => (
          <div className="text-wrap py-2 flex items-center flex-col flex-wrap md:flex-row gap-1">
            {row.nama_alkes}
            {row.keterangan_alkes && ( // Tampilkan ikon jika keterangan ada
              <FaInfoCircle
                title="Lihat Info Detail Barang"
                className="cursor-pointer text-primary hover:text-graydark w-5 h-5 md:w-4 md:h-4"
                onClick={() =>
                  handleShowKeterangan(row.keterangan_alkes, row.nama_alkes)
                } // Tampilkan popup saat ikon diklik
              />
            )}
          </div>
        ),
        minWidth: "110px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Kriteria SDM</div>,
        selector: (row) => row.jenis_sdmk_per_alat,
        cell: (row) => (
          <div className="text-wrap py-2">
            {row.jenis_sdmk_per_alat ? row.jenis_sdmk_per_alat : "Tidak Spesifik"}
          </div>
        ),
        width: "120px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Standard</div>,
        selector: (row) =>
          selectedPelayanan?.value === "Non Rawat Inap"
            ? row.standard_non_inap
            : row.standard_rawat_inap,
        cell: (row) => (
          <div className="text-wrap py-2">
            {selectedPelayanan?.value === "Non Rawat Inap"
              ? row.standard_non_inap
              : row.standard_rawat_inap}
          </div>
        ),
        width: "120px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Masih Berfungsi</div>,
        cell: (row) => {
          const standard =
            selectedPelayanan?.value === "Non Rawat Inap"
              ? row.standard_non_inap
              : row.standard_rawat_inap;

          // Ambil nilai masih_berfungsi dari editedData atau row, default ke 0
          const masihBerfungsi =
            editedData[row.id]?.berfungsi !== undefined
              ? editedData[row.id].berfungsi
              : row.berfungsi || 0;

          return (
            <input
              type="number"
              value={masihBerfungsi} // Gunakan nilai dari state atau row
              onChange={(e) =>
                handleInputChange(row.id, "berfungsi", e.target.value)
              }
              className="border border-primary rounded p-2 !text-sm py-4 w-full focus:border-graydark focus:outline-none focus:ring-0"
              disabled={
                user?.role == "5" ||
                isDisabled ||
                selectedPeriode?.stat == 0 ||
                !isAllowedKab
              }
              min={0} // Pastikan tidak bisa minus
            />
          );
        },
        minWidth: "100px",
        maxWidth: "200px",
      },
      {
        name: <div className="text-wrap">Usulan</div>,
        cell: (row) => {
          const memenuhiSalahSatuKriteria = checkKesiapanSDMByString(row.jenis_sdmk_per_alat, ownedSDMObj);

          const isSdmkStrategyEnabled = import.meta.env.VITE_ENABLE_SDMK_STRATEGY === 'true';

          if (!isSdmkStrategyEnabled && !memenuhiSalahSatuKriteria && row.jenis_sdmk_per_alat && row.jenis_sdmk_per_alat.trim() !== "") {
            // Jika tidak memenuhi kriteria, set otomatis alasan
            if (
              !editedData[row.id]?.keterangan_usulan ||
              editedData[row.id]?.keterangan_usulan === "Tidak Siap SDM"
            ) {
              setEditedData((prev) => ({
                ...prev,
                [row.id]: {
                  ...prev[row.id],
                  keterangan_usulan: "Tidak Siap SDM",
                  catatanAlasan: undefined,
                },
              }));
            }

            return (
              <div className="text-red-500 text-xs">
                SDM tidak memenuhi kriteria
              </div>
            );
          }
          // If now meets criteria but had "Tidak Siap SDM" reason, clear it
          if (
            memenuhiSalahSatuKriteria &&
            editedData[row.id]?.keterangan_usulan === "Tidak Siap SDM"
          ) {
            setEditedData((prev) => ({
              ...prev,
              [row.id]: {
                ...prev[row.id],
                keterangan_usulan: null,
                catatanAlasan: null,
              },
            }));
          }

          const standard =
            selectedPelayanan?.value === "Non Rawat Inap"
              ? row.standard_non_inap
              : row.standard_rawat_inap;

          // Ambil nilai masih_berfungsi dari editedData atau row, default ke 0
          const masihBerfungsi =
            editedData[row.id]?.berfungsi !== undefined
              ? editedData[row.id].berfungsi
              : row.berfungsi || 0;

          const maxUsulan = Math.max(0, standard - masihBerfungsi); // Hitung maksimal usulan

          // Ambil nilai usulan dari editedData atau row, default ke 0
          const usulan =
            editedData[row.id]?.usulan !== undefined
              ? editedData[row.id].usulan
              : row.usulan || 0;

          return (
            <div className="w-full">
              <input
                type="number"
                value={usulan} // Gunakan nilai dari state atau row
                onChange={(e) =>
                  handleInputChange(row.id, "usulan", e.target.value)
                }
                className="border border-primary rounded p-2 !text-sm py-4 w-full focus:border-graydark focus:outline-none"
                min={0} // Pastikan tidak bisa minus
                max={standard === null ? undefined : maxUsulan} // Batasi usulan jika standard tidak null
                disabled={
                  masihBerfungsi >= standard ||
                  user?.role == "5" ||
                  isDisabled ||
                  selectedPeriode?.stat == 0 ||
                  !isAllowedKab
                } // Nonaktifkan input jika masih_berfungsi >= standard
              />
              {isSdmkStrategyEnabled && !memenuhiSalahSatuKriteria && row.jenis_sdmk_per_alat && row.jenis_sdmk_per_alat.trim() !== "" && usulan > 0 && (
                <div className="text-yellow-600 text-[10px] mt-1 leading-tight text-[10px]">
                  Standar SDMK Belum Terpenuhi. Harap Isi Strategi Pemenuhan!
                </div>
              )}
              {/* {errors[row.id] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors[row.id]}
                </div>
              )} */}
            </div>
          );
        },
        minWidth: "100px",
        maxWidth: "200px",
      },
      {
        name: <div className="text-wrap">Alasan & Strategi Pemenuhan</div>,
        cell: (row) => {
          const memenuhiSalahSatuKriteria = checkKesiapanSDMByString(row.jenis_sdmk_per_alat, ownedSDMObj);

          const isSdmkStrategyEnabled = import.meta.env.VITE_ENABLE_SDMK_STRATEGY === 'true';

          // If doesn't meet criteria, show auto-reason (ONLY IF feature is not enabled)
          if (!isSdmkStrategyEnabled && !memenuhiSalahSatuKriteria && row.jenis_sdmk_per_alat && row.jenis_sdmk_per_alat.trim() !== "") {
            return (
              <div className="w-full">
                <input
                  type="text"
                  value="Tidak Siap SDM"
                  className="border border-primary rounded p-1 text-sm w-full bg-gray-100"
                  readOnly
                  disabled
                />
              </div>
            );
          }

          // If now meets criteria but had "Tidak Siap SDM" reason, show empty
          if (
            memenuhiSalahSatuKriteria &&
            editedData[row.id]?.keterangan_usulan === "Tidak Siap SDM"
          ) {
            return (
              <div className="w-full">
                <input
                  type="text"
                  value=""
                  className="border border-primary rounded p-1 text-sm w-full"
                  readOnly
                  disabled
                />
              </div>
            );
          }
          const standard =
            selectedPelayanan?.value === "Non Rawat Inap"
              ? row.standard_non_inap
              : row.standard_rawat_inap;

          const masihBerfungsi =
            editedData[row.id]?.berfungsi !== undefined ? editedData[row.id].berfungsi : row.berfungsi || 0;
          const usulan = 
            editedData[row.id]?.usulan !== undefined ? editedData[row.id].usulan : row.usulan || 0;
          const required = standard - masihBerfungsi;

          // Perbaikan utama: Tampilkan alasan jika usulan < required ATAU ada flag needAlasan
          const showAlasan =
            standard !== null &&
            standard !== undefined &&
            (usulan < required || editedData[row.id]?.needAlasan);
            
          const showStrategi = isSdmkStrategyEnabled && !memenuhiSalahSatuKriteria && row.jenis_sdmk_per_alat && row.jenis_sdmk_per_alat.trim() !== "" && usulan > 0;

          if (!showAlasan && !showStrategi) {
            const existingAlasan = editedData[row.id]?.keterangan_usulan === "Lainnya"
              ? editedData[row.id]?.catatanAlasan
              : editedData[row.id]?.keterangan_usulan;
            if (existingAlasan) {
              return (
                <div className="text-xs text-slate-500 italic py-1 px-1 bg-slate-50 rounded border border-slate-100 max-w-[220px]">
                  {existingAlasan}
                </div>
              );
            }
            return <div className="text-xs text-gray-400">-</div>;
          }

          return (
            <div className="w-full space-y-2">
              {showAlasan && (
                <div className="w-full">
                  <select
                    value={editedData[row.id]?.keterangan_usulan || ""}
                    onChange={(e) => handleAlasanChange(row.id, e.target.value)}
                    disabled={!isAllowedKab}
                    className="border border-primary focus:border-primary rounded p-1 text-sm w-full focus-within:border-primary active:border-primary mb-2"
                  >
                    <option value="">Pilih Alasan Tidak Mengusulkan</option>
                    {AlasanOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {editedData[row.id]?.keterangan_usulan === "Lainnya" && (
                    <div className="mt-1">
                      <input
                        disabled={!isAllowedKab}
                        type="text"
                        value={editedData[row.id]?.catatanAlasan || ""}
                        onChange={(e) =>
                          handleCatatanAlasanChange(row.id, e.target.value)
                        }
                        placeholder="Ketik alasan lainnya"
                        className="border border-primary rounded p-1 text-sm w-full mt-1 mb-2"
                        required
                      />
                    </div>
                  )}
                </div>
              )}
              {showStrategi && (
                <div className="w-full">
                  <select
                    value={editedData[row.id]?.strategi_pemenuhan || ""}
                    onChange={(e) => handleStrategiPemenuhanChange(row.id, e.target.value)}
                    disabled={!isAllowedKab}
                    className="border border-blue-500 focus:border-blue-500 rounded p-1 text-sm w-full focus-within:border-blue-500 active:border-blue-500"
                  >
                    <option value="">Pilih Strategi Pemenuhan SDMK</option>
                    {StrategiPemenuhanOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {errors[row.id] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors[row.id]}
                </div>
              )}
            </div>
          );
        },
        width: "250px",
      },
    ],
    [editedData, errors, selectedPelayanan, filteredData, formData.id_kriteria, ownedSDMObj],
  );

  if (usulanLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb title="Edit Usulan Alkes" pageName="Usulan Alkes" />
      <Card>
        <div className="card-header flex justify-between">
          <div className="ml-auto">
            <Link
              to={buildBackUrl()}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full">
          <UsulanForm
            formData={formData}
            selectedPeriode={selectedPeriode}
            dataPeriode={dataPeriode}
            handlePeriodeChange={handlePeriodeChange}
            pelayanan={selectedPelayanan}
            handlePelayananChange={handlePelayananChange}
            daya={selectedDaya}
            handleDayaChange={handleDayaChange}
            listrik={selectedListrik}
            handleListrikChange={handleListrikChange}
            internet={selectedInternet}
            handleInternetChange={handleInternetChange}
            kriteria={selectedKriteria}
            dataKriteria={dataKriteria}
            handleKriteriaChange={handleKriteriaChange}
            persalinan={selectedPersalinan}
            handlePersalinanChange={handlePersalinanChange}
            poned={selectedPoned}
            handlePonedChange={handlePonedChange}
            limbah={selectedLimbah}
            dataLimbah={dataLimbah}
            handleLimbahChange={handleLimbahChange}
            sumberListrik={selectedSumberListrik}
            dataSumberListrik={dataSumberListrik}
            handleSumberListrikChange={handleSumberListrikChange}
            totalDaya={selectedTotalDaya}
            handleTotalDayaChange={handleTotalDayaChange}
            user={user}
            isAllowedKab={isAllowedKab}
            isDisabled={isDisabled}
          />

          <UsulanItemsTable
            data={filteredData}
            columns={columns}
            loading={loading}
          />

          <div className="w-full mt-8 gap-4">
            {/* STATUS VERIFIKASI — hanya untuk desker/admin */}
            {isDeskerUser && (
              <section className="mb-4 bg-yellow-50 border border-yellow-300 p-4 rounded-md">
                <div className="mb-3">
                  <h2 className="font-semibold text-yellow-800">Status Verifikasi</h2>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    Keputusan verifikasi kelayakan usulan puskesmas ini
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">
                      Status
                    </label>
                    <select
                      value={statusVerifikasi}
                      onChange={(e) => setStatusVerifikasi(e.target.value)}
                      className="w-full border border-yellow-300 focus:border-yellow-500 rounded-md py-2 px-3 text-xs bg-white focus:outline-none"
                    >
                      <option value="">— Pilih Status —</option>
                      <option value="1">Belum Verifikasi</option>
                      <option value="2">Sudah Verifikasi</option>
                      <option value="3">Perlu Revisi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">
                      Catatan Verifikasi
                    </label>
                    <textarea
                      value={catatanVerifikasi}
                      onChange={(e) => setCatatanVerifikasi(e.target.value)}
                      rows={3}
                      placeholder="Catatan verifikasi (opsional)"
                      className="w-full border border-yellow-300 focus:border-yellow-500 rounded-md py-2 px-3 text-xs bg-white focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </section>
            )}
            <button
              onClick={handleSimpan}
              disabled={loading || selectedPeriode?.stat == 0}
              title={selectedPeriode?.stat == 0 ? "Periode sudah ditutup, tidak dapat menyimpan usulan" : ""}
              className="w-full px-6 py-2 bg-primary text-white rounded-md font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading
                ? "Menyimpan..."
                : selectedPeriode?.stat == 0
                  ? "Periode Ditutup — Tidak Dapat Menyimpan"
                  : "Simpan Usulan"}
            </button>
            {selectedPeriode?.stat == 0 && (
              <p className="text-xs text-red-500 mt-1 text-center">
                Periode ini sudah ditutup. Hubungi admin untuk membuka kembali.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditUsulan;
