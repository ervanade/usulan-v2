import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/Card/Card";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import {
  dataBarang,
  dataDistribusiBekasi,
  dataKecamatan,
  dataPuskesmas,
} from "../../data/data";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import { useParams } from "react-router";
import NotFound from "../NotFound";
import { useSelector } from "react-redux";
// import Modal from "react-modal";
import Modal from "../../components/Modal/Modal";
import SignatureCanvas from "react-signature-canvas";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import DokumenBMN from "../../assets/contoh_laporan.pdf";

const EditDistribusi = () => {
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
    const data = dataDistribusiBekasi.find((a) => a.id === parseInt(id));
    if (!data) {
      navigate("/not-found");
    }
    setFormData({
      kecamatan: dataKecamatan.find((a) => a.label == data.kecamatan),
      puskesmas: dataPuskesmas.find((a) => a.label == data.Puskesmas),
      nama_kepala_puskesmas: data.nama_kapus,
      nip_kepala_puskesmas: "",
      nama_barang: dataBarang.find((a) => a.label == data.nama_barang),
      jumlah_barang_dikirim: data.jumlah_barang_dikirim,
      jumlah_barang_diterima: data.jumlah_barang_diterima,
      tte: "",
      ket_daerah: "",
      ket_ppk: data.keterangan_ppk,
    });
  }, []);
  const [showModal, setShowModal] = useState(false);

  const handlePreview = () => {
    // setModalIsOpen(true);
    // navigate(`/preview-dokumen/${id}`)
    navigate(`/data-distribusi/preview-dokumen/${id}`);
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
      text: "Jumlah dikirim dan diterima sudah sesuai, tandatangani BAST ini?",
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
        navigate("/data-distribusi");
      } else if (result.isDenied) {
        Swal.fire("Simpan Data Berhasil!", "", "success");
        navigate("/data-distribusi");
      }
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDocUrl("");
  };
  return (
    <div>
      <Breadcrumb pageName="Form Edit Data BAST" />
      <Card>
        <Modal showModal={showModal} setShowModal={setShowModal} />
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            {user.role == "1"
              ? "Form Edit Data BAST Admin Dit Tata Kelola Kesmas"
              : user.role == "2"
              ? "Form TTE BAST dan Naskah Hibah Admin PPK"
              : user.role == "3"
              ? "Form Edit Data BAST Admin Dinas Kesehatan Kab/Kota"
              : "Form Edit Data BAST Admin Dinas Kesehatan Kab/Kota"}
          </h1>
          <div>
            <Link
              to="/data-distribusi"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full 2xl:w-4/5 ">
          <form className="mt-5" onSubmit={handleSimpan}>
            {user.role == "1" ? (
              <>
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className="block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Puskesmas :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className="block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Nama Barang yang dikirim :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Jumlah Barang yang dikirim :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
                    <input
                      className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className="block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Puskesmas :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Nama Kepala Puskesmas :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
                    <input
                      className={`sm:flex-[5_5_0%] bg-white disabled:bg-[#F2F2F2] appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      NIP Kepala Puskesmas :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
                    <input
                      className={`sm:flex-[5_5_0%] bg-white disabled:bg-[#F2F2F2] appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className="block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Nama Barang yang diterima :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Jumlah Barang yang dikirim :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
                    <input
                      className={`sm:flex-[5_5_0%] disabled:bg-[#F2F2F2] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Jumlah Barang yang diterima :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Keterangan Daerah :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Keterangan PPK :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Upload TTE :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <SignatureCanvas
                      penColor="black"
                      ref={signatureRef}
                      canvasProps={{
                        width: 300,
                        height: 200,
                        className: "sigCanvas border-[#cacaca] border",
                      }}
                    />
                    <div className="div flex flex-col gap-2">
                      <p className="text-sm text-bodydark2">
                        petunjuk TTE: Silahkan TTD di Kotak Berikut
                      </p>
                      <div>
                        <button
                          type="button"
                          className=" bg-[#0ACBC2]  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                          onClick={handleResetSignature}
                        >
                          Reset TTE
                        </button>
                      </div>
                    </div>
                    {/* <button
                      className="w-1/4 bg-[#0ACBC2]  text-white font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                      onClick={handleSimpan}
                    >
                      {loading ? "Loading..." : "Pilih File"}
                    </button>
                    <span className="text-sm text-bodydark2">
                      petunjuk upload file: besaran kb/mb, tipe file jpg/jpeg
                    </span> */}
                  </div>
                </div>
                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Dokumen BMN :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div>
                      <button
                        type="button"
                        className=" bg-[#0ACBC2]  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                        onClick={handlePreview}
                      >
                        Lihat Dokumen
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className={` disabled:bg-red-100 disabled:text-red-500 bg-blue-600  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent`}
                        onClick={handleSimpan}
                        disabled={
                          formData.jumlah_barang_dikirim !=
                          formData.jumlah_barang_diterima
                        }
                      >
                        {formData.jumlah_barang_dikirim !=
                        formData.jumlah_barang_diterima
                          ? "Pastikan Jumlah Barang Dikirim / DIterima Sama Sebelum TTD !"
                          : "Tanda Tangani Dokumen"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : user.role == "3" ? (
              <>
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className="block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Puskesmas :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Nama Kepala Puskesmas :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
                    <input
                      className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      NIP Kepala Puskesmas :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
                    <input
                      className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className="block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Nama Barang yang diterima :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Jumlah Barang yang dikirim :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
                    <input
                      className={`sm:flex-[5_5_0%] disabled:bg-[#F2F2F2] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Jumlah Barang yang diterima :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Keterangan Daerah :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%]">
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

                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Upload TTE :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <SignatureCanvas
                      penColor="black"
                      ref={signatureRef}
                      canvasProps={{
                        width: 300,
                        height: 200,
                        className: "sigCanvas border-[#cacaca] border",
                      }}
                    />
                    <div className="div flex flex-col gap-2">
                      <p className="text-sm text-bodydark2">
                        petunjuk TTE: Silahkan TTD di Kotak Berikut
                      </p>
                      <div>
                        <button
                          type="button"
                          className=" bg-[#0ACBC2]  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                          onClick={handleResetSignature}
                        >
                          Reset TTE
                        </button>
                      </div>
                    </div>
                    {/* <button
                      className="w-1/4 bg-[#0ACBC2]  text-white font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                      onClick={handleSimpan}
                    >
                      {loading ? "Loading..." : "Pilih File"}
                    </button>
                    <span className="text-sm text-bodydark2">
                      petunjuk upload file: besaran kb/mb, tipe file jpg/jpeg
                    </span> */}
                  </div>
                </div>
                <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center sm:justify-center">
                  <div className="sm:flex-[2_2_0%]">
                    <label
                      className=" block text-[#728294] text-base font-normal mb-2"
                      htmlFor="email"
                    >
                      Dokumen BMN :
                    </label>
                  </div>
                  <div className="sm:flex-[5_5_0%] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div>
                      <button
                        type="button"
                        className=" bg-[#0ACBC2]  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                        onClick={handlePreview}
                      >
                        Lihat Dokumen
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className={` disabled:bg-red-100 disabled:text-red-500 bg-blue-600  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent`}
                        onClick={handleSimpan}
                        disabled={
                          formData.jumlah_barang_dikirim !=
                          formData.jumlah_barang_diterima
                        }
                      >
                        {formData.jumlah_barang_dikirim !=
                        formData.jumlah_barang_diterima
                          ? "Pastikan Jumlah Barang Dikirim / DIterima Sama Sebelum TTD !"
                          : "Tanda Tangani Dokumen"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            <div className="flex items-center justify-center mt-6 sm:mt-12 sm:gap-8">
              <div className="div sm:flex-[2_2_0%]"></div>
              <div className="div sm:flex-[5_5_0%] ">
                <div className="w-4/5 flex items-center gap-4">
                  <button
                    className="w-full bg-[#0ACBC2]  text-white font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                    type="submit"
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

export default EditDistribusi;
