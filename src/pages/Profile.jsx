import React, { useEffect, useState, useRef } from "react";
import UserDefault from "../assets/user/user-default.png";
import NoImage from "../assets/no-image.png";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import SignatureCanvas from "react-signature-canvas";
import Select from "react-select";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import { roleOptions } from "../data/data";
import axios from "axios";
import ModalProfile from "../components/Modal/ModalProfile";
import { selectThemeColors } from "../data/utils";
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/authSlice";
import { validateFileFormat, validateForm } from "../data/validationUtils";

const Profile = () => {
  const [signature, setSignature] = useState(null);
  const [file, setFile] = useState(null);
  const [getLoading, setGetLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("tab2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [previewImages, setPreviewImages] = useState({
    profile: null,
    ttd: null,
  });

  const dispatch = useDispatch();

  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [listProvinsi, setListProvinsi] = useState([]);
  const [listKecamatan, setListKecamatan] = useState([]);
  const [listKabupaten, setListKabupaten] = useState([]);
  const navigate = useNavigate();

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleSaveSignature = (signatureDataURL) => {
    setSignature(signatureDataURL);
    setFile(null); // Clear file if a signature is saved
  };

  const handleUploadFile = (event) => {
    setFile(event.target.files[0]);
    setSignature(null); // Clear signature if a file is uploaded
    setShowPopup(false);
  };

  const handleTabChange = (event, tab) => {
    event.preventDefault();
    setActiveTab(tab);
  };

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    role: roleOptions[2],
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    nip: "",
    no_tlp: "",
    profile: null,
    ttd: null,
  });
  const user = useSelector((a) => a.auth.user);
  const fetchProvinsiData = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/provinsi`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setListProvinsi(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchKota = async () => {
    setGetLoading(true);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kabupaten`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setListKabupaten(response.data.data);
    } catch (error) {
      setError(true);
      setListKabupaten([]);
    }
  };

  const fetchKecamatan = async () => {
    setGetLoading(true);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kecamatan`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setListKecamatan(response.data.data);
    } catch (error) {
      setError(true);
      setListKecamatan([]);
    }
  };
  const fetchUserData = async () => {
    setGetLoading(true);
    try {
      // eslint-disable-next-line
      const responseUser = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/me`,
        headers: {
          "Content-Type": "application/json",
          //eslint-disable-next-line
          Authorization: `Bearer ${user?.token}`,
        },
      }).then(function (response) {
        // handle success
        // console.log(response)
        const data = response.data.data;
        setFormData({
          name: data.name,
          nip: data.nip,
          no_tlp: data.no_tlp,
          role: data.role,
          email: data.email,
          profile: data.profile,
          provinsi: data.provinsi,
          kabupaten: data.kabupaten,
          kecamatan: data.kecamatan,
          username: data.username,
          ttd: data.ttd,
        });
        setPreviewImages({
          profile: data.profile ? `${data.profile}` : null,
          ttd: data.ttd ? `${data.ttd}` : null,
        });
      });
      setGetLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserData();
    if (user.role == "3") {
      fetchProvinsiData();
      fetchKota();
      fetchKecamatan();
    }
  }, []);

  const editProfile = async () => {
    // if (!file && !signature && !formData.ttd) {
    //   Swal.fire("Error", "TTE Masih Kosong", "error");
    //   return;
    // }
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("nip", formData.nip);
    formDataToSend.append("no_tlp", formData.no_tlp);
    formDataToSend.append("profile", formData.profile);
    if (file) {
      formDataToSend.append("ttd", file || formData.ttd);
    } else if (signature) {
      const response = await fetch(signature);
      const blob = await response.blob();
      formDataToSend.append(
        "ttd",
        new File([blob], `tte-${user?.nip || ""}.png`, { type: "image/png" })
      );
    }
    setLoading(true);
    await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/api/updateme`,
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      data: formDataToSend,
    })
      .then(function (response) {
        const data = response.data.data;
        dispatch(
          loginUser({
            ...user,
            profile: data.profile,
            ttd: data.ttd,
            username: data.username,
            name: data.name,
            nip: data.nip,
            no_tlp: data.no_tlp,
          })
        );
        fetchUserData();
        Swal.fire("Data Berhasil di Update!", "", "success");
        navigate("/profile");
        setLoading(true);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!validateForm(formData, ["email", "name", "username", "nip", "no_tlp"])) return;
    if (
      !validateFileFormat(
        formData.profile,
        ["png", "jpg", "jpeg"],
        2,
        "Profile"
      )
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
        editProfile();
      }
    });
  };

  useEffect(() => {
    if (formData.provinsi && listProvinsi.length > 0) {
      const initialOption = listProvinsi.find(
        (prov) => prov.id == formData.provinsi
      );
      if (initialOption) {
        setSelectedProvinsi({
          label: initialOption.name,
          value: initialOption.id,
        });
      }
    }
    if (formData.kecamatan && listKecamatan.length > 0) {
      const initialOption = listKecamatan.find(
        (kec) => kec.id == formData.kecamatan
      );
      if (initialOption) {
        setSelectedKecamatan({
          label: initialOption.name,
          value: initialOption.id,
        });
      }
    }
  }, [formData, listProvinsi, listKecamatan]);

  const handleChangeProfile = (event) => {
    const { id, value, files } = event.target;
    let file = files?.[0];

    if (!file) return;

    // **1. Cek ukuran file (Maks 2MB)**
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "Ukuran gambar harus di bawah 2 MB!", "error");
      event.target.value = ""; // Reset input file
      return;
    }

    // **2. Validasi ekstensi file (PNG, JPG, JPEG)**
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire(
        "Error",
        "Hanya format PNG, JPG, dan JPEG yang diperbolehkan!",
        "error"
      );
      event.target.value = ""; // Reset input file
      return;
    }

    // **3. Validasi isi file (Magic Number)**
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const uint = new Uint8Array(e.target.result).subarray(0, 4);
      const header = uint.reduce((acc, byte) => acc + byte.toString(16), "");

      const validMagicNumbers = [
        "89504e47",
        "ffd8ffe0",
        "ffd8ffe1",
        "ffd8ffe2",
      ];
      if (!validMagicNumbers.includes(header)) {
        Swal.fire(
          "Warning",
          "Format gambar tidak sesuai atau mengandung karakter berbahaya!",
          "warning"
        );
        event.target.value = ""; // Reset input file
        return;
      }

      // **4. Sanitasi Nama File (Mencegah XSS)**
      file = new File(
        [file],
        DOMPurify.sanitize(file.name.replace(/[^a-zA-Z0-9_.-]/g, "")),
        { type: file.type }
      );

      // **5. Buat preview aman**
      const imgReader = new FileReader();
      imgReader.onloadend = () => {
        setPreviewImages((prev) => ({ ...prev, profile: imgReader.result }));
      };
      imgReader.readAsDataURL(file);

      // **6. Simpan file setelah validasi**
      setFormData((prev) => ({ ...prev, profile: file }));
    };

    // **Abort FileReader Sebelum Membaca Ulang**
    fileReader.abort();
    fileReader.readAsArrayBuffer(file); // Membaca header file untuk validasi Magic Number
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
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 ">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informasi Personal
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSimpan}>
                <div className="mb-5.5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full overflow-hidden">
                      {formData.profile && previewImages.profile && (
                        <img
                          src={previewImages.profile || UserDefault}
                          className="rounded-full"
                          alt="Profile Preview"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = UserDefault;
                          }}
                        />
                      )}
                      {!formData.profile && !previewImages.profile && (
                        <img
                          src={UserDefault}
                          className="rounded-full"
                          alt="Profile Preview"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = UserDefault;
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Logo Anda
                      </span>
                    </div>
                  </div>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full xl:w-3/4 cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-4"
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleChangeProfile}
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <p>
                        <span className="text-primary">Upload Logo Anda</span>
                      </p>
                      <p className="mt-1.5">PNG, JPG</p>
                      <p>(max: 2MB size:800 X 800px)</p>
                    </div>
                    {formData.profile && previewImages.profile && (
                      <img
                        src={previewImages.profile || UserDefault}
                        className="rounded-md mt-2 h-[100px] mx-auto"
                        alt="Profile Preview"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = UserDefault;
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                            fill=""
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                    <input
                      className="w-full rounded border disabled:bg-slate-200 cursor-not-allowed border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      placeholder="Email"
                      disabled
                      value={formData.email}
                      // onChange={(e) =>
                      //   setFormData((prev) => ({
                      //     ...prev,
                      //     email: e.target.value,
                      //   }))
                      // }
                    />
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Username
                  </label>
                  <input
                    className="w-full rounded border border-stroke cursor-not-allowed disabled:bg-slate-200 bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="Username"
                    id="Username"
                    disabled
                    placeholder="Username"
                    value={formData.username}
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     username: e.target.value,
                    //   }))
                    // }
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="nama"
                  >
                    Nama
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="nama"
                    id="nama"
                    placeholder="nama"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Nip"
                  >
                    NIP
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="Nip"
                    id="Nip"
                    placeholder="NIP"
                    value={formData.nip}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nip: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Nip"
                  >
                    No Handphone
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="Nip"
                    id="no_tlp"
                    placeholder="No Handphone"
                    value={formData.no_tlp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        no_tlp: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Role"
                  >
                    Role
                  </label>
                  <p>
                    {formData.role == "1"
                      ? "Admin"
                      : formData.role == "2"
                      ? "PPK"
                      : formData.role == "3"
                      ? "User"
                      : formData.role == "4"
                      ? "Direktur"
                      : ""}
                  </p>
                  {/* <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="Role"
                    id="Role"
                    disabled
                    placeholder="Role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                  /> */}
                </div>
                {user.role == "3" ? (
                  <>
                    {" "}
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Role"
                      >
                        Provinsi
                      </label>
                      {listProvinsi?.length > 0 &&
                        formData?.provinsi &&
                        listProvinsi?.find((x) => x.id == formData?.provinsi)
                          ?.name}
                    </div>
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Role"
                      >
                        Kab / Kota
                      </label>
                      {listKabupaten?.length > 0 &&
                        formData?.kabupaten &&
                        listKabupaten?.find((x) => x.id == formData?.kabupaten)
                          ?.name}
                    </div>
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Role"
                      >
                        Kecamatan
                      </label>
                      {listKecamatan?.length > 0 &&
                        formData?.kecamatan &&
                        listKecamatan?.find((x) => x.id == formData?.kecamatan)
                          ?.name}
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className="flex justify-center gap-4.5">
                  {/* <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="submit"
                  >
                    Cancel
                  </button> */}
                  <button
                    className="flex justify-center rounded bg-primary py-3 px-8 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-2 hidden">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                TTE Anda
              </h3>
            </div>
            <div className="p-7">
              <form className="p-4">
                <button
                  type="button"
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-3 w-full rounded mb-4"
                  onClick={handleOpenPopup}
                >
                  Input TTE
                </button>

                {!file && !signature && !previewImages.ttd ? (
                  <div className="w-full  rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5 ">
                    <p className="text-center text-red-400 p-2 font-semibold">
                      Anda Belum Input TTE!
                    </p>
                  </div>
                ) : null}

                {file ? (
                  <div className="mb-6">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center">
                      Preview TTE
                    </label>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="File"
                      className="w-48 mx-auto py-2"
                      style={{ width: "200px", height: "100px" }}
                    />
                  </div>
                ) : signature ? (
                  <div className="mb-6">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center">
                      Preview TTE
                    </label>
                    <img
                      src={signature}
                      alt="Signature"
                      className="w-48 mx-auto py-2"
                      style={{ width: "200px", height: "100px" }}
                    />
                  </div>
                ) : previewImages.ttd ? (
                  <div className="mb-6">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center">
                      Preview TTE
                    </label>
                    <img
                      src={previewImages.ttd || NoImage}
                      className="w-48 mx-auto py-2 rounded-md"
                      alt="Profile Preview"
                      style={{ width: "200px", height: "100px" }}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = NoImage;
                      }}
                    />
                  </div>
                ) : null}

                <ModalProfile
                  isVisible={showPopup}
                  onClose={() => setShowPopup(false)}
                  onSaveSignature={handleSaveSignature}
                  onUploadFile={handleUploadFile}
                  signature={signature}
                  file={file}
                  activeTab={activeTab}
                  handleTabChange={handleTabChange}
                />

                <div className="flex justify-center mt-4">
                  {/* <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save
                  </button> */}
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => {
                      setSignature(null);
                      setFile(null);
                      setFormData((prev) => ({ ...prev, ttd: null }));
                      setPreviewImages((prev) => ({ ...prev, ttd: null }));
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
