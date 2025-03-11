import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { encryptId, formatRupiah, selectThemeColors } from "../../data/utils";
import {
  FaDownload,
  FaEdit,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { BiExport, BiSolidFileExport } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { CgSpinner } from "react-icons/cg";
import CardDataStats from "../../components/CardDataStats";
import { PiShieldWarningBold } from "react-icons/pi";
import { MdOutlineDomainVerification } from "react-icons/md";
import { AiOutlineDatabase } from "react-icons/ai";
import LaporanCard from "../../components/Card/LaporanCard";
import { data } from "autoprefixer";
import moment from "moment/moment";

const LaporanBarang = () => {
  const user = useSelector((a) => a.auth.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [dataUser, setDataUser] = useState([]);

  const [dataCard, setDataCard] = useState({});
  const [getLoading, setGetLoading] = useState(false);

  const [data, setData] = useState({});

  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);

  const [formData, setFormData] = useState({});

  const fetchDataLaporan = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/lapalkes`,
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

  const fetchBarang = useCallback(async () => {
    if (dataBarang.length > 0) return;

    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/alkes`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setDataBarang([
        { label: "Semua Barang", value: "" },
        ...response.data.data.map((item) => ({
          label: item.nama_alkes,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataBarang([]);
    }
  }, [dataBarang.length, user?.token]);

  // Fetch cities based on the selected province
  const fetchKota = useCallback(
    async (idProvinsi) => {
      if (dataKota.length > 0 && selectedProvinsi?.value === idProvinsi) return;

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
      if (dataKecamatan.length > 0 && selectedKota?.value === idKota) return;

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

  const handleSearchClick = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/lapalkes`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: {
          id_provinsi: selectedProvinsi?.value?.toString() || "0",
          id_kabupaten: selectedKota?.value?.toString() || "0",
          id_alkes: selectedBarang?.value?.toString() || "0",
        },
      });
      setFilteredData(response.data.data);
    } catch (error) {
      setError(true);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProvinsi();
    fetchUserData();
    fetchDataLaporan();
    fetchBarang();
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
  const handleBarangChange = (selectedOption) => {
    setSelectedBarang(selectedOption);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filtered = data.filter((item) => {
      return item?.nama_alkes && item.nama_alkes.toLowerCase().includes(value);
    });

    setFilteredData(filtered);
  };

  const columns = useMemo(
    () => [
      // { name: "No", selector: (row) => row.id, sortable: true },
      // {
      //   name: "Provinsi",
      //   selector: (row) => row.provinsi,
      //   sortable: true,
      //   width: "180px",
      // },
      // {
      //   name: "Kabupaten",
      //   selector: (row) => row.kabupaten,
      //   sortable: true,
      //   width: "180px",
      // },
      {
        name: <div className="text-wrap">Nama Alkes</div>,
        selector: (row) => row.nama_alkes,
        cell: (row) => <div className="text-wrap py-2">{row.nama_alkes}</div>,

        sortable: true,
        width: "200px",
      },
      {
        name: "Jumlah Eksisting",
        selector: (row) => Number(row.berfungsi),
        sortable: true,
        // width: "100px",
      },
      {
        name: "Jumlah Usulan",
        selector: (row) => Number(row.usulan),
        sortable: true,
        // width: "100px",
      },
      {
        name: "Aksi",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <button
              title="Detail"
              className="text-green-400 hover:text-green-500"
            >
              <Link
                to={`/laporan/detail/${
                  user?.role == "3"
                    ? encodeURIComponent(encryptId(row?.id_alkes)) +
                      "/" +
                      encodeURIComponent(encryptId(user?.provinsi))
                    : encodeURIComponent(encryptId(row?.id_alkes))
                }`}
              >
                <FaEye size={16} />
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
    const XLSX = await import("xlsx"); // Implementasi untuk mengekspor data (misalnya ke CSV)

    const exportData = filteredData?.map((item) => ({
      "Nama Alkes": item?.nama_alkes,
      "Jumlah Eksisting": item?.berfungsi,
      "Jumlah Usulan": item?.usulan,
    }));
    const wb = XLSX.utils.book_new();

    // Kolom yang konsisten untuk semua tabel
    const cols = [
      { wch: 20 }, // Kolom 1
      { wch: 20 }, // Kolom 2
      { wch: 20 }, // Kolom 3
      { wch: 25 }, // Kolom 4
      { wch: 20 }, // Kolom 5
      { wch: 20 }, // Kolom 6
      { wch: 20 }, // Kolom 7
      { wch: 20 }, // Kolom 8
    ];

    // Membuat sheet untuk data filteredData
    const wsFilteredData = XLSX.utils.json_to_sheet(exportData);
    wsFilteredData["!cols"] = cols;

    // Menambahkan sheet ke workbook
    XLSX.utils.book_append_sheet(wb, wsFilteredData, "Data Laporan Alkes");

    // Export file excel
    const tanggal = moment().locale("id").format("DD MMMM YYYY HH:mm");
    XLSX.writeFile(wb, `Data laporan Per Alkes ${tanggal}.xlsx`);
  };

  const handleExportAll = async () => {
    const XLSX = await import("xlsx");
    const moment = (await import("moment")).default;

    // Menampilkan loading
    Swal.fire({
      title: "Loading...",
      text: "Sedang mengambil data dari server",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Mengambil data dari API dengan headers
      const response = await fetch(
        "https://api.tatakelolakesmas.com/api/lapalkes/semua",
        {
          method: "GET", // Metode request
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`, // Menggunakan token dari user
          },
        }
      );

      // Cek jika response tidak OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.data) {
        throw new Error("Data tidak ditemukan");
      }

      const exportData = data.data.map((item) => ({
        "Nama Alkes": item.nama_alkes,
        Puskesmas: item?.nama_puskesmas,
        Kabupaten: item.kabupaten,
        Provinsi: item.provinsi,
        "Jumlah Eksisting": item.berfungsi,
        "Jumlah Usulan": item.usulan,
      }));

      const wb = XLSX.utils.book_new();

      const cols = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];

      // Sheet 1: Urutkan berdasarkan "Nama Alkes"

      const wsAlkes = XLSX.utils.json_to_sheet(exportData);
      wsAlkes["!cols"] = cols;
      XLSX.utils.book_append_sheet(wb, wsAlkes, "Data Sort by Puskesmas");

      // Sheet 2: Urutkan berdasarkan "Provinsi"
      const exportDataAlkes = [...exportData];
      exportDataAlkes.sort((a, b) => {
        if (a["Nama Alkes"] < b["Nama Alkes"]) return -1;
        if (a["Nama Alkes"] > b["Nama Alkes"]) return 1;
        return 0;
      });
      const wsProvinsi = XLSX.utils.json_to_sheet(exportDataAlkes);
      wsProvinsi["!cols"] = cols;
      XLSX.utils.book_append_sheet(wb, wsProvinsi, "Data Sort by Alkes");

      const tanggal = moment().locale("id").format("DD MMMM YYYY HH:mm");
      XLSX.writeFile(wb, `Data laporan Semua Alkes Puskesmas ${tanggal}.xlsx`);

      // Menampilkan notifikasi berhasil
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diambil dan diexport",
      });
    } catch (error) {
      // Menampilkan notifikasi gagal
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengambil data: " + error.message,
      });
    } finally {
      // Menutup loading
      Swal.close();
    }
  };

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
      <Breadcrumb
        pageName="Data Laporan Alkes"
        title="Data Laporan Per Alkes"
      />
      <div className="flex flex-col items-center justify-center w-full tracking-tight mb-8">
        <div className="flex items-center lg:items-end mt-8 gap-4 flex-col lg:flex-row">
          <div className="flex items-center gap-4 flex-col sm:flex-row">
            {/* <div>
              <label
                className="block text-[#728294] text-base font-normal mb-2"
                htmlFor="kecamatan"
              >
                Kecamatan
              </label>
              <Select
                options={dataKecamatan}
                value={selectedKecamatan}
                onChange={handleKecamatanChange}
                className="w-64 sm:w-32 xl:w-60"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "lightgrey",
                    primary: "grey",
                  },
                })}
                isDisabled={!selectedKota}
                placeholder={
                  selectedKota ? "Pilih Kecamatan" : "Pilih Kab / Kota Dahulu"
                }
              />
            </div> */}
            <div>
              <label
                className="block text-[#728294] text-base font-normal mb-2"
                htmlFor="barang"
              >
                Alkes
              </label>
              <Select
                options={dataBarang}
                value={selectedBarang}
                onChange={handleBarangChange}
                className="w-64 sm:w-32 xl:w-60"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "lightgrey",
                    primary: "grey",
                  },
                })}
                placeholder={"Pilih Alkes"}
              />
            </div>
          </div>
          <button
            onClick={handleSearchClick}
            disabled={loading}
            className="mt-2 flex items-center gap-2 cursor-pointer text-base font-semibold text-white px-5 py-2 bg-primary rounded-md tracking-tight"
          >
            <FaSearch />
            <span className="lg:hidden xl:flex">
              {" "}
              {loading ? "Loading" : "Cari Data"}
            </span>
          </button>
        </div>
      </div>
      <div className="rounded-md flex flex-col gap-4 overflow-hidden overflow-x-auto  border border-stroke bg-white py-4 md:py-8 px-4 md:px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between mb-4 items-center">
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
          <div className="div flex gap-2 flex-row">
            <button
              title="Export Data All"
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExportAll}
            >
              <BiExport />
              <span className="hidden sm:block">Export All</span>
            </button>

            <button
              title="Export Data Alkes"
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
            {/* {user.role === "1" ? (
              <button
                title="Tambah Data Laporan"
                className="flex items-center gap-2 cursor-pointer text-base text-white  bg-primary rounded-md tracking-tight"
                onClick={handleExport}
              >
                <Link
                  to="/dokumen/add"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <FaPlus size={16} />
                  <span className="hidden sm:block">Tambah Data Laporan</span>
                </Link>
              </button>
            ) : (
              ""
            )} */}
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center">
              <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : error || filteredData.length === 0 ? (
            <div className="text-center">Data Tidak Tersedia.</div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
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
                    paddingTop: 6,
                    paddingBottom: 6,
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

export default LaporanBarang;
