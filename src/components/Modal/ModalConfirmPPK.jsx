import React, { useEffect, useRef, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import SignatureCanvas from "react-signature-canvas";
import {
  dataBarang,
  dataDistribusiBekasi,
  dataKecamatan,
  dataPuskesmas,
  konfirmasiOptions,
} from "../../data/data";

const ModalConfirmPPK = ({
  showModal,
  setShowModal,
  children,
  Title,
  data,
}) => {
  //   const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    kecamatan: "",
    puskesmas: "",
    nama_kepala_puskesmas: "",
    nip_kepala_puskesmas: "",
    nama_barang: "",
    jumlah_barang_dikirim: "",
    jumlah_barang_diterima: "",
    tte: "",
    ket_daerah: "",
    ket_ppk: "",
  });
  const { id } = useParams();
  const user = useSelector((a) => a.auth.user);
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const signatureRef = useRef({});
  const handleResetSignature = () => {
    signatureRef.current.clear();
  };

  const navigate = useNavigate();
  useEffect(() => {
    setFormData({
      kecamatan: dataKecamatan.find((a) => a.label == data?.kecamatan),
      puskesmas: dataPuskesmas.find((a) => a.label == data?.Puskesmas),
      nama_kepala_puskesmas: data?.nama_kapus,
      nip_kepala_puskesmas: "",
      nama_barang: dataBarang.find((a) => a.label == data?.nama_barang),
      jumlah_barang_dikirim: data?.jumlah_barang_dikirim,
      jumlah_barang_diterima: data?.jumlah_barang_diterima,
      tte: "",
      ket_daerah: "",
      ket_ppk: data?.keterangan_ppk,
    });
  }, [data]);

  const handlePreview = () => {
    // setModalIsOpen(true);
    // navigate(`/preview-dokumen/${id}`)
    navigate(`/data-distribusi/preview-dokumen/${data?.id}`);
    // setShowModal(true);
    // navigate("/preview-laporan");
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const handleSimpan = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Perhatian",
      text: "Jumlah dikirim dan diterima sudah sesuai, konfirmasi BAST ini?",
      showDenyButton: true,
      showCancelButton: true,
      denyButtonColor: "#3B82F6",
      confirmButtonColor: "#16B3AC",
      confirmButtonText: "Ya",
      denyButtonText: `Simpan Data`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Data Berhasil di Input!", "", "success");
        navigate(`/data-distribusi/detail/${data?.Puskesmas}`);
      } else if (result.isDenied) {
        Swal.fire("Simpan Data Berhasil!", "", "success");
        navigate(`/data-distribusi/detail/${data?.Puskesmas}`);
      }
    });
  };
  return (
    <>
      {/* <button
        className="bg-blue-200 text-black active:bg-blue-500 
      font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Fill Details
      </button> */}
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
            <div className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"></div>
            <div className="relative my-6 mx-auto w-[85%] max-h-[90%] overflow-auto sm:w-3/4 xl:w-1/2 z-1">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-black/20 rounded-t ">
                  <h3 className="text-xl font-bold text-primary">
                    {Title || "Popup"}
                  </h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <MdClose className="text-gray-500 opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full" />
                    {/* <span className="text-red-500 opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span> */}
                  </button>
                </div>
                <form className="mt-5" onSubmit={handleSimpan}>
                  <div className=" p-6 flex-auto w-full">
                    {user.role == "1" ? (
                      <>
                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Kecamatan :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataKecamatan}
                              value={formData.kecamatan}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  kecamatan: e,
                                }))
                              }
                              placeholder="Pilih Kecamatan"
                              className="w-full"
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Puskesmas :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataPuskesmas}
                              value={formData.puskesmas}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  puskesmas: e,
                                }))
                              }
                              placeholder="Pilih Puskesmas"
                              className="w-full"
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Nama Barang yang dikirim :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataBarang}
                              value={formData.nama_barang}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nama_barang: e,
                                }))
                              }
                              placeholder="Pilih Barang"
                              className="w-full"
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Jumlah Barang yang dikirim :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="jumlah_barang_dikirim"
                              type="number"
                              value={formData.jumlah_barang_dikirim}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  jumlah_barang_dikirim: e.target.value,
                                }))
                              }
                              placeholder="Jumlah Barang yang dikirim"
                            />
                          </div>
                        </div>
                      </>
                    ) : user.role == "2" ? (
                      <>
                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Kecamatan :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataKecamatan}
                              value={formData.kecamatan}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  kecamatan: e,
                                }))
                              }
                              placeholder="Pilih Kecamatan"
                              className="w-full"
                              isDisabled
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Puskesmas :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataPuskesmas}
                              value={formData.puskesmas}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  puskesmas: e,
                                }))
                              }
                              placeholder="Pilih Puskesmas"
                              className="w-full"
                              isDisabled
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Nama Kepala Puskesmas :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` bg-white disabled:bg-[#F2F2F2] appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="nama_kepala_puskesmas"
                              type="text"
                              disabled
                              value={formData.nama_kepala_puskesmas}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nama_kepala_puskesmas: e.target.value,
                                }))
                              }
                              placeholder="Nama Kepala Puskesmas"
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              NIP Kepala Puskesmas :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` bg-white disabled:bg-[#F2F2F2] appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="nip_kepala_puskesmas"
                              type="text"
                              value={formData.nip_kepala_puskesmas}
                              disabled
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nip_kepala_puskesmas: e.target.value,
                                }))
                              }
                              placeholder="NIP Kepala Puskesmas"
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Nama Barang yang diterima :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataBarang}
                              value={formData.nama_barang}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nama_barang: e,
                                }))
                              }
                              placeholder="Pilih Barang"
                              className="w-full"
                              isDisabled
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Jumlah Barang yang dikirim :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` disabled:bg-[#F2F2F2] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="jumlah_barang_dikirim"
                              type="number"
                              value={formData.jumlah_barang_dikirim}
                              disabled
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  jumlah_barang_dikirim: e.target.value,
                                }))
                              }
                              placeholder="Jumlah Barang yang dikirim"
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Jumlah Barang yang diterima :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` disabled:bg-[#F2F2F2] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="jumlah_barang_diterima"
                              type="number"
                              disabled
                              value={formData.jumlah_barang_diterima}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  jumlah_barang_diterima: e.target.value,
                                }))
                              }
                              placeholder="Jumlah Barang yang diterima"
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Keterangan Daerah :
                            </label>
                          </div>
                          <div className="">
                            <textarea
                              id="message"
                              rows="4"
                              value={formData.ket_daerah}
                              disabled
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  ket_daerah: e.target.value,
                                }))
                              }
                              className={` disabled:bg-[#F2F2F2] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              placeholder="Keterangan : misal: komplit dan baik atau kurang dari rensi dan baik"
                            ></textarea>
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Konfirmasi Daerah :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={konfirmasiOptions}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  tte: e,
                                }))
                              }
                              defaultValue={
                                data?.status_tte == "Sudah"
                                  ? konfirmasiOptions[0]
                                  : konfirmasiOptions[1]
                              }
                              placeholder="Konfrimasi PPK"
                              className="w-full cursor-pointer"
                              theme={selectThemeColors}
                              isDisabled
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Keterangan PPK :
                            </label>
                          </div>
                          <div className="">
                            <textarea
                              id="message"
                              rows="4"
                              value={formData.ket_ppk}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  ket_ppk: e.target.value,
                                }))
                              }
                              className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              placeholder="Keterangan : misal: disetujui atau konfirmasi ke transporter barang sedang dikirim kembali"
                            ></textarea>
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Konfirmasi PPK :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={konfirmasiOptions}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  tte: e,
                                }))
                              }
                              defaultValue={
                                data?.status_tte == "Sudah"
                                  ? konfirmasiOptions[0]
                                  : konfirmasiOptions[1]
                              }
                              placeholder="Konfrimasi PPK"
                              className="w-full cursor-pointer"
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Dokumen BMN :
                            </label>
                          </div>
                          <div className=" flex flex-col   gap-2 sm:gap-4">
                            <div>
                              <button
                                type="button"
                                className=" bg-[#0ACBC2]  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                                onClick={handlePreview}
                              >
                                Lihat Dokumen
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : user.role == "3" ? (
                      <>
                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Kecamatan :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataKecamatan}
                              value={formData.kecamatan}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  kecamatan: e,
                                }))
                              }
                              isDisabled
                              placeholder="Pilih Kecamatan"
                              className="w-full"
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Puskesmas :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataPuskesmas}
                              value={formData.puskesmas}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  puskesmas: e,
                                }))
                              }
                              isDisabled
                              placeholder="Pilih Puskesmas"
                              className="w-full"
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Nama Kepala Puskesmas :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="nama_kepala_puskesmas"
                              type="text"
                              value={formData.nama_kepala_puskesmas}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nama_kepala_puskesmas: e.target.value,
                                }))
                              }
                              placeholder="Nama Kepala Puskesmas"
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              NIP Kepala Puskesmas :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="nip_kepala_puskesmas"
                              type="text"
                              value={formData.nip_kepala_puskesmas}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nip_kepala_puskesmas: e.target.value,
                                }))
                              }
                              placeholder="NIP Kepala Puskesmas"
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Nama Barang yang diterima :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={dataBarang}
                              value={formData.nama_barang}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nama_barang: e,
                                }))
                              }
                              placeholder="Pilih Barang"
                              className="w-full"
                              theme={selectThemeColors}
                              isDisabled
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Jumlah Barang yang dikirim :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` disabled:bg-[#F2F2F2] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="jumlah_barang_dikirim"
                              type="number"
                              value={formData.jumlah_barang_dikirim}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  jumlah_barang_dikirim: e.target.value,
                                }))
                              }
                              placeholder="Jumlah Barang yang dikirim"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Jumlah Barang yang diterima :
                            </label>
                          </div>
                          <div className="">
                            <input
                              className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              id="jumlah_barang_diterima"
                              type="number"
                              value={formData.jumlah_barang_diterima}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  jumlah_barang_diterima: e.target.value,
                                }))
                              }
                              placeholder="Jumlah Barang yang diterima"
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Keterangan Daerah :
                            </label>
                          </div>
                          <div className="">
                            <textarea
                              id="message"
                              rows="4"
                              value={formData.ket_daerah}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  ket_daerah: e.target.value,
                                }))
                              }
                              className={` bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                              placeholder="Keterangan : misal: komplit dan baik atau kurang dari rensi dan baik"
                            ></textarea>
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className="block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Konfirmasi Daerah :
                            </label>
                          </div>
                          <div className="">
                            <Select
                              options={konfirmasiOptions}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  tte: e,
                                }))
                              }
                              defaultValue={
                                data?.status_tte == "Sudah"
                                  ? konfirmasiOptions[0]
                                  : konfirmasiOptions[1]
                              }
                              placeholder="Konfrimasi PPK"
                              className="w-full cursor-pointer"
                              theme={selectThemeColors}
                            />
                          </div>
                        </div>

                        <div className="mb-8 flex-col  sm:gap-2 w-full flex ">
                          <div className="">
                            <label
                              className=" block text-[#728294] text-base font-semibold mb-2"
                              htmlFor="email"
                            >
                              Dokumen BMN :
                            </label>
                          </div>
                          <div className=" flex flex-col   gap-2 sm:gap-4">
                            <div>
                              <button
                                type="button"
                                className=" bg-[#0ACBC2]  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                                onClick={handlePreview}
                              >
                                Lihat Dokumen
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="flex items-center justify-end p-6 border-t gap-2 border-solid border-black/20 rounded-b">
                    <button
                      className="text-red-500 border-red-500 border background-transparent rounded-md font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-[#0ACBC2]  text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent mr-1 mb-1"
                      type="submit"
                    >
                      {loading ? "Loading..." : "Simpan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ModalConfirmPPK;
