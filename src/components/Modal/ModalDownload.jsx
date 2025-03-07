import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { encryptId, selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { FaDownload } from "react-icons/fa";

const ModalDownload = ({
  show,
  onClose,
  onSave,
  editIndex,
  jsonData,
  user,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dokumenData, setDokumenData] = useState(null); // State to store document data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    id_provinsi: jsonData?.id_provinsi || 0,
    id_kabupaten: jsonData?.id_kabupaten || 0,
  });
  const navigate = useNavigate();
  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/laporan/getdokumen`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: JSON.stringify({
          id_provinsi: jsonData?.id_provinsi || 0,
          id_kabupaten: jsonData?.id_kabupaten || 0,
        }),
      });
      setDokumenData(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchDokumen(); // Fetch document data when modal is shown
    }
  }, [show]); // Re-run when 's
  const cekTte = async () => {
    if (!formData.email && !formData.password) {
      Swal.fire("Error", "Form Belum Lengkap Diisi", "error");
      setLoading(false);
      return;
    }
    if (!user.ttd || !user.name || !user.nip) {
      Swal.fire("Error", "Anda Belum Input TTE / Nama / NIP", "error");
      navigate("/profile");
      setLoading(false);
      return;
    }
    await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/api/update/tte`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      data: JSON.stringify(formData),
    })
      .then(function (response) {
        Swal.fire("Dokumen Berhasil di TTE!", "", "success");
        navigate("/dokumen");
      })
      .catch((error) => {
        Swal.fire(
          "Gagal TTE! Pastikan TTE, Nama, NIP Sudah di Input",
          "",
          "error"
        );
        navigate("/profile");
        setLoading(false);
        console.log(error);
      });
  };

  const handleSave = () => {
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
    setFormData({
      email: "",
      password: "",
      id_dokumen: jsonData?.id || "",
    });
    onClose();
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id_provinsi: jsonData?.id_provinsi,
      id_kabupaten: jsonData?.id_kabupaten,
    }));
  }, [jsonData]);

  if (!show) {
    return null;
  }

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
      <div className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"></div>
      <div className="relative my-6 mx-auto w-[85%] max-h-[90%] overflow-auto sm:w-3/4 xl:w-1/2 z-1">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-black/20 rounded-t ">
            <h3 className="text-xl font-bold text-primary">Download Laporan</h3>
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
              <ol className="!list-decimal">
                {dokumenData ? (
                  dokumenData.map((item, index) => (
                    <li
                      className="flex items-center justify-between text-bodydark1"
                      key={index}
                    >
                      <div className="flex items-center gap-4">
                        <span className="me-1 sm:me-4">{index + 1}.</span>
                        <img
                          src="/pdf-icon.png"
                          alt=""
                          className="h-5 w-5 sm:h-8 sm:w-8"
                        />
                        <p className="text-bodydark1">{item?.nama_dokumen}</p>
                      </div>

                      <button
                        title="Download"
                        className="text-green-400 hover:text-green-500"
                      >
                        <Link
                          className="flex items-center p-2 gap-2 bg-white text-teal-500 rounded-md"
                          to={`/dokumen/preview-dokumen/${encodeURIComponent(
                            encryptId(item?.id)
                          )}`}
                        >
                          <FaDownload size={16} />
                          <span className="hidden sm:block">Download</span>
                        </Link>
                      </button>
                    </li>
                  ))
                ) : (
                  <div className="flex justify-center items-center">
                    <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
                    <span className="ml-2">Loading...</span>
                  </div>
                )}
              </ol>
            </div>
            <div className="flex items-center justify-end p-6 border-t gap-2 border-solid border-black/20 rounded-b">
              <button
                className="text-red-500 border-red-500 border background-transparent rounded-md font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDownload;
