import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotifs, fetchNotifs, markAsRead } from "../../store/notifSlice";
import ClickOutside from "../ClickOutside";
import { FaBell, FaCheckDouble, FaInfo } from "react-icons/fa";
import parse from "html-react-parser";
import { decode } from "html-encoder-decoder";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CgSpinner } from "react-icons/cg";

const DROPDOWN_LIMIT = 20;

const DropdownNotification = () => {
  const dispatch = useDispatch();
  const { notifs, status, error } = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [readAllLoading, setReadAllLoading] = useState(false);

  const unreadCount = notifs.filter((n) => n.is_read == "0").length;
  const displayNotifs = notifs.slice(0, DROPDOWN_LIMIT);
  const isLoading = status === "loading";

  // Fetch once on mount; subsequent opens use cached Redux state
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotifs());
    }
  }, [dispatch, status]);

  // Refresh when dropdown opens only if data is stale (failed or idle)
  const handleToggle = () => {
    const next = !dropdownOpen;
    setDropdownOpen(next);
    if (next && (status === "failed" || status === "idle")) {
      dispatch(fetchNotifs());
    }
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const readAll = async () => {
    setReadAllLoading(true);
    try {
      await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/notif/readall`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      Swal.fire("Notifikasi Berhasil di Tandai Telah di Baca!", "", "success");
      dispatch(fetchNotifs());
      navigate("/notifikasi");
    } catch {
      Swal.fire("Gagal Membaca Notifikasi!", "", "error");
    } finally {
      setReadAllLoading(false);
    }
  };

  const handleSave = () => {
    Swal.fire({
      title: "Perhatian",
      text: "Anda Menandai Telah Membaca Semua Notifikasi",
      showCancelButton: true,
      confirmButtonColor: "#16B3AC",
      confirmButtonText: "Ya",
    }).then((result) => {
      if (result.isConfirmed) readAll();
    });
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <button
          onClick={handleToggle}
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full font-bold text-primary"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 inline">
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
            </span>
          )}
          <FaBell size={18} />
        </button>

        {dropdownOpen && (
          <div className="absolute -right-5 mt-2.5 flex h-90 w-75 sm:w-80 flex-col rounded-sm border border-teal-500 bg-white shadow-lg z-50">
            <div className="px-4.5 py-3 border-b border-teal-500 flex items-center justify-between">
              <h5 className="text-sm font-medium text-gray-700">Notifikasi</h5>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} belum dibaca
                </span>
              )}
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto notifikasi">
              {isLoading ? (
                <li className="flex justify-center items-center py-8 gap-2 text-gray-400">
                  <CgSpinner className="animate-spin w-5 h-5" />
                  <span className="text-sm">Memuat...</span>
                </li>
              ) : error ? (
                <li className="text-center mt-5 text-gray-500 font-semibold px-4">
                  Gagal Memuat Notifikasi!
                </li>
              ) : displayNotifs.length > 0 ? (
                displayNotifs.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                      notif.is_read == "0" ? "bg-yellow-50" : "bg-white"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {notif.is_read == "0" ? (
                        <div className="flex items-center justify-center w-7 h-7 bg-yellow-400 text-white rounded-full">
                          <FaInfo size={11} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-7 h-7 bg-green-500 text-white rounded-full">
                          <FaCheckDouble size={11} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      {typeof notif.message === "string" ? (
                        <p className="text-xs text-gray-800 leading-snug line-clamp-3">
                          {parse(decode(notif.message))}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-800">Pesan Tidak Valid</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.created_at).toLocaleDateString("id-ID")}
                      </p>
                      <span className={`text-xs font-semibold ${notif.is_read == "0" ? "text-yellow-500" : "text-green-500"}`}>
                        {notif.is_read == "0" ? "Belum Dibaca" : "Sudah Dibaca"}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center mt-5 text-gray-500 font-semibold px-4">
                  Tidak Ada Notifikasi!
                </li>
              )}
            </ul>

            <div className="flex w-full border-t border-teal-500 mt-auto">
              <button
                onClick={handleSave}
                disabled={readAllLoading}
                className="w-1/2 bg-green-500 text-white py-2 text-center text-sm font-semibold hover:bg-green-600 transition duration-300 disabled:opacity-60 flex items-center justify-center gap-1"
              >
                {readAllLoading && <CgSpinner className="animate-spin w-3 h-3" />}
                Baca Semua
              </button>
              <Link
                to="/notifikasi"
                className="w-1/2 bg-teal-500 text-white py-2 text-center text-sm font-semibold hover:bg-teal-600 transition duration-300"
              >
                Semua Notifikasi
              </Link>
            </div>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
