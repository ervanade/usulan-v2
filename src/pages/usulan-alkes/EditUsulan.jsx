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
  pelayananOptions,
  SelectOptions,
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
import FormInput from "../../components/Form/FormInput";
import Card from "../../components/Card/Card";

const EditUsulan = () => {
  const user = useSelector((a) => a.auth.user);
  const [formData, setFormData] = useState({
    tahun_lokus: "",
    penerima_hibah: "",
    jenis_bmn: "",
    kepala_unit_pemberi:
      "Direktur Fasilitas dan Mutu Pelayanan Kesehatan Primer",
    nama_kontrak_pengadaan: "",
    tanggal_kontrak_pengadaan: "",
    id_user_pemberi: "",
    id_user_penerima: "",
    contractFile: null,
    contractFileName: "",
    contractFileLink: "",
    id_provinsi: "",
    id_kabupaten: "",
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [getLoading, setGetLoading] = useState(false);

  const [dataUser, setDataUser] = useState([]);
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataPuskesmas, setDataPuskesmas] = useState([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState(null);

  const navigate = useNavigate();

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
    fetchProvinsi();
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
        id_puskesmas: selectedOption.value.toString(),
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
    if (formData.id_puskesmas && dataPuskesmas.length > 0) {
      const initialOption = dataPuskesmas.find(
        (kec) => kec.value == formData.id_puskesmas
      );
      if (initialOption) {
        setSelectedPuskesmas({
          label: initialOption.label,
          value: initialOption.value,
        });
      }
    }
  }, [formData, dataProvinsi, dataKecamatan, dataKota, dataPuskesmas]);
  useEffect(() => {
    if (formData.id_provinsi) {
      fetchKota(formData.id_provinsi);
    }
    if (formData.id_kabupaten) {
      fetchKecamatan(formData.id_kabupaten);
    }
    if (formData.id_kecamatan) {
      fetchPuskesmas(formData.id_kecamatan);
    }
  }, [formData.id_provinsi, formData.id_kabupaten, formData.id_kecamatan]);

  const [editedData, setEditedData] = useState({});

  const handleInputChange = (rowId, columnName, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [rowId]: {
        ...prevData[rowId],
        [columnName]: value,
      },
    }));
  };
  const getResultData = () => {
    return filteredData.map((row) => ({
      id: row.id,
      jumlah_dikirim:
        editedData[row.id]?.jumlah_dikirim || row.jumlah_barang_dikirim || 0,
      jumlah_diterima:
        editedData[row.id]?.jumlah_diterima || row.jumlah_barang_diterima || 0,
    }));
  };

  // Contoh penggunaan getResultData (misalnya, saat tombol "Simpan" ditekan)
  const handleSave = () => {
    const result = getResultData();
    console.log(result); // Lakukan sesuatu dengan data hasil akhir
  };
  const columns = useMemo(
    () => [
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
        name: <div className="text-wrap">Jumlah Dikirim</div>,
        cell: (row) => (
          <input
            type="number"
            value={
              editedData[row.id]?.jumlah_dikirim ||
              row.jumlah_barang_dikirim ||
              ""
            }
            onChange={(e) =>
              handleInputChange(row.id, "jumlah_dikirim", e.target.value)
            }
            className="border border-primary rounded p-2 !text-base py-4 w-full focus:border-graydark focus:outline-none focus:ring-0"
          />
        ),
        width: "200px",
      },
      {
        name: <div className="text-wrap">Jumlah Diterima</div>,
        cell: (row) => (
          <input
            type="number"
            value={
              editedData[row.id]?.jumlah_diterima ||
              row.jumlah_barang_diterima ||
              ""
            }
            onChange={(e) =>
              handleInputChange(row.id, "jumlah_diterima", e.target.value)
            }
            className="border border-primary rounded p-2 !text-base py-4 w-full focus:border-graydark focus:outline-none"
          />
        ),
        width: "200px",
      },
    ],
    [editedData, handleInputChange, navigate, user] // Tambahkan editedData di sini
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
                    className="block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="email"
                  >
                    Provinsi :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={dataProvinsi}
                    value={selectedProvinsi}
                    onChange={handleProvinsiChange}
                    placeholder="Pilih Provinsi"
                    className="w-full"
                    theme={selectThemeColors}
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="email"
                  >
                    Kabupaten / Kota :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={dataKota}
                    value={selectedKota}
                    onChange={handleKotaChange}
                    isDisabled={!selectedProvinsi}
                    placeholder={
                      selectedProvinsi
                        ? "Pilih Kab / Kota"
                        : "Pilih Provinsi Dahulu"
                    }
                    className="w-full"
                    theme={selectThemeColors}
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="email"
                  >
                    Kecamatan :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={dataKecamatan}
                    value={selectedKecamatan}
                    isDisabled={!selectedKota}
                    onChange={handleKecamatanChange}
                    placeholder={
                      selectedKota
                        ? "Pilih Kecamatan"
                        : "Pilih Kab / Kota Dahulu"
                    }
                    className="w-full"
                    theme={selectThemeColors}
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="kode_puskesmas"
                  >
                    Kode Puskesmas :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="kode_puskesmas"
                    value={formData.nip}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nip: e.target.value,
                      }))
                    }
                    type="text"
                    required
                    placeholder="Kode Puskesmas"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-normal mb-1"
                    htmlFor="email"
                  >
                    Puskesmas :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={dataPuskesmas}
                    value={selectedPuskesmas}
                    onChange={handlePuskesmasChange}
                    isDisabled={!selectedKecamatan || user.role != "1"}
                    placeholder={
                      selectedKota
                        ? "Pilih Puskesmas"
                        : "Pilih Kecamatan Dahulu"
                    }
                    className="w-full"
                    theme={selectThemeColors}
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-normal mb-1"
                    htmlFor="tahun_lokus"
                  >
                    Tahun:
                  </label>
                </div>
                <div className="">
                  <input
                    className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="tahun_lokus"
                    value={formData.tahun_lokus}
                    onChange={handleChange}
                    maxLength={4}
                    type="text"
                    required
                    placeholder="Tahun"
                  />
                </div>
              </div>
            </div>
            <div className="gap-3 gap-y-4 grid grid-cols-2 md:grid-cols-4 mt-10 lg:mt-12">
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-semibold mb-1"
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
                    className="w-full"
                    theme={selectThemeColors}
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="email"
                  >
                    Ketersediaan Daya Listrik :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={SelectOptions}
                    value={selectedPelayanan}
                    onChange={handlePelayananChange}
                    placeholder="Ketersediaan Daya Listrik"
                    className="w-full"
                    theme={selectThemeColors}
                  />
                </div>
              </div>
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="email"
                  >
                    Ketersediaan Listrik (24 Jam):
                  </label>
                </div>
                <div className="">
                  <Select
                    options={SelectOptions}
                    value={selectedPelayanan}
                    onChange={handlePelayananChange}
                    placeholder="Ketersediaan Listrik"
                    className="w-full"
                    theme={selectThemeColors}
                  />
                </div>
              </div>
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="email"
                  >
                    Ketersediaan Internet :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={SelectOptions}
                    value={selectedPelayanan}
                    onChange={handlePelayananChange}
                    placeholder="Ketersediaan Internet"
                    className="w-full"
                    theme={selectThemeColors}
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="rounded-md flex flex-col gap-4 overflow-hidden overflow-x-auto  border border-stroke bg-white py-4 md:py-8 px-4 md:px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="font-medium text-bodydark1 mt-2">
              Form Usulan Alkes
            </h2>
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
          <button
            onClick={handleSave}
            className="mt-4 bg-primary hover:bg-graydark text-white font-bold py-3 px-4 rounded w-full"
          >
            Simpan
          </button>
        </div>
      </Card>
    </div>
  );
};

export default EditUsulan;
