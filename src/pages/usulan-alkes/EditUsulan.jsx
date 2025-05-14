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
  console.log(formData);

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
        .filter(Boolean); // Filter out null jika ID tidak ditemukan di dataKriteria
      console.log(initialSelectedKriteria);
      setSelectedKriteria(initialSelectedKriteria);
    }

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
    if (formData?.usulan) {
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
        console.log(
          `initialEditedData untuk ID ${item.id}:`,
          initialEditedData[item.id]
        );
      });
      setEditedData(initialEditedData);
    }
  }, [formData, AlasanOptions]);
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
    const newValue = parseInt(value, 10); // Konversi ke number, termasuk 0
    const finalValue = isNaN(newValue) ? 0 : newValue;

    // Ambil standard berdasarkan selectedPelayanan
    const standard =
      selectedPelayanan?.value === "Non Rawat Inap"
        ? filteredData.find((row) => row.id === rowId)?.standard_non_inap
        : filteredData.find((row) => row.id === rowId)?.standard_rawat_inap;

    // Ambil nilai masih_berfungsi
    const masihBerfungsi =
      editedData[rowId]?.berfungsi !== undefined
        ? editedData[rowId].berfungsi
        : filteredData.find((row) => row.id === rowId)?.berfungsi || 0;

    // Jika standard null, bebas mengisi usulan dan masih_berfungsi
    if (standard === null) {
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

    // Validasi untuk usulan
    if (columnName === "usulan") {
      const maxUsulan = Math.max(0, standard - masihBerfungsi);

      // Validasi nilai usulan
      if (finalValue > maxUsulan) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [rowId]: `Usulan tidak boleh melebihi ${maxUsulan}`,
        }));
        return;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [rowId]: "",
        }));
      }

      // Logika keterangan_usulan ketika usulan kurang dari standar
      const requiredUsulan = standard - masihBerfungsi;

      // Jika usulan kurang dari standar dan belum ada keterangan_usulan
      if (
        finalValue < requiredUsulan &&
        !editedData[rowId]?.keterangan_usulan
      ) {
        // Set state untuk men-trigger tampilan input keterangan_usulan
        setEditedData((prev) => ({
          ...prev,
          [rowId]: {
            ...prev[rowId],
            [columnName]: finalValue,
            needAlasan: true, // Flag untuk menunjukkan perlu keterangan_usulan
          },
        }));
        return;
      }

      // Jika usulan memenuhi standar dan ada keterangan_usulan, hapus keterangan_usulan
      if (
        finalValue >= requiredUsulan &&
        editedData[rowId]?.keterangan_usulan
      ) {
        setEditedData((prev) => ({
          ...prev,
          [rowId]: {
            ...prev[rowId],
            [columnName]: finalValue,
            keterangan_usulan: undefined,
            catatanAlasan: undefined,
            needAlasan: false,
          },
        }));
        return;
      }
    }

    // Jika masih_berfungsi diubah dan memenuhi standar
    if (columnName === "berfungsi" && finalValue >= standard) {
      setEditedData((prevData) => ({
        ...prevData,
        [rowId]: {
          ...prevData[rowId],
          berfungsi: finalValue,
          usulan: 0,
          ...(editedData[rowId]?.keterangan_usulan && {
            keterangan_usulan: undefined,
            catatanAlasan: undefined,
          }),
        },
      }));
    } else {
      // Update nilai biasa
      setEditedData((prevData) => ({
        ...prevData,
        [rowId]: {
          ...prevData[rowId],
          [columnName]: finalValue,
        },
      }));
    }
  };

  [
    {
      id: 88451,
      id_usulan: 2024,
      id_puskesmas: 3,
      id_alkes: 8,
      berfungsi: 0,
      usulan: 0,
      periode_id: 2,
      nama_alkes: "Elektrokardiograf (EKG)",
      jenis_alkes: "EKG",
      kategori: "EKG",
      satuan: "unit",
      tahun: "2025",
      standard_rawat_inap: 1,
      standard_non_inap: 1,
      harga: 1000,
      keterangan_alkes:
        "[https://drive.google.com/file/d/1EizZI9-aUpkZQuJmzj9rYGZBAKhSwssR/view?usp=drive_link]",
      keterangan_usulan: "",
      kriteria_alkes: [
        {
          id_alkes: 8,
          id: 1,
          kriteria: "Dokter",
          stat: 1,
          created_at: "2025-05-10 05:00:29",
          updated_at: null,
        },
        {
          id_alkes: 8,
          id: 3,
          kriteria: "Bidan",
          stat: 1,
          created_at: "2025-05-10 05:00:53",
          updated_at: null,
        },
        {
          id_alkes: 8,
          id: 2,
          kriteria: "Perawat",
          stat: 1,
          created_at: "2025-05-10 05:00:44",
          updated_at: null,
        },
      ],
    },
    {
      id: 98719,
      id_usulan: 2024,
      id_puskesmas: 3,
      id_alkes: 9,
      berfungsi: 0,
      usulan: 0,
      periode_id: 2,
      nama_alkes: "Chemistry Analyzer",
      jenis_alkes: "Chemistry Analyzer",
      kategori: "Chemistry Analyzer",
      satuan: "1",
      tahun: "2025",
      standard_rawat_inap: 1,
      standard_non_inap: 1,
      harga: 0,
      keterangan_alkes:
        "[https://drive.google.com/file/d/1EizZI9-aUpkZQuJmzj9rYGZBAKhSwssR/view?usp=sharing]",
      keterangan_usulan: "",
      kriteria_alkes: [
        {
          id_alkes: 9,
          id: 1,
          kriteria: "Dokter",
          stat: 1,
          created_at: "2025-05-10 05:00:29",
          updated_at: null,
        },
        {
          id_alkes: 9,
          id: 3,
          kriteria: "Bidan",
          stat: 1,
          created_at: "2025-05-10 05:00:53",
          updated_at: null,
        },
        {
          id_alkes: 9,
          id: 2,
          kriteria: "Perawat",
          stat: 1,
          created_at: "2025-05-10 05:00:44",
          updated_at: null,
        },
        {
          id_alkes: 9,
          id: 5,
          kriteria: "ATLM",
          stat: 1,
          created_at: "2025-05-10 05:02:14",
          updated_at: null,
        },
      ],
    },
  ];

  const getResultData = () => {
    return filteredData.map((row) => ({
      id: row.id,
      berfungsi:
        editedData[row.id]?.berfungsi !== undefined
          ? editedData[row.id].berfungsi
          : row.berfungsi || 0,
      usulan:
        editedData[row.id]?.usulan !== undefined
          ? editedData[row.id].usulan
          : row.usulan || 0,
      alasan:
        editedData[row.id]?.keterangan_usulan === "Lainnya"
          ? editedData[row.id]?.catatanAlasan
          : editedData[row.id]?.keterangan_usulan ?? null,
    }));
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

      const masihBerfungsi =
        editedData[row.id]?.berfungsi || row.berfungsi || 0;
      const usulan = editedData[row.id]?.usulan || row.usulan || 0;

      if (standard !== null && usulan < standard - masihBerfungsi) {
        if (!editedData[row.id]?.keterangan_usulan) {
          validationErrors[row.id] = "Harap pilih alasan tidak usul";
          hasError = true;
        } else if (
          editedData[row.id]?.keterangan_usulan === "Lainnya" &&
          !editedData[row.id]?.catatanAlasan?.trim()
        ) {
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
            {row.kriteria_alkes?.map((item) => item.kriteria).join("/ ")}
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
                user?.role == "5" || isDisabled || selectedPeriode?.stat == 0
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

          if (!memenuhiSalahSatuKriteria) {
            return (
              <div className="text-red-500 text-xs">
                SDM tidak memenuhi kriteria
              </div>
            );
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
                  selectedPeriode?.stat == 0
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

          // if (!memenuhiSalahSatuKriteria) {
          //   return (
          //     <div className="text-red-500 text-xs">
          //       SDM tidak memenuhi kriteria
          //     </div>
          //   );
          // }
          const standard =
            selectedPelayanan?.value === "Non Rawat Inap"
              ? row.standard_non_inap
              : row.standard_rawat_inap;

          const masihBerfungsi =
            editedData[row.id]?.berfungsi || row.berfungsi || 0;
          const usulan = editedData[row.id]?.usulan || row.usulan || 0;
          const showAlasan =
            standard !== null && usulan < standard - masihBerfungsi;
          console.log("Row:", row.id, {
            standard,
            masihBerfungsi,
            usulan,
            hasAlasan: !!editedData[row.id]?.keterangan_usulan,
            showAlasan,
          });

          if (!showAlasan)
            return <div className="text-xs text-gray-400">-</div>;

          return (
            <div className="w-full">
              <select
                value={editedData[row.id]?.keterangan_usulan || ""}
                onChange={(e) => handleAlasanChange(row.id, e.target.value)}
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
                    isDisabled={user?.role == "5" || isDisabled}
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
                    isDisabled={user?.role == "5" || isDisabled}
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
                    isDisabled={user?.role == "5" || isDisabled}
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
                    isDisabled={user?.role == "5" || isDisabled}
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
          {!isDisabled && (
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
