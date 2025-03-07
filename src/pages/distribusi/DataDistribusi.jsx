import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Select from "react-select";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import {
  dataDistribusiBekasi,
  dataKecamatan,
  dataKota,
  dataProvinsi,
} from "../../data/data";
import { encryptId, selectThemeColors } from "../../data/utils";
import {
  FaCheck,
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
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";

const DataDistribusi = () => {
  const user = useSelector((a) => a.auth.user);
  const [search, setSearch] = useState(""); // Initialize search state with an empty string
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [getLoading, setGetLoading] = useState(false);

  const [dataUser, setDataUser] = useState([]);
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataDokumen, setDataDokumen] = useState([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filtered = data.filter((item) => {
      return (
        (item?.nomor_bast && item.nomor_bast.toLowerCase().includes(value)) ||
        (item?.provinsi && item.provinsi.toLowerCase().includes(value)) ||
        (item?.kabupaten && item.kabupaten.toLowerCase().includes(value)) ||
        (item?.kecamatan && item.kecamatan.toLowerCase().includes(value)) ||
        (item?.nama_puskesmas &&
          item.nama_puskesmas.toLowerCase().includes(value)) ||
        (item?.listrik && item.listrik.toLowerCase().includes(value)) ||
        (item?.internet &&
          item.internet.toString().toLowerCase().includes(value)) ||
        (item?.kepala_unit_pemberi &&
          item.kepala_unit_pemberi.toLowerCase().includes(value)) ||
        (item?.status_tte && item.status_tte.toLowerCase().includes(value)) ||
        (item?.jumlah_barang_diterima &&
          item.jumlah_barang_diterima.toLowerCase().includes(value)) ||
        (item?.jumlah_barang_dikirim &&
          item.jumlah_barang_dikirim.toLowerCase().includes(value)) ||
        (item?.nama_dokumen && item.nama_dokumen.toLowerCase().includes(value))
      );
    });

    setFilteredData(filtered);
  };

  const handleExport = () => {
    // Implementasi untuk mengekspor data (misalnya ke CSV)
    const exportData = filteredData?.map((item) => ({
      Provinsi: item?.provinsi,
      Kabupaten_Kota: item?.kabupaten,
      Kecamatan: item?.kecamatan,
      Puskesmas: item?.nama_puskesmas,
      Dokumen: item?.nama_dokumen,
      Program: item?.program,
      Batch: item?.batch,
      Tahun_Lokus: item?.tahun_lokus,
      BAST: item?.nomor_bast,
      Tanggal_Kirim: item?.tanggal_kirim,
      Tanggal_Terima: item?.tanggal_terima,
      Jumlah_Kirim: item?.jumlah_barang_dikirim,
      Jumlah_Terima: item?.jumlah_barang_diterima,
      Ket_Daerah: item?.keterangan_daerah,
      Ket_Ppk: item?.keterangan_ppk,
      Konfirmasi_Daerah:
        item?.konfirmasi_daerah == "1"
          ? "Sudah Konfirmasi"
          : "Belum Konfirmasi",
      Konfirmasi_Ppk:
        item?.konfirmasi_ppk == "1" ? "Sudah Konfirmasi" : "Belum Konfirmasi",
    }));
    const wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(exportData);

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

    XLSX.utils.book_append_sheet(wb, ws, `Data Distribusi`);
    XLSX.writeFile(wb, "Data Distribusi.xlsx");
  };
  const navigate = useNavigate();

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

  // Fetch distribution data
  const fetchDistribusiData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/distribusi`,
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
  }, [user?.token]);

  const handleSearchClick = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/search`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: {
          id_provinsi: selectedProvinsi?.value.toString() || "",
          id_kabupaten: selectedKota?.value.toString() || "",
          id_kecamatan: selectedKecamatan?.value.toString() || "",
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

  const fetchDokumen = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/getdokumen/0`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataDokumen(...response.data.data);
    } catch (error) {
      setError(true);
      setDataDokumen([]);
    }
  };

  useEffect(() => {
    fetchDistribusiData();
    fetchProvinsi();
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

  const deleteDistribusi = async (id) => {
    await axios({
      method: "delete",
      url: `${import.meta.env.VITE_APP_API_URL}/api/distribusi/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then(() => {
        fetchDistribusiData();
        setSearch("");

      })
      .catch((error) => {
        console.log(error);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleConfirmDeleteDistribusi = async (id) => {
    return Swal.fire({
      title: "Are you sure?",
      text: "You will Delete This Distribusi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#16B3AC",
    }).then(async (result) => {
      if (result.value) {
        await deleteDistribusi(id);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your Distribusi has been deleted.",
        });
      }
    });
  };
  const columns = useMemo(
    () => [
      // { name: "No", selector: (row) => row.id, sortable: true },
      // {
      //   name: "Nomor BAST",
      //   selector: (row) => row.nomor_bast,
      //   sortable: true,
      //   width: "100px",
      // },
      {
        name: <div className="text-wrap">Dokumen</div>,
        selector: (row) => row.nama_dokumen,
        sortable: true,
        cell: (row) => <div className="text-wrap py-2">{row.nama_dokumen}</div>,
        width: "120px",
      },
      {
        name: <div className="text-wrap">Provinsi</div>,
        selector: (row) => row.provinsi,
        sortable: true,
        cell: (row) => <div className="text-wrap py-2">{row.provinsi}</div>,
        width: "120px",
        omit: user.role == "3",
      },
      {
        name: <div className="text-wrap">Kab / Kota</div>,
        selector: (row) => row.kabupaten,
        cell: (row) => <div className="text-wrap py-2">{row.kabupaten}</div>,
        width: "120px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Kecamatan</div>,
        selector: (row) => row.kecamatan,
        cell: (row) => <div className="text-wrap py-2">{row.kecamatan}</div>,
        width: "110px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Puskesmas</div>,
        selector: (row) => row.nama_puskesmas,
        cell: (row) => (
          <div className="text-wrap py-2">{row.nama_puskesmas}</div>
        ),
        minWidth: "110px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Tahun Lokus</div>,
        selector: (row) => row.tahun_lokus,
        cell: (row) => <div className="text-wrap py-2">{row.tahun_lokus}</div>,
        sortable: true,
        width: "80px",
      },
      {
        name: <div className="text-wrap">Jumlah Dikirim</div>,
        selector: (row) => Number(row.jumlah_barang_dikirim) || 0,
        cell: (row) => (
          <div className="text-wrap py-2">{row.jumlah_barang_dikirim}</div>
        ),
        sortable: true,
        width: "100px",
      },
      {
        name: <div className="text-wrap">Jumlah Diterima</div>,
        selector: (row) => Number(row.jumlah_barang_diterima) || 0,
        cell: (row) => (
          <div className="text-wrap py-2">{row.jumlah_barang_diterima}</div>
        ),
        sortable: true,
        width: "100px",
      },
      {
        name: "Aksi",
        id: "Aksi",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            {user.role == "2" || user.role == "1" ? (
              row.konfirmasi_ppk != "1" ? (
                <button
                  title="Konfirmasi"
                  className="text-white font-semibold py-2 w-22 bg-red-500 rounded-md"
                  onClick={() => {
                    navigate(`/data-distribusi/edit/${row.id}`, {
                      replace: true,
                    });
                  }}
                >
                  <Link to={`/data-distribusi/edit/${row.id}`}>Konfirmasi</Link>
                </button>
              ) : (
                <button
                  title="Konfirmasi"
                  className="text-white font-semibold  py-2 w-22 bg-green-500 rounded-md"
                  onClick={() => {
                    navigate(`/data-distribusi/edit/${row.id}`, {
                      replace: true,
                    });
                  }}
                >
                  {/* <FaEdit size={16} /> */}
                  <Link to={`/data-distribusi/edit/${row.id}`}>
                    Sudah Konfirmasi
                  </Link>
                </button>
              )
            ) : user.role == "3" ? (
              row.konfirmasi_daerah != "1" ? (
                <button
                  title="Konfirmasi"
                  className="text-white font-semibold py-2 w-22 bg-red-500 rounded-md"
                  onClick={() => {
                    navigate(`/data-distribusi/edit/${row.id}`, {
                      replace: true,
                    });
                  }}
                >
                  <Link to={`/data-distribusi/edit/${row.id}`}>Konfirmasi</Link>
                </button>
              ) : (
                <button
                  title="Konfirmasi"
                  className="text-white font-semibold  py-2 w-22 bg-green-500 rounded-md"
                  onClick={() => {
                    navigate(`/data-distribusi/edit/${row.id}`, {
                      replace: true,
                    });
                  }}
                >
                  {/* <FaEdit size={16} /> */}
                  <Link to={`/data-distribusi/edit/${row.id}`}>
                    Sudah Konfirmasi
                  </Link>
                </button>
              )
            ) : (
              ""
            )}

            {user.role == "1" ? (
              <button
                title="Delete"
                className="text-red-500 hover:text-red-700 pr-4"
                onClick={() => handleConfirmDeleteDistribusi(row.id)}
              >
                <FaTrash size={16} />
              </button>
            ) : (
              ""
            )}
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        sortable: true,
        minWidth: "150px",
        selector: (row) =>
          user.role == "3" ? row.konfirmasi_daerah : row.konfirmasi_ppk,
      },
    ],
    []
  );

  useEffect(() => {
    if (user.role == "3") {
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
    if (user.role == "3" && user.provinsi && dataProvinsi.length > 0) {
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
      <Breadcrumb pageName="Data Distribusi" />
      <div className="flex flex-col items-center justify-center w-full tracking-tight mb-6">
        <h1 className="font-normal mb-3 text-xl lg:text-[28px] tracking-tight text-center text-bodydark1">
          DATA DISTRIBUSI
          {/* SELAMAT DATANG{" "}
          {user.role == "1"
            ? "ADMIN PUSAT"
            : user.role == "2"
            ? "ADMIN PPK"
            : user.role == "3"
            ? `ADMIN KAB/KOTA`
            : ""} */}
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
                isDisabled={user.role == "3"}
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
            <div>
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
              title="Export Data Distribusi"
              className="flex items-center gap-2 cursor-pointer text-base font-semibold text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
            {user.role == "1" ? (
              <button
                title="Tambah Data Distribusi"
                className="flex items-center gap-2 cursor-pointer text-base font-semibold text-white  bg-primary rounded-md tracking-tight"
              >
                <Link
                  to="/data-distribusi/add"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <FaPlus size={16} />
                  <span className="hidden sm:block">
                    Tambah Data Distribusi
                  </span>
                </Link>
              </button>
            ) : (
              ""
            )}
            {user.role == "3" && dataDokumen.length > 0 ? (
              <button
                title="Tandatangani Dokumen BMN"
                className="flex items-center gap-2 cursor-pointer text-base font-semibold text-white  bg-teal-600 rounded-md tracking-tight"
              >
                <Link
                  to={`/dokumen`}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <FaCheck size={16} />
                  <span className="hidden sm:block">
                    Tandatangani Dokumen BMN
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

export default DataDistribusi;
