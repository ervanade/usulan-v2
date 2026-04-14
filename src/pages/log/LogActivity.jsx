import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BiExport } from "react-icons/bi";
import { useSelector } from "react-redux";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import moment from "moment";
import { MdOutlineHistory, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FiUser, FiClock, FiLink } from "react-icons/fi";

// ─── Action badge config ────────────────────────────────────────────────────
const ACTION_CONFIG = {
  update: { label: "UPDATE", cls: "bg-blue-100 text-blue-700 border border-blue-200" },
  create: { label: "CREATE", cls: "bg-green-100 text-green-700 border border-green-200" },
  delete: { label: "DELETE", cls: "bg-red-100 text-red-700 border border-red-200" },
  login:  { label: "LOGIN",  cls: "bg-purple-100 text-purple-700 border border-purple-200" },
};

const getActionConfig = (action) =>
  ACTION_CONFIG[action?.toLowerCase()] || {
    label: (action || "OTHER").toUpperCase(),
    cls: "bg-slate-100 text-slate-600 border border-slate-200",
  };

// ─── Avatar initials ─────────────────────────────────────────────────────────
const Avatar = ({ name }) => {
  const initials = (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
      <span className="text-primary font-bold text-xs">{initials}</span>
    </div>
  );
};

// ─── Changes detail (collapsible) ────────────────────────────────────────────
const ChangesDetail = ({ changesStr }) => {
  let changes = null;
  try {
    changes = typeof changesStr === "string" ? JSON.parse(changesStr) : changesStr;
  } catch {
    return <p className="text-xs text-slate-500 italic mt-2 px-1">{changesStr}</p>;
  }
  if (!changes || typeof changes !== "object") return null;

  const SKIP_KEYS = ["id_provinsi", "id_kabupaten", "id_kecamatan", "id", "usulan", "id_kriteria", "pengelolaan_limbah", "master_sumber_listrik"];
  const entries = Object.entries(changes).filter(([k]) => !SKIP_KEYS.includes(k));
  if (entries.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg border border-slate-100 overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left px-3 py-2 text-slate-500 font-semibold w-2/5">Field</th>
            <th className="text-left px-3 py-2 text-slate-500 font-semibold">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
              <td className="px-3 py-1.5 text-slate-500 font-medium align-top capitalize">
                {key.replace(/_/g, " ")}
              </td>
              <td className="px-3 py-1.5 text-slate-700 align-top break-all">
                {value === null || value === undefined ? (
                  <span className="text-slate-300 italic">-</span>
                ) : Array.isArray(value) ? (
                  <span className="text-slate-400 italic text-xs">[array]</span>
                ) : (
                  <span>{String(value)}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Single log row ───────────────────────────────────────────────────────────
const LogRow = ({ log, index }) => {
  const [expanded, setExpanded] = useState(false);
  const { label, cls } = getActionConfig(log.action);
  const hasChanges = !!log.changes;

  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-all duration-200 ${
        index % 2 === 0 ? "bg-white border-slate-100" : "bg-slate-50/50 border-slate-100"
      } hover:border-primary/30 hover:shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={log.name} />

        <div className="flex-1 min-w-0">
          {/* Top row: name + badge + desc */}
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm text-slate-800 truncate max-w-[200px]">
              {log.name || log.username || "System"}
            </span>
            {log.username && (
              <span className="text-xs text-slate-400 hidden sm:inline">@{log.username}</span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide ${cls}`}>
              {label}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-snug">{log.desc || "-"}</p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <FiClock size={11} />
              {log.created_at
                ? format(new Date(log.created_at), "dd MMM yyyy, HH:mm", { locale: id })
                : "-"}
            </span>
            {log.email && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <FiUser size={11} />
                {log.email}
              </span>
            )}
            {log.uri && (
              <span
                className="flex items-center gap-1 text-xs text-slate-400 truncate max-w-[260px]"
                title={log.uri}
              >
                <FiLink size={11} />
                <span className="truncate">{log.uri.replace(/https?:\/\/[^/]+/, "")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Expand button */}
        {hasChanges && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 text-xs text-primary font-semibold hover:underline mt-0.5 whitespace-nowrap"
          >
            {expanded ? "Sembunyikan" : "Lihat Detail"}
          </button>
        )}
      </div>

      {expanded && hasChanges && <ChangesDetail changesStr={log.changes} />}
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, lastPage, total, perPage, loading, onChange }) => {
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 2)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
      <span className="text-xs text-slate-400">
        Menampilkan {from}–{to} dari {total.toLocaleString("id-ID")} data
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <MdChevronLeft size={18} />
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} className="px-1.5 text-slate-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              disabled={loading}
              className={`min-w-[32px] h-8 rounded-lg text-sm font-medium border transition-colors ${
                p === currentPage
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              } disabled:cursor-not-allowed`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === lastPage || loading}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <MdChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const LogActivity = () => {
  const user = useSelector((a) => a.auth.user);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(20);

  const fetchLogData = async (page = 1, limit = perPage, searchVal = search) => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/log`,
        params: { page, per_page: limit, search: searchVal || undefined },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const paged = response.data.data;
      setData(paged.data);
      setTotal(paged.total);
      setCurrentPage(paged.current_page);
      setLastPage(paged.last_page);
    } catch {
      setError(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogData(1, perPage, "");
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchLogData(1, perPage, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const exportData = data.map((item) => ({
      User: item?.name,
      Username: item?.username,
      Email: item?.email,
      Aksi: item?.action,
      Deskripsi: item?.desc,
      URL: item?.uri,
      Tanggal: item?.created_at,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [20, 20, 30, 12, 30, 40, 22].map((wch) => ({ wch }));
    XLSX.utils.book_append_sheet(wb, ws, "Aktivitas Log");
    XLSX.writeFile(wb, `Aktivitas Log ${moment().format("DD-MM-YYYY HH-mm")}.xlsx`);
  };

  return (
    <div>
      <Breadcrumb pageName="Aktivitas Log" title="Aktivitas Log" />

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <MdOutlineHistory size={20} className="text-primary" />
            <span className="font-semibold text-slate-700 text-sm">Riwayat Aktivitas Sistem</span>
            {total > 0 && !loading && (
              <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                {total.toLocaleString("id-ID")}
              </span>
            )}
          </div>
          <button
            title="Export"
            onClick={handleExport}
            disabled={loading || data.length === 0}
            className="flex items-center gap-1.5 text-sm text-white px-3 py-1.5 bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BiExport size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 fill-slate-400"
              width="16" height="16" viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama user, aksi..."
              className="w-full bg-white pl-9 pr-4 py-2 text-sm text-black outline outline-1 outline-zinc-200 focus:outline-primary dark:text-white rounded-lg"
            />
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <CgSpinner className="animate-spin w-10 h-10 text-primary" />
              <p className="text-sm text-slate-400 animate-pulse">Memuat riwayat aktivitas...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <MdOutlineHistory size={48} className="text-slate-200 mb-3" />
              <p className="text-sm">Gagal memuat data. Silakan coba lagi.</p>
              <button
                onClick={() => fetchLogData(1, perPage, search)}
                className="mt-3 text-sm text-primary hover:underline font-medium"
              >
                Coba lagi
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <MdOutlineHistory size={48} className="text-slate-200 mb-3" />
              <p className="text-sm">Tidak ada data aktivitas ditemukan.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {data.map((log, i) => (
                  <LogRow key={log.id ?? i} log={log} index={i} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                total={total}
                perPage={perPage}
                loading={loading}
                onChange={(page) => fetchLogData(page, perPage, search)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogActivity;
