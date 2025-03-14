import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver"; // Pastikan Anda menginstal file-saver
import GenerateDokumen from "../Dokumen/GenerateDokumen";
import { validateFileFormat } from "../../data/validationUtils";

const ModalUploadDokumen = ({
  show,
  onClose,
  onSave,
  editIndex,
  jsonData,
  user,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [setuju, setSetuju] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    id_dokumen: jsonData?.id || "",
    fileDokumen: null,
    fileDokumenName: "",
  });
  const navigate = useNavigate();
  var today = new Date();

  const defaultDate = today.toISOString().substring(0, 10);
  const defaultImage =
    "https://media.istockphoto.com/id/1472819341/photo/background-white-light-grey-total-grunge-abstract-concrete-cement-wall-paper-texture-platinum.webp?b=1&s=170667a&w=0&k=20&c=yoY1jUAKlKVdakeUsRRsNEZdCx2RPIEgaIxSwQ0lS1k=";
  const uploadDokumen = async () => {
    if (!formData.fileDokumen) {
      Swal.fire("Error", "Form Belum Lengkap Diisi", "error");
      setLoading(false);
      return;
    }
    Swal.fire({
      title: "Upload dokumen...",
      text: "Tunggu Sebentar Upload Disiapkan...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    // if (!user.ttd || !user.name || !user.nip) {
    //   Swal.fire("Error", "Anda Belum Input TTE / Nama / NIP", "error");
    //   navigate("/profile");
    //   setLoading(false);
    //   return;
    // }

    const formDataToSend = new FormData();
    // formDataToSend.append("email", formData.email);
    // formDataToSend.append("password", formData.password);
    // formDataToSend.append("id_dokumen", formData.id_dokumen);
    if (formData.fileDokumen) {
      formDataToSend.append("file_upload", formData.fileDokumen);
    }
    await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/api/usulan/upload/${
        formData.id_dokumen
      }`,
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      data: formDataToSend,
    })
      .then(function (response) {
        Swal.fire("Dokumen Berhasil diUpload!", "", "success");
        navigate("/pdf-usulan-alkes");
      })
      .catch((error) => {
        Swal.fire("Gagal Upload Dokumen!", "", "error");
        setLoading(false);
        setSetuju(false);
        setFormData({
          email: "",
          password: "",
          id_dokumen: jsonData?.id || "",
          fileDokumen: null,
          fileDokumenName: "",
        });
        console.log(error);
      });
  };
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
        fileDokumenName: file.name,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSave = () => {
    if (!validateFileFormat(formData.fileDokumen, ["pdf"], 100, "File Dokumen"))
      return;
    if (!setuju) {
      Swal.fire("Warning", "Anda Belum Menyetujui Upload", "warning");
      setLoading(false);
      return;
    }
    Swal.fire({
      title: "Perhatian",
      text: "Anda tidak dapat mengubah data setelah mengupload. Lanjutkan?",
      showCancelButton: true,
      denyButtonColor: "#3B82F6",
      confirmButtonColor: "#027d77",
      confirmButtonText: "Ya",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        uploadDokumen();
      }
    });
    setFormData({
      email: "",
      password: "",
      id_dokumen: jsonData?.id || "",
    });
    onClose();
  };
  useEffect(() => {
    setFormData((prev) => ({ ...prev, id_dokumen: jsonData?.id }));
  }, [jsonData]);

  // const updateDownload = async (id) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios({
  //       method: "post",
  //       url: `${import.meta.env.VITE_APP_API_URL}/api/usulan/download/${id}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });
  //     fetchDokumenData();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDownload = async (id) => {
  //   const confirmResult = await Swal.fire({
  //     title: "Apakah Anda Yakin?",
  //     text: "Anda ingin mendownload dokumen usulan. Lanjutkan?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Ya, Download",
  //     cancelButtonText: "Batal",
  //   });

  //   // Jika pengguna memilih "Batal", hentikan proses
  //   if (!confirmResult.isConfirmed) {
  //     return;
  //   }
  //   try {
  //     Swal.fire({
  //       title: "Generate dokumen...",
  //       text: "Tunggu Sebentar Dokumen Disiapkan...",
  //       allowOutsideClick: false,
  //       showConfirmButton: false,
  //       willOpen: () => {
  //         Swal.showLoading();
  //       },
  //     });

  //     const response = await axios({
  //       method: "get",
  //       url: `${
  //         import.meta.env.VITE_APP_API_URL
  //       }/api/usulan/${encodeURIComponent(id)}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });

  //     const data = response.data.data;
  //     // Lakukan proses generate dokumen berdasarkan data JSON yang diterima
  //     let dataJson = {
  //       id: data.id,
  //       tgl_download: data.tgl_download || defaultDate,
  //       tgl_upload: data.tgl_upload || defaultDate,
  //       provinsi: data.provinsi || "",
  //       kabupaten: data.kabupaten || "",
  //       user_download: data.user_download || "",
  //       user_upload: data.user_upload || "",
  //       distribusi: data.usulan_detail || [],
  //       total_alkes: data.total_alkes || [],
  //     };
  //     const pdfBlob = await GenerateDokumen(dataJson, false); // GenerateDokumen harus mengembalikan Blob PDF

  //     saveAs(pdfBlob, `PDF Usulan ${dataJson.kabupaten}.pdf`);
  //     await updateDownload(dataJson?.id);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Download Complete",
  //       text: "Dokumen Sukses Di Download",
  //       confirmButtonText: "OK",
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Gagal Download Dokumen",
  //     });
  //     console.log(error);
  //   }
  // };

  if (!show) {
    return null;
  }

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
      <div className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"></div>
      <div className="relative my-6 mx-auto w-[85%] max-h-[90%] overflow-auto sm:w-3/4 xl:w-1/2 z-1">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-black/20 rounded-t ">
            <h3 className="text-xl font-bold text-primary">
              {editIndex !== null
                ? `Upload Dokumen ${jsonData?.kabupaten}`
                : `Upload Dokumen ${jsonData?.kabupaten}`}
            </h3>
            <button
              className="bg-transparent border-0 text-black float-right"
              onClick={onClose}
            >
              <MdClose className="text-gray-500 opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full" />
              {/* <span className="text-red-500 opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                    x
                  </span> */}
            </button>
          </div>
          <div className="modal-content">
            <form className="mt-5" onSubmit={handleSave}></form>
            <div className=" p-6 flex-auto w-full">
              <div className="flex items-center justify-between mb-4 gap-2">
                <p className="text-bodydark2 text-xs sm:text-sm  flex-1">
                  Petunjuk: Harap Download Dokumen Terlebih Dahulu & TTD Sebelum
                  Mengupload.
                </p>
                {/* <button
                  title="Download"
                  className="text-primary hover:text-graydark flex items-center gap-2"
                  onClick={() => handleDownload(jsonData?.id)} // Tambahkan handler download di sini
                >
                  <span className="hidden sm:block sm:text-sm">
                    Download Dokumen
                  </span>
                  <FaDownload size={16} />
                </button> */}
              </div>

              <div className="mt-6 mb-4 flex-col sm:gap-2 w-full flex ">
                <div className="">
                  <label
                    className=" block text-[#728294] text-base font-semibold mb-2"
                    htmlFor="email"
                  >
                    Dokumen Sudah TTD :
                  </label>
                </div>
                <div className="">
                  <div
                    id="FileUpload"
                    className="relative my-2 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-4.5"
                  >
                    <input
                      type="file"
                      id="fileDokumen"
                      onChange={handleChange}
                      accept="application/pdf"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {formData.fileDokumenName ? (
                        <div className="flex items-center">
                          <img
                            src="/pdf-icon.png"
                            alt=""
                            className="h-5 w-5 sm:h-8 sm:w-8"
                          />

                          <p className="text-gray-500 text-xs ml-4">
                            File: {formData.fileDokumenName}
                          </p>
                        </div>
                      ) : (
                        <p>
                          <span className="text-primary">
                            Click to Upload Dokumen
                          </span>{" "}
                          or drag and drop
                        </p>
                      )}
                      <p>(File PDF, Max: 100MB)</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 
              <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                <div className="">
                  <label
                    className=" block text-[#728294] text-base font-semibold mb-2"
                    htmlFor="email"
                  >
                    Email :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` bg-white disabled:bg-[#F2F2F2] appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="jumlah_barang_dikirim"
                    type="email"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    value={formData.email}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                <div className="">
                  <label
                    className="block text-[#728294] text-sm font-semibold mb-2"
                    htmlFor="password"
                  >
                    Password :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="*******"
                  />
                </div>
              </div> */}

              <div className="mt-8 mb-4 flex flex-col sm:flex-row sm:gap-8 sm:items-center">
                <div className="sm:flex-[5_5_0%] flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="persetujuan"
                    checked={setuju}
                    onChange={() => setSetuju(!setuju)}
                    className="cursor-pointer w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="persetujuan"
                    className="ms-2 text-sm md:text-lg font-medium text-[#728294] dark:text-gray-300 cursor-pointer"
                  >
                    Dengan ini Saya Menyetujui Data yang diisi adalah sebenarnya
                    dan dapat dipertanggungjawabkan
                  </label>
                </div>
              </div>
              <p className="text-center text-bodydark2 font-bold">
                Upload Dokumen Ini Sebagai{" "}
                {user?.role == "3" ? "User Daerah" : "Direktur"}
              </p>
            </div>
            <div className="flex items-center justify-end p-6 border-t gap-2 border-solid border-black/20 rounded-b">
              <button
                className="text-red-500 border-red-500 border background-transparent rounded-md font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="bg-primary  text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline mr-1 mb-1"
                type="submit"
                onClick={handleSave}
              >
                {"Upload Dokumen Ini"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUploadDokumen;
