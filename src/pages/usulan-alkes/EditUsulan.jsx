import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.jsx";
import Select from "react-select";
import DataTable from "react-data-table-component";
import {
  AlasanOptions,
  allowedKabupaten,
  dayaOptions,
  pelayananOptions,
  SelectOptions,
} from "../../data/data.js";
import { decryptId, encryptId, selectThemeColors } from "../../data/utils.js";
import {
  FaCheck,
  FaEdit,
  FaEye,
  FaInfoCircle,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";
import Card from "../../components/Card/Card";

const EditUsulan = () => {
  const user = useSelector((a) => a.auth.user);
  const { id } = useParams();
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
    tahun_lokus: "2025",
    pelayanan: "",
    ketersediaan_listrik: "",
    kapasitas_listrik: "",
    internet: "",
    tgl_upload: null,
    id_kriteria: [],
    usulan: [],
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const isDisabled = false;

  const isAllowedKab = useMemo(
    () => allowedKabupaten.includes(formData.kabupaten),
    [formData.kabupaten]
  );

  const [dataUser, setDataUser] = useState([]);
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataPuskesmas, setDataPuskesmas] = useState([]);
  const [dataKriteria, setDataKriteria] = useState([]);
  const [dataPeriode, setDataPeriode] = useState([]);
  const [idPeriode, setIdPeriode] = useState(null);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState(null);
  const [selectedPeriode, setSelectedPeriode] = useState(null);

  const [selectedKriteria, setSelectedKriteria] = useState(null);

  const [selectedDaya, setSelectedDaya] = useState(null);
  const [selectedListrik, setSelectedListrik] = useState(null);
  const [selectedInternet, setSelectedInternet] = useState(null);

  const navigate = useNavigate();

  const fetchKriteria = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kriteria`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataKriteria([
        { value: "all", label: "Pilih Semua" },
        ...response.data.data.map((item) => ({
          label: item.kriteria,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataKriteria([]);
    }
  };

  const fetchPeriodeData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/periode`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataPeriode([
        ...response.data.data.map((item) => ({
          label: item.periode_name,
          value: item.id,
          stat: item.stat,
        })),
      ]);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinsi = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/provinsi`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataProvinsi([
        ...response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataProvinsi([]);
    }
  };
  const fetchKota = async (idProvinsi) => {
    try {
      const response = await axios({
        method: "get",
        url: `${
          import.meta.env.VITE_APP_API_URL
        }/api/getkabupaten/${idProvinsi}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataKota([
        ...response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataKota([]);
    }
  };
  const fetchKecamatan = async (idKota) => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/getkecamatan/${idKota}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataKecamatan([
        ...response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataKecamatan([]);
    }
  };

  const handlePeriodeChange = (selectedOption) => {
    setSelectedPeriode(selectedOption);
    setFormData((prev) => ({
      ...prev,
      periode_id: selectedOption ? selectedOption?.value?.toString() : "",
    }));
    // Panggil fetch data dengan periode ID yang baru
    if (selectedOption?.value) {
      fetchDistribusiData(selectedOption.value);
    } else {
      // Jika periode di-clear, fetch data tanpa periode ID (kembali ke default)
      fetchDistribusiData();
    }
  };
  const isSwalShown = useRef(false);
  // Fetch distribution data
  const fetchDistribusiData = useCallback(
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
      }/api/usulan/detail/${encodeURIComponent(decryptedId)}`;
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
          id_provinsi: data.id_provinsi || "",
          id_kabupaten: data.id_kabupaten || "",
          id_kecamatan: data.id_kecamatan || "",
          provinsi: data.provinsi || "",
          kabupaten: data.kabupaten || "",
          kecamatan: data.kecamatan || "",
          nama_puskesmas: data.nama_puskesmas || "",
          kode_pusdatin_baru: data.kode_pusdatin_baru || "",
          id: data.id || "",
          tahun_lokus: "2025",
          pelayanan: data.pelayanan || "",
          ketersediaan_listrik: data.ketersediaan_listrik || "",
          kapasitas_listrik: data.kapasitas_listrik || "",
          internet: data.internet || "",
          tgl_upload: data.usulan_alkes[0].tgl_upload || null,
          usulan: data.usulan || [],
          id_kriteria: data.id_kriteria || [],
        });
        setData(data?.usulan || []);
        setFilteredData(data?.usulan || []);
        setIdPeriode(data.usulan_alkes[0].periode_id);
        // if (
        //   data?.usulan_alkes[0]?.tgl_upload &&
        //   data?.usulan_alkes[0]?.file_upload &&
        //   !isSwalShown.current
        // ) {
        //   Swal.fire(
        //     "Warning",
        //     "Data tidak bisa diubah karena daerah sudah mengupload dokumen usulan!",
        //     "warning"
        //   );
        //   isSwalShown.current = true;
        // }
      } catch (error) {
        setError(true);
        setFilteredData([]);
      } finally {
        setLoading(false);
        setGetLoading(false);
      }
    },
    [user?.token]
  );

  const handleAlasanChange = (rowId, value) => {
    setEditedData((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        keterangan_usulan: value,
        // Reset catatan jika bukan "Lainnya"
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

  const fetchPuskesmas = async (idKecamatan) => {
    try {
      const response = await axios({
        method: "get",
        url: `${
          import.meta.env.VITE_APP_API_URL
        }/api/getpuskesmas/${idKecamatan}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataPuskesmas([
        ...response.data.data.map((item) => ({
          label: item.nama_puskesmas,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataPuskesmas([]);
    }
  };

  useEffect(() => {
    fetchDistribusiData();
    fetchPeriodeData();
    fetchKriteria();
    // fetchProvinsi();
  }, []);

  const handleProvinsiChange = (selectedOption) => {
    setSelectedProvinsi(selectedOption);
    setSelectedKota(null);
    setSelectedKecamatan(null);
    setSelectedPuskesmas(null);
    setDataKota([]);
    setDataKecamatan([]);
    setDataPuskesmas([]);
    setFormData((prev) => ({
      ...prev,
      id_provinsi: selectedOption ? selectedOption.value : "",
    }));
    if (selectedOption) {
      fetchKota(selectedOption.value);
    }
  };

  const handleKotaChange = (selectedOption) => {
    setSelectedKota(selectedOption);
    setSelectedKecamatan(null);
    setSelectedPuskesmas(null);
    setDataKecamatan([]);
    setDataPuskesmas([]);

    setFormData((prev) => ({
      ...prev,
      id_kabupaten: selectedOption ? selectedOption.value : "",
    }));
    if (selectedOption) {
      fetchKecamatan(selectedOption.value);
    }
  };

  const handleKecamatanChange = (selectedOption) => {
    setSelectedPuskesmas(null);
    setDataPuskesmas([]);
    setSelectedKecamatan(selectedOption);
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        id_kecamatan: selectedOption.value.toString(),
      }));
      fetchPuskesmas(selectedOption.value);
    }
  };

  const handlePuskesmasChange = (selectedOption) => {
    setSelectedPuskesmas(selectedOption);
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        id: selectedOption.value.toString(),
      }));
    }
  };

  const handlePelayananChange = (selectedOption) => {
    setSelectedPelayanan(selectedOption);
    setFormData((prev) => ({
      ...prev,
      pelayanan: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const handleDayaChange = (selectedOption) => {
    setSelectedDaya(selectedOption);
    setFormData((prev) => ({
      ...prev,
      kapasitas_listrik: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const handleListrikChange = (selectedOption) => {
    setSelectedListrik(selectedOption);
    setFormData((prev) => ({
      ...prev,
      ketersediaan_listrik: selectedOption
        ? selectedOption.value.toString()
        : "",
    }));
  };

  const handleInternetChange = (selectedOption) => {
    setSelectedInternet(selectedOption);
    setFormData((prev) => ({
      ...prev,
      internet: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  // 1. Inisialisasi awal saat pertama kali mount
  useEffect(() => {
    // Inisialisasi pelayanan
    if (formData.pelayanan) {
      const initialOption = pelayananOptions.find(
        (kec) => kec.value == formData.pelayanan
      );
      if (initialOption) {
        setSelectedPelayanan({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    // Inisialisasi listrik
    if (formData.ketersediaan_listrik) {
      const initialOption = SelectOptions.find(
        (kec) => kec.value == formData.ketersediaan_listrik
      );
      if (initialOption) {
        setSelectedListrik({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    // Inisialisasi daya
    if (formData.kapasitas_listrik) {
      const initialOption = dayaOptions.find(
        (kec) => kec.value == formData.kapasitas_listrik
      );
      if (initialOption) {
        setSelectedDaya({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

    // Inisialisasi internet
    if (formData.internet) {
      const initialOption = SelectOptions.find(
        (kec) => kec.value == formData.internet
      );
      if (initialOption) {
        setSelectedInternet({
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
  ]);

  // 2. Inisialisasi kriteria (terpisah karena tergantung dataKriteria)
  useEffect(() => {
    if (formData.id_kriteria && dataKriteria.length > 0) {
      const initialSelectedKriteria = formData.id_kriteria
        .map((kriteriaId) => {
          const foundKriteria = dataKriteria.find(
            (kriteria) => kriteria.value == kriteriaId
          );
          return foundKriteria
            ? { value: foundKriteria.value, label: foundKriteria.label }
            : null;
        })
        .filter(Boolean);
      setSelectedKriteria(initialSelectedKriteria);
    }
  }, [formData.id_kriteria, dataKriteria]);

  // 3. Inisialisasi periode (terpisah karena tergantung idPeriode)
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

  // 4. Inisialisasi usulan (terpisah karena kompleks)
  useEffect(() => {
    if (formData?.usulan && AlasanOptions) {
      const initialEditedData = {};
      formData.usulan.forEach((item) => {
        const isStandardAlasan = AlasanOptions.some(
          (opt) => opt.value === item.keterangan_usulan
        );

        initialEditedData[item.id] = {
          berfungsi: item.berfungsi ?? 0,
          usulan: item.usulan ?? 0,
          keterangan_usulan: isStandardAlasan
            ? item.keterangan_usulan
            : item.keterangan_usulan === null ||
              item.keterangan_usulan === false ||
              item.keterangan_usulan === ""
            ? ""
            : "Lainnya",
          catatanAlasan: isStandardAlasan
            ? undefined
            : item.keterangan_usulan === null ||
              item.keterangan_usulan === false ||
              item.keterangan_usulan === ""
            ? undefined
            : item.keterangan_usulan,
        };
      });

      // Gabungkan dengan data yang sudah diubah sebelumnya
      setEditedData((prev) => ({
        ...prev,
        ...initialEditedData,
      }));
    }
  }, [formData.usulan, AlasanOptions]);
  // useEffect(() => {
  //   if (formData.id_provinsi) {
  //     fetchKota(formData.id_provinsi);
  //   }
  //   if (formData.id_kabupaten) {
  //     fetchKecamatan(formData.id_kabupaten);
  //   }
  //   if (formData.id_kecamatan) {
  //     fetchPuskesmas(formData.id_kecamatan);
  //   }
  // }, [formData.id_provinsi, formData.id_kabupaten, formData.id_kecamatan]);

  const [editedData, setEditedData] = useState({});
  const [errors, setErrors] = useState({}); // State untuk menyimpan pesan error

  const handleKriteriaChange = (selectedOptions) => {
    setSelectedKriteria(selectedOptions);

    if (!selectedOptions) {
      setFormData((prev) => ({ ...prev, id_kriteria: [] }));
      return;
    }

    const allOption = dataKriteria.find((option) => option.value === "all");

    if (selectedOptions.some((option) => option.value === "all")) {
      // Jika "Pilih Semua" dipilih, pilih semua opsi lainnya
      const allKriteriaValues = dataKriteria
        .filter((option) => option.value !== "all")
        .map((option) => option.value);

      setSelectedKriteria(
        dataKriteria.filter((option) => option.value !== "all")
      );
      setFormData((prev) => ({ ...prev, id_kriteria: allKriteriaValues }));
    } else {
      // Jika "Pilih Semua" tidak dipilih, ambil nilai dari opsi yang dipilih
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
    const memenuhiKriteria = row.kriteria_alkes?.some((alkesKriteria) =>
      formData.id_kriteria?.includes(alkesKriteria.id)
    );

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
      row.kriteria_alkes?.length > 0
    ) {
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
    return filteredData.map((row) => {
      const memenuhiKriteria = row.kriteria_alkes?.some((alkesKriteria) =>
        formData.id_kriteria?.includes(alkesKriteria.id)
      );

      const currentKeterangan = editedData[row.id]?.keterangan_usulan;

      // Handle case where criteria was added but reason was "Tidak Siap SDM"
      const finalAlasan =
        // If now meets criteria but had "Tidak Siap SDM" reason
        memenuhiKriteria && currentKeterangan === "Tidak Siap SDM"
          ? null
          : // If doesn't meet criteria
          !memenuhiKriteria && row.kriteria_alkes?.length > 0
          ? "Tidak Siap SDM"
          : // If meets criteria and has other reason
          currentKeterangan === "Lainnya"
          ? editedData[row.id]?.catatanAlasan
          : currentKeterangan;

      return {
        id: row.id,
        berfungsi: editedData[row.id]?.berfungsi ?? row.berfungsi ?? 0,
        usulan: editedData[row.id]?.usulan ?? row.usulan ?? 0,
        alasan: finalAlasan,
      };
    });
  };

  const editUsulan = async () => {
    const resultUsulan = getResultData();
    const updatedFormData = {
      ...formData,
      usulan: resultUsulan, // Pastikan usulan di formData sudah diupdate
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
      const response = await axios({
        method: "put",
        url: `${
          import.meta.env.VITE_APP_API_URL
        }/api/usulan/update/${encodeURIComponent(decryptId(id))}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: JSON.stringify(updatedFormData), // Pastikan formData sudah diupdate
      });

      Swal.fire("Data Berhasil di Simpan!", "", "success");
      navigate("/usulan-alkes");
    } catch (error) {
      Swal.fire("Error", "Gagal Menyimpan Data", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Contoh penggunaan getResultData (misalnya, saat tombol "Simpan" ditekan)
  const handleSimpan = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    let hasError = false;

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
      const memenuhiKriteria = row.kriteria_alkes?.some((alkesKriteria) =>
        formData.id_kriteria?.includes(alkesKriteria.id)
      );

      // Special case: Skip validation if SDM doesn't meet criteria
      if (!memenuhiKriteria && row.kriteria_alkes?.length > 0) {
        return;
      }

      const kekurangan = standard - masihBerfungsi;

      // Only validate if usulan is less than required
      if (usulan < kekurangan && kekurangan > 0) {
        // Case 1: No reason provided
        if (!keterangan) {
          validationErrors[row.id] = "Harap pilih alasan tidak usul";
          hasError = true;
        }
        // Case 2: 'Lainnya' selected but no note
        else if (keterangan === "Lainnya" && !catatan?.trim()) {
          validationErrors[row.id] = "Harap isi alasan tidak usul lainnya";
          hasError = true;
        }
      }
    });

    if (hasError) {
      setErrors(validationErrors);
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Harap lengkapi alasan untuk usulan yang kurang dari standar",
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
    const linkMatch = keterangan.match(
      /\[(https:\/\/drive\.google\.com[^\]]*)\]/
    );
    const imageUrl = linkMatch ? linkMatch[1] : null;
    const detailString = keterangan.replace(
      linkMatch ? `[${imageUrl}]` : "",
      ""
    );
    const detailList = detailString
      .split("|")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    let htmlContent = "";

    if (imageUrl) {
      htmlContent += `
        <div style="margin-bottom: 10px; text-align: center;">
          <button
            style="background-color: #0FAD91; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;"
            onclick="window.open('${imageUrl}', '_blank', 'noopener,noreferrer')"
          >
            Lihat Gambar Alkes
          </button>
        </div>
      `;
    }

    if (detailList.length > 0) {
      const daftarBarang = detailList
        .map((item, index) => `${index + 1}. ${item}`)
        .join("<br>");
      htmlContent += `
        <div style="text-align: left; max-height: 300px; overflow-y: auto; margin-top: 10px;">
          <strong>Detail Alkes:</strong><br>
          ${daftarBarang}
        </div>
      `;
    } else if (!imageUrl) {
      // Jika tidak ada gambar dan tidak ada detail yang dipisahkan, tampilkan seluruh keterangan awal
      htmlContent += `<div style="text-align: left; max-height: 300px; overflow-y: auto;">${keterangan}</div>`;
    }

    Swal.fire({
      title: `Detail ${nama_alkes || ""}`,
      html: htmlContent,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
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
        selector: (row) => row.kriteria_alkes,
        cell: (row) => (
          <div className="text-wrap py-2">
            {row.kriteria_alkes?.length > 0
              ? row.kriteria_alkes?.map((item) => item.kriteria).join("/ ")
              : "Tidak Spesifik"}
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
          const memenuhiSalahSatuKriteria = row.kriteria_alkes?.some(
            (alkesKriteria) => formData.id_kriteria?.includes(alkesKriteria.id)
          );

          if (!memenuhiSalahSatuKriteria && row?.kriteria_alkes?.length > 0) {
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
              {errors[row.id] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors[row.id]}
                </div>
              )}
            </div>
          );
        },
        minWidth: "100px",
        maxWidth: "200px",
      },
      {
        name: <div className="text-wrap">Alasan Tidak Mengusulkan</div>,
        cell: (row) => {
          const memenuhiSalahSatuKriteria = row.kriteria_alkes?.some(
            (alkesKriteria) => formData.id_kriteria?.includes(alkesKriteria.id)
          );

          // If doesn't meet criteria, show auto-reason
          if (!memenuhiSalahSatuKriteria && row?.kriteria_alkes?.length > 0) {
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
            editedData[row.id]?.berfungsi || row.berfungsi || 0;
          const usulan = editedData[row.id]?.usulan || row.usulan || 0;
          const required = standard - masihBerfungsi;

          // Perbaikan utama: Tampilkan alasan jika usulan < required ATAU ada flag needAlasan
          const showAlasan =
            standard !== null &&
            standard !== undefined &&
            (usulan < required || editedData[row.id]?.needAlasan);

          if (!showAlasan)
            return <div className="text-xs text-gray-400">-</div>;

          return (
            <div className="w-full">
              <select
                value={editedData[row.id]?.keterangan_usulan || ""}
                onChange={(e) => handleAlasanChange(row.id, e.target.value)}
                disabled={!isAllowedKab}
                className="border border-primary focus:border-primary rounded p-1 text-sm w-full focus-within:border-primary active:border-primary"
              >
                <option value="">Pilih Alasan</option>
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
                    placeholder="Ketik keterangan_usulan lainnya"
                    className="border border-primary rounded p-1 text-sm w-full mt-1"
                    required
                  />
                </div>
              )}
            </div>
          );
        },
        width: "250px",
      },
    ],
    [editedData, errors, selectedPelayanan, filteredData]
  );

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
      <Breadcrumb title="Edit Usulan Alkes" pageName="Usulan Alkes" />
      <Card>
        <div className="card-header flex justify-between">
          {/* <h1 className="mb-5 mt-1 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            Edit Usulan Alkes
          </h1> */}
          <div className="ml-auto">
            <Link
              to="/usulan-alkes"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full ">
          <form className="mt-4 mb-8">
            <div className="gap-3 gap-y-4 grid grid-cols-2 md:grid-cols-3 mb-4">
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Provinsi :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="nama_provinsi"
                    value={formData.provinsi}
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     provinsi: e.target.value,
                    //   }))
                    // }
                    disabled
                    type="text"
                    required
                    placeholder="Provinsi"
                  />
                  {/* <Select
                    options={dataProvinsi}
                    value={selectedProvinsi}
                    onChange={handleProvinsiChange}
                    isDisabled={true}
                    placeholder="Pilih Provinsi"
                    className="w-full text-sm"
                    theme={selectThemeColors}
                  /> */}
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Kabupaten / Kota :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="nama_kabupaten"
                    value={formData.kabupaten}
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     kabupaten: e.target.value,
                    //   }))
                    // }
                    disabled
                    type="text"
                    required
                    placeholder="Kabupaten"
                  />
                  {/* <Select
                    options={dataKota}
                    value={selectedKota}
                    onChange={handleKotaChange}
                    isDisabled={!selectedProvinsi || true}
                    placeholder={
                      selectedProvinsi
                        ? "Pilih Kab / Kota"
                        : "Pilih Provinsi Dahulu"
                    }
                    className="w-full text-sm"
                    theme={selectThemeColors}
                  /> */}
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Kecamatan :
                  </label>
                </div>
                <div className="">
                  {/* <Select
                    options={dataKecamatan}
                    value={selectedKecamatan}
                    isDisabled={!selectedKota || true}
                    onChange={handleKecamatanChange}
                    placeholder={
                      selectedKota
                        ? "Pilih Kecamatan"
                        : "Pilih Kab / Kota Dahulu"
                    }
                    className="w-full text-sm"
                    theme={selectThemeColors}
                  /> */}
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="nama_kecamatan"
                    value={formData.kecamatan}
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     kecamatan: e.target.value,
                    //   }))
                    // }
                    disabled
                    type="text"
                    required
                    placeholder="Kecamatan"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="kode_puskesmas"
                  >
                    Kode Puskesmas :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="kode_puskesmas"
                    value={formData.kode_pusdatin_baru}
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     kode_pusdatin_baru: e.target.value,
                    //   }))
                    // }
                    disabled
                    type="text"
                    required
                    placeholder="Kode Puskesmas"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Puskesmas :
                  </label>
                </div>
                <div className="">
                  {/* <Select
                    options={dataPuskesmas}
                    value={selectedPuskesmas}
                    onChange={handlePuskesmasChange}
                    isDisabled={!selectedKecamatan || user.role != "1" || true}
                    placeholder={
                      selectedKota
                        ? "Pilih Puskesmas"
                        : "Pilih Kecamatan Dahulu"
                    }
                    className="w-full text-sm"
                    theme={selectThemeColors}
                  /> */}
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="nama_puskesmas"
                    value={formData.nama_puskesmas}
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     nama_puskesmas: e.target.value,
                    //   }))
                    // }
                    disabled
                    type="text"
                    required
                    placeholder="Puskesmas"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="tahun_lokus"
                  >
                    Tahun:
                  </label>
                </div>
                <div className="">
                  <input
                    className={`disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="tahun_lokus"
                    value={formData.tahun_lokus}
                    // onChange={handleChange}
                    disabled
                    maxLength={4}
                    type="text"
                    required
                    placeholder="Tahun"
                  />
                </div>
              </div>
            </div>
            <div className="gap-3 gap-y-4 grid grid-cols-2 lg:grid-cols-4 mt-10 lg:mt-12">
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Jenis Pelayanan :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={pelayananOptions}
                    value={selectedPelayanan}
                    onChange={handlePelayananChange}
                    placeholder="Jenis Pelayanan"
                    className="w-full text-sm"
                    theme={selectThemeColors}
                    isDisabled
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Ketersediaan Daya Listrik (PLN) :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={dayaOptions}
                    value={selectedDaya}
                    onChange={handleDayaChange}
                    placeholder="Ketersediaan Daya"
                    className="w-full text-sm"
                    isDisabled={
                      user?.role == "5" || isDisabled || !isAllowedKab
                    }
                    theme={selectThemeColors}
                  />
                </div>
              </div>
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Ketersediaan Listrik (24 Jam) :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={SelectOptions}
                    value={selectedListrik}
                    onChange={handleListrikChange}
                    placeholder="Ketersediaan Listrik"
                    className="w-full text-sm"
                    isDisabled={
                      user?.role == "5" || isDisabled || !isAllowedKab
                    }
                    theme={selectThemeColors}
                  />
                </div>
              </div>
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Ketersediaan Internet :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={SelectOptions}
                    value={selectedInternet}
                    onChange={handleInternetChange}
                    placeholder="Ketersediaan Internet"
                    className="w-full text-sm"
                    isDisabled={
                      user?.role == "5" || isDisabled || !isAllowedKab
                    }
                    theme={selectThemeColors}
                  />
                </div>
              </div>
            </div>
            <div className="gap-3 gap-y-4 grid grid-cols-2 lg:grid-cols-2 mt-4 lg:mt-4">
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    SDM Tersedia :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={dataKriteria}
                    value={selectedKriteria}
                    onChange={handleKriteriaChange}
                    placeholder="SDM Tersedia"
                    isMulti
                    className="w-full text-sm"
                    isDisabled={
                      user?.role == "5" || isDisabled || !isAllowedKab
                    }
                    theme={selectThemeColors}
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="rounded-md flex flex-col gap-4 overflow-hidden overflow-x-auto  border border-stroke bg-white py-4 md:py-8 px-4 md:px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-bodydark1 mt-2">
                Form Usulan Alkes
              </h2>
              <h2 className="font-medium text-bodydark1 text-sm mt-2">
                {dataPeriode?.length > 0 && (
                  <div className="flex-col gap-2 flex">
                    <div className="">
                      <label
                        className="block text-[#728294] text-sm font-semibold mb-1"
                        htmlFor="nama_alkes"
                      >
                        Periode :
                      </label>
                    </div>
                    <div className="">
                      <Select
                        options={dataPeriode}
                        value={selectedPeriode}
                        onChange={handlePeriodeChange}
                        placeholder="Periode   "
                        className="w-full text-sm"
                        isDisabled={user?.role != "1" || isDisabled}
                        theme={selectThemeColors}
                      />
                    </div>
                  </div>
                )}
              </h2>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center">
                  <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
                  <span className="ml-2">Loading...</span>
                </div>
              ) : error || filteredData.length == 0 ? (
                <div className="text-center">Data Tidak Tersedia.</div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  paginationPerPage={100} // Default 100 item per halaman
                  paginationRowsPerPageOptions={[10, 20, 50, 100]} // Opsi yang tersedia
                  // defaultSortFieldId="Aksi"
                  striped
                  defaultSortAsc={false}
                  persistTableHead
                  highlightOnHover
                  pointerOnHover
                  customStyles={{
                    headCells: {
                      style: {
                        padding: 12,
                        backgroundColor: "#0FAD91", // Warna header biru
                        color: "#fff", // Teks header putih
                        fontWeight: 700,
                        fontSize: 14,
                      },
                    },
                    rows: {
                      style: {
                        fontSize: 14,
                        paddingTop: 10,
                        paddingBottom: 10,
                        backgroundColor: "#FFFFFF", // Default warna baris ganjil (putih)
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#F9FAFB", // Warna baris genap (abu terang)
                        },
                        highlightOnHoverStyle: {
                          backgroundColor: "#D1E8FF", // Warna saat hover (biru terang)
                          color: "#212121", // Warna teks tetap gelap
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
          {isAllowedKab && (
            <button
              onClick={handleSimpan}
              className="mt-4 bg-primary hover:bg-graydark text-white font-bold py-3 px-4 rounded w-full"
            >
              Simpan
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EditUsulan;
