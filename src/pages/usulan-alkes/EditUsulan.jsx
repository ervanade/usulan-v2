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
    usulan: [],
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const isDisabled = true;

  const [dataUser, setDataUser] = useState([]);
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataPuskesmas, setDataPuskesmas] = useState([]);
  const [dataPeriode, setDataPeriode] = useState([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState(null);
  const [selectedDaya, setSelectedDaya] = useState(null);
  const [selectedListrik, setSelectedListrik] = useState(null);
  const [selectedInternet, setSelectedInternet] = useState(null);

  const navigate = useNavigate();

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
      setDataPeriode(response.data.data);
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
  const isSwalShown = useRef(false);
  // Fetch distribution data
  const fetchDistribusiData = useCallback(async () => {
    setLoading(true);
    setGetLoading(true);

    setError(false);
    const decryptedId = decryptId(id);
    if (!decryptedId) {
      // Jika decryptId gagal (mengembalikan null atau nilai falsy lainnya)
      navigate("/not-found"); // Arahkan ke halaman "not found"
      return; // Hentikan eksekusi fungsi
    }
    try {
      const response = await axios({
        method: "get",
        url: `${
          import.meta.env.VITE_APP_API_URL
        }/api/usulan/detail/${encodeURIComponent(decryptId(id))}`,
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
      });
      setData(data?.usulan || []);
      setFilteredData(data?.usulan || []);
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
  }, [user?.token]);

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
    // fetchProvinsi();
  }, []);

  const handleChange = (event) => {
    const { id, value, files } = event.target;
    if (files) {
      const file = files[0];
      if (file.type !== "application/pdf") {
        Swal.fire("Error", "File type harus PDF", "error");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        Swal.fire("Error", "File size harus dibawah 100 MB", "error");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [id]: file,
        contractFileName: file.name,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

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
    if (formData.id_provinsi && dataProvinsi.length > 0) {
      const initialOption = dataProvinsi?.find(
        (prov) => prov.value == formData.id_provinsi
      );
      if (initialOption) {
        setSelectedProvinsi({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }
    if (formData.id_kecamatan && dataKecamatan.length > 0) {
      const initialOption = dataKecamatan.find(
        (kec) => kec.value == formData.id_kecamatan
      );
      if (initialOption) {
        setSelectedKecamatan({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }
    if (formData.id_kabupaten && dataKota.length > 0) {
      const initialOption = dataKota.find(
        (kec) => kec.value == formData.id_kabupaten
      );

      if (initialOption) {
        setSelectedKota({
          label: initialOption.label,
          value: initialOption.value,
          provinsi: initialOption.provinsi,
        });
      }
    }
    if (formData.id && dataPuskesmas.length > 0) {
      const initialOption = dataPuskesmas.find(
        (kec) => kec.value == formData.id
      );
      if (initialOption) {
        setSelectedPuskesmas({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }

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
  }, [formData, dataProvinsi, dataKecamatan, dataKota, dataPuskesmas]);
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

  const handleInputChange = (rowId, columnName, value) => {
    const newValue = parseInt(value, 10); // Konversi ke number, termasuk 0

    // Jika newValue adalah NaN (misalnya, input kosong), set ke 0
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
          [columnName]: finalValue, // Gunakan finalValue, termasuk 0
        },
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [rowId]: "", // Hapus pesan error jika standard null
      }));
      return;
    }

    // Validasi untuk usulan
    if (columnName === "usulan") {
      const maxUsulan = Math.max(0, standard - masihBerfungsi); // Hitung maksimal usulan
      if (finalValue > maxUsulan) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [rowId]: `Usulan tidak boleh melebihi ${maxUsulan}`,
        }));
        return; // Hentikan proses jika usulan melebihi batas
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [rowId]: "", // Hapus pesan error jika valid
        }));
      }
    }

    // Jika masih_berfungsi diubah dan sudah memenuhi atau melebihi standard, set usulan ke 0
    if (columnName === "berfungsi" && finalValue >= standard) {
      setEditedData((prevData) => ({
        ...prevData,
        [rowId]: {
          ...prevData[rowId],
          berfungsi: finalValue, // Gunakan finalValue, termasuk 0
          usulan: 0, // Set usulan ke 0
        },
      }));
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        [rowId]: {
          ...prevData[rowId],
          [columnName]: finalValue, // Gunakan finalValue, termasuk 0
        },
      }));
    }
  };

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
    Swal.fire({
      title: "Perhatian",
      text: "Data yang diisi adalah sebenarnya dan dapat dipertanggungjawabkan?",
      showCancelButton: true,
      confirmButtonColor: "#027d77",
      confirmButtonText: "Ya, Simpan Data",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        editUsulan();
      }
    });
  };

  const handleShowKeterangan = (keterangan, nama_alkes) => {
    // Format keterangan menjadi daftar barang
    const daftarBarang = keterangan
      .split("|") // Pisahkan berdasarkan tanda |
      .map((item, index) => `${index + 1}. ${item.trim()}`) // Tambahkan nomor urut
      .join("\n"); // Gabungkan dengan newline

    // Tampilkan popup SweetAlert2
    Swal.fire({
      title: `Daftar List Detail ${nama_alkes || ""}`,
      html: `<pre style="text-align: left; max-height: 300px; overflow-y: auto;">${daftarBarang}</pre>`,
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
            {row.keterangan && ( // Tampilkan ikon jika keterangan ada
              <FaInfoCircle
                title="Lihat Info Detail Barang"
                className="cursor-pointer text-primary hover:text-graydark w-5 h-5 md:w-4 md:h-4"
                onClick={() =>
                  handleShowKeterangan(row.keterangan, row.nama_alkes)
                } // Tampilkan popup saat ikon diklik
              />
            )}
          </div>
        ),
        minWidth: "110px",
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
              disabled={user?.role == "5" || isDisabled}
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
                  masihBerfungsi >= standard || user?.role == "5" || isDisabled
                } // Nonaktifkan input jika masih_berfungsi >= standard
              />
              {errors[row.id] && (
                <div className="text-red-500 text-sm mt-1">
                  {errors[row.id]}
                </div>
              )}
            </div>
          );
        },
        minWidth: "100px",
        maxWidth: "200px",
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
          </form>
          <div className="rounded-md flex flex-col gap-4 overflow-hidden overflow-x-auto  border border-stroke bg-white py-4 md:py-8 px-4 md:px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-bodydark1 mt-2">
                Form Usulan Alkes
              </h2>
              <h2 className="font-medium text-bodydark1 text-sm mt-2">
                Periode : Periode Telah Berakhir
                {/* {dataPeriode?.length > 0
                  ? `${dataPeriode[0]?.periode_name} (Aktif)`
                  : "Periode Telah Berakhir"} */}
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
                        backgroundColor: "#b1e4e0", // Warna header biru
                        color: "#212121", // Teks header putih
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
