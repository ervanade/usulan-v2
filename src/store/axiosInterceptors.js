import axios from "axios";
import { store } from "./index.js";
import { logoutUser } from "./authSlice.js";
import Swal from "sweetalert2";

// Tambahkan interceptor untuk menangani response
axios.interceptors.response.use(
    (response) => {
        // Jika response berhasil, langsung return
        return response;
    },
    (error) => {
        if (
            error.response &&
            error.response.status === 401
        ) {
            // Logout user
            store.dispatch(logoutUser());

            // Redirect ke halaman login
            Swal.fire({
                icon: "warning",
                title: "Sesi Anda Telah Habis",
                text: "Silahkan login kembali.",
                timer: 1500, // Swal akan otomatis tertutup dalam 2.5 detik
                // showConfirmButton: false,
                willClose: () => {
                    window.location.href = "/login"; // Redirect setelah Swal tertutup
                }
            });
            return; // Hentikan eksekusi lebih lanjut agar tidak langsung redirect
        }

        // Tetap lempar error untuk ditangani oleh caller
        return Promise.reject(error);
    }
);
