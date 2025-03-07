import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Select from "react-select";
import DataTable from "react-data-table-component";
import {
  dataDistribusiBekasi,
  dataKecamatan,
  dataKota,
  dataProvinsi,
} from "../../data/data";
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
import ModalTTE from "../../components/Modal/ModalTTE";
import GenerateDokumen from "../../components/Dokumen/GenerateDokumen";
import ModalUploadDokumen from "../../components/Modal/ModalUploadDokumen";
import { differenceBy } from "lodash";
import ModalTTENew from "../../components/Modal/ModalTTENew";
import * as XLSX from "xlsx";

const DokumenDistributor = () => {
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
  });

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      if (
        window.confirm(
          `Apakah Anda Mau TTE Dokumen:\r ${selectedRows.map(
            (r) => r.nama_dokumen
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared);
        setData(differenceBy(filteredData, selectedRows, "nama_dokumen"));
        handleTTE();
      }
    };

    const handleReset = () => {
      setToggleCleared(!toggleCleared);
      setSelectedRows([]);
    };

    return (
      <div className="flex items-center gap-2">
        <button
          key="delete"
          onClick={() => handleReset()}
          className="p-2 bg-red-500 rounded-md text-white text-base"
          icon
        >
          Reset
        </button>
        <button
          key="delete"
          onClick={handleDelete}
          className="p-2 bg-teal-500 rounded-md text-white text-base"
          icon
        >
          TTE Dokumen
        </button>
      </div>
    );
  }, [filteredData, selectedRows, toggleCleared]);

  const handleTTE = async (e, id, nama_dokumen) => {
    // e.preventDefault();
    // setShowModal(true);
    setShowPopup(true);
    setJsonData({
      id: id,
      nama_dokumen: nama_dokumen,
    });
  };

  const handleModalDokumen = async (e, id, nama_dokumen) => {
    e.preventDefault();
    setShowModalUpload(true);
    setJsonData({
      id: id,
      nama_dokumen: nama_dokumen,
    });
  };

  const fetchDokumenData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/dokumen`,
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
        url: `${import.meta.env.VITE_APP_API_URL}/api/searchdoc`,
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

  const handleDownload = async (id) => {
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
        }/api/dokumen/${encodeURIComponent(id)}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = response.data.data;
      // Lakukan proses generate dokumen berdasarkan data JSON yang diterima
      let dataJson = {
        nama_dokumen: data.nama_dokumen || "",
        id: data.id,
        nomorSurat: data.nomor_bast || "",
        tanggal: data.tanggal_bast || defaultDate,
        tanggal_tte_ppk: data.tanggal_tte_ppk || defaultDate,
        tanggal_tte_daerah: data.tanggal_tte_daerah || defaultDate,
        kecamatan: data.kecamatan,
        puskesmas: data.Puskesmas,
        namaKapus: data.nama_kapus,
        provinsi: data.provinsi || "",
        kabupaten: data.kabupaten || "",
        penerima_hibah: data.penerima_hibah || "",
        kepala_unit_pemberi: data.kepala_unit_pemberi || "",
        distribusi: data.distribusi || [],
        nipKapus: "nip.121212",
        namaBarang: data.nama_barang,
        status_tte: data.status_tte || "",
        jumlahDikirim: "24",
        jumlahDiterima: "24",
        tte: "",
        tteDaerah: {
          image_url:
            "https://www.shutterstock.com/image-vector/fake-autograph-samples-handdrawn-signatures-260nw-2332469589.jpg",
          width: 50,
          height: 50,
        },
        ket_daerah: "",
        ket_ppk: data.keterangan_ppk,
        tte_daerah: data.tte_daerah || defaultImage,
        nama_daerah: data.nama_daerah || "",
        nip_daerah: data.nip_daerah || "",
        tte_ppk: data.tte_ppk || defaultImage,
        nama_ppk: data.nama_ppk || "",
        nip_ppk: data.nip_ppk || "",
        total_barang_dikirim: data.total_barang_dikirim || "",
        total_harga: data.total_harga || "",
        file_dokumen: data.file_dokumen || null,
      };

      if (dataJson?.file_dokumen) {
        try {
          const response = await fetch(dataJson?.file_dokumen);
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          const blob = await response.blob();
          const fileName = dataJson?.nama_dokumen
            ? `${dataJson.nama_dokumen}.pdf`
            : "dokumen.pdf";
          saveAs(blob, fileName);
        } catch (error) {
          console.error("Failed to download file:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Gagal Download Dokumen",
          });
        }
      } else {
        if (user.role == "3") {
          if (!user.name || !user.nip) {
            Swal.fire("Error", "Anda Belum Input Nama / NIP", "error");
            navigate("/profile");
            setLoading(false);
            return;
          }
          dataJson.nama_daerah = user.name;
          dataJson.nip_daerah = user.nip;
        }
        const distributor = "true";
        const pdfBlob = await GenerateDokumen(dataJson, distributor); // GenerateDokumen harus mengembalikan Blob PDF

        saveAs(pdfBlob, `${dataJson.nama_dokumen}.pdf`);
      }

      Swal.fire({
        icon: "success",
        title: "Download Complete",
        text: "Dokumen Sukses Di Download",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal Download Dokumen",
      });
      console.log(error);
    }
  };

  const columns = useMemo(
    () => [
      // { name: "No", selector: (row) => row.id, sortable: true },
      {
        name: <div className="text-wrap">Nama Dokumen</div>,
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
      },
      {
        name: <div className="text-wrap">Kab / Kota</div>,
        selector: (row) => row.kabupaten,
        cell: (row) => <div className="text-wrap py-2">{row.kabupaten}</div>,
        width: "120px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Nomor BAST</div>,
        selector: (row) => row.nomor_bast,
        cell: (row) => <div className="text-wrap py-4">{row.nomor_bast}</div>,
        sortable: true,

        // width: "100px",
      },
      // {
      //   name: "Tanggal BAST",
      //   selector: (row) => row.tanggal_bast,
      //   sortable: true,
      //   // width: "100px",
      // },
      {
        name: <div className="text-wrap">Tahun Lokus</div>,
        selector: (row) => row.tahun_lokus,
        cell: (row) => <div className="text-wrap py-2">{row.tahun_lokus}</div>,
        sortable: true,
        width: "100px",
      },
      // {
      //   name: "Kepala Unit Pemberi",
      //   selector: (row) => row.kepala_unit_pemberi,
      //   sortable: true,
      //   // width: "100px",
      // },
      // {
      //   name: "Penerima Hibah",
      //   selector: (row) => row.penerima_hibah,
      //   sortable: true,
      //   // width: "100px",
      // },

      // {
      //   name: "Keterangan PPK Kemenkes",
      //   selector: (row) => row.keterangan_ppk,
      //   sortable: true,
      // },
      {
        name: <div className="text-wrap">Dokumen BAST</div>,
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
            <button
              title="Lihat"
              className="text-[#16B3AC] hover:text-cyan-500"
            >
              <Link
                to={`/dokumen/preview-dokumen/${encodeURIComponent(
                  encryptId(row.id)
                )}`}
              >
                <FaEye size={20} />
              </Link>
            </button>
            <button
              title="Download"
              className="text-green-400 hover:text-green-500"
              onClick={() => handleDownload(row.id)} // Tambahkan handler download di sini
            >
              <FaDownload size={20} />
            </button>
            {/* {user.role == "2" || user.role == "3" || user.role == "4" ? (
              <button
                title="Upload Dokumen"
                className="text-white py-2 w-20 bg-teal-500 rounded-md"
                onClick={(e) => handleModalDokumen(e, row.id, row.nama_dokumen)}
              >
                Upload Dokumen
              </button>
            ) : (
              ""
            )} */}
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: "80px",
      },
    ],
    []
  );

  const handleExport = () => {
    // Implementasi untuk mengekspor data (misalnya ke CSV)
    const exportData = filteredData?.map((item) => ({
      Dokumen: item?.nama_dokumen,
      Provinsi: item?.provinsi,
      Kabupaten_Kota: item?.kabupaten,
      Program: item?.program,
      Batch: item?.batch,
      Tahun_Lokus: item?.tahun_lokus,
      BAST: item?.nomor_bast,
      Tanggal_BAST: item?.tanggal_bast,
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

    XLSX.utils.book_append_sheet(wb, ws, `Data Dokumen`);
    XLSX.writeFile(wb, "Data Dokumen.xlsx");
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
      <Breadcrumb pageName="Dokumen TTE" linkBack="/dokumen" />
      <div className="flex flex-col items-center justify-center w-full tracking-tight mb-12">
        <h1 className="font-normal mb-3 text-xl lg:text-[28px] tracking-tight text-center text-bodydark1">
          DATA DOKUMEN DISTRIBUTOR
        </h1>
        <div className="flex items-center lg:items-end mt-8 gap-4 flex-col lg:flex-row">
          <div className="flex items-center gap-4 flex-col sm:flex-row">
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
                htmlFor="kota"
              >
                Status TTE
              </label>
              <Select
                options={[
                  { label: "Sudah TTE", value: 1 },
                  { label: "Belum TTE", value: 0 },
                ]}
                value={selectedStatus}
                onChange={(status) => {
                  setSelectedStatus(status);
                }}
                className="w-64 sm:w-32 xl:w-60"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "lightgrey",
                    primary: "grey",
                  },
                })}
                placeholder={"Pilih Status TTE"}
              />
            </div>
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
                isDisabled={user.role == "3" || !selectedKota}
                placeholder={
                  selectedKota ? "Pilih Kecamatan" : "Pilih Kab / Kota Dahulu"
                }
              />
            </div> */}
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
          <div className="div flex gap-2 flex-row font-semibold">
            <button
              title="Export Data Distribusi"
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
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
              title={selectedRows.length > 0 ? "Data Dokumen" : ""}
              columns={columns}
              data={filteredData}
              pagination
              persistTableHead
              highlightOnHover
              // selectableRows
              // contextActions={contextActions}
              // onSelectedRowsChange={handleRowSelected}
              // clearSelectedRows={toggleCleared}
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

export default DokumenDistributor;
