import axiosInstance from "../axiosInstance";

export const getKonfirmasiHeader = async () => {
  const response = await axiosInstance.get("/api/konfirmasiheader");
  return response.data.data;
};

export const filterKonfirmasiHeader = async (filters) => {
  const response = await axiosInstance.post("/api/konfirmasiheader/filter", filters);
  return response.data.data;
};

export const filterKonfirmasiDetail = async (filters) => {
  const response = await axiosInstance.post("/api/konfirmasidetail/filter", filters);
  return response.data.data;
};
