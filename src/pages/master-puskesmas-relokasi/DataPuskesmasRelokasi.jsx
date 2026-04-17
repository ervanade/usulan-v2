import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { BiExport } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { usePuskesmasRelokasi } from "../../hooks/usePuskesmasRelokasi";
import { usePuskesmasListRelokasi } from "../../hooks/usePuskesmasRelokasi";
import { useProvinsi, useKabupaten } from "../../hooks/useRegion";
import { useAlkes } from "../../hooks/useUsulan";
import {
  storePuskesmasRelokasi,
  updatePuskesmasRelokasi,
  deletePuskesmasRelokasi,
} from "../../api/services/puskesmasRelokasiService";

// ─── Form Modal ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  nama_puskesmas: "",
  id_provinsi: "",
  id_kabupaten: "",
  id_puskesmas: "",
  id_alkes: "",
  jumlah: "",
  provinsi: "",
  kabupaten: "",
  kode_puskesmas: "",
  alamat: "",
};

const FormModal = ({ show, onClose, editData, onSaved }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  console.log(form)
  
  // selects
  const [selProvinsi, setSelProvinsi] = useState(null);
  const [selKabupaten, setSelKabupaten] = useState(null);
  const [selPuskesmas, setSelPuskesmas] = useState(null);
  const [selAlkes, setSelAlkes] = useState(null);
  console.log(selAlkes)

  const { data: rawProvinsi } = useProvinsi();
  const { data: rawKabupaten } = useKabupaten(selProvinsi?.value);
  const { data: rawPuskesmasList } = usePuskesmasListRelokasi();
  const { alkes: rawAlkes } = useAlkes();

  const optProvinsi = useMemo(
    () => (rawProvinsi || []).map((p) => ({ value: p.id, label: p.name })),
    [rawProvinsi]
  );
  const optKabupaten = useMemo(
    () => (rawKabupaten || []).map((k) => ({ value: k.id, label: k.name })),
    [rawKabupaten]
  );
  const optPuskesmas = useMemo(() => {
    const list = rawPuskesmasList || [];
    const filtered = selKabupaten
      ? list.filter((p) => String(p.id_kabupaten) === String(selKabupaten.value))
      : list;
    return filtered.map((p) => ({
      value: p.id_puskesmas ?? p.id,
      label: p.nama_puskesmas,
      kode: p.kode_pusdatin_baru || p.kode_puskesmas || "",
      alamat: p.alamat,
    }));
  }, [rawPuskesmasList, selKabupaten]);
  const optAlkes = useMemo(
    () => (rawAlkes || []).map((a) => ({ value: a.id, label: a.nama_alkes ?? a.nama_barang ?? a.name })),
    [rawAlkes]
  );

  // populate form when editing
  useEffect(() => {
    if (!show) return;
    if (editData) {
      setForm({
        nama_puskesmas: editData.nama_puskesmas || "",
        id_provinsi: editData.id_provinsi || "",
        id_kabupaten: editData.id_kabupaten || "",
        id_puskesmas: editData.id_puskesmas || "",
        id_alkes: editData.id_alkes || "",
        jumlah: editData.jumlah ?? "",
        provinsi: editData.provinsi || "",
        kabupaten: editData.kabupaten || "",
        kode_puskesmas: editData.kode_puskesmas || "",
        alamat: editData.alamat || "",
      });
      setSelProvinsi(
        editData.id_provinsi
          ? { value: editData.id_provinsi, label: editData.provinsi }
          : null
      );
      setSelKabupaten(
        editData.id_kabupaten
          ? { value: editData.id_kabupaten, label: editData.kabupaten }
          : null
      );
      setSelAlkes(
        editData.id_alkes
          ? { value: editData.id_alkes, label: editData.nama_alkes ?? "" }
          : null
      );
      // puskesmas select will be set after rawPuskesmas loads
    } else {
      setForm(EMPTY_FORM);
      setSelProvinsi(null);
      setSelKabupaten(null);
      setSelPuskesmas(null);
      setSelAlkes(null);
    }
  }, [show, editData]);

  // restore puskesmas select after options load (edit mode)
  useEffect(() => {
    if (!editData || !rawPuskesmasList?.length) return;
    const found = optPuskesmas.find((p) => p.value == editData.id_puskesmas);
    if (found) setSelPuskesmas(found);
  }, [optPuskesmas, editData]);

  // restore alkes label after options load (edit mode)
  useEffect(() => {
    if (!editData || !rawAlkes?.length) return;
    const found = optAlkes.find((a) => a.value == editData.id_alkes);
    if (found) setSelAlkes(found);
  }, [optAlkes, editData]);

  const handleProvinsi = (opt) => {
    setSelProvinsi(opt);
    setSelKabupaten(null);
    setSelPuskesmas(null);
    setForm((f) => ({
      ...f,
      id_provinsi: opt?.value ?? "",
      provinsi: opt?.label ?? "",
      id_kabupaten: "",
      kabupaten: "",
      id_puskesmas: "",
      nama_puskesmas: "",
      kode_puskesmas: "",
      alamat: "",
    }));
  };

  const handleKabupaten = (opt) => {
    setSelKabupaten(opt);
    setSelPuskesmas(null);
    setForm((f) => ({
      ...f,
      id_kabupaten: opt?.value ?? "",
      kabupaten: opt?.label ?? "",
      id_puskesmas: "",
      nama_puskesmas: "",
      kode_puskesmas: "",
      alamat: "",
    }));
  };

  const handlePuskesmas = (opt) => {
    setSelPuskesmas(opt);
    setForm((f) => ({
      ...f,
      id_puskesmas: opt?.value ?? "",
      nama_puskesmas: opt?.label ?? "",
      kode_puskesmas: opt?.kode ?? "",
      alamat: opt?.alamat ?? "",
    }));
  };

  const handleAlkes = (opt) => {
    setSelAlkes(opt);
    setForm((f) => ({ ...f, id_alkes: opt?.value ?? "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_provinsi || !form.id_kabupaten || !form.id_puskesmas || !form.id_alkes || !form.jumlah) {
      Swal.fire("Perhatian", "Lengkapi semua field yang wajib diisi.", "warning");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        nama_puskesmas: form.nama_puskesmas,
        id_provinsi: Number(form.id_provinsi),
        id_kabupaten: Number(form.id_kabupaten),
        id_puskesmas: Number(form.id_puskesmas),
        id_alkes: Number(form.id_alkes),
        jumlah: Number(form.jumlah),
        provinsi: form.provinsi,
        kabupaten: form.kabupaten,
        kode_puskesmas: form.kode_puskesmas,
        alamat: form.alamat || null,
      };
      if (editData) {
        await updatePuskesmasRelokasi(editData.id, payload);
      } else {
        await storePuskesmasRelokasi(payload);
      }
      Swal.fire("Berhasil", `Data berhasil ${editData ? "diperbarui" : "disimpan"}.`, "success");
      onSaved();
      onClose();
    } catch (err) {
      Swal.fire("Gagal", err?.response?.data?.message || "Terjadi kesalahan.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const inputCls =
    "bg-white appearance-none border border-[#cacaca] focus:border-primary rounded-md w-full py-2.5 px-3 text-[#728294] leading-tight focus:outline-none text-sm";
  const labelCls = "block text-sm font-medium text-slate-600 mb-1";

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none bg-black/40 backdrop-blur-sm">
      <div className="relative my-6 mx-auto w-[95%] sm:w-[80%] lg:w-[60%] max-h-[90vh] flex flex-col">
        <div className="border-0 rounded-2xl shadow-2xl flex flex-col w-full bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-700">
              {editData ? "Edit Puskesmas Relokasi" : "Tambah Puskesmas Relokasi"}
            </h3>
            <button
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              onClick={onClose}
              type="button"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Provinsi */}
              <div>
                <label className={labelCls}>Provinsi <span className="text-red-500">*</span></label>
                <Select
                  options={optProvinsi}
                  value={selProvinsi}
                  onChange={handleProvinsi}
                  placeholder="Pilih Provinsi"
                  classNamePrefix="my-react-select"
                  isClearable
                />
              </div>

              {/* Kabupaten */}
              <div>
                <label className={labelCls}>Kabupaten/Kota <span className="text-red-500">*</span></label>
                <Select
                  options={optKabupaten}
                  value={selKabupaten}
                  onChange={handleKabupaten}
                  placeholder={selProvinsi ? "Pilih Kabupaten/Kota" : "Pilih Provinsi dahulu"}
                  isDisabled={!selProvinsi}
                  classNamePrefix="my-react-select"
                  isClearable
                />
              </div>

              {/* Puskesmas */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Puskesmas <span className="text-red-500">*</span></label>
                <Select
                  options={optPuskesmas}
                  value={selPuskesmas}
                  onChange={handlePuskesmas}
                  placeholder={selKabupaten ? "Pilih Puskesmas" : "Pilih Kabupaten dahulu"}
                  isDisabled={!selKabupaten}
                  classNamePrefix="my-react-select"
                  isClearable
                />
              </div>

              {/* Kode Puskesmas (readonly autofill) */}
              <div>
                <label className={labelCls}>Kode Puskesmas</label>
                <input
                  className={inputCls + " bg-slate-50 cursor-not-allowed"}
                  value={form.kode_puskesmas}
                  readOnly
                  placeholder="Otomatis terisi"
                />
              </div>

              {/* Alamat (readonly autofill) */}
              <div>
                <label className={labelCls}>Alamat</label>
                <input
                  className={inputCls + " bg-slate-50 cursor-not-allowed"}
                  value={form.alamat}
                  readOnly
                  placeholder="Otomatis terisi dari puskesmas"
                />
              </div>

              {/* Alkes */}
              <div>
                <label className={labelCls}>Alkes <span className="text-red-500">*</span></label>
                <Select
                  options={optAlkes}
                  value={selAlkes}
                  onChange={handleAlkes}
                  placeholder="Pilih Alkes"
                  classNamePrefix="my-react-select"
                  isClearable
                />
              </div>

              {/* Jumlah */}
              <div>
                <label className={labelCls}>Jumlah <span className="text-red-500">*</span></label>
                <input
                  className={inputCls}
                  type="number"
                  min="1"
                  value={form.jumlah}
                  onChange={(e) => setForm((f) => ({ ...f, jumlah: e.target.value }))}
                  placeholder="Jumlah"
                  required
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-6 rounded-xl text-sm transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {loading && <CgSpinner className="animate-spin" />}
              {editData ? "Simpan Perubahan" : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const DataPuskesmasRelokasi = () => {
  const user = useSelector((a) => a.auth.user);
  const { data: rawData, isLoading, mutate } = usePuskesmasRelokasi();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const filteredData = useMemo(() => {
    const list = rawData || [];
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(
      (item) =>
        item.nama_puskesmas?.toLowerCase().includes(q) ||
        item.provinsi?.toLowerCase().includes(q) ||
        item.kabupaten?.toLowerCase().includes(q) ||
        item.kode_puskesmas?.toLowerCase().includes(q)
    );
  }, [rawData, search]);

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Hapus data ini?",
        text: "Data yang dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#16B3AC",
      });
      if (!result.isConfirmed) return;
      try {
        await deletePuskesmasRelokasi(id);
        Swal.fire("Berhasil", "Data berhasil dihapus.", "success");
        mutate();
      } catch {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus.", "error");
      }
    },
    [mutate]
  );

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const exportData = (rawData || []).map((item) => ({
      Provinsi: item.provinsi,
      Kabupaten: item.kabupaten,
      Kode_Puskesmas: item.kode_puskesmas,
      Nama_Puskesmas: item.nama_puskesmas,
      Jumlah: item.jumlah,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Puskesmas Relokasi");
    XLSX.writeFile(wb, "Data Puskesmas Relokasi.xlsx");
  };

  const columns = useMemo(
    () => [
      {
        name: "Provinsi",
        selector: (row) => row.provinsi,
        sortable: true,
        cell: (row) => <div className="py-2 text-sm">{row.provinsi}</div>,
        minWidth: "130px",
      },
      {
        name: "Kabupaten/Kota",
        selector: (row) => row.kabupaten,
        sortable: true,
        cell: (row) => <div className="py-2 text-sm">{row.kabupaten}</div>,
        minWidth: "140px",
      },
      {
        name: "Kode Puskesmas",
        selector: (row) => row.kode_puskesmas,
        sortable: true,
        cell: (row) => <div className="py-2 text-sm font-mono">{row.kode_puskesmas}</div>,
        width: "150px",
      },
      {
        name: "Nama Puskesmas",
        selector: (row) => row.nama_puskesmas,
        sortable: true,
        cell: (row) => <div className="py-2 text-sm font-medium">{row.nama_puskesmas}</div>,
        minWidth: "180px",
      },
      {
        name: "Jumlah",
        selector: (row) => row.jumlah,
        sortable: true,
        cell: (row) => <div className="py-2 text-sm text-center w-full">{row.jumlah}</div>,
        width: "90px",
      },
      {
        name: "Aksi",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <button
              title="Edit"
              className="text-primary hover:text-teal-600 transition-colors"
              onClick={() => {
                setEditData(row);
                setShowModal(true);
              }}
            >
              <FaEdit size={15} />
            </button>
            {user.role == "1" && (
              <button
                title="Hapus"
                className="text-red-500 hover:text-red-700 transition-colors"
                onClick={() => handleDelete(row.id)}
              >
                <FaTrash size={15} />
              </button>
            )}
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: "90px",
      },
    ],
    [handleDelete, user.role]
  );

  return (
    <div>
      <Breadcrumb pageName="Data Puskesmas Relokasi" />
      <div className="rounded-md flex flex-col gap-4 overflow-hidden border border-stroke bg-white py-4 md:py-8 px-4 md:px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <div className="relative">
            <button className="absolute left-2 top-1/2 -translate-y-1/2">
              <svg className="fill-body hover:fill-primary" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z" fill="" />
                <path fillRule="evenodd" clipRule="evenodd" d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z" fill="" />
              </svg>
            </button>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Data..."
              className="w-full bg-white pl-9 pr-4 text-black outline outline-1 outline-zinc-200 focus:outline-primary dark:text-white xl:w-125 py-2 rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button
              title="Export"
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
            {user.role == "1" && (
              <button
                title="Tambah Data"
                className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
                onClick={() => { setEditData(null); setShowModal(true); }}
              >
                <FaPlus size={14} />
                <span className="hidden sm:block">Tambah Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <CgSpinner className="animate-spin w-8 h-8 text-teal-400" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-slate-400">Data Tidak Tersedia.</div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              persistTableHead
              highlightOnHover
              pointerOnHover
              customStyles={{
                headCells: {
                  style: {
                    padding: 12,
                    backgroundColor: "#0FAD91",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  },
                },
                rows: {
                  style: {
                    fontSize: 14,
                    paddingTop: 4,
                    paddingBottom: 4,
                    backgroundColor: "#FFFFFF",
                    "&:nth-of-type(odd)": { backgroundColor: "#F9FAFB" },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      <FormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onSaved={mutate}
      />
    </div>
  );
};

export default DataPuskesmasRelokasi;
