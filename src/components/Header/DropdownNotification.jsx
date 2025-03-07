import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotifs, fetchNotifs, markAsRead } from "../../store/notifSlice";
import ClickOutside from "../ClickOutside";
import { FaBell, FaCheck, FaCheckDouble, FaInfo } from "react-icons/fa";
import parse from "html-react-parser";

import { encode, decode } from "html-encoder-decoder"; // Gunakan import alih-alih require
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const DropdownNotification = () => {
  const dispatch = useDispatch();
  const { notifs, error } = useSelector((state) => state.notifications); // Ambil error dari Redux
  const unreadNotifs = notifs.filter((notif) => notif.is_read == "0");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchNotifs());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id)).then(() => {
      dispatch(fetchNotifs());
    });
  };

  const readAll = async () => {
    setLoading(true);
    try {
      await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/notif/readall`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      Swal.fire("Notifikasi Berhasil di Tandai Telah di Baca!", "", "success");
      dispatch(fetchNotifs());
      navigate("/notifikasi");
    } catch (error) {
      Swal.fire("Gagal Membaca Notifikasi!", "", "error");
      console.error(error);
    } finally {
      setLoading(false);
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
      if (result.isConfirmed) {
        readAll();
      }
    });
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full font-bold text-primary"
        >
          {unreadNotifs.length > 0 && (
            <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 inline">
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
            </span>
          )}
          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <FaBell />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute -right-5 mt-2.5 flex h-90 w-75 sm:w-80 flex-col rounded-sm border border-teal-500 bg-white shadow-lg">
            <div className="px-4.5 py-3 border-b border-teal-500">
              <h5 className="text-sm font-medium text-gray-700">Notifikasi</h5>
            </div>
            <ul className="flex h-auto flex-col overflow-y-auto notifikasi">
              {error ? (
                <p className="text-center mt-5 text-gray-500 font-semibold">
                  Gagal Memuat Notifikasi!
                </p>
              ) : notifs.length > 0 ? (
                notifs.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`flex items-start gap-4 px-4.5 py-3 border-b cursor-pointer transition-all duration-300 hover:bg-gray-100 ${
                      notif.is_read == "0" ? "bg-yellow-50" : "bg-white"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {notif.is_read == "0" ? (
                        <div className="flex items-center justify-center w-8 h-8 bg-yellow-400 text-white rounded-full">
                          <FaInfo />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full">
                          <FaCheckDouble />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      {typeof notif.message === "string" ? (
                        <p className="text-sm text-gray-800">
                          {parse(decode(notif.message))}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-800">
                          Pesan Tidak Valid
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                      <span
                        className={`text-xs font-semibold ${
                          notif.is_read == "0"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {notif.is_read == "0" ? "Belum Dibaca" : "Sudah Dibaca"}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center mt-5 text-gray-500 font-semibold">
                  Tidak Ada Notifikasi!
                </p>
              )}
            </ul>
            <div className="flex w-full border-t border-teal-500">
              <button
                onClick={handleSave}
                className="w-1/2 bg-green-500 text-white py-2 text-center text-sm font-semibold hover:bg-green-600 transition duration-300"
              >
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

// const DropdownNotification = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [notifying, setNotifying] = useState(true);

//   return (
//     <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
//       <li>
//         <button
//           onClick={() => {
//             setNotifying(false);
//             setDropdownOpen(!dropdownOpen);
//           }}
//           to="#"
//           className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full font-bold text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
//         >
//           <span
//             className={absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${
//               notifying == false ? "hidden" : "inline"
//             }}
//           >
//             <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
//           </span>

//           <svg
//             className="fill-current duration-300 ease-in-out"
//             width="18"
//             height="18"
//             viewBox="0 0 18 18"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
//               fill=""
//             />
//           </svg>
//         </button>

//         {dropdownOpen && (
//           <div
//             className={absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80}
//           >
//             <div className="px-4.5 py-3">
//               <h5 className="text-sm font-medium text-bodydark2">
//                 Notification
//               </h5>
//             </div>

//             <ul className="flex h-auto flex-col overflow-y-auto">
//               <li>
//                 <Link
//                   className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
//                   to="#"
//                 >
//                   <p className="text-sm">
//                     <span className="text-black dark:text-white">
//                       Edit your information in a swipe
//                     </span>{" "}
//                     Sint occaecat cupidatat non proident, sunt in culpa qui
//                     officia deserunt mollit anim.
//                   </p>

//                   <p className="text-xs">12 May, 2025</p>
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
//                   to="#"
//                 >
//                   <p className="text-sm">
//                     <span className="text-black dark:text-white">
//                       It is a long established fact
//                     </span>{" "}
//                     that a reader will be distracted by the readable.
//                   </p>

//                   <p className="text-xs">24 Feb, 2025</p>
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
//                   to="#"
//                 >
//                   <p className="text-sm">
//                     <span className="text-black dark:text-white">
//                       There are many variations
//                     </span>{" "}
//                     of passages of Lorem Ipsum available, but the majority have
//                     suffered
//                   </p>

//                   <p className="text-xs">04 Jan, 2025</p>
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
//                   to="#"
//                 >
//                   <p className="text-sm">
//                     <span className="text-black dark:text-white">
//                       There are many variations
//                     </span>{" "}
//                     of passages of Lorem Ipsum available, but the majority have
//                     suffered
//                   </p>

//                   <p className="text-xs">01 Dec, 2024</p>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         )}
//       </li>
//     </ClickOutside>
//   );
// };

// export default DropdownNotification;
