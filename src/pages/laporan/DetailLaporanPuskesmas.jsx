import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Select from "react-select";
import DataTable from "react-data-table-component";
import {
  dataDistribusiBekasi,
  dataKecamatan,
  dataKota,
  dataProvinsi,
} from "../../data/data";
import * as XLSX from "xlsx";
import moment from "moment/moment";
import {
  decryptId,
  encryptId,
  formatRupiah,
  selectThemeColors,
} from "../../data/utils";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { BiExport, BiSolidFileExport } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { CgSpinner } from "react-icons/cg";
import LaporanCard from "../../components/Card/LaporanCard";

const DetailLaporanPuskesmas = () => {
  const user = useSelector((a) => a.auth.user);

  const [search, setSearch] = useState(""); // Initialize search state with an empty string
  const [dataCard, setDataCard] = useState({});
  const [data, setData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [getLoading, setGetLoading] = useState(false);
  const [error, setError] = useState(false);
  const { idProvinsi, idKabupaten, idPuskesmas } = useParams();

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filtered = data.filter((item) => {
      return (
        (item?.jenis_alkes && item.jenis_alkes.toLowerCase().includes(value)) ||
        (item?.puskesmas && item.puskesmas.toLowerCase().includes(value))
      );
    });

    setFilteredData(filtered);
  };

  const handleExport = () => {
    // Implementasi untuk mengekspor data (misalnya ke CSV)
    const dashboardData = [
      {
        "Data Distribusi": dataCard.jumlah_distribusi,
        "Data Terverifikasi": dataCard.terverifikasi,
        "Data Belum Terverifikasi": dataCard.belum_terverifikasi,
        "Data Belum Diproses": dataCard.belum_diproses,
        "Jumlah Barang Dikirim": dataCard.jumlah_dikirim,
        "Jumlah Barang Diterima": dataCard.jumlah_diterima,
        "Total Harga": formatRupiah(dataCard.total_harga),
        "Jumlah Dokumen": dataCard.jumlah_dokumen,
      },
    ];
    const exportData = filteredData?.map((item) => ({
      Puskesmas: item?.nama_puskesmas,
      "Nama Barang": item?.jenis_alkes,
      "Jumlah Barang Dikirim": item?.jumlah_dikirim,
      "Jumlah Barang Diterima": item?.jumlah_diterima,
      "Total Harga": formatRupiah(item?.total_harga),
    }));
    const wb = XLSX.utils.book_new();

    // Membuat sheet untuk data dashboard
    const wsDashboard = XLSX.utils.json_to_sheet(dashboardData);

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
    wsDashboard["!cols"] = cols;

    // Membuat sheet untuk data filteredData
    const wsFilteredData = XLSX.utils.json_to_sheet(exportData);
    wsFilteredData["!cols"] = cols;

    // Menambahkan sheet ke workbook
    XLSX.utils.book_append_sheet(wb, wsDashboard, "Total Data");
    XLSX.utils.book_append_sheet(wb, wsFilteredData, "Data Distribusi");

    // Export file excel
    const tanggal = moment().locale("id").format("DD MMMM YYYY HH:mm");
    XLSX.writeFile(
      wb,
      `Data laporan Puskesmas ${
        filteredData[0]?.nama_puskesmas || ""
      } ${tanggal}.xlsx`
    );
  };

  const fetchProvinsi = async () => {
    setLoading(true);
    setGetLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/laporan/detail`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: JSON.stringify({
          id_provinsi: encodeURIComponent(decryptId(idProvinsi)) || 0,
          id_kabupaten: encodeURIComponent(decryptId(idKabupaten)) || 0,
          id_puskesmas: encodeURIComponent(decryptId(idPuskesmas)) || 0,
        }),
      });
      setFilteredData(response.data.data);
      setData(response.data.data);
      setLoading(false);
      setGetLoading(false);
    } catch (error) {
      setError(true);
      setGetLoading(false);
      setLoading(false);
    }
  };

  const fetchDataCard = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/laporan/dashboard`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: JSON.stringify({
          id_provinsi: encodeURIComponent(decryptId(idProvinsi)),
          id_kabupaten: encodeURIComponent(decryptId(idKabupaten)),
          id_puskesmas: encodeURIComponent(decryptId(idPuskesmas)) || 0,
        }),
      });
      setDataCard(response?.data?.data[0]);
      setLoading(false);
    } catch (error) {
      setError(true);
    }
  };
  useEffect(() => {
    fetchProvinsi();
    fetchDataCard();
  }, []);

  const deleteProvinsi = async (id) => {
    await axios({
      method: "delete",
      url: `${import.meta.env.VITE_APP_API_URL}/api/kabupaten/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then(() => {
        fetchProvinsiData();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleConfirmDeleteProvinsi = async (id) => {
    return Swal.fire({
      title: "Are you sure?",
      text: "You will Delete This Provinsi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#16B3AC",
    }).then(async (result) => {
      if (result.value) {
        await deleteProvinsi(id);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your Provinsi has been deleted.",
        });
      }
    });
  };

  const columns = useMemo(
    () => [
      // {
      //   name: "Kecamatan",
      //   selector: (row) => row.kecamatan,
      //   sortable: true,
      //   width: "180px",
      // },
      // {
      //   name: "Puskesmas",
      //   selector: (row) => row.nama_puskesmas,
      //   sortable: true,
      //   width: "180px",
      // },
      {
        name: "Nama Barang",
        selector: (row) => row.jenis_alkes,
        sortable: true,
        width: "180px",
      },
      //   {
      //     name: "Data Distribusi",
      //     selector: (row) => row.jumlah_distribusi,
      //     sortable: true,
      //     // width: "100px",
      //   },
      // {
      //   name: "Data Distribusi",
      //   selector: (row) => Number(row.jumlah_distribusi),
      //   sortable: true,
      //   // width: "100px",
      // },
      {
        name: "Jumlah Dikirim",
        selector: (row) => Number(row.jumlah_dikirim),
        sortable: true,
        // width: "100px",
      },
      {
        name: "Jumlah Diterima",
        selector: (row) => Number(row.jumlah_diterima),
        sortable: true,
        // width: "100px",
      },
      {
        name: "Total Harga (Rp)",
        selector: (row) => Number(row.total_harga),
        cell: (row) => formatRupiah(row.total_harga),
        sortable: true,
        width: "200px",
      },
    ],
    [handleConfirmDeleteProvinsi, user.role]
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
      <Breadcrumb
        pageName={
          "Data Laporan Puskesmas " + (filteredData[0]?.kecamatan || "")
        }
        title={"Data Laporan Puskesmas " + (filteredData[0]?.kecamatan || "")}
      />
      <div className="flex justify-end mb-4">
        <button
          onClick={() =>
            navigate(
              `/laporan/detail/${encodeURIComponent(
                idProvinsi
              )}/${encodeURIComponent(idKabupaten)}`
            )
          }
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
        >
          Back
        </button>
      </div>
      <div className="flex flex-col items-center justify-center w-full tracking-tight mb-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:gap-7.5">
          <LaporanCard
            title="Data Distribusi"
            total={dataCard.jumlah_distribusi || 0}
          />
          <LaporanCard
            title="Data Terverifikasi"
            total={dataCard.terverifikasi || 0}
          />
          <LaporanCard
            title="Data Belum Diverifikasi"
            total={dataCard.belum_terverifikasi || 0}
          />
          <LaporanCard
            title="Data Belum Diproses"
            total={dataCard.belum_diproses || 0}
          />
          <LaporanCard
            title="Jumlah Barang Dikirim"
            total={dataCard.jumlah_dikirim || 0}
          />
          <LaporanCard
            title="Jumlah Barang Diterima"
            total={dataCard.jumlah_diterima || 0}
          />
          <LaporanCard
            title="Total Harga (Rp)"
            total={formatRupiah(dataCard.total_harga) || 0}
          />
          <LaporanCard
            title="Jumlah Dokumen"
            total={dataCard.jumlah_dokumen || 0}
          />
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
              title="Export Data Puskesmas"
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
            {/* {user.role === "1" ? (
              <button
                title="Tambah Data Kota"
                className="flex items-center gap-2 cursor-pointer text-base text-white  bg-primary rounded-md tracking-tight"
                onClick={handleExport}
              >
                <Link
                  to="/master-data-kota/add"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <FaPlus size={16} />
                  <span className="hidden sm:block">Tambah Data Kota</span>
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
                    backgroundColor: "#EBFBFA", // Warna header biru
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

export default DetailLaporanPuskesmas;
