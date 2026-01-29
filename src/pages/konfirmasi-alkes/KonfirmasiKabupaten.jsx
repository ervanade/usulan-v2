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
import GenerateVerif from "../../components/Dokumen/GenerateVerif.jsx";
import { allowedKabupaten, EXCEL_HEADER } from "../../data/data.js";
import { MdClose } from "react-icons/md";

const KonfirmasiKabupaten = () => {
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
  const [dataPeriode, setDataPeriode] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedProvinsiLaporan, setSelectedProvinsiLaporan] = useState(null);
  const [exportAll, setExportAll] = useState(false);
  const [exportLimit, setExportLimit] = useState(1000);
  const [exportLoading, setExportLoading] = useState(false);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPeriode, setSelectedPeriode] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [uploadTypeModal, setUploadTypeModal] = useState(null); // State untuk tipe upload modal
  const [showModalUpload, setShowModalUpload] = useState(false);
  const [jsonData, setJsonData] = useState({
    id: "",
    nama_dokumen: "",
    kabupaten: "",
    dokumen_array: [],
  });

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);

  const showExportProgress = () => {
    Swal.fire({
      title: "Sedang Mengekspor Data",
      html: `
      <div style="width:100%; background:#e5e7eb; border-radius:6px; height:8px; overflow:hidden">
        <div id="export-progress" style="
          height:8px;
          width:0%;
          background:#2563eb;
          transition: width .3s ease;
        "></div>
      </div>
      <p style="font-size:12px;color:#64748b;margin-top:8px">
        Progress: <span id="progress-text">0%</span>
      </p>
    `,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
  };

  const updateProgress = (percent) => {
    const bar = document.getElementById("export-progress");
    const text = document.getElementById("progress-text");

    if (bar) bar.style.width = `${percent}%`;
    if (text) text.innerText = `${percent}%`;
  };

  const handleModalDokumen = async (
    e,
    id,
    nama_dokumen,
    kabupaten,
    type = null,
  ) => {
    e.preventDefault();
    setShowModalUpload(true);
    setJsonData({
      id: id,
      nama_dokumen: nama_dokumen,
      kabupaten: kabupaten,
    });
    setUploadTypeModal(type); // Set tipe upload saat modal dibuka
  };

  const fetchDokumenData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/konfirmasiheader`,
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

  useEffect(() => {
    fetchDokumenData();
    fetchBarang();
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
    [dataKota.length, selectedProvinsi?.value, user?.token],
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
    [dataKecamatan.length, selectedKota?.value, user?.token],
  );

  const fetchPeriode = async () => {
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
        { label: "Semua Periode", value: "" },
        ...response.data.data.map((item) => ({
          label: item.periode_name,
          value: item.id,
          stat: item.stat,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataPeriode([]);
    }
  };
  useEffect(() => {
    fetchProvinsi();
    fetchUserData();
    fetchPeriode();
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

  const handlePeriodeChange = (selectedOption) => {
    setSelectedPeriode(selectedOption);
  };

  const handleKecamatanChange = (selectedOption) => {
    setSelectedKecamatan(selectedOption);
  };

  const handleBarangChange = (selectedOption) => {
    setSelectedBarang(selectedOption);
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
        (item?.nama_provinsi &&
          item.nama_provinsi.toLowerCase().includes(value)) ||
        (item?.nama_kabupaten &&
          item.nama_kabupaten.toLowerCase().includes(value)) ||
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
        url: `${import.meta.env.VITE_APP_API_URL}/api/konfirmasiheader/filter`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: {
          id_provinsi: selectedProvinsi?.value.toString() || "",
          id_kabupaten: selectedKota?.value.toString() || "",
          periode_id: selectedPeriode?.value.toString() || "",
          id_alkes: selectedBarang?.value.toString() || "",
          tanggal_from: dateFrom || "",
          tanggal_to: dateTo || "",
        },
      });
      let dataResponse = response.data.data;

      if (selectedStatus) {
        dataResponse =
          selectedStatus.value == 0
            ? dataResponse.filter((a) => a.status_tte == "0")
            : dataResponse.filter(
                (a) => a.status_tte == "1" || a.status_tte == "2",
              );
      }

      setFilteredData(dataResponse);
      setData(dataResponse);
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
        (prov) => prov.value == user.provinsi,
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
        (prov) => prov.value == user.kabupaten,
      );
      if (initialOption) {
        setSelectedKota({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }
  }, [user.role, user.provinsi, user.kabupaten, dataProvinsi, dataKota]);

  const updateDownload = async (id, type = "proposal") => {
    setLoading(true);
    let urlDownload;
    if (type === "chr") {
      urlDownload = "downloadchr";
    } else if (type === "chp") {
      urlDownload = "downloadchp";
    } else if (type === "baverif") {
      urlDownload = "downloadverif";
    } else {
      urlDownload = "download";
    }
    try {
      const response = await axios({
        method: "post",
        url: `${
          import.meta.env.VITE_APP_API_URL
        }/api/usulan/${encodeURIComponent(urlDownload)}/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      fetchDokumenData();
      setSearch("");
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

      saveAs(pdfBlob, `Dokumen Usulan ${dataJson.kabupaten}.pdf`);
      await updateDownload(dataJson?.id, "proposal");

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

  const handleBaVerif = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda ingin mendownload ba verifikasi. Lanjutkan?",
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
        }/api/usulanverif/${encodeURIComponent(id)}`,
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
        ba_verif: data.ba_verif || [],
      };
      const pdfBlob = await GenerateVerif(dataJson, false); // GenerateDokumen harus mengembalikan Blob PDF

      saveAs(pdfBlob, `BA Verifikasi ${dataJson.kabupaten}.pdf`);
      await updateDownload(dataJson?.id, "baverif");

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

  const handleBukaUpload = async (id, type = "proposal") => {
    try {
      Swal.fire({
        title: "Download dokumen...",
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
        }/api/konfirmasiheader/${encodeURIComponent(id)}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = response.data.data;
      // Lakukan proses generate dokumen berdasarkan data JSON yang diterima
      let fileUrl;
      let fileNamePrefix = "Dokumen Upload Usulan";
      let dataJson = {
        id: data.id,
        kecamatan: data.kecamatan,
        provinsi: data.provinsi || "",
        kabupaten: data.kabupaten || "",
        file_upload: data.file_upload || null,
        file_chr: data.file_chr || null,
        file_chp: data.file_chp || null,
        file_verifikasi: data.file_verifikasi || null,
        file_konfirmasi: data.doc_konfirmasi || null,
      };

      if (type === "chr") {
        fileUrl = dataJson?.file_chr;
        fileNamePrefix = "Dokumen CHR";
      } else if (type === "chp") {
        fileUrl = dataJson?.file_chp;
        fileNamePrefix = "Dokumen CHP";
      } else if (type === "baverif") {
        fileUrl = dataJson?.file_verifikasi;
        fileNamePrefix = "Dokumen BA Verifikasi";
      } else if (type === "konfirmasi") {
        fileUrl = dataJson?.file_konfirmasi;
        fileNamePrefix = "Dokumen Konfirmasi";
      } else {
        fileUrl = dataJson?.file_upload;
      }

      if (fileUrl) {
        try {
          // Menggunakan axios untuk mengambil file
          const response = await axios.get(fileUrl, {
            responseType: "blob", // Mengatur respons sebagai blob (file)
          });

          // Mendapatkan file blob dari respons
          const blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });

          // Menentukan nama file
          const fileName = dataJson?.kabupaten
            ? `${fileNamePrefix} ${dataJson.kabupaten}.pdf`
            : `${fileNamePrefix}.pdf`;

          // Menggunakan file-saver untuk menyimpan file
          saveAs(blob, fileName);

          // Menampilkan notifikasi sukses
          Swal.fire({
            icon: "success",
            title: "Download Complete",
            text: "Dokumen Upload Sukses Di Download",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Failed to download file:", error);

          // Menampilkan notifikasi gagal
          Swal.fire({
            icon: "error",
            title: "Gagal Download Dokumen",
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

  useEffect(() => {
    if (dataPeriode.length > 0) {
      const initialOption = dataPeriode.find((kec) => kec.stat == "1");
      if (initialOption) {
        setSelectedPeriode({
          label: initialOption.label,
          value: initialOption.value,
          stat: initialOption.stat,
        });
      }
    }
  }, [dataPeriode]);

  const columns = useMemo(
    () => [
      {
        name: <div className="text-wrap">Provinsi</div>,
        selector: (row) => row.provinsi,
        sortable: true,
        cell: (row) => (
          <div className="text-wrap py-2">{row.nama_provinsi}</div>
        ),
        width: "120px",
      },
      {
        name: <div className="text-wrap">Kab / Kota</div>,
        selector: (row) => row.id_kabupaten,
        cell: (row) => (
          <div className="text-wrap py-2">{row.nama_kabupaten}</div>
        ),
        minWidth: "120px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Nama Alkes</div>,
        selector: (row) => row.nama_barang,
        cell: (row) => <div className="text-wrap py-2">{row.nama_barang}</div>,
        minWidth: "110px",
        sortable: true,
      },
      {
        name: <div className="text-wrap">Periode</div>,
        selector: (row) => row.nama_barang,
        cell: (row) => <div className="text-wrap py-2">{row.periode}</div>,
        minWidth: "110px",
        sortable: true,
      },

      {
        name: <div className="text-wrap px-1">Dokumen Konfirmasi</div>,
        cell: () => (
          <div className="flex items-center justify-center">
            <a
              href="https://docs.google.com/document/d/1mtfLgWaJ018jbxUD2ox_0axIFQMg9jTM/edit"
              title="Download Dokumen Konfirmasi"
              className="text-white bg-cyan-600 hover:bg-cyan-700 py-1 px-3 rounded-md font-medium text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
              <br />
              Dokumen
            </a>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        minWidth: "120px",
      },
      {
        name: <div className="text-wrap px-1">Upload Dokumen Konfirmasi</div>,
        selector: (row) =>
          row?.doc_konfirmasi && row?.doc_konfirmasi ? "Sudah" : "Belum",
        sortable: true,
        cell: (row) => {
          const isAllowed =
            (user?.role == "1" && row?.stat) ||
            (allowedKabupaten.includes(row.id_kabupaten) && row?.stat);
          return (
            <div className="flex flex-col items-center space-y-1">
              {!row?.doc_konfirmasi ? (
                <button
                  title="Upload Dokumen"
                  className="text-white py-1 px-2 bg-primary rounded-md text-xs"
                  disabled={!isAllowed}
                  style={{ display: isAllowed ? "block" : "none" }}
                  onClick={(e) =>
                    handleModalDokumen(
                      e,
                      row.id,
                      `Dokumen Konfirmasi ${row.nama_kabupaten}`,
                      row.nama_kabupaten,
                      "konfirmasi",
                    )
                  }
                >
                  Upload
                  <br />
                  Dokumen
                </button>
              ) : (
                <div className="flex space-x-1">
                  <button
                    title="Upload Konfirmasi Baru"
                    className="text-white py-1 px-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-xs"
                    style={{ display: isAllowed ? "block" : "none" }}
                    onClick={(e) =>
                      handleModalDokumen(
                        e,
                        row.id,
                        `Dokumen Konfirmasi ${row.nama_kabupaten}`,
                        row.nama_kabupaten,
                        "konfirmasi",
                      )
                    }
                  >
                    Upload <br />
                    Dokumen
                  </button>
                  <button
                    title="Buka Dokumen Konfirmasi"
                    className="text-white bg-green-600 hover:bg-green-700 py-1 px-2 rounded-md font-medium text-xs"
                    onClick={() => handleBukaUpload(row.id, "konfirmasi")}
                  >
                    Buka
                  </button>
                </div>
              )}
              {row?.doc_konfirmasi && (
                <div className="text-green-500 text-xs">Sudah Upload</div>
              )}
              {!row?.doc_konfirmasi && (
                <div className="text-red-500 text-xs">Belum Upload</div>
              )}
            </div>
          );
        },
        ignoreRowClick: true,
        button: true,
        minWidth: "120px",
      },
      //   {
      //     name: <div className="text-wrap">Periode</div>,
      //     selector: (row) => row.periode_name,
      //     sortable: true,
      //     cell: (row) => (
      //       <div className="text-wrap text-xs py-2">{row.periode_name}</div>
      //     ),
      //     width: "80px",
      //   },
      {
        name: <div className="text-wrap">Status Konfirmasi</div>,
        selector: (row) => row.stat,
        sortable: true,
        cell: (row) => (
          <div className="text-wrap py-2">
            {row.stat === "1" ? (
              <div className="text-white py-1 px-2 bg-green-600 rounded-md text-xs">
                Sudah Konfirmasi
              </div>
            ) : (
              <div className="text-white py-1 px-2 bg-red-600 rounded-md text-xs">
                Belum Konfirmasi
              </div>
            )}
          </div>
        ),
        width: "150px",
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
                  `/konfirmasi-alkes/kabupaten/${encodeURIComponent(
                    encryptId(row.id_kabupaten),
                  )}`,
                  {
                    replace: true,
                  },
                );
              }}
            >
              <Link
                className="text-white font-semibold py-2 w-22 bg-primary rounded-md"
                to={`/konfirmasi-alkes/kabupaten/${encodeURIComponent(
                  encryptId(row.id_kabupaten),
                )}`}
              >
                Detail
              </Link>
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [],
  );

  const mapResponseToExcel = (data) => {
    return data.map((item, index) => ({
      No: index + 1,
      Provinsi: item.provinsi,
      "Kab/Kota": item.kab_kota,
      Kecamatan: item.kecamatan || "",
      "Kode Puskesmas": item.kode_puskesmas,
      "Nama Puskesmas": item.nama_puskesmas,
      "Alamat Puskesmas": item.alamat_puskesmas || "",
      "Alat Kesehatan": item.nama_barang,
      "Jumlah Alat": item.jumlah_barang_unit,
      "Status Surat": item.submit_surat_balasan ? "Sudah submit" : "Belum",
      "Status Relokasi": item.relokasi_status || "Lokus",
      "Status SDMK": item.kesiapan_sdmk || "",
      "Alasan Relokasi": item.alasan_relokasi || "",
      "Nama Puskesmas PENERIMA RELOKASI":
        item.nama_puskesmas_penerima_relokasi || "",
      "Alamat Puskesmas Penerima Relokasi":
        item.alamat_puskesmas_relokasi || "",
      "Kecamatan Penerima Relokasi": item.kecamatan_relokasi || "",
      "Kabupaten Penerima Relokasi": item.nama_kab_kota_relokasi || "",
      "Kontak Puskesmas Penerima Relokasi": `${item.pic_penerima_relokasi_nama || ""} ${
        item.pic_penerima_relokasi_hp || ""
      }`,
      "Status RC Puskesmas Relokasi": item.status_verifikasi || "",
      "Tindak lanjut/ Keterangan Relokasi": item.keterangan_relokasi || "",
      "PIC Puskesmas (Petugas ASPAK)": `${item.pic_puskesmas_nama || ""} (${item.pic_puskesmas_hp || ""})`,
      "PIC Dinkes Kesehatan Kab/Kota": `${item.pic_dinkes_nama || ""} (${item.pic_dinkes_hp || ""})`,
      "PIC Dinas Kesehatan Provinsi": "",
      "Surat Balasan": item.template_dokumen || "",
      "Status SDM": item.kesiapan_sdmk || "",
    }));
  };
  const exportToExcel = async (rows) => {
    const XLSX = await import("xlsx");

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: EXCEL_HEADER,
    });

    // === SET LEBAR KOLOM ===
    worksheet["!cols"] = EXCEL_HEADER.map((h) => ({
      wch: Math.max(h.length + 5, 10),
    }));

    // === STYLE HEADER ===
    EXCEL_HEADER.forEach((_, idx) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: idx })];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "2563EB" } },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
        };
      }
    });

    worksheet["!rows"] = [{ hpt: 30 }]; // tinggi header

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Konfirmasi Alkes");

    XLSX.writeFile(workbook, `Konfirmasi_Alkes_${Date.now()}.xlsx`);
  };

  const handleExport = async () => {
    if (!exportAll && !selectedProvinsiLaporan) {
      Swal.fire("Pilih Provinsi", "Silakan pilih provinsi", "warning");
      return;
    }

    showExportProgress();

    try {
      updateProgress(10);

      const payload = {
        id_provinsi: exportAll ? 0 : selectedProvinsiLaporan.value,
        id_kabupaten: 0,
        limit: exportLimit,
      };

      const res = await fetch(
        "https://api.alkesihss.com/api/laporan/konfirmasi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      updateProgress(30);

      const json = await res.json();
      if (!json.success) throw new Error("Gagal export");

      updateProgress(50);

      // mapping data
      const excelData = mapResponseToExcel(json.data.data);

      updateProgress(70);

      await exportToExcel(excelData);

      updateProgress(100);

      Swal.fire({
        icon: "success",
        title: "Export Selesai",
        text: "File Excel berhasil dibuat",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsExportModalOpen(false);
    }
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
      <Breadcrumb
        pageName="Konfirmasi Kabupaten"
        linkBack="/pdf-usulan-alkes"
      />
      {isExportModalOpen && (
        <div className="fixed inset-0 z-999 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-primary">
                Export Konfirmasi Alkes
              </h3>
              <button onClick={() => setIsExportModalOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Export All */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportAll}
                  onChange={(e) => {
                    setExportAll(e.target.checked);
                    if (e.target.checked) setSelectedProvinsiLaporan(null);
                  }}
                />
                Export Semua Provinsi
              </label>

              {/* Provinsi */}
              {!exportAll && (
                <div>
                  <label className="block mb-1 text-sm">Provinsi</label>
                  <Select
                    options={dataProvinsi}
                    value={selectedProvinsiLaporan}
                    onChange={setSelectedProvinsiLaporan}
                    placeholder="Pilih Provinsi"
                  />
                </div>
              )}

              {/* Limit */}
              <div>
                <label className="block mb-1 text-sm">Limit Data</label>
                <select
                  value={exportLimit}
                  onChange={(e) => setExportLimit(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1.000</option>
                  <option value={10000}>10.000</option>
                  <option value={100000}>Semua Data</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                onClick={() => setIsExportModalOpen(false)}
              >
                Batal
              </button>
              <button
                disabled={exportLoading}
                onClick={handleExport}
                className={`px-4 py-2 rounded text-white ${
                  exportLoading ? "bg-gray-400" : "bg-primary"
                }`}
              >
                {exportLoading ? "Mengekspor..." : "Export Excel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center w-full tracking-tight mb-6">
        <h1 className="font-normal mb-3 text-xl lg:text-[28px] tracking-tight text-center text-bodydark1">
          Konfirmasi Ulang Alkes
        </h1>
        {/* <p className="text-sm text-red-500 italic mb-3 text-center font-medium">
          Batas pengisian dan unggah: 15-19 Mei 2025. <br />
          Lewat tanggal tersebut pengunggahan dokumen akan dikunci.
        </p> */}
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
                className="w-64 sm:w-32 xl:w-52 bg-slate-500 my-react-select-container"
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
                htmlFor="barang"
              >
                Alkes
              </label>
              <Select
                options={dataBarang}
                value={selectedBarang}
                onChange={handleBarangChange}
                className="w-64 sm:w-32 xl:w-48"
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
            {user?.role == "1" && (
              <>
                <div>
                  <label className="block text-[#728294] text-base font-normal mb-2">
                    Tanggal Dari
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDateFrom(val);

                      // kalau from > to, reset to
                      if (dateTo && val > dateTo) {
                        setDateTo("");
                      }
                    }}
                    max={dateTo || undefined}
                    className="w-64 sm:w-32 xl:w-36 border border-[#c9d1da] rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#728294] text-base font-normal mb-2">
                    Tanggal Sampai
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom || undefined}
                    className="w-64 sm:w-32 xl:w-36 border border-[#c9d1da] rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </>
            )}

            {/* <div>
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
            </div> */}
            {/* {user?.role == "1" && (
              <div>
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="kota"
                >
                  Periode
                </label>
                <Select
                  options={dataPeriode}
                  value={selectedPeriode}
                  onChange={handlePeriodeChange}
                  placeholder="Pilih Periode"
                  className="w-64 sm:w-32 xl:w-60"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "lightgrey",
                      primary: "grey",
                    },
                  })}
                />
              </div>
            )} */}
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
        fetchDokumenData={fetchDokumenData}
        uploadType={uploadTypeModal} // State untuk menyimpan tipe upload yang akan digunakan modal
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
            {user?.role == "1" && (
              <button
                title="Export Data Distribusi"
                className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
                onClick={() => setIsExportModalOpen(true)}
              >
                <BiExport />
                <span className="hidden sm:block">Export Konfirmasi</span>
              </button>
            )}

            {/* {user.role == "1" ? (
              <button
                title="Tambah Data Dokumen"
                className="flex font-semibold items-center gap-2 cursor-pointer text-base text-white  bg-primary rounded-md tracking-tight"
              >
                <Link
                  to="/master-data-barang/add"
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
                    backgroundColor: "#0FAD91", // Warna header biru
                    color: "#fff", // Teks header putih
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

export default KonfirmasiKabupaten;
