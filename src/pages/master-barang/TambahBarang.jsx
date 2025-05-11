import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  dataBarang,
  dataKecamatan,
  dataPuskesmas,
  roleOptions,
  SelectOptions,
  StatusOptions,
} from "../../data/data";
import { decryptId, selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axios from "axios";
import FormInput from "../../components/Form/FormInput";
import { validateFileFormat, validateForm } from "../../data/validationUtils";

const TambahBarang = () => {
  const [formData, setFormData] = useState({
    nama_alkes: "",
    standard_rawat_inap: "",
    standard_non_inap: "",
    jenis_alkes: "",
    kategori: "",
    satuan: "",
    tahun: "",
    harga: "",
    keterangan: "",
    stat: 0,
    id_kriteria: [],
    input_usulan: false,
    periode_id: null,
  });

  const navigate = useNavigate();
  const user = useSelector((a) => a.auth.user);

  const [listKota, setListKota] = useState([]);
  const [listKecamatan, setListKecamatan] = useState([]);
  const [dataKriteria, setDataKriteria] = useState([]);
  const [dataPeriode, setDataPeriode] = useState([]);
  const isDisabled = false;

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState(null);
  const [selectedDaya, setSelectedDaya] = useState(null);
  const [selectedKriteria, setSelectedKriteria] = useState(null);
  const [selectedPeriode, setSelectedPeriode] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [selectedInternet, setSelectedInternet] = useState(null);
  const [selectedStandar, setSelectedStandar] = useState(null);
  const [selectedNonStandar, setSelectedNonStandar] = useState(null);
  const [setuju, setSetuju] = useState(false);

  const fetchKriteria = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kriteria`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataKriteria([
        { value: "all", label: "Pilih Semua" },
        ...response.data.data.map((item) => ({
          label: item.kriteria,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataKriteria([]);
    }
  };

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
        ...response.data.data.map((item) => ({
          label: item.periode_name,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataPeriode([]);
    }
  };

  useEffect(() => {
    fetchKriteria();
    fetchPeriode();
  }, []);

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));

    switch (name) {
      case "stat":
        setSelectedStatus(selectedOption);
        break;
      case "standar_nonrawat_inap":
        setSelectedNonStandar(selectedOption);
        break;
      default:
        break;
    }
  };

  const handlePeriodeChange = (selectedOption) => {
    setSelectedPeriode(selectedOption);
    setFormData((prev) => ({
      ...prev,
      periode_id: selectedOption ? selectedOption?.value?.toString() : "",
    }));
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi untuk memformat angka ke format rupiah
  const formatRupiah = (value) => {
    if (!value) return "";
    return parseInt(value, 10).toLocaleString("id-ID");
  };

  // Fungsi untuk mendapatkan nilai asli (tanpa format)
  const getRawValue = (formattedValue) => {
    return formattedValue.replace(/\./g, "");
  };

  const handleChange = (event) => {
    const { id, value, files } = event.target;
    if (files) {
      const file = files[0];
      if (!file) return;
      if (file.type !== "application/pdf") {
        Swal.fire("Error", "File type harus PDF", "error");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        Swal.fire("Error", "File size harus dibawah 100 MB", "error");
        return;
      }

      // **3. Validasi isi file (Magic Number untuk PDF: 0x25 50 44 46)**
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const uint = new Uint8Array(e.target.result).subarray(0, 4);
        const header = uint.reduce((acc, byte) => acc + byte.toString(16), "");

        if (header !== "25504446") {
          Swal.fire(
            "Warning",
            "Format PDF tidak sesuai atau mengandung karakter berbahaya!",
            "warning"
          );
          event.target.value = ""; // Reset input file
          return;
        }
        setFormData((prev) => ({
          ...prev,
          [id]: file,
          contractFileName: file.name,
        }));
      };
      fileReader.readAsArrayBuffer(file); // Membaca header file
    } else {
      if (id === "standard_rawat_inap") {
        const unformattedValue = value.replace(/\./g, ""); // Hapus semua titik
        if (!isNaN(unformattedValue)) {
          setFormData((prev) => ({
            ...prev,
            standard_rawat_inap: formatRupiah(unformattedValue),
          }));
        }
      } else if (id === "harga") {
        const unformattedValue = value.replace(/\./g, ""); // Hapus semua titik
        if (!isNaN(unformattedValue)) {
          setFormData((prev) => ({
            ...prev,
            harga: formatRupiah(unformattedValue),
          }));
        }
      } else if (id === "standard_non_inap") {
        const unformattedValue = value.replace(/\./g, ""); // Hapus semua titik
        if (!isNaN(unformattedValue)) {
          setFormData((prev) => ({
            ...prev,
            standard_non_inap: formatRupiah(unformattedValue),
          }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [id]: value }));
      }
    }
  };
  console.log(formData);
  const handlePelayananChange = (selectedOption) => {
    setSelectedPelayanan(selectedOption);
    setFormData((prev) => ({
      ...prev,
      pelayanan: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const handleDayaChange = (selectedOption) => {
    setSelectedDaya(selectedOption);
    setFormData((prev) => ({
      ...prev,
      kapasitas_listrik: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const handleKriteriaChange = (selectedOptions) => {
    setSelectedKriteria(selectedOptions);

    if (!selectedOptions) {
      setFormData((prev) => ({ ...prev, id_kriteria: [] }));
      return;
    }

    const allOption = dataKriteria.find((option) => option.value === "all");

    if (selectedOptions.some((option) => option.value === "all")) {
      // Jika "Pilih Semua" dipilih, pilih semua opsi lainnya
      const allKriteriaValues = dataKriteria
        .filter((option) => option.value !== "all")
        .map((option) => option.value);

      setSelectedKriteria(
        dataKriteria.filter((option) => option.value !== "all")
      );
      setFormData((prev) => ({ ...prev, id_kriteria: allKriteriaValues }));
    } else {
      // Jika "Pilih Semua" tidak dipilih, ambil nilai dari opsi yang dipilih
      const kriteriaValues = selectedOptions.map((option) => option.value);
      setFormData((prev) => ({ ...prev, id_kriteria: kriteriaValues }));
    }
  };

  const handleInternetChange = (selectedOption) => {
    setSelectedInternet(selectedOption);
    setFormData((prev) => ({
      ...prev,
      internet: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const tambahBarang = async () => {
    Swal.fire({
      title: "Menambah Data...",
      text: "Tunggu Sebentar Data sedang di Input...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    const updatedFormData = {
      ...formData,
      stat: parseInt(formData?.stat), // Pastikan usulan di formData sudah diupdate
      standard_rawat_inap: parseInt(getRawValue(formData.standard_rawat_inap)),
      standard_non_inap: parseInt(getRawValue(formData.standard_non_inap)),
      harga: getRawValue(formData.harga),
    };
    // const formDataToSend = new FormData();
    // formDataToSend.append("nama_alkes", formData.nama_alkes);
    // formDataToSend.append("jenis_alkes", formData.jenis_alkes);
    // formDataToSend.append("kategori", formData.kategori);
    // formDataToSend.append(
    //   "standard_rawat_inap",
    //   parseInt(getRawValue(formData.standard_rawat_inap))
    // );
    // formDataToSend.append(
    //   "standard_non_inap",
    //   parseInt(getRawValue(formData.standard_non_inap))
    // );
    // formDataToSend.append("tahun", formData.tahun);
    // formDataToSend.append("satuan", formData.satuan);
    // formDataToSend.append("harga", getRawValue(formData.harga));
    // formDataToSend.append("stat", parseInt(formData.stat));
    // formDataToSend.append("input_usulan", formData.input_usulan);
    // formDataToSend.append("keterangan", formData.keterangan);
    await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/api/alkesa`,
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      data: JSON.stringify(updatedFormData), // Pastikan formData sudah diupdate
    })
      .then(function (response) {
        Swal.fire("Data Berhasil di Input!", "", "success");
        navigate("/master-data-barang");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        Swal.fire("Gagal Input Data", "", "error");
      });
  };
  const handleSimpan = async (e) => {
    e.preventDefault();
    if (
      !validateForm(formData, [
        "nama_alkes",
        "jenis_alkes",
        "kategori",
        "standard_rawat_inap",
        "standard_non_inap",
        "satuan",
        "harga",
        "tahun",
        "stat",
      ])
    )
      return;
    setLoading(true);
    tambahBarang();
  };

  return (
    <div>
      <Breadcrumb pageName="Form Tambah Data Alkes" />
      <Card>
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            {user.role == "1" ? "Form Tambah Data Alkes" : ""}
          </h1>
          <div>
            <Link
              to="/master-data-barang"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full">
          <form className="mt-5" onSubmit={handleSimpan}>
            <div className="gap-3 gap-y-4 grid grid-cols-2 md:grid-cols-3 mb-4">
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="nama_alkes"
                  >
                    Nama Alkes :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="nama_alkes"
                    value={formData.nama_alkes}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Nama Alkes"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="jenis_alkes"
                  >
                    Jenis Alkes :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="jenis_alkes"
                    value={formData.jenis_alkes}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Jenis Alkes"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="kategori"
                  >
                    Kategori :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Kategori"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="standard_rawat_inap"
                  >
                    Standar Ranap :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="standard_rawat_inap"
                    value={formData.standard_rawat_inap}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Standar"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="standard_rawat_inap"
                  >
                    Standar Non Ranap :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="standard_non_inap"
                    value={formData.standard_non_inap}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Standar Non Rawat Inap"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="satuan"
                  >
                    Satuan :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="satuan"
                    value={formData.satuan}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Satuan"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="kategori"
                  >
                    Harga :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Harga"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="tahun"
                  >
                    Tahun :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` disabled:bg-slate-50 bg-white appearance-none border border-[#cacaca] focus:border-[#00B1A9]
                  "border-red-500" 
               rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="tahun"
                    value={formData.tahun}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Tahun"
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Status :
                  </label>
                </div>
                <div className="">
                  <Select
                    name="stat"
                    options={StatusOptions}
                    value={selectedStatus}
                    onChange={handleSelectChange}
                    placeholder="Status"
                    className="w-full cursor-pointer"
                    theme={selectThemeColors}
                  />
                </div>
              </div>
              <div className="flex-col gap-2 flex">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="email"
                  >
                    Kriteria SDM :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={dataKriteria}
                    value={selectedKriteria}
                    onChange={handleKriteriaChange}
                    placeholder="Kriteria SDM"
                    isMulti
                    className="w-full text-sm"
                    isDisabled={user?.role == "5" || isDisabled}
                    theme={selectThemeColors}
                  />
                </div>
              </div>

              <div className="flex-col gap-2 flex">
                <div className="flex">
                  {" "}
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-1"
                    htmlFor="satuan"
                  >
                    Input Usulan:
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="persetujuan"
                    checked={formData.input_usulan}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        input_usulan: !prev.input_usulan,
                      }))
                    }
                    className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="persetujuan"
                    className="ms-2 text-sm md:text-lg  text-[#728294] dark:text-gray-300 cursor-pointer"
                  >
                    Input usulan detail puskesmas
                  </label>
                </div>
              </div>
              {formData.input_usulan && (
                <div className="flex-col gap-2 flex">
                  <div className="">
                    <label
                      className="block text-[#728294] text-sm font-semibold mb-1"
                      htmlFor="nama_alkes"
                    >
                      Periode :
                    </label>
                  </div>
                  <div className="">
                    <Select
                      options={dataPeriode}
                      value={selectedPeriode}
                      onChange={handlePeriodeChange}
                      placeholder="Periode"
                      className="w-full text-sm"
                      isDisabled={user?.role == "5" || isDisabled}
                      theme={selectThemeColors}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="gap-3 gap-y-4 grid grid-cols-2 lg:grid-cols-3 mt-4 lg:mt-4"></div>

            <div className="mb-8 mt-8 flex-col sm:gap-2 flex">
              <div className="">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="keterangan"
                >
                  Keterangan :
                </label>
              </div>
              <div className="">
                <textarea
                  id="keterangan"
                  rows="4"
                  value={formData.keterangan}
                  onChange={handleChange}
                  className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  placeholder="Keterangan Alkes"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-center mt-6 sm:mt-12 sm:gap-8">
              <div className="div sm:flex-[2_2_0%]"></div>
              <div className="div sm:flex-[5_5_0%] ">
                <div className="w-4/5 flex items-center gap-4">
                  <button
                    className="w-full bg-[#0ACBC2]  text-white font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                    type="submit"
                    disabled={loading}
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
          </form>
        </div>
      </Card>
    </div>
  );
};

export default TambahBarang;
