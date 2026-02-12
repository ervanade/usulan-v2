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
import { validateFileFormat, validateForm } from "../../data/validationUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormInput from "../../components/Form/FormInput";

const TambahPeriodeAlkes = () => {
  const [formData, setFormData] = useState({
    periode_name: "",
    stat: 0,
    periode_start: "",
    periode_end: "",
    id_alkes: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dataAlkes, setDataAlkes] = useState([]);
  const [selectedAlkes, setSelectedAlkes] = useState([]);
  const handleStartDateChange = (date) => {
    setStartDate(date);
    const formattedDate = date ? formatDateWithTime(date) : null;
    setFormData((prev) => ({ ...prev, periode_start: formattedDate }));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    const formattedDate = date ? formatDateWithTime(date) : null;
    setFormData((prev) => ({ ...prev, periode_end: formattedDate }));
  };
  const handleAlkesChange = (selectedOption) => {
    setSelectedAlkes(selectedOption);
    setFormData((prev) => ({
      ...prev,
      id_alkes: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const formatDateWithTime = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const navigate = useNavigate();
  const user = useSelector((a) => a.auth.user);

  const [listKota, setListKota] = useState([]);
  const [listKecamatan, setListKecamatan] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedNonStandar, setSelectedNonStandar] = useState(null);

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

  const fetchAlkes = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/alkes`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setDataAlkes([
        ...response.data.data.map((item) => ({
          label: item.nama_alkes,
          value: item.id,
        })),
      ]);
    } catch (error) {
      setError(true);
      setDataAlkes([]);
    }
  };

  useEffect(() => {
    fetchAlkes();
  }, []);

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
            "warning",
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
      if (id === "harga_satuan") {
        const unformattedValue = value.replace(/\./g, ""); // Hapus semua titik
        if (!isNaN(unformattedValue)) {
          setFormData((prev) => ({
            ...prev,
            harga_satuan: formatRupiah(unformattedValue),
          }));
        }
      } else if (event.target.type === "date") {
        // Penanganan khusus untuk input bertipe date
        if (value) {
          const date = new Date(value);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");

          const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          setFormData((prev) => ({ ...prev, [id]: formattedDateTime }));
        } else {
          setFormData((prev) => ({ ...prev, [id]: value })); // Jika tidak ada nilai, simpan apa adanya
        }
      } else {
        setFormData((prev) => ({ ...prev, [id]: value }));
      }
    }
  };

  const tambahBarang = async () => {
    const formDataToSend = new FormData();
    // formDataToSend.append("periode_name", formData.periode_name);
    formDataToSend.append("id_alkes", formData.id_alkes);
    formDataToSend.append("tanggal_from", formData.periode_start);
    formDataToSend.append("tanggal_to", formData.periode_end);
    formDataToSend.append("stat", parseInt(formData.stat));
    await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/api/periodealikes`,
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      data: formDataToSend,
    })
      .then(function (response) {
        Swal.fire("Data Berhasil di Input!", "", "success");
        navigate("/master-data-periode-alkes");
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
        "id_alkes",
        "periode_start",
        "periode_end",
        "stat",
      ])
    )
      return;
    setLoading(true);
    tambahBarang();
  };

  return (
    <div>
      <Breadcrumb pageName="Form Tambah Data Periode" />
      <Card>
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            {user.role == "1" ? "Form Tambah Data Periode" : ""}
          </h1>
          <div>
            <Link
              to="/master-data-periode-alkes"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full 2xl:w-4/5 ">
          <form className="mt-5" onSubmit={handleSimpan}>
            {/* <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="nama_alkes"
                >
                  Nama Periode :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="periode_name"
                  value={formData.periode_name}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Nama Periode"
                />
              </div>
            </div> */}
            <FormInput
              select={true}
              id="alkes"
              options={dataAlkes}
              value={selectedAlkes}
              onChange={handleAlkesChange}
              placeholder={"Pilih Alkes"}
              label="Alkes :"
              required
            />

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="periode_start"
                >
                  Tanggal Periode Mulai :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm:ss"
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
              rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="periode_start"
                  placeholderText="Periode Mulai"
                />
              </div>
            </div>
            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="periode_end"
                >
                  Tanggal Periode Selesai :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm:ss"
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
              rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="periode_end"
                  placeholderText="Periode Selesai"
                />
              </div>
            </div>

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="stat"
                >
                  Status :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
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

export default TambahPeriodeAlkes;
