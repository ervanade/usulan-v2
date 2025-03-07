import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  dataBarang,
  dataKecamatan,
  dataPuskesmas,
  pelayananOptions,
  roleOptions,
  wilayahKerjaOptions,
} from "../../data/data";
import { decryptId, selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axios from "axios";
import FormInput from "../../components/Form/FormInput";
import { validateForm } from "../../data/validationUtils";

const TambahPuskesmas = () => {
  const [formData, setFormData] = useState({
    nama_puskesmas: "",
    id_provinsi: "",
    id_kabupaten: "",
    id_kecamatan: "",
    alamat: "",
    nomor_telpon: "",
    email: "",
    status_puskesmas: "",
    wilayah_kerja: "",
    kode_pusdatin_baru: "",
    pelayanan: "",
    keterangan: "",
  });

  const navigate = useNavigate();
  const user = useSelector((a) => a.auth.user);

  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedWilayahKerja, setSelectedWilayahKerja] = useState(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState(null);

  const [listKota, setListKota] = useState([]);
  const [listKecamatan, setListKecamatan] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

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

  const handleChange = (event) => {
    const { id, value, files } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const tambahPuskesmas = async () => {
    await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/api/puskesmas`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      data: JSON.stringify(formData),
    })
      .then(function (response) {
        Swal.fire("Data Berhasil di Input!", "", "success");
        navigate("/master-data-puskesmas");
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
        "nama_puskesmas",
        "id_provinsi",
        "id_kabupaten",
        "id_kecamatan",
        "alamat",
        "kode_pusdatin_baru",
        "wilayah_kerja",
        "pelayanan",
        "status_puskesmas",
        "keterangan",
      ])
    )
      return;
    setLoading(true);
    tambahPuskesmas();
  };

  useEffect(() => {
    fetchProvinsi();
  }, []);

  const handleProvinsiChange = (selectedOption) => {
    setSelectedProvinsi(selectedOption);
    setSelectedKota(null);
    setSelectedKecamatan(null);
    setDataKota([]);
    setDataKecamatan([]);
    setFormData((prev) => ({
      ...prev,
      id_provinsi: selectedOption ? selectedOption.value.toString() : "",
    }));
    if (selectedOption) {
      fetchKota(selectedOption.value);
    }
  };

  const handleKotaChange = (selectedOption) => {
    setSelectedKota(selectedOption);
    setSelectedKecamatan(null);
    setDataKecamatan([]);
    setFormData((prev) => ({
      ...prev,
      id_kabupaten: selectedOption ? selectedOption.value.toString() : "",
    }));
    if (selectedOption) {
      fetchKecamatan(selectedOption.value);
    }
  };

  const handleKecamatanChange = (selectedOption) => {
    setSelectedKecamatan(selectedOption);
    setFormData((prev) => ({
      ...prev,
      id_kecamatan: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const handleWilayahKerjaChange = (selectedOption) => {
    setSelectedWilayahKerja(selectedOption);
    setFormData((prev) => ({
      ...prev,
      wilayah_kerja: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const handlePelayananChange = (selectedOption) => {
    setSelectedPelayanan(selectedOption);
    setFormData((prev) => ({
      ...prev,
      pelayanan: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  return (
    <div>
      <Breadcrumb pageName="Form Tambah Data Puskesmas" />
      <Card>
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            {user.role == "1" ? "Form Tambah Data Puskesmas" : ""}
          </h1>
          <div>
            <Link
              to="/master-data-puskesmas"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full 2xl:w-4/5 ">
          <form className="mt-5" onSubmit={handleSimpan}>
            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="nama_alkes"
                >
                  Nama Puskesmas :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="nama_puskesmas"
                  value={formData.nama_puskesmas}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Nama Puskesmas"
                />
              </div>
            </div>

            <FormInput
              select={true}
              id="provinsi"
              options={dataProvinsi}
              value={selectedProvinsi}
              onChange={handleProvinsiChange}
              placeholder="Pilih Provinsi"
              label="Provinsi :"
              required
            />

            <FormInput
              select={true}
              id="kota"
              options={dataKota}
              value={selectedKota}
              isDisabled={!selectedProvinsi}
              onChange={handleKotaChange}
              placeholder={
                selectedProvinsi ? "Pilih Kab / Kota" : "Pilih Provinsi Dahulu"
              }
              label="Kab / Kota :"
              required
            />

            <FormInput
              select={true}
              id="kecamatan"
              options={dataKecamatan}
              value={selectedKecamatan}
              onChange={handleKecamatanChange}
              placeholder={
                selectedKota ? "Pilih Kecamatan" : "Pilih Kab / Kota Dahulu"
              }
              isDisabled={!selectedKota}
              label="Kecamatan :"
              required
            />

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="alamat"
                >
                  Alamat :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Alamat"
                />
              </div>
            </div>

            <FormInput
              id="kode_pusdatin_baru"
              value={formData.kode_pusdatin_baru}
              onChange={handleChange}
              type="text"
              placeholder={"Kode Pusdatin"}
              label="Kode Pusdatin :"
              required
            />
            <FormInput
              select={true}
              id="wilayah_kerja"
              options={wilayahKerjaOptions}
              value={selectedWilayahKerja}
              onChange={handleWilayahKerjaChange}
              placeholder={"Pilih Karakteristik Wilayah Kerja"}
              label="Karakteristik Wilayah Kerja :"
              required
            />

            <FormInput
              select={true}
              id="pelayanan"
              options={pelayananOptions}
              value={selectedPelayanan}
              onChange={handlePelayananChange}
              placeholder={"Pilih Pelayanan"}
              label="Pelayanan :"
              required
            />

            {/* <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="nomor_telpon"
                >
                  Nomor Telpon :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="nomor_telpon"
                  value={formData.nomor_telpon}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Nomor Telpon"
                />
              </div>
            </div>

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="email"
                >
                  Email :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  placeholder="Email"
                />
              </div>
            </div> */}

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="status_puskesmas"
                >
                  Status Puskesmas :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="status_puskesmas"
                  value={formData.status_puskesmas}
                  onChange={handleChange}
                  type="text"
                  placeholder="Status Puskesmas"
                />
              </div>
            </div>

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="keterangan"
                >
                  Keterangan :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <textarea
                  id="keterangan"
                  rows="4"
                  value={formData.keterangan}
                  onChange={handleChange}
                  className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  placeholder="Keterangan Puskesmas"
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

export default TambahPuskesmas;
