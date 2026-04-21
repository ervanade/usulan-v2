import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import { verifyUsulanDetail } from "../../api/services/usulanService";

const ModalVerifikasiUsulan = ({ show, onClose, data, onSave }) => {
  const [formData, setFormData] = useState({
    status_verifikasi: "1",
    keterangan: "",
    periode_id: 0,
  });

  const statusOptions = [
    { value: "1", label: "Belum Verifikasi" },
    { value: "2", label: "Sudah Verifikasi" },
    { value: "3", label: "Perlu Revisi" },
  ];

  useEffect(() => {
    if (data) {
      setFormData({
        status_verifikasi: data.status_verifikasi || "1",
        keterangan: data.keterangan|| data.catatan_verifikasi || "",
        periode_id: data.periode_id || 0,
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmResult = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda akan menyimpan verifikasi ini.",
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

        await verifyUsulanDetail(data.id_usulan, data.id_puskesmas, formData);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Verifikasi berhasil disimpan.",
        });
        
        if (onSave) onSave();
        onClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan verifikasi.",
        });
      }
    }
  };

  if (!show) return null;

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
      <div className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"></div>
      <div className="relative my-6 mx-auto w-[85%] max-h-[90%] min-h-[60%] overflow-auto sm:w-3/4 xl:w-1/2 z-1">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-black/20 rounded-t">
            <h3 className="text-xl font-bold text-primary">
              Verifikasi Usulan
            </h3>
            <button
              className="bg-transparent border-0 text-black float-right"
              onClick={onClose}
            >
              <MdClose className="text-gray-500 opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full" />
            </button>
          </div>
          
          <div className="p-6 flex-auto">
            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-md border border-slate-200">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Puskesmas</p>
                <p className="text-sm font-medium">{data?.nama_puskesmas || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Kabupaten/Kota</p>
                <p className="text-sm font-medium">{data?.kabupaten || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Provinsi</p>
                <p className="text-sm font-medium">{data?.provinsi || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Periode</p>
                <p className="text-sm font-medium">{data?.periode_name || "-"}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#728294] text-sm font-semibold mb-1">
                  Status Verifikasi
                </label>
                <Select
                  options={statusOptions}
                  value={statusOptions.find(opt => opt.value === formData.status_verifikasi)}
                  onChange={(opt) => setFormData({ ...formData, status_verifikasi: opt.value })}
                  theme={selectThemeColors}
                  placeholder="Pilih Status Verifikasi"
                  className="text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#728294] text-sm font-semibold mb-1">
                  Catatan Verifikasi
                </label>
                <textarea
                  className="w-full bg-white border border-[#cacaca] focus:border-[#0ACBC2] rounded-md py-2 px-3 text-sm text-[#728294] focus:outline-none h-24"
                  placeholder="Masukkan catatan verifikasi..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-solid border-black/20 gap-2">
                <button
                  className="text-red-500 border-red-500 border background-transparent rounded-md font-bold uppercase px-6 py-2 text-xs outline-none focus:outline-none"
                  type="button"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  className="bg-primary text-white font-bold py-2 px-6 rounded-md text-xs focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Simpan Verifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerifikasiUsulan;
