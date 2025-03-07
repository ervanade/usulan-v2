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
import { selectThemeColors } from "../../data/utils";
import { FaCheck, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { BiExport, BiSolidFileExport } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ModalConfirmPPK from "../../components/Modal/ModalConfirmPPK";

const DetailDistribusi = () => {
  const user = useSelector((a) => a.auth.user);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedRowData, setSelectedRowData] = useState(null);

  const columns = useMemo(
    () => [
      // { name: "No", selector: (row) => row.id, sortable: true },
      {
        name: "Provinsi",
        selector: (row) => row.provinsi,
        sortable: true,
        width: "100px",
      },
      {
        name: "Kab/Kota",
        selector: (row) => row.kab_kota,
        sortable: true,
        width: "100px",
      },
      { name: "Kecamatan", selector: (row) => row.kecamatan, sortable: true },
      { name: "Puskesmas", selector: (row) => row.Puskesmas, sortable: true },
      { name: "Nama Kapus", selector: (row) => row.nama_kapus, sortable: true },
      {
        name: "Nama Barang",
        selector: (row) => row.nama_barang,
        sortable: true,
      },
      {
        name: "Jumlah Barang Dikirim",
        selector: (row) => row.jumlah_barang_dikirim,
        sortable: true,
      },
      {
        name: "Jumlah Barang Diterima",
        selector: (row) => row.jumlah_barang_diterima,
        sortable: true,
      },
      {
        name: "Status TTE",
        selector: (row) => row.status_tte,
        sortable: true,
        width: "110px",
      },
      {
        name: "Keterangan PPK Kemenkes",
        selector: (row) => row.keterangan_ppk,
        sortable: true,
      },
      {
        name: "Aksi",
        width: "150px",
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
            {/* <button title="Edit" className="text-[#16B3AC] hover:text-cyan-500">
              <Link to={`/data-distribusi/edit/${row.id}`}>
                <FaEdit size={16} />
              </Link>
            </button> */}
            {row.status_tte == "Belum" ? (
              <button
                title="Konfirmasi"
                className="text-white py-2 w-22 bg-red-500 rounded-md"
                onClick={() => {
                  setShowModal(true);
                  setSelectedRowData(row);
                }}
              >
                {/* <FaEdit size={16} /> */}
                Konfirmasi
              </button>
            ) : (
              <button
                title="Konfirmasi"
                className="text-white  py-2 w-22 bg-green-500 rounded-md"
                onClick={() => {
                  setShowModal(true);
                  setSelectedRowData(row);
                }}
              >
                {/* <FaEdit size={16} /> */}
                Sudah Sesuai
              </button>
            )}
            {user.role == "1" ? (
              <button
                title="Delete"
                className="text-red-500 hover:text-red-700"
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
      },
    ],
    []
  );

  const [search, setSearch] = useState("");
  const [dataKecamatanState, setDataKecamatanState] = useState([
    { label: "Semua Kecamatan", value: "all" },
    ...dataKecamatan,
  ]);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [filteredData, setFilteredData] = useState(dataDistribusiBekasi);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filtered = dataDistribusiBekasi.filter(
      (item) =>
        item.provinsi.toLowerCase().includes(value) ||
        item.kab_kota.toLowerCase().includes(value) ||
        item.kecamatan.toLowerCase().includes(value) ||
        item.Puskesmas.toLowerCase().includes(value) ||
        item.nama_kapus.toLowerCase().includes(value) ||
        item.nama_barang.toLowerCase().includes(value) ||
        item.jumlah_barang_dikirim.toString().includes(value) ||
        item.jumlah_barang_diterima.toString().includes(value) ||
        item.status_tte.toLowerCase().includes(value) ||
        item.keterangan_ppk.toLowerCase().includes(value)
    );

    if (selectedKecamatan) {
      selectedKecamatan.value != "all"
        ? setFilteredData(
            filtered.filter((item) => item.kecamatan == selectedKecamatan.label)
          )
        : setFilteredData(filtered);
    } else {
      setFilteredData(filtered);
    }
  };

  const handleExport = () => {
    // Implementasi untuk mengekspor data (misalnya ke CSV)
  };
  const { id } = useParams();

  useEffect(() => {
    const data = dataDistribusiBekasi.filter((a) => a.Puskesmas == id);
    setFilteredData(data);
    if (!data) {
      navigate("/not-found");
    }
  }, []);

  return (
    <div>
      <Breadcrumb
        pageName="Data Distribusi Detail"
        title="Data Distribusi Detail"
      />
      {/* <div className="flex flex-col items-center justify-center w-full tracking-tight mb-12">
        <h1 className="font-normal mb-3 text-xl lg:text-[28px] tracking-tight text-center text-bodydark1">
          SELAMAT DATANG ADMIN KAB/KOTA KOTA BEKASI
        </h1>
        <ModalConfirmPPK
          showModal={showModal}
          setShowModal={setShowModal}
          Title="Form Input BAST PPK"
          data={selectedRowData}
        ></ModalConfirmPPK>
        <div className="mt-8 mb-3">
          <label
            className="block text-[#728294] text-lg font-normal mb-2"
            htmlFor="email"
          >
            Provinsi
          </label>
          <Select
            options={dataProvinsi}
            defaultValue={dataProvinsi[0]}
            className="w-64 sm:w-100 bg-slate-500 my-react-select-container"
            classNamePrefix="my-react-select"
            theme={selectThemeColors}
            isDisabled={user.role == "3"}
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-[#728294] text-lg font-normal mb-2"
            htmlFor="email"
          >
            Kab / Kota
          </label>
          <Select
            options={dataKota}
            defaultValue={dataKota[0]}
            className="w-64 sm:w-100"
            theme={selectThemeColors}
            isDisabled={user.role == "3"}
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-[#728294] text-lg font-normal mb-2"
            htmlFor="email"
          >
            Kecamatan
          </label>
          <Select
            options={dataKecamatanState}
            defaultValue={dataKecamatanState[0]}
            onChange={setSelectedKecamatan}
            className="w-64 sm:w-100"
            theme={selectThemeColors}
          />
        </div>
        <button
          onClick={handleSearch}
          className="cursor-pointer mt-8 text-lg text-white px-8 py-2 bg-primary rounded-md tracking-tight"
        >
          Cari Data
        </button>
      </div> */}
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
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
            {user.role == "1" ? (
              <button
                title="Tambah Data Distribusi"
                className="flex items-center gap-2 cursor-pointer text-base text-white  bg-primary rounded-md tracking-tight"
                onClick={handleExport}
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
          </div>
        </div>
        <div className="overflow-x-auto">
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
                  backgroundColor: "#EBFBFA",
                  color: "#728294",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailDistribusi;
