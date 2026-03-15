import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.jsx";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { encryptId } from "../../data/utils";
import { FaPlus, FaSearch } from "react-icons/fa";
import { BiExport } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";
import { useUsulan } from "../../hooks/useUsulan";
import { useProvinsi, useKabupaten, useKecamatan } from "../../hooks/useRegion";
import { filterUsulan } from "../../api/services/usulanService";
import axiosInstance from "../../api/axiosInstance";
import ModalVerifikasiUsulan from "../../components/Modal/ModalVerifikasiUsulan";

const UsulanAlkes = () => {
  const user = useSelector((state) => state.auth.user);
  const { usulan: initialData, isLoading: usulanLoading, mutate: mutateUsulan } = useUsulan();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [showModalVerif, setShowModalVerif] = useState(false);
  const [selectedDataVerif, setSelectedDataVerif] = useState(null);

  const { data: dataProvinsiRaw } = useProvinsi();
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const { data: dataKotaRaw } = useKabupaten(selectedProvinsi?.value);
  const [selectedKota, setSelectedKota] = useState(null);
  const { data: dataKecamatanRaw } = useKecamatan(selectedKota?.value);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);

  const dataProvinsi = useMemo(() => {
    if (!dataProvinsiRaw) return [];
    return [
      { label: "Semua Provinsi", value: "" },
      ...dataProvinsiRaw.map((item) => ({ label: item.name, value: item.id })),
    ];
  }, [dataProvinsiRaw]);

  const dataKota = useMemo(() => {
    if (!dataKotaRaw) return [];
    return [
      { label: "Semua Kabupaten/Kota", value: "" },
      ...dataKotaRaw.map((item) => ({ label: item.name, value: item.id })),
    ];
  }, [dataKotaRaw]);

  const dataKecamatan = useMemo(() => {
    if (!dataKecamatanRaw) return [];
    return [
      { label: "Semua Kecamatan", value: "" },
      ...dataKecamatanRaw.map((item) => ({ label: item.name, value: item.id })),
    ];
  }, [dataKecamatanRaw]);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setFilteredData(initialData);
    }
  }, [initialData]);

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

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const exportData = filteredData?.map((item) => ({
      Puskesmas: item?.nama_puskesmas,
      Provinsi: item?.provinsi,
      Kabupaten_Kota: item?.kabupaten,
      Kecamatan: item?.kecamatan,
      Kode_Puskesmas: item?.kode_pusdatin_baru,
      Status_Pelayanan: item?.pelayanan,
      Kapasitas_Listrik: item?.kapasitas_listrik,
      Ketersediaan_Listrik: item?.ketersediaan_listrik,
      Internet: item?.internet,
    }));
    const wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(exportData);

    ws["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, `Data Usulan Alkes`);
    XLSX.writeFile(wb, "Data Usulan Alkes.xlsx");
  };

  const navigate = useNavigate();

  const handleSearchClick = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await filterUsulan({
        id_provinsi: selectedProvinsi?.value.toString() || "",
        id_kabupaten: selectedKota?.value.toString() || "",
        id_kecamatan: selectedKecamatan?.value.toString() || "",
      });
      setFilteredData(result);
      setData(result);
    } catch (error) {
      setError(true);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinsiChange = (selectedOption) => {
    setSelectedProvinsi(selectedOption);
    setSelectedKota(null);
    setSelectedKecamatan(null);
  };

  const handleKotaChange = (selectedOption) => {
    setSelectedKota(selectedOption);
    setSelectedKecamatan(null);
  };

  const handleKecamatanChange = (selectedOption) => {
    setSelectedKecamatan(selectedOption);
  };

  const deleteDistribusi = async (id) => {
    try {
      await axiosInstance.delete(`/api/distribusi/${id}`);
      mutateUsulan();
      setSearch("");
    } catch (error) {
      console.log(error);
    }
  };

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
      {
        name: <div className="text-wrap">Nama Puskesmas</div>,
        selector: (row) => row.nama_puskesmas,
        cell: (row) => (
          <div className="text-wrap py-2">{row.nama_puskesmas}</div>
        ),
        minWidth: "110px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Kecamatan</div>,
        selector: (row) => row.kecamatan,
        cell: (row) => <div className="text-wrap py-2">{row.kecamatan}</div>,
        width: "120px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Kab / Kota</div>,
        selector: (row) => row.kabupaten,
        cell: (row) => <div className="text-wrap py-2">{row.kabupaten}</div>,
        width: "150px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Provinsi</div>,
        selector: (row) => row.provinsi,
        sortable: true,
        cell: (row) => <div className="text-wrap py-2">{row.provinsi}</div>,
        width: "150px",
        omit: user.role == "3",
      },
       {
        name: <div className="text-wrap">Periode</div>,
        selector: (row) => row.periode_name,
        sortable: true,
        cell: (row) => (
          <div className="text-wrap text-xs py-2">{row.periode_name}</div>
        ),
        width: "80px",
      },

      // {
      //   name: <div className="text-wrap">Jumlah Dikirim</div>,
      //   selector: (row) => Number(row.jumlah_barang_dikirim) || 0,
      //   cell: (row) => (
      //     <div className="text-wrap py-2">{row.jumlah_barang_dikirim}</div>
      //   ),
      //   sortable: true,
      //   width: "100px",
      // },
      // {
      //   name: <div className="text-wrap">Jumlah Diterima</div>,
      //   selector: (row) => Number(row.jumlah_barang_diterima) || 0,
      //   cell: (row) => (
      //     <div className="text-wrap py-2">{row.jumlah_barang_diterima}</div>
      //   ),
      //   sortable: true,
      //   width: "100px",
      // },
           {
        name: <div className="text-wrap">Status Verifikasi</div>,
        selector: (row) => row.provinsi,
        sortable: true,
        cell: (row) => (
          <div className="text-wrap py-2">
            {row.status_verifikasi == "3" ? (
              <div className="text-white py-1 px-2 bg-green-600 rounded-md text-xs">
                Perlu Revisi
              </div>
            ) : row.status_verifikasi == "2" ? (
              <div className="text-white py-1 px-2 bg-yellow-600 rounded-md text-xs">
                Sudah Verifikasi
              </div>
            ) : row.status_verifikasi == "1" ? (
              <div className="text-white py-1 px-2 bg-red-600 rounded-md text-xs">
                Belum Verifikasi
              </div>
            ) : (
              <div className="text-white py-1 px-2 bg-slate-500 rounded-md text-xs">
                Belum Mengisi
              </div>
            )}
          </div>
        ),
        width: "150px",
        // omit: user.role == "3",
      },
      {
        name: "Aksi",
        id: "Aksi",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <button
              title="Detail"
              className="text-white font-semibold py-2 w-18 bg-primary rounded-md text-xs"
              onClick={() => {
                navigate(
                  `/usulan-alkes/edit/${encodeURIComponent(encryptId(row?.id_puskesmas))}`,
                  {
                    replace: true,
                  }
                );
              }}
            >
              <Link
                to={`/usulan-alkes/edit/${encodeURIComponent(
                  encryptId(row?.id_puskesmas)
                )}`}
              >
                Detail
              </Link>
            </button>
            {(row.status_verifikasi == "1" && (user.role == "1" || user.role == "2")) && (
              <button
                title="Verifikasi"
                className="text-white font-semibold py-2 w-18 bg-[#16B3AC] rounded-md px-2 text-xs"
                onClick={() => {
                  setSelectedDataVerif(row);
                  setShowModalVerif(true);
                }}
              >
                Verifikasi
              </button>
            )}
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        sortable: true,
        minWidth: "160px",
        selector: (row) =>
          user.role == "3" ? row.konfirmasi_daerah : row.konfirmasi_ppk,
      },
    ],
    []
  );

  // Fetch provinces and cities based on selected options
  // useEffect(() => {
  //   fetchProvinsi();
  //   if (selectedProvinsi) {
  //     fetchKota(selectedProvinsi.value);
  //   }
  // }, [fetchProvinsi, selectedProvinsi, fetchKota]);

  // Fetch subdistricts based on the selected city
  // useEffect(() => {
  //   if (selectedKota) {
  //     fetchKecamatan(selectedKota.value);
  //   }
  // }, [selectedKota, fetchKecamatan]);

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

  if (usulanLoading) {
    return (
      <div className="flex justify-center items-center">
        <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb pageName="Usulan Alkes" />
      <div className="flex flex-col items-center justify-center w-full tracking-tight mb-6">
        <h1 className="font-medium mb-3 text-xl lg:text-[28px] tracking-tight text-center text-bodydark1">
          USULAN ALKES
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
              title="Export Data Usulan Alkes"
              className="flex items-center gap-2 cursor-pointer text-base font-semibold text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
            {user.role == "1" ? (
              <button
                title="Tambah Usulan Alkes"
                className="flex items-center gap-2 cursor-pointer text-base font-semibold text-white  bg-primary rounded-md tracking-tight"
              >
                <Link
                  to="/master-data-barang/add"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <FaPlus size={16} />
                  <span className="hidden sm:block">Tambah Usulan Alkes</span>
                </Link>
              </button>
            ) : (
              ""
            )}
            {/* {user.role == "3" && dataDokumen.length > 0 ? (
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
            )} */}
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
                    backgroundColor: "#0FAD91", // Warna header biru
                    color: "#fff", // Teks header putih
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
              onRowClicked={(row) => {
                navigate(
                  `/usulan-alkes/edit/${encodeURIComponent(encryptId(row?.id_puskesmas))}`,
                  {
                    replace: true,
                  }
                );
              }}
            />
          )}
        </div>
      </div>
      <ModalVerifikasiUsulan
        show={showModalVerif}
        onClose={() => setShowModalVerif(false)}
        data={selectedDataVerif}
        onSave={() => mutateUsulan()}
      />
    </div>
  );
};

export default UsulanAlkes;
