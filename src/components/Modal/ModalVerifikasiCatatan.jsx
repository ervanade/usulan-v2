import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";

const ModalVerifikasiCatatan = ({
  show,
  onClose,
  data,
  onSave,
  apiUrl,
  method = "post",
  extraPayload = {},
  title = "Verifikasi Catatan",
  info = [], // Array of { label, value }
}) => {
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (show && data) {
      setCatatan(data.keterangan || data.catatan_verifikasi || "");
    } else if (!show) {
      setCatatan("");
    }
  }, [show, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmResult = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda akan menyimpan catatan verifikasi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16B3AC",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        Swal.fire({
          title: "Menyimpan...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const payload = {
          keterangan: catatan,
          ...extraPayload,
        };

        if (method.toLowerCase() === "put") {
          await axiosInstance.put(apiUrl, payload);
        } else {
          await axiosInstance.post(apiUrl, payload);
        }

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Catatan verifikasi berhasil disimpan.",
        });

        if (onSave) onSave();
        onClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan catatan verifikasi.",
        });
      }
    }
  };

  if (!show) return null;

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
      <div
        className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"
        onClick={onClose}
      ></div>
      <div className="relative my-6 mx-auto w-[90%] sm:w-[60%] lg:w-[40%] xl:w-[30%] z-1">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-4 border-b border-solid border-black/10 rounded-t">
            <h3 className="text-lg font-bold text-primary">{title}</h3>
            <button
              className="bg-transparent border-0 text-black float-right"
              onClick={onClose}
            >
              <MdClose className="text-gray-500 opacity-7 h-6 w-6 text-xl block bg-gray-200 py-0 rounded-full" />
            </button>
          </div>
          
          <div className="p-6 flex-auto">
            {/* Info Section */}
            {info.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-md border border-slate-200">
                {info.map((item, index) => (
                  <div key={index}>
                    <p className="text-xs text-slate-500 uppercase font-semibold">{item.label}</p>
                    <p className="text-sm font-medium">{item.value || "-"}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#728294] text-sm font-semibold mb-2">
                  Catatan Verifikasi
                </label>
                <textarea
                  className="w-full bg-white border border-[#cacaca] focus:border-[#0ACBC2] rounded-md py-2 px-3 text-sm text-[#728294] focus:outline-none h-32"
                  placeholder="Masukkan catatan verifikasi..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-solid border-black/10 gap-2">
                <button
                  className="text-red-500 border-red-500 border background-transparent rounded-md font-bold uppercase px-4 py-2 text-xs outline-none focus:outline-none"
                  type="button"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  className="bg-primary text-white font-bold py-2 px-6 rounded-md text-xs focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerifikasiCatatan;
