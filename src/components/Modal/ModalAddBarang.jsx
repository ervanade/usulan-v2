import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import { useSelector } from "react-redux";
import FormInput from "../Form/FormInput";
import {
  konfirmasiJumlahOptions,
  ujiFungsiOptions,
  ujiOpsOptions,
} from "../../data/data";
import { validateForm } from "../../data/validationUtils";

const ModalAddBarang = ({ show, onClose, onSave, editIndex, dataBarang }) => {
  const user = useSelector((a) => a.auth.user);
  const [barang, setBarang] = useState({
    id_barang: "",
    jenis_alkes: "",
    jumlah_dikirim: "",
    jumlah_diterima: "0",
    nomor_kepemilikan: "",
    merk: "",
    satuan: "",
    harga_satuan: "",
    status_barang: "",
    keterangan: "",
    uji_fungsi: "",
    uji_operasional: "",
  });
  const [selectedProgram, setSelectedProgram] = useState(ujiFungsiOptions[0]);
  const [selectedOperasional, setSelectedOperasional] = useState(
    ujiOpsOptions[0]
  );
  const handleProgramChange = (selectedOption) => {
    setSelectedProgram(selectedOption);
    setBarang((prev) => ({
      ...prev,
      uji_fungsi: selectedOption ? selectedOption.value.toString() : "",
    }));
  };
  const handleOperasionalChange = (selectedOption) => {
    setSelectedOperasional(selectedOption);
    setBarang((prev) => ({
      ...prev,
      uji_operasional: selectedOption ? selectedOption.value.toString() : "",
    }));
  };

  const [selectedKonfirmasi, setSelectedKonfirmasi] = useState(
    konfirmasiJumlahOptions[0]
  );
  const handleKonfirmasiChange = (selectedOption) => {
    setSelectedKonfirmasi(selectedOption);
    if (selectedOption.value === "1") {
      setBarang((prev) => ({
        ...prev,
        jumlah_diterima: barang.jumlah_dikirim || "0",
      }));
    }
  };
  const [listBarang, setListBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);

  const handleBarangChange = (selectedOption) => {
    setSelectedBarang(selectedOption);
    if (selectedOption) {
      setBarang((prev) => ({
        ...prev,
        id_barang: selectedOption ? selectedOption.id : "",
        jenis_alkes: selectedOption ? selectedOption.value : "",
        merk: selectedOption.merk ? selectedOption.merk : "",
        satuan: selectedOption.satuan ? selectedOption.satuan : "",
        keterangan: selectedOption.keterangan ? selectedOption.keterangan : "",
        status_barang: selectedOption.status_barang
          ? selectedOption.status_barang
          : "",
        harga_satuan: selectedOption.harga_satuan
          ? selectedOption.harga_satuan
          : "",
      }));
    }
  };

  useEffect(() => {
    if (editIndex !== null && dataBarang) {
      setBarang(dataBarang);
      setSelectedKonfirmasi(
        dataBarang?.jumlah_dikirim == dataBarang?.jumlah_diterima
          ? konfirmasiJumlahOptions[1]
          : konfirmasiJumlahOptions[0]
      );
      setSelectedProgram(
        dataBarang?.uji_fungsi == "1"
          ? ujiFungsiOptions[1]
          : ujiFungsiOptions[0]
      );
      setSelectedOperasional(
        dataBarang?.uji_operasional == "1" ? ujiOpsOptions[1] : ujiOpsOptions[0]
      );
    } else {
      setBarang({
        id_barang: "",
        jenis_alkes: "",
        jumlah_dikirim: "",
        nomor_kepemilikan: "",
        jumlah_diterima: "0",
        merk: "",
        satuan: "",
        harga_satuan: "",
        keterangan: "",
        uji_fungsi: "",
        uji_operasional: "",
      });
    }
  }, [editIndex, dataBarang]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm(barang, ["id_barang", "jumlah_dikirim"])) return;
    if (isNaN(barang.jumlah_dikirim)) {
      Swal.fire(
        "Warning",
        `Format jumlah_dikirim harus berupa angka!`,
        "warning"
      );
      return;
    }
    if (editIndex && barang.jumlah_diterima && isNaN(barang.jumlah_diterima)) {
      Swal.fire(
        "Warning",
        `Format jumlah_diterima harus berupa angka!`,
        "warning"
      );
      return;
    }
    if (!barang.id_barang || !barang.jumlah_dikirim) {
      Swal.fire("Error", "Ada Form yang belum di lengkapi", "error");
      return;
    }
    onSave(barang);
    setBarang({
      id_barang: "",
      jenis_alkes: "",
      jumlah_dikirim: "",
      nomor_kepemilikan: "",
      jumlah_diterima: "0",
      merk: "",
      satuan: "",
      harga_satuan: "",
      keterangan: "",
      uji_fungsi: "",
      uji_operasional: "",
    });
    setSelectedBarang(null);
    setSelectedProgram(ujiFungsiOptions[0]);
    setSelectedOperasional(ujiOpsOptions[0]);
    setSelectedKonfirmasi(konfirmasiJumlahOptions[0]);
    onClose();
  };

  const fetchBarang = async (idKota) => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/barang`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setListBarang([
        ...response.data.data.map((item) => ({
          label: item.nama_alkes,
          value: item.nama_alkes,
          ...item,
        })),
      ]);
    } catch (error) {
      setListBarang([]);
    }
  };
  useEffect(() => {
    fetchBarang();
  }, []);
  useEffect(() => {
    if (dataBarang && listBarang.length > 0) {
      const initialOption = listBarang?.find(
        (prov) => prov.id == dataBarang.id_barang
      );
      if (initialOption) {
        setSelectedBarang({
          label: initialOption.label,
          value: initialOption.value,
        });
        setBarang((prev) => ({
          ...prev,
          merk: initialOption.merk ? initialOption.merk : "",
        }));
      }
    }
  }, [dataBarang]);
  if (!show) {
    return null;
  }

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
      <div className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"></div>
      <div className="relative my-6 mx-auto w-[85%] max-h-[90%] min-h-[60%] overflow-auto sm:w-3/4 xl:w-1/2 z-1">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-black/20 rounded-t ">
            <h3 className="text-xl font-bold text-primary">
              {editIndex !== null ? "Edit Barang" : "Tambah Barang"}
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
            <form className="mt-0" onSubmit={handleSave}></form>
            <div className=" px-6 py-4 flex-auto w-full">
              <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                <div className="">
                  <label
                    className="block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="email"
                  >
                    Barang :
                  </label>
                </div>
                <div className="">
                  <Select
                    options={listBarang}
                    value={selectedBarang}
                    onChange={handleBarangChange}
                    placeholder="Pilih Barang"
                    className="w-full"
                    theme={selectThemeColors}
                    isDisabled={user.role != "1"}
                  />
                </div>
              </div>

              {/* <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                <div className="">
                  <label
                    className=" block text-[#728294] text-base font-semibold mb-1"
                    htmlFor="email"
                  >
                    Merk / Type :
                  </label>
                </div>
                <div className="">
                  <input
                    className={` bg-white disabled:bg-[#F2F2F2] appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                    id="jumlah_barang_dikirim"
                    type="text"
                    value={barang.merk}
                    disabled
                    placeholder="Merk / Type"
                  />
                </div>
              </div> */}
              {user.role == "1" ? (
                <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                  <div className="">
                    <label
                      className=" block text-[#728294] text-base font-semibold mb-1"
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
                      required
                      value={barang.jumlah_dikirim}
                      onChange={(e) =>
                        setBarang((prev) => ({
                          ...prev,
                          jumlah_dikirim: e.target.value,
                        }))
                      }
                      placeholder="Jumlah Barang yang dikirim"
                    />
                  </div>
                </div>
              ) : user.role == "3" ? (
                <>
                  <p className="text-center font-semibold text-primary">
                    Jumlah Barang Dikirim : {barang?.jumlah_dikirim}
                  </p>
                  <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                    <div className="">
                      <label
                        className=" block text-[#728294] text-base font-semibold mb-1"
                        htmlFor="email"
                      >
                        Jumlah Barang :
                      </label>
                    </div>
                    <div className="">
                      <Select
                        options={konfirmasiJumlahOptions}
                        onChange={handleKonfirmasiChange}
                        value={selectedKonfirmasi}
                        placeholder="Konfirmasi Penerimaan Barang"
                        className="w-full cursor-pointer"
                        theme={selectThemeColors}
                      />
                    </div>
                  </div>
                  {selectedKonfirmasi.value == "0" ? (
                    <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                      <div className="">
                        <label
                          className=" block text-[#728294] text-base font-semibold mb-1"
                          htmlFor="email"
                        >
                          Jumlah Barang yang Diterima :
                        </label>
                      </div>
                      <div className="">
                        <input
                          className={` bg-white disabled:bg-[#F2F2F2] appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                          id="jumlah_diterima"
                          type="number"
                          max={parseInt(barang.jumlah_dikirim) - 1}
                          min={0}
                          required
                          value={barang.jumlah_diterima}
                          onChange={(e) => {
                            const value = Math.min(
                              Math.max(0, parseInt(e.target.value) || 0), // Batas minimum
                              barang.jumlah_dikirim - 1 // Batas maksimum
                            );
                            setBarang((prev) => ({
                              ...prev,
                              jumlah_diterima: value,
                            }));
                          }}
                          placeholder="Jumlah Barang yang Diterima"
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                    <div className="">
                      <label
                        className=" block text-[#728294] text-base font-semibold mb-1"
                        htmlFor="email"
                      >
                        Uji Fungsi :
                      </label>
                    </div>
                    <div className="">
                      <Select
                        options={ujiFungsiOptions}
                        onChange={handleProgramChange}
                        value={selectedProgram}
                        placeholder="Uji Fungsi"
                        className="w-full cursor-pointer"
                        theme={selectThemeColors}
                      />
                    </div>
                  </div>

                  <div className="mb-4 flex-col  sm:gap-2 w-full flex ">
                    <div className="">
                      <label
                        className=" block text-[#728294] text-base font-semibold mb-1"
                        htmlFor="email"
                      >
                        Uji Operasional :
                      </label>
                    </div>
                    <div className="">
                      <Select
                        options={ujiOpsOptions}
                        onChange={handleOperasionalChange}
                        value={selectedOperasional}
                        placeholder="Uji Operasional"
                        className="w-full cursor-pointer"
                        theme={selectThemeColors}
                      />
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center justify-end p-4 border-t gap-2 border-solid border-black/20 rounded-b">
              <button
                className="text-red-500 border-red-500 border background-transparent rounded-md font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="bg-[#0ACBC2]  text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent mr-1 mb-1"
                type="submit"
                onClick={handleSave}
              >
                {"Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAddBarang;
