import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import {
  dataBarang,
  dataKecamatan,
  dataPuskesmas,
  roleOptions,
} from "../../data/data";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axios from "axios";
import { validateForm } from "../../data/validationUtils";

const TambahUser = () => {
  const [formData, setFormData] = useState({
    password: "",
    email: "",
    c_password: "",
    username: "",
    name: "",
    role: roleOptions[2].value,
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    nip: "",
    no_tlp: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const symbol = /[\W_]/.test(password); // Simbol apa pun

    setValidations({ length, uppercase, lowercase, number, symbol });

    if (!length || !uppercase || !lowercase || !number || !symbol) {
      setPasswordError("Password harus memenuhi semua persyaratan format!");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));
    validatePassword(password);
  };

  const navigate = useNavigate();
  const user = useSelector((a) => a.auth.user);

  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKota, setSelectedKota] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedRole, setSelectedRole] = useState(roleOptions[2]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const tambahUser = async () => {
    if (formData.password !== formData.c_password) {
      Swal.fire(
        "Error",
        "Password Tidak Sama dengan Confirm Password",
        "error"
      );
      setLoading(false);
      return;
    }
    if (formData.role == "3" && (!formData.provinsi || !formData.kabupaten)) {
      Swal.fire(
        "Error",
        "Jika User Daerah Harap Masukan Provinsi & Kabupaten",
        "error"
      );
      setLoading(false);
      return;
    }
    try {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/register`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: JSON.stringify({
          ...formData,
          provinsi: formData.provinsi.toString(),
          kabupaten: formData.kabupaten.toString(),
          kecamatan: formData.kecamatan.toString(),
        }),
      });
      Swal.fire("Data Berhasil di Input!", "", "success");
      navigate("/user-management");
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.response.status == 500) {
        Swal.fire("Error", "Email Telah Digunakan", "error");
        setLoading(false);
        return;
      }
    }
  };
  const handleSimpan = async (e) => {
    e.preventDefault();
    const isPasswordValid = Object.values({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password),
      symbol: /[\W_]/.test(formData.password),
    }).every(Boolean);
    if (!isPasswordValid) {
      Swal.fire("Error", "Format password tidak sesuai!", "error");
      return;
    }

    if (
      !validateForm(formData, [
        "name",
        "username",
        "email",
        "password",
        "c_password",
        "role",
        "nip",
        "kabupaten",
        "kecamatan",
        "nip",
        "no_tlp",
      ])
    )
      return;
    setLoading(true);
    tambahUser();
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
      provinsi: selectedOption ? selectedOption.value : "",
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
      kabupaten: selectedOption ? selectedOption.value : "",
    }));
    if (selectedOption) {
      fetchKecamatan(selectedOption.value);
    }
  };

  const handleKecamatanChange = (selectedOption) => {
    setSelectedKecamatan(selectedOption);
    setFormData((prev) => ({
      ...prev,
      kecamatan: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
    setFormData((prev) => ({
      ...prev,
      role: selectedOption ? selectedOption.value : "",
    }));
  };

  return (
    <div>
      <Breadcrumb pageName="Form Input Data User" />
      <Card>
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            {user.role == "1" ? "Form Input Data User" : ""}
          </h1>
          <div>
            <Link
              to="/user-management"
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  type="email"
                  required
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row sm:gap-8">
              {/* Label */}
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="password"
                >
                  Password :
                </label>
              </div>

              {/* Input & Error Message */}
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`w-full bg-white appearance-none border rounded-md py-3 px-3 text-[#728294] leading-tight 
                        focus:outline-none focus:shadow-outline dark:bg-transparent
                        ${
                          passwordError
                            ? "border-red-500"
                            : formData.password
                            ? "border-green-500"
                            : "border-[#cacaca]"
                        }`}
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="*******"
                />
                {passwordError && formData.password && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
                {/* ✅ Persyaratan Password (Responsive) */}

                <div className="mt-4 sm:w-[40%] rounded-md bg-gray-50 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800 mb-2">
                    Syarat Password:
                  </p>
                  <p
                    className={
                      validations.length ? "text-green-600" : "text-red-500"
                    }
                  >
                    ✓ Minimal 8 karakter
                  </p>
                  <p
                    className={
                      validations.uppercase ? "text-green-600" : "text-red-500"
                    }
                  >
                    ✓ Mengandung huruf besar
                  </p>
                  <p
                    className={
                      validations.lowercase ? "text-green-600" : "text-red-500"
                    }
                  >
                    ✓ Mengandung huruf kecil
                  </p>
                  <p
                    className={
                      validations.number ? "text-green-600" : "text-red-500"
                    }
                  >
                    ✓ Mengandung angka
                  </p>
                  <p
                    className={
                      validations.symbol ? "text-green-600" : "text-red-500"
                    }
                  >
                    ✓ Mengandung simbol (@, #, !, dll.)
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="password"
                >
                  Confirm Password :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="c_password"
                  required
                  type="password"
                  value={formData.c_password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      c_password: e.target.value,
                    }))
                  }
                  placeholder="*******"
                />
              </div>
            </div>

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="email"
                >
                  Username :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  type="text"
                  required
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="email"
                >
                  Nama :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  type="text"
                  required
                  placeholder="Nama"
                />
              </div>
            </div>
            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="nip"
                >
                  NIP :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="nip"
                  value={formData.nip}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nip: e.target.value,
                    }))
                  }
                  type="text"
                  required
                  placeholder="NIP"
                />
              </div>
            </div>
            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="no_tlp"
                >
                  No Handphone :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="no_tlp"
                  value={formData.no_tlp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      no_tlp: e.target.value,
                    }))
                  }
                  type="text"
                  required
                  placeholder="No Handphone"
                />
              </div>
            </div>
            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="email"
                >
                  Role :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <Select
                  options={roleOptions}
                  value={selectedRole}
                  onChange={handleRoleChange}
                  placeholder="Pilih Role"
                  className="w-full"
                  theme={selectThemeColors}
                />
              </div>
            </div>

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="email"
                >
                  Provinsi :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
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

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="email"
                >
                  Kabupaten / Kota :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
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

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="email"
                >
                  Kecamatan :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <Select
                  options={dataKecamatan}
                  value={selectedKecamatan}
                  isDisabled={!selectedKota}
                  onChange={handleKecamatanChange}
                  placeholder={
                    selectedKota ? "Pilih Kecamatan" : "Pilih Kab / Kota Dahulu"
                  }
                  className="w-full"
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

export default TambahUser;
