import React, { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card/Card";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { dataBarang, dataKecamatan, dataPuskesmas } from "../../data/data";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import ModalAddBarang from "../../components/Modal/ModalAddBarang";
import axios from "axios";
import FormInput from "../../components/Form/FormInput";
import DataTable from "react-data-table-component";
import { validateForm } from "../../data/validationUtils";

const TambahDistribusi = () => {
  var today = new Date();
  const defaultDate = today.toISOString().substring(0, 10);

  const [formData, setFormData] = useState({
    id_dokumen: "",
    provinsi: "",
    id_kabupaten: "",
    id_kecamatan: "",
    puskesmas: "",
    id_puskesmas: "",
    nama_kepala_puskesmas: "",
    nip_kepala_puskesmas: "",
    nama_barang: "",
    jumlah_barang_dikirim: "",
    jumlah_barang_diterima: "",
    tte: "",
    tanggal_kirim: defaultDate,
    keterangan_daerah: "",
    keterangan_ppk: "",
    kodepusdatin_lama: "",
    kodepusdatin_baru: "",
    kriteria_lima_sdm: "",
    listrik: "",
    internet: "",
    karakteristik_wilayah_kerja: "",
    tahun_lokus: "",
    konfirmasi_ppk: "",
    konfirmasi_daerah: "",
    tanggal_terima: "",
    total_nilai_perolehan: "",
    jenis_bmn: "",
    jumlah_barang: "",
    id_user_pemberi: "1",
    id_user_pembuat: 1,
    id_user_penerima: "2",
    dataBarang: [],
    penyedia: "",
    id_penyedia: "",
  });

  const navigate = useNavigate();
  const user = useSelector((a) => a.auth.user);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [dataKota, setDataKota] = useState([]);
  const [dataDokumen, setDataDokumen] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataPuskesmas, setDataPuskesmas] = useState([]);
  const [dataPenyedia, setDataPenyedia] = useState([]);

  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedDokumen, setSelectedDokumen] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState(null);
  const [selectedPenyedia, setSelectedPenyedia] = useState(null);

  const handleKotaChange = (selectedOption) => {
    setSelectedKota(selectedOption);
    setSelectedKecamatan(null);
    setDataKecamatan([]);
    setSelectedPuskesmas(null);
    setDataPuskesmas([]);
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        id_kabupaten: selectedOption.value.toString(),
        id_provinsi: selectedOption.provinsi.toString(),
      }));
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

  const handlePenyediaChange = (selectedOption) => {
    setSelectedPenyedia(selectedOption);
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        id_penyedia: selectedOption.value.toString(),
        penyedia: selectedOption.label.toString(),
      }));
    }
  };

  const handleDokumenChange = (selectedOption) => {
    setSelectedKecamatan(null);
    setDataKecamatan([]);
    setSelectedPuskesmas(null);
    setDataPuskesmas([]);
    setSelectedDokumen(selectedOption);
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        id_dokumen: selectedOption.value.toString(),
        id_kabupaten: selectedOption.id_kabupaten.toString(),
        id_provinsi: selectedOption.id_provinsi.toString(),
      }));
      fetchKecamatan(selectedOption.id_kabupaten);
    }
  };

  const handleChange = (event) => {
    const { id, value, files } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const fetchKota = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kabupaten`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataKota([
        ...response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
          provinsi: item.id_provinsi,
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
      setDataDokumen([
        ...response.data.data
          // .filter((a) => a.status_tte == "0")
          .map((item) => ({
            label: item.nama_dokumen,
            value: item.id,
            id_provinsi: item.id_provinsi,
            id_kabupaten: item.id_kabupaten,
          })),
      ]);
    } catch (error) {
      setError(true);
      setDataDokumen([]);
    }
  };

  const fetchPenyedia = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/penyedia`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataPenyedia([
        ...response.data.data
          // .filter((a) => a.status_tte == "0")
          .map((item) => ({
            label: item.penyedia,
            value: item.id,
          })),
      ]);
    } catch (error) {
      setError(true);
      setDataPenyedia([]);
    }
  };

  useEffect(() => {
    fetchPenyedia();
    fetchKota();
    fetchDokumen();
  }, []);

  const tambahDistribusi = async () => {
    if (formData.dataBarang.length < 1) {
      Swal.fire("Error", "Form Data Barang Masih Kosong", "error");
      return;
    }
    if (
      !formData.id_dokumen ||
      !formData.id_penyedia ||
      !formData.id_kecamatan ||
      !formData.id_kabupaten ||
      !formData.id_puskesmas
    ) {
      Swal.fire("Error", "Ada Form yang Belum Diisi", "error");
      return;
    }
    await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/api/distribusi`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      data: JSON.stringify(formData),
    })
      .then(function (response) {
        Swal.fire("Data Berhasil di Input!", "", "success");
        navigate("/data-distribusi");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (
      !validateForm(formData, [
        "id_dokumen",
        "id_penyedia",
        "id_kecamatan",
        "id_kabupaten",
        "id_puskesmas",
      ])
    )
      return;
    Swal.fire({
      title: "Perhatian",
      text: "Data sudah sesuai, Simpan Data ini?",
      showCancelButton: true,
      confirmButtonColor: "#16B3AC",
      confirmButtonText: "Ya, Simpan Data",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        tambahDistribusi();
      }
    });
  };

  const handleTambahBarang = (barang) => {
    if (editIndex !== null) {
      const updatedDataBarang = formData.dataBarang.map((item, i) =>
        i === editIndex ? barang : item
      );
      setFormData((prev) => ({
        ...prev,
        dataBarang: updatedDataBarang,
      }));
      setEditIndex(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        dataBarang: [...prev.dataBarang, barang],
      }));
    }
    setShowModal(false);
  };

  const tambahBarangClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleEditBarang = (e, index) => {
    e.preventDefault();
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteBarang = (index) => {
    const updatedDataBarang = formData.dataBarang.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      dataBarang: updatedDataBarang,
    }));
  };
  useEffect(() => {
    if (editIndex) {
      setShowModal(true);
    }
  }, [editIndex]);

  const columns = useMemo(
    () => [
      {
        name: "Nama Barang",
        selector: (row) => row.jenis_alkes,
        sortable: true,
        width: "200px",
      },
      {
        name: "Merk/Tipe",
        selector: (row) => row.merk,
        sortable: true,
      },
      {
        name: "Satuan",
        selector: (row) => row.satuan,
        sortable: true,
      },
      {
        name: "Jumlah Dikirim",
        selector: (row) => row.jumlah_dikirim,
        sortable: true,
        width: "140px",
      },
      {
        name: "Jumlah Diterima",
        selector: (row) => row.jumlah_diterima || 0,
        sortable: true,
        width: "140px",
      },
      {
        name: "Harga Satuan",
        selector: (row) => row.harga_satuan || 0,
        sortable: true,
        width: "140px",
      },
      {
        name: "Aksi",
        id: "Aksi",
        cell: (row, index) => (
          <div className="flex items-center space-x-2">
            <button
              title="Edit"
              onClick={(e) => handleEditBarang(e, index)}
              className="text-[#16B3AC] hover:text-cyan-500"
            >
              <FaEdit size={16} />
              {index}
            </button>
            <button
              onClick={() => handleDeleteBarang(index)}
              title="Delete"
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash size={16} />
              {index}
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        sortable: true,
        selector: (row) => row.konfirmasi_daerah,
      },
    ],
    []
  );
  return (
    <div>
      <Breadcrumb pageName="Form Input Data BAST" />
      <Card>
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            {user.role == "1"
              ? "Form Input Data BAST Admin Dit Tata Kelola Kesmas"
              : user.role == "2"
              ? "Form TTE BAST dan Naskah Hibah Admin PPK"
              : user.role == "3"
              ? "Form Input Data BAST Admin Dinas Kesehatan Kab/Kota"
              : "Form Input Data BAST Admin Dinas Kesehatan Kab/Kota"}
          </h1>
          <div>
            <Link
              to="/data-distribusi"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full 2xl:w-4/5 ">
          <form className="mt-5" onSubmit={handleSimpan}>
            <FormInput
              select={true}
              id="dokumen"
              options={dataDokumen}
              value={selectedDokumen}
              onChange={handleDokumenChange}
              placeholder="Pilih Dokumen"
              label="Dokumen :
"
              required
            />

            <FormInput
              select={true}
              id="kecamatan"
              options={dataKecamatan}
              value={selectedKecamatan}
              onChange={handleKecamatanChange}
              placeholder={
                selectedDokumen ? "Pilih Kecamatan" : "Pilih Dokumen Dahulu"
              }
              isDisabled={!selectedDokumen}
              label="Kecamatan :"
              required
            />

            <FormInput
              select={true}
              id="puskesmas"
              options={dataPuskesmas}
              value={selectedPuskesmas}
              onChange={handlePuskesmasChange}
              isDisabled={!selectedKecamatan || dataPuskesmas.length < 1}
              placeholder={
                selectedKecamatan && dataPuskesmas.length > 0
                  ? "Pilih Puskesmas"
                  : selectedKecamatan && dataPuskesmas.length < 1
                  ? "Data Puskesmas Tidak Ada "
                  : "Pilih Kecamatan Dahulu"
              }
              label="Puskesmas :"
              required
            />

            <FormInput
              select={true}
              id="penyedia"
              options={dataPenyedia}
              value={selectedPenyedia}
              onChange={handlePenyediaChange}
              placeholder="Pilih Penyedia"
              label="Penyedia Barang :
"
              required
            />

            <FormInput
              id="tanggal_kirim"
              value={formData.tanggal_kirim}
              onChange={handleChange}
              type="date"
              required
              placeholder="Tanggal Kirim"
              label="Tanggal Kirim :"
            />

            <div className="mt-12">
              <div className="card-header flex flex-col ">
                <h1 className="mb-8 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-center text-bodydark1">
                  Form Input Data Barang
                </h1>
                <div className="flex justify-end mb-2">
                  <button
                    title="Tambah Data Distribusi"
                    className="flex items-center gap-2 cursor-pointer text-base text-white  bg-primary rounded-md tracking-tight"
                    // onClick={handleExport}
                  >
                    <button
                      onClick={(e) => tambahBarangClick(e)}
                      to="/data-distribusi/add"
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <FaPlus size={16} />
                      <span className="hidden sm:block">
                        Tambah Data Barang
                      </span>
                    </button>
                  </button>
                </div>
              </div>
              <div className="w-full">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-bodydark2 uppercase bg-[#EBFBFA] dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-center">
                          Nama Barang
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Merk/Tipe
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Satuan
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Jumlah Dikirim
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Jumlah Diterima
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Harga Satuan
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.dataBarang.map((barang, index) => (
                        <tr
                          key={index}
                          className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <th
                            scope="row"
                            className="px-2 py-2 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {barang.jenis_alkes}
                          </th>
                          <td className="px-2 py-2 text-center">
                            {barang.merk}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {barang.satuan}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {barang.jumlah_dikirim}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {barang.jumlah_diterima}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {barang.harga_satuan}
                          </td>
                          <td className="px-2 py-2 text-center flex items-center gap-2">
                            <button
                              title="Edit"
                              onClick={(e) => handleEditBarang(e, index)}
                              className="text-[#16B3AC] hover:text-cyan-500"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteBarang(index)}
                              title="Delete"
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-6 sm:mt-12 sm:gap-8">
              <div className="div sm:flex-[2_2_0%]"></div>
              <div className="div sm:flex-[5_5_0%] ">
                <div className="w-4/5 flex items-center gap-4">
                  <button
                    className="w-full bg-[#0ACBC2]  text-white font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                    type="submit"
                  >
                    {loading ? "Loading..." : "Simpan"}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/");
                    }}
                    className="w-full bg-[#fff]  text-[#0ACBC2] border border-[#0ACBC2] font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                  >
                    {loading ? "Loading..." : "Batal"}
                  </button>
                </div>
              </div>
            </div>

            <ModalAddBarang
              show={showModal}
              onClose={() => setShowModal(false)}
              onSave={handleTambahBarang}
              editIndex={editIndex}
              dataBarang={
                editIndex !== null ? formData.dataBarang[editIndex] : null
              }
            />
          </form>
        </div>
      </Card>
    </div>
  );
};

export default TambahDistribusi;
