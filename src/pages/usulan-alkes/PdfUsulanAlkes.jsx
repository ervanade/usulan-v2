import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.jsx";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { encryptId, selectThemeColors } from "../../data/utils";
import {
  FaDownload,
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { saveAs } from "file-saver"; // Pastikan Anda menginstal file-saver
import { BiExport, BiSolidFileExport } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { CgSpinner } from "react-icons/cg";
import ModalTTE from "../../components/Modal/ModalTTE.jsx";
import GenerateDokumen from "../../components/Dokumen/GenerateDokumen.jsx";
import ModalUploadDokumen from "../../components/Modal/ModalUploadDokumen.jsx";
import ModalTTENew from "../../components/Modal/ModalTTENew.jsx";

const PdfUsulanAlkes = () => {
  const user = useSelector((a) => a.auth.user);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  var today = new Date();
  const defaultDate = today.toISOString().substring(0, 10);
  const defaultImage =
    "https://media.istockphoto.com/id/1472819341/photo/background-white-light-grey-total-grunge-abstract-concrete-cement-wall-paper-texture-platinum.webp?b=1&s=170667a&w=0&k=20&c=yoY1jUAKlKVdakeUsRRsNEZdCx2RPIEgaIxSwQ0lS1k=";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [data, setData] = useState([]);
  const [getLoading, setGetLoading] = useState(false);

  const [dataUser, setDataUser] = useState([]);
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showModalUpload, setShowModalUpload] = useState(false);
  const [jsonData, setJsonData] = useState({
    id: "",
    nama_dokumen: "",
    kabupaten: "",
    dokumen_array: [],
  });

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);

  const handleTTE = async (id, nama_dokumen, dokumen_array, kabupaten) => {
    // e.preventDefault();
    // setShowModal(true);
    setShowPopup(true);
    setJsonData({
      id: id,
      nama_dokumen: nama_dokumen,
      dokumen_array: dokumen_array,
      kabupaten: kabupaten,
    });
  };

  const handleModalDokumen = async (e, id, nama_dokumen, kabupaten) => {
    e.preventDefault();
    setShowModalUpload(true);
    setJsonData({
      id: id,
      nama_dokumen: nama_dokumen,
      kabupaten: kabupaten,
    });
  };

  const fetchDokumenData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/usulan`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      setError(true);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumenData();
  }, []);

  const fetchUserData = useCallback(async () => {
    setGetLoading(true);
    try {
      const responseUser = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/me`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setDataUser(responseUser.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setGetLoading(false);
    }
  }, [user?.token]);

  // Fetch provinces only if dataProvinsi is empty
  const fetchProvinsi = useCallback(async () => {
    if (dataProvinsi.length > 0) return;

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
        { label: "Semua Provinsi", value: "" },
        ...response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataProvinsi([]);
    }
  }, [dataProvinsi.length, user?.token]);

  // Fetch cities based on the selected province
  const fetchKota = useCallback(
    async (idProvinsi) => {
      if (dataKota.length > 0 && selectedProvinsi?.value == idProvinsi) return;

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
          { label: "Semua Kabupaten/Kota", value: "" },
          ...response.data.data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        ]);
      } catch (error) {
        setError(true);
        setDataKota([]);
      }
    },
    [dataKota.length, selectedProvinsi?.value, user?.token]
  );

  // Fetch subdistricts based on the selected city
  const fetchKecamatan = useCallback(
    async (idKota) => {
      if (dataKecamatan.length > 0 && selectedKota?.value == idKota) return;

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
          { label: "Semua Kecamatan", value: "" },
          ...response.data.data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        ]);
      } catch (error) {
        setError(true);
        setDataKecamatan([]);
      }
    },
    [dataKecamatan.length, selectedKota?.value, user?.token]
  );
  useEffect(() => {
    fetchProvinsi();
    fetchUserData();
  }, []);

  const handleProvinsiChange = (selectedOption) => {
    setSelectedProvinsi(selectedOption);
    setSelectedKota(null);
    setSelectedKecamatan(null);
    setDataKota([]);
    setDataKecamatan([]);
    if (selectedOption && selectedOption.value !== "") {
      fetchKota(selectedOption.value);
    }
  };

  const handleKotaChange = (selectedOption) => {
    setSelectedKota(selectedOption);
    setSelectedKecamatan(null);
    setDataKecamatan([]);
    if (selectedOption && selectedOption.value !== "") {
      fetchKecamatan(selectedOption.value);
    }
  };

  const handleKecamatanChange = (selectedOption) => {
    setSelectedKecamatan(selectedOption);
  };

  const deleteDokumen = async (id) => {
    await axios({
      method: "delete",
      url: `${import.meta.env.VITE_APP_API_URL}/api/dokumen/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then(() => {
        fetchDokumenData();
        setSearch("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleConfirmDeleteDokumen = async (id) => {
    return Swal.fire({
      title: "Are you sure?",
      text: "You will Delete This Dokumen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#16B3AC",
    }).then(async (result) => {
      if (result.value) {
        await deleteDokumen(id);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your Dokumen has been deleted.",
        });
      }
    });
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filtered = data.filter((item) => {
      return (
        (item?.nama_dokumen &&
          item.nama_dokumen.toLowerCase().includes(value)) ||
        (item?.nomor_bast && item.nomor_bast.toLowerCase().includes(value)) ||
        (item?.provinsi && item.provinsi.toLowerCase().includes(value)) ||
        (item?.kabupaten && item.kabupaten.toLowerCase().includes(value)) ||
        (item?.tanggal_bast &&
          item.tanggal_bast.toLowerCase().includes(value)) ||
        (item?.tahun_lokus && item.tahun_lokus.toLowerCase().includes(value)) ||
        (item?.penerima_hibah &&
          item.penerima_hibah.toLowerCase().includes(value))
      );
    });

    setFilteredData(filtered);
  };
  const handleSearchClick = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/usulan/filter`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: {
          id_provinsi: selectedProvinsi?.value.toString() || "",
          id_kabupaten: selectedKota?.value.toString() || "",
        },
      });
      let dataResponse = response.data.data;

      if (selectedStatus) {
        dataResponse =
          selectedStatus.value == 0
            ? dataResponse.filter((a) => a.status_tte == "0")
            : dataResponse.filter(
                (a) => a.status_tte == "1" || a.status_tte == "2"
              );
      }

      setFilteredData(dataResponse);
    } catch (error) {
      setError(true);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role == "3" || user.role == "5") {
      fetchUserData();
    }
  }, [user.role, fetchUserData]);

  // Fetch provinces and cities based on selected options
  useEffect(() => {
    fetchProvinsi();
    if (selectedProvinsi) {
      fetchKota(selectedProvinsi.value);
    }
  }, [fetchProvinsi, selectedProvinsi, fetchKota]);

  // Fetch subdistricts based on the selected city
  useEffect(() => {
    if (selectedKota) {
      fetchKecamatan(selectedKota.value);
    }
  }, [selectedKota, fetchKecamatan]);

  // Set selected options for provinces and cities based on user's initial data
  useEffect(() => {
    if (
      (user.role == "3" || user.role == "5") &&
      user.provinsi &&
      dataProvinsi.length > 0
    ) {
      const initialOption = dataProvinsi.find(
        (prov) => prov.value == user.provinsi
      );
      if (initialOption) {
        setSelectedProvinsi({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }
    if (user.role == "3" && user.kabupaten && dataKota.length > 0) {
      const initialOption = dataKota.find(
        (prov) => prov.value == user.kabupaten
      );
      if (initialOption) {
        setSelectedKota({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }
  }, [user.role, user.provinsi, user.kabupaten, dataProvinsi, dataKota]);

  const updateDownload = async (id) => {
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/usulan/download/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      fetchDokumenData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda ingin mendownload dokumen usulan. Lanjutkan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Download",
      cancelButtonText: "Batal",
    });

    // Jika pengguna memilih "Batal", hentikan proses
    if (!confirmResult.isConfirmed) {
      return;
    }
    try {
      Swal.fire({
        title: "Generate dokumen...",
        text: "Tunggu Sebentar Dokumen Disiapkan...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios({
        method: "get",
        url: `${
          import.meta.env.VITE_APP_API_URL
        }/api/usulan/${encodeURIComponent(id)}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = response.data.data;
      // Lakukan proses generate dokumen berdasarkan data JSON yang diterima
      let dataJson = {
        id: data.id,
        tgl_download: data.tgl_download || defaultDate,
        tgl_upload: data.tgl_upload || defaultDate,
        provinsi: data.provinsi || "",
        kabupaten: data.kabupaten || "",
        user_download: data.user_download || "",
        user_upload: data.user_upload || "",
        distribusi: data.usulan_detail || [],
        total_alkes: data.total_alkes || [],
      };
      const pdfBlob = await GenerateDokumen(dataJson, false); // GenerateDokumen harus mengembalikan Blob PDF

      saveAs(pdfBlob, `PDF Usulan ${dataJson.kabupaten}.pdf`);
      await updateDownload(dataJson?.id);

      Swal.fire({
        icon: "success",
        title: "Download Complete",
        text: "Dokumen Sukses Di Download",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Download Gagal",
        text: "Silahkan Coba Beberapa Saat Lagi",
      });
      console.log(error);
    }
  };

  const handleBukaUpload = async (id) => {
    try {
      Swal.fire({
        title: "Generate dokumen...",
        text: "Tunggu Sebentar Dokumen Disiapkan...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios({
        method: "get",
        url: `${
          import.meta.env.VITE_APP_API_URL
        }/api/usulan/${encodeURIComponent(id)}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = response.data.data;
      // Lakukan proses generate dokumen berdasarkan data JSON yang diterima
      let dataJson = {
        id: data.id,
        kecamatan: data.kecamatan,
        provinsi: data.provinsi || "",
        kabupaten: data.kabupaten || "",
        file_upload: data.file_upload || null,
      };

      if (dataJson?.file_upload) {
        try {
          const response = await fetch(dataJson?.file_upload);
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          const blob = await response.blob();
          const fileName = dataJson?.kabupaten
            ? `Dokumen Upload Usulan ${dataJson.kabupaten}.pdf`
            : "dokumen.pdf";
          saveAs(blob, fileName);
          Swal.fire({
            icon: "success",
            title: "Download Complete",
            text: "Dokumen Upload Sukses Di Download",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Failed to download file:", error);
          Swal.fire({
            icon: "error",
            title: "Download Gagal",
            text: "Silahkan Coba Beberapa Saat Lagi",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "warning",
          text: "Dokumen Belum di Upload!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Download Gagal",
        text: "Silahkan Coba Beberapa Saat Lagi",
      });
      console.log(error);
    }
  };

  const columns = useMemo(
    () => [
      {
        name: <div className="text-wrap">Provinsi</div>,
        selector: (row) => row.provinsi,
        sortable: true,
        cell: (row) => <div className="text-wrap py-2">{row.provinsi}</div>,
        width: "120px",
      },
      {
        name: <div className="text-wrap">Kab / Kota</div>,
        selector: (row) => row.kabupaten,
        cell: (row) => <div className="text-wrap py-2">{row.kabupaten}</div>,
        minWidth: "120px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Tanggal Download</div>,
        selector: (row) => row.tgl_download?.substring(0, 10) || "Belum Download",
        cell: (row) => (
          <div className="text-wrap py-4">
            {row.tgl_download?.substring(0, 10) || "Belum Download"}
          </div>
        ),
        width: "165px",
        sortable: true,

        // width: "100px",
      },
      {
        name: <div className="text-wrap">Download</div>,
        cell: (row) => (
          <div className="flex items-center space-x-2">
            {/* <button
              title="Lihat"
              className="text-[#16B3AC] hover:text-cyan-500"
            >
              <Link
                to={`/pdf-usulan-alkes/preview-dokumen/${encodeURIComponent(
                  encryptId(row.id)
                )}`}
              >
                <FaEye size={20} />
              </Link>
            </button> */}
            <button
              title="Download"
              className="text-white bg-blue-600 hover:bg-blue-700 py-2 w-22 rounded-md font-medium text-xs"
              onClick={() => handleDownload(row.id)} // Tambahkan handler download di sini
            >
              Buka <br /> Download
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        minWidth: "100px",
      },
      {
        name: <div className="text-wrap">Tanggal Upload</div>,
        selector: (row) => row.tgl_upload?.substring(0, 10) || "Belum Upload",
        cell: (row) => (
          <div className="text-wrap py-4">
            {row.tgl_upload?.substring(0, 10) || (
              <span className="text-red-500">Belum Upload</span>
            )}
          </div>
        ),
        width: "150px",
        sortable: true,

        // width: "100px",
      },
      {
        name: <div className="text-wrap">Upload</div>,
        cell: (row) => (
          <div className="flex items-center space-x-2">
            {/* <button
              title="Input"
              className="text-green-500 hover:text-green-700"
            >
              <Link to="/data-verifikasi/form-distribusi">
                <FaPlus />
              </Link>
            </button> */}
            {/* <button
              title="Lihat"
              className="text-[#16B3AC] hover:text-cyan-500"
            >
              <Link
                to={`/pdf-usulan-alkes/preview-dokumen/${encodeURIComponent(
                  encryptId(row.id)
                )}`}
              >
                <FaEye size={20} />
              </Link>
            </button> */}
            {row?.tgl_upload && row?.file_upload ? (
              <button
                title="Download"
                className="text-white bg-blue-600 hover:bg-blue-700 py-2 w-22 rounded-md font-medium text-xs"
                onClick={() => handleBukaUpload(row.id)} // Tambahkan handler download di sini
              >
                Buka
                <br /> Upload
              </button>
            ) : (
              ""
            )}
            {user.role == "3" ? (
              <button
                title="Upload Dokumen"
                className="text-white py-2 w-20 bg-primary rounded-md"
                onClick={(e) =>
                  handleModalDokumen(e, row.id, row.nama_dokumen, row.kabupaten)
                }
              >
                Upload <br />
                Dokumen
              </button>
            ) : (!row.tgl_upload || !row.file_upload) &&
              (user.role == "1" || user.role == "5") ? (
              "Belum Upload"
            ) : (
              ""
            )}
          </div>
        ),
        ignoreRowClick: true,
        button: true,
        minWidth: "200px",
      },

      {
        name: "Aksi",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <button
              title="Lihat"
              className="text-white font-semibold py-2 w-22 bg-primary rounded-md"
              onClick={() => {
                navigate(
                  `/pdf-usulan-alkes/preview-dokumen/${encodeURIComponent(
                    encryptId(row.id)
                  )}`,
                  {
                    replace: true,
                  }
                );
              }}
            >
              <Link
                className="text-white font-semibold py-2 w-22 bg-primary rounded-md"
                to={`/pdf-usulan-alkes/preview-dokumen/${encodeURIComponent(
                  encryptId(row.id)
                )}`}
              >
                Preview
              </Link>
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    []
  );

  const handleExport = async () => {
    // Lazy load library xlsx
    const XLSX = await import("xlsx");

    // Implementasi untuk mengekspor data (misalnya ke CSV)
    const exportData = filteredData?.map((item) => ({
      Provinsi: item?.provinsi,
      Kabupaten_Kota: item?.kabupaten,
      Tanggal_Download: item?.tgl_download,
      Tanggal_Upload: item?.tgl_upload,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    ws["!cols"] = [
      { wch: 20 }, // Kolom 1 (Provinsi)
      { wch: 20 }, // Kolom 2 (Kabupaten_Kota)
      { wch: 20 }, // Kolom 3 (Kecamatan)
      { wch: 25 }, // Kolom 4 (Puskesmas)
      { wch: 20 }, // Kolom 5 (Dokumen)
      { wch: 15 }, // Kolom 6 (Program)
      { wch: 10 }, // Kolom 7 (Batch)
      { wch: 15 }, // Kolom 8 (Tahun_Lokus)
      { wch: 15 }, // Kolom 9 (BAST)
      { wch: 15 }, // Kolom 10 (Tanggal_Kirim)
      { wch: 15 }, // Kolom 11 (Tanggal_Terima)
      { wch: 10 }, // Kolom 12 (Jumlah_Kirim)
      { wch: 10 }, // Kolom 13 (Jumlah_Terima)
      { wch: 20 }, // Kolom 14 (Ket_Daerah)
      { wch: 20 }, // Kolom 15 (Ket_Ppk)
      { wch: 20 }, // Kolom 16 (Konfirmasi_Daerah)
      { wch: 20 }, // Kolom 17 (Konfirmasi_Ppk)
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Data PDF Usulan`);
    XLSX.writeFile(wb, "Data PDF Usulan.xlsx");
  };
  // if (getLoading) {
  //   return (
  //     <div className="flex justify-center items-center">
  //       <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
  //       <span className="ml-2">Loading...</span>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Breadcrumb pageName="PDF Usulan Alkes" linkBack="/pdf-usulan-alkes" />
      <div className="flex flex-col items-center justify-center w-full tracking-tight mb-6">
        <h1 className="font-normal mb-3 text-xl lg:text-[28px] tracking-tight text-center text-bodydark1">
          PDF Usulan Alkes
        </h1>
        <div className="flex items-center lg:items-end mt-3 gap-3 flex-col lg:flex-row">
          <div className="flex items-center gap-3 flex-col sm:flex-row">
            <div className="text-base">
              <label
                className="block text-[#728294] text-base font-normal mb-2"
                htmlFor="email"
              >
                Provinsi
              </label>
              <Select
                options={dataProvinsi}
                value={selectedProvinsi}
                onChange={handleProvinsiChange}
                className="w-64 sm:w-32 xl:w-60 bg-slate-500 my-react-select-container"
                classNamePrefix="my-react-select"
                placeholder="Pilih Provinsi"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "lightgrey",
                    primary: "grey",
                  },
                })}
                isDisabled={user.role == "3" || user.role == "5"}
              />
            </div>
            <div>
              <label
                className="block text-[#728294] text-base font-normal mb-2"
                htmlFor="kota"
              >
                Kab / Kota
              </label>
              <Select
                options={dataKota}
                value={selectedKota}
                onChange={handleKotaChange}
                className="w-64 sm:w-32 xl:w-60"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "lightgrey",
                    primary: "grey",
                  },
                })}
                isDisabled={user.role == "3" || !selectedProvinsi}
                placeholder={
                  selectedProvinsi
                    ? "Pilih Kab / Kota"
                    : "Pilih Provinsi Dahulu"
                }
              />
            </div>
          </div>
          <button
            onClick={handleSearchClick}
            disabled={loading}
            className="mt-2 flex items-center font-semibold gap-2 cursor-pointer text-base text-white px-5 py-2 bg-primary rounded-md tracking-tight"
          >
            <FaSearch />
            <span className="lg:hidden xl:flex">
              {" "}
              {loading ? "Loading" : "Cari Data"}
            </span>
          </button>
        </div>
      </div>
      <ModalTTENew
        isVisible={showPopup}
        onClose={() => setShowPopup(false)}
        setShowPopup={setShowPopup}
        jsonData={jsonData}
        user={user}
      />
      <ModalTTE
        show={showModal}
        onClose={() => setShowModal(false)}
        jsonData={jsonData}
        user={user}
      />
      <ModalUploadDokumen
        show={showModalUpload}
        onClose={() => setShowModalUpload(false)}
        jsonData={jsonData}
        user={user}
      />
      <div className="rounded-md flex flex-col gap-2 overflow-hidden overflow-x-auto  border border-stroke bg-white py-4 md:py-8 px-4 md:px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between mb-2 items-center">
          <div className="relative">
            <button className="absolute left-2 top-1/2 -translate-y-1/2">
              <svg
                className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill=""
                />
              </svg>
            </button>

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Cari Data..."
              className="w-full bg-white pl-9 pr-4 text-black outline outline-1 outline-zinc-200 focus:outline-primary dark:text-white xl:w-125 py-2 rounded-md"
            />
          </div>
          <div className="div flex gap-2 flex-row font-semibold">
            <button
              title="Export Data Distribusi"
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
            {user.role == "1" ? (
              <button
                title="Tambah Data Dokumen"
                className="flex font-semibold items-center gap-2 cursor-pointer text-base text-white  bg-primary rounded-md tracking-tight"
              >
                <Link
                  to="/pdf-usulan-alkes/add"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <FaPlus size={16} />
                  <span className="hidden sm:block">
                    Tambah PDF Usulan Alkes
                  </span>
                </Link>
              </button>
            ) : (
              ""
            )}
          </div>
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
              title={selectedRows.length > 0 ? "Data Dokumen" : ""}
              columns={columns}
              data={filteredData}
              striped
              pagination
              persistTableHead
              highlightOnHover
              // selectableRows={user?.role == "3" || user?.role == "4"} // Tampilkan selectableRows jika role 3 atau 4
              // contextActions={
              //   user?.role == "3" || user?.role == "4"
              //     ? contextActions
              //     : undefined
              // } // Tambahkan contextActions jika role 3/4
              // onSelectedRowsChange={
              //   user?.role == "3" || user?.role == "4"
              //     ? handleRowSelected
              //     : undefined
              // } // Tambahkan handler jika role 3/4
              // clearSelectedRows={
              //   user?.role == "3" || user?.role == "4"
              //     ? toggleCleared
              //     : undefined
              // } // Clear selection jika role 3/4
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
                    paddingTop: 4,
                    paddingBottom: 4,
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
    </div>
  );
};

export default PdfUsulanAlkes;
