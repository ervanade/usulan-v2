import axiosInstance from "../axiosInstance";

export const getPuskesmasRelokasiList = async () => {
  const response = await axiosInstance.get("/api/puskesmas-relokasi");
  return response.data.data;
};

export const storePuskesmasRelokasi = async (data) => {
  const response = await axiosInstance.post("/api/puskesmas-relokasi/store", data);
  return response.data;
};

export const updatePuskesmasRelokasi = async (id, data) => {
  const response = await axiosInstance.put(`/api/puskesmas-relokasi/${id}`, data);
  return response.data;
};

export const deletePuskesmasRelokasi = async (id) => {
  const response = await axiosInstance.delete(`/api/puskesmas-relokasi/${id}`);
  return response.data;
};
