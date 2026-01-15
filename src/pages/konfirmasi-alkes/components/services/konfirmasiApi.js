// components/services/konfirmasiApi.js
import axios from "axios";

export const putKonfirmasi = async ({ id, payload, token }) => {
  try {
    const response = await axios({
      method: "put",
      url: `${import.meta.env.VITE_APP_API_URL}/api/konfirmasidetail/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Gagal PUT Konfirmasi:", error);

    throw (
      error.response?.data || {
        message: "Gagal mengirim data konfirmasi",
      }
    );
  }
};
