import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../api/axiosInstance";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CgSpinner } from "react-icons/cg";

// Map field keys to human-readable labels
const FIELD_LABELS = {
  id_ihss: "ID IHSS",
  id_provinsi: "ID Provinsi",
  id_kabupaten: "ID Kabupaten",
  id_puskesmas: "ID Puskesmas",
  provinsi: "Provinsi",
  kab_kota: "Kab/Kota",
  kode_puskesmas: "Kode Puskesmas",
  nama_puskesmas: "Nama Puskesmas",
  nama_barang: "Nama Barang",
  jumlah_barang_unit: "Jumlah Barang (Unit)",
  kesiapan_sdmk: "Kesiapan SDMK",
  upaya_memenuhi_sdm: "Upaya Memenuhi SDM",
  strategi_pemenuhan_sdm: "Strategi Pemenuhan SDM",
  kriteria_puskesmas: "Kriteria Puskesmas",
  siap_sarana_prasarana: "Siap Sarana & Prasarana",
  kondisi_alkes_baik: "Kondisi Alkes Baik",
  relokasi_status: "Status Relokasi",
  alasan_relokasi: "Alasan Relokasi",
  keterangan_relokasi: "Keterangan Relokasi",
  id_provinsi_relokasi: "ID Provinsi Relokasi",
  id_kabupaten_relokasi: "ID Kabupaten Relokasi",
  id_puskesmas_relokasi: "ID Puskesmas Relokasi",
  nama_kab_kota_relokasi: "Kab/Kota Relokasi",
  nama_puskesmas_penerima_relokasi: "Puskesmas Penerima Relokasi",
  alamat_puskesmas_relokasi: "Alamat Relokasi",
  jumlah_relokasi: "Jumlah Relokasi",
  pic_penerima_relokasi_nama: "PIC Penerima Relokasi",
  pic_penerima_relokasi_hp: "HP PIC Penerima Relokasi",
  pic_dinkes_kab_kota_relokasi_cp: "CP Dinkes Kab/Kota Relokasi",
  pic_dinkes_kab_kota_relokasi_hp: "HP Dinkes Kab/Kota Relokasi",
  pic_puskesmas_nama: "PIC Puskesmas",
  pic_puskesmas_hp: "HP PIC Puskesmas",
  pic_dinkes_nama: "PIC Dinkes",
  pic_dinkes_hp: "HP PIC Dinkes",
  status_verifikasi: "Status Verifikasi",
};

const SOURCE_LABELS = {
  konfirmasi: "Konfirmasi",
  usulan: "Usulan",
  dokumen: "Dokumen Usulan",
};

const STATUS_COLORS = {
  DISETUJUI: "bg-green-100 text-green-700",
  REVISI: "bg-amber-100 text-amber-700",
  DITOLAK: "bg-red-100 text-red-700",
  YA: "bg-green-100 text-green-700",
  TIDAK: "bg-red-100 text-red-700",
};

const renderValue = (key, value) => {
  if (value === null || value === undefined) return <span className="text-slate-400 italic">-</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-400 italic">-</span>;
    return (
      <ul className="list-disc list-inside space-y-0.5">
        {value.map((item, i) => (
          <li key={i} className="text-xs">
            {typeof item === "object" ? Object.values(item).filter(Boolean).join(" - ") : String(item)}
          </li>
        ))}
      </ul>
    );
  }
  const strVal = String(value);
  const colorClass = STATUS_COLORS[strVal.toUpperCase()];
  if (colorClass) {
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
        {strVal}
      </span>
    );
  }
  return <span className="text-xs">{strVal}</span>;
};

const ChangesDetail = ({ changesStr }) => {
  let changes = null;
  try {
    changes = typeof changesStr === "string" ? JSON.parse(changesStr) : changesStr;
  } catch {
    return <p className="text-xs text-slate-500 italic">{changesStr}</p>;
  }
  if (!changes || typeof changes !== "object") return null;

  // Filter out id fields and null-only entries for cleaner display
  const entries = Object.entries(changes).filter(
    ([k]) => !["id_ihss", "id_provinsi", "id_kabupaten", "id_puskesmas", "id_provinsi_relokasi", "id_kabupaten_relokasi", "id_puskesmas_relokasi"].includes(k)
  );

  return (
    <div className="mt-2 rounded-lg border border-slate-100 overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left px-3 py-2 text-slate-500 font-semibold w-1/3">Field</th>
            <th className="text-left px-3 py-2 text-slate-500 font-semibold">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
              <td className="px-3 py-1.5 text-slate-600 font-medium align-top">
                {FIELD_LABELS[key] || key}
              </td>
              <td className="px-3 py-1.5 text-slate-700 align-top">
                {renderValue(key, value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LogItem = ({ log, index }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChanges = !!log.changes;

  const actionColors = {
    update: "bg-blue-100 text-blue-700",
    create: "bg-green-100 text-green-700",
    delete: "bg-red-100 text-red-700",
  };
  const actionColor = actionColors[log.action?.toLowerCase()] || "bg-slate-100 text-slate-600";

  return (
    <div className={`border border-slate-100 rounded-xl p-4 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-primary font-bold text-xs uppercase">
              {(log.name || log.username || "?")[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            {/* User & action */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-slate-800">{log.name || log.username || "System"}</span>
              {log.username && log.name !== log.username && (
                <span className="text-xs text-slate-400">@{log.username}</span>
              )}
              {log.action && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${actionColor}`}>
                  {log.action.toUpperCase()}
                </span>
              )}
            </div>
            {/* Desc */}
            <p className="text-sm text-slate-600 leading-snug">{log.desc || log.keterangan || log.activity || "-"}</p>
            {/* Time */}
            <p className="text-xs text-slate-400 mt-1">
              {log.created_at
                ? format(new Date(log.created_at), "dd MMMM yyyy, HH:mm", { locale: id })
                : "-"}
            </p>
          </div>
        </div>
        {hasChanges && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 text-xs text-primary font-semibold hover:underline mt-0.5"
          >
            {expanded ? "Sembunyikan" : "Lihat Detail"}
          </button>
        )}
      </div>
      {expanded && hasChanges && (
        <ChangesDetail changesStr={log.changes} />
      )}
    </div>
  );
};

const ModalLog = ({ show, onClose, payload, row, source, apiUrl }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(100);

  useEffect(() => {
    if (show && payload) {
      setCurrentPage(1);
      fetchLogs(1);
    }
  }, [show, payload]);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const endpoint = apiUrl || "/api/log/filter-usulan";
      const response = await axiosInstance.post(`${endpoint}?page=${page}`, payload);
      if (response.data.success) {
        const paginatedData = response.data.data;
        // Support both paginated response (data.data) and flat array
        if (paginatedData && typeof paginatedData === "object" && !Array.isArray(paginatedData)) {
          setLogs(paginatedData.data || []);
          setCurrentPage(paginatedData.current_page || 1);
          setLastPage(paginatedData.last_page || 1);
          setTotal(paginatedData.total || 0);
          setPerPage(paginatedData.per_page || 100);
        } else {
          setLogs(paginatedData || []);
          setLastPage(1);
          setTotal((paginatedData || []).length);
        }
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) return;
    setCurrentPage(page);
    fetchLogs(page);
  };

  const entityName = row?.nama_puskesmas || row?.nama_kabupaten || row?.kabupaten || null;
  const sourceLabel = SOURCE_LABELS[source] || null;

  if (!show) return null;

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none bg-black/40 backdrop-blur-sm">
      <div className="relative my-6 mx-auto w-[95%] sm:w-[85%] lg:w-[65%] xl:w-[55%] max-h-[90vh] flex flex-col">
        <div className="border-0 rounded-2xl shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                  Riwayat Perubahan dan Verifikasi
                </h3>
                {entityName && (
                  <span className="text-base font-semibold text-slate-600">
                    — {entityName}
                  </span>
                )}
              </div>
              {sourceLabel && (
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  {sourceLabel}
                </p>
              )}
            </div>
            <button
              className="p-2 ml-auto bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors duration-200"
              onClick={onClose}
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 flex-auto overflow-y-auto bg-white min-h-[300px]">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 gap-4">
                <CgSpinner className="animate-spin text-primary w-12 h-12" />
                <p className="text-slate-400 font-medium animate-pulse text-sm">Memuat riwayat...</p>
              </div>
            ) : logs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {logs.map((log, i) => (
                  <LogItem key={log.id || i} log={log} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-64 text-slate-400 italic">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <MdClose size={48} className="text-slate-200" />
                </div>
                <p>Belum ada riwayat aktivitas untuk data ini.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-5 border-t border-slate-100 bg-slate-50/50 gap-3 flex-wrap">
            {/* Pagination */}
            {lastPage > 1 ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                {Array.from({ length: lastPage }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        disabled={loading}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          p === currentPage
                            ? "bg-primary text-white border-primary"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        } disabled:cursor-not-allowed`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage || loading}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
                <span className="text-xs text-slate-400 ml-1">
                  {total} data
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">{total > 0 ? `${total} data` : ""}</span>
            )}
            <button
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-8 rounded-xl text-sm transition-all duration-200 focus:outline-none"
              type="button"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLog;
