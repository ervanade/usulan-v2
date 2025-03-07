import React, { useEffect, useRef, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import NoImage from "../../assets/no-image.png";
import SignatureCanvas from "react-signature-canvas";
import {
  dataBarang,
  dataDistribusiBekasi,
  dataKecamatan,
  dataPuskesmas,
  konfirmasiOptions,
} from "../../data/data";
import axios from "axios";

const ModalTTENew = ({ isVisible, onClose, setShowPopup, jsonData, user }) => {
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef(null);

  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("tab2");
  const [loading, setLoading] = useState(false);
  const [setuju, setSetuju] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    id_dokumen: jsonData?.id || "",
    dokumen_array: jsonData?.dokumen_array || [],
  });

  const navigate = useNavigate();
  //   const [showModal, setShowModal] = useState(false);

  const [previewImages, setPreviewImages] = useState({
    ttd: null,
  });

  useEffect(() => {
    if (user?.ttd) {
      setPreviewImages({ ttd: user?.ttd });
    }
  }, [user?.ttd, isVisible]);

  useEffect(() => {
    // Reset setuju setiap kali modal ditutup atau dibuka kembali
    if (!isVisible) {
      setSetuju(false);
    }
  }, [isVisible]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id_dokumen: jsonData?.id,
      dokumen_array: jsonData?.dokumen_array,
    }));
  }, [jsonData]);

  const onSaveSignature = (signatureDataURL) => {
    setSignature(signatureDataURL);
    setFile(null); // Clear file if a signature is saved
  };

  const handleSaveSignature = () => {
    if (signatureRef.current.isEmpty()) {
      alert("Anda belum TTE");
      return;
    }
    const signatureDataURL = signatureRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    onSaveSignature(signatureDataURL);
    onClose();
  };

  const handleUploadFile = (event) => {
    setFile(event.target.files[0]);
    setSignature(null); // Clear signature if a file is uploaded
    // setShowPopup(false);
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleTabChange = (event, tab) => {
    event.preventDefault();
    setActiveTab(tab);
  };

  const handleResetSignature = () => {
    signatureRef?.current?.clear();
    onSaveSignature(null);
    setPreviewImages((prev) => ({ ...prev, ttd: null }));
    setFile(null);
    // onClose();
  };

  const cekTte = async () => {
    setLoading(true);

    // Validasi jika tidak ada TTE (signature atau file)

    Swal.fire({
      title: "TTE dokumen...",
      text: "Tunggu Sebentar TTE Dokumen Disiapkan...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    const formDataToSend = new FormData();

    // Jika previewImages.ttd tersedia, ubah menjadi File
    if (previewImages?.ttd) {
      const response = await fetch(previewImages.ttd);
      const blob = await response.blob();
      const fileFromTtd = new File([blob], "signature.png", {
        type: "image/png",
      });
      if (user?.role == "3") {
        formDataToSend.append("tte_daerah", fileFromTtd);
      } else if (user?.role == "4") {
        formDataToSend.append("tte_ppk", fileFromTtd);
      }
    } else if (file) {
      // Jika file diunggah
      if (user?.role == "3") {
        formDataToSend.append("tte_daerah", file);
      } else if (user?.role == "4") {
        formDataToSend.append("tte_ppk", file);
      }
    } else if (signatureRef?.current) {
      // Jika signature (dari canvas)
      const trimmedCanvas = signatureRef.current.getTrimmedCanvas();
      if (trimmedCanvas) {
        const signatureDataURL = trimmedCanvas.toDataURL("image/png");
        const signatureFile = dataURLtoFile(signatureDataURL, "signature.png"); // Konversi Base64 ke File
        if (user?.role == "3") {
          formDataToSend.append("tte_daerah", signatureFile);
        } else if (user?.role == "4") {
          formDataToSend.append("tte_ppk", signatureFile);
        }
      }
    }
    if (formData?.dokumen_array?.length > 0) {
      formDataToSend.append(
        "id_dokumen",
        JSON.stringify(formData?.dokumen_array?.map((a) => a.id))
      );
    } else {
      formDataToSend.append("id_dokumen", formData?.id_dokumen);
    }

    // Kirim FormData ke API
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/update/tte${
          formData?.dokumen_array?.length > 0 ? "all" : ""
        }`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      Swal.fire("Dokumen Berhasil di TTE!", "", "success");
      navigate("/dokumen");
    } catch (error) {
      Swal.fire("Gagal TTE! Dokumen Tidak Ditemukan", "", "error");
      console.error(error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleTTE = () => {
    if (!user.name || !user.nip || !user.profile) {
      Swal.fire("Error", "Anda Belum Input Nama / NIP / Logo", "error");
      navigate("/profile");
      setLoading(false);
      return;
    }
    if (!setuju) {
      Swal.fire("Error", "Anda Belum Menyetujui TTE", "warning");
      setLoading(false);
      return;
    }
    if (!previewImages?.ttd && !signatureRef.current && !file) {
      Swal.fire("Error", "Anda Belum TTE", "warning");
      setLoading(false);
      return;
    }
    Swal.fire({
      title: "Perhatian",
      text: "Jumlah dikirim dan diterima sudah sesuai, tandatangani BAST ini?",
      showCancelButton: true,
      denyButtonColor: "#3B82F6",
      confirmButtonColor: "#16B3AC",
      confirmButtonText: "Ya",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        cekTte();
      }
    });
  };
  return (
    <>
      {/* <button
        className="bg-primary text-black active:bg-primary 
      font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Fill Details
      </button> */}
      {isVisible ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
            <div className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"></div>
            <div className="relative my-6 mx-auto w-[85%] max-h-[90%] overflow-auto sm:w-3/4 xl:w-1/2 z-1">
              <div className="bg-white p-4 rounded shadow-md w-full h-full">
                <div className="flex justify-between items-center border-b border-gray-300 mb-4 pb-2">
                  <h2 className="text-lg font-bold text-teal-500">
                    TTE Langsung Dokumen {jsonData?.nama_dokumen || ""}
                  </h2>
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                  >
                    <MdClose className="text-gray-500 opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full" />
                  </button>
                </div>
                <div className="tabs mb-4 flex space-x-4">
                  <button
                    className={`px-4 py-2 font-bold border-b-2 ${
                      activeTab == "tab1"
                        ? "border-teal-500"
                        : "border-transparent"
                    }`}
                    onClick={(e) => handleTabChange(e, "tab1")}
                  >
                    Upload File
                  </button>
                  <button
                    className={`px-4 py-2 font-bold border-b-2 ${
                      activeTab == "tab2"
                        ? "border-teal-500"
                        : "border-transparent"
                    }`}
                    onClick={(e) => handleTabChange(e, "tab2")}
                  >
                    Gambar TTE
                  </button>
                </div>
                <div className="tab-content">
                  {activeTab == "tab1" && (
                    <div
                      id="tab1"
                      className="tab-pane h-64 w-full flex flex-col items-center justify-center"
                    >
                      {previewImages?.ttd ? (
                        <>
                          <div className="mb-4">
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
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleResetSignature}
                          >
                            Reset TTE
                          </button>
                        </>
                      ) : (
                        <div
                          id="FileUpload"
                          className="relative my-2 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-4.5"
                        >
                          <input
                            type="file"
                            onChange={handleUploadFile}
                            accept="image/png"
                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          />
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <p>
                              <span className="text-primary">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="mt-1.5">
                              Disarankan Background Berwarna Putih
                            </p>
                            <p>(FILE PNG, 800 X 800px)</p>
                          </div>
                        </div>
                      )}

                      {/* <input
                        type="file"
                        className="appearance-none block mt-4 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        onChange={onUploadFile}
                      /> */}
                      {file && !previewImages.ttd && (
                        <div className="my-2">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Preview File
                          </label>
                          <img
                            src={URL.createObjectURL(file)}
                            alt="File"
                            className="w-24 mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab == "tab2" && (
                    <div
                      id="tab2"
                      className="tab-pane h-64 w-full flex flex-col items-center justify-center"
                    >
                      {previewImages?.ttd ? (
                        <>
                          <div className="mb-4">
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
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleResetSignature}
                          >
                            Reset TTE
                          </button>
                        </>
                      ) : (
                        <>
                          <SignatureCanvas
                            ref={signatureRef}
                            canvasProps={{
                              width: 400,
                              height: 200,
                              className: "border border-gray-300",
                            }}
                          />
                          <div className="flex space-x-2 mt-4">
                            {/* <button
                          type="button"
                          className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded"
                          onClick={handleSaveSignature}
                        >
                          Save TTE
                        </button> */}
                            <button
                              type="button"
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              onClick={handleResetSignature}
                            >
                              Reset TTE
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <div className="my-2 px-4">
                    <p className="mb-1 ">
                      Apakah Anda ingin TTE dokumen berikut?
                    </p>
                    <ul className="">
                      {formData?.dokumen_array?.length > 0 &&
                        formData?.dokumen_array?.map((item, index) => (
                          <li key={index}>
                            <strong>
                              {index + 1}. {item?.nama_dokumen}
                            </strong>
                          </li>
                        ))}
                    </ul>
                  </div>{" "}
                  <div className="w-full flex items-center py-4 mb-4 justify-self-center place-items-center">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      checked={setuju}
                      onChange={() => setSetuju(!setuju)}
                      className="cursor-pointer w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-checkbox"
                      className="ms-2 text-sm md:text-lg font-medium text-[#728294] dark:text-gray-300 cursor-pointer"
                    >
                      Dengan ini Saya Menyetujui Bast Naskah Hibah Milik
                      Negara Untuk di Tanda Tangani
                    </label>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={handleTTE}
                      disabled={loading}
                      className="bg-primary hover:bg-primary text-white font-bold py-3 px-6 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ModalTTENew;
