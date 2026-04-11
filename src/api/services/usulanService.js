import axiosInstance from "../axiosInstance";

export const getUsulanList = async () => {
  const response = await axiosInstance.get("/api/usulan/grouppuskesmas");
  return response.data.data;
};

export const getAlkes = async () => {
  const response = await axiosInstance.get("/api/alkes");
  return response.data.data;
};

export const getUsulanDetail = async (id, periodeId = null) => {
  let url = `/api/usulan/detail/${encodeURIComponent(id)}`;
  if (periodeId) {
    url += `/${periodeId}`;
  }
  const response = await axiosInstance.get(url);
  return response.data.data;
};

export const filterUsulan = async (filters) => {
  const response = await axiosInstance.post("/api/usulan/grouppuskesmas", filters);
  return response.data.data;
};

export const deleteUsulan = async (id) => {
  const response = await axiosInstance.delete(`/api/distribusi/${id}`);
  return response.data;
};

export const updateUsulan = async (id, data) => {
  const response = await axiosInstance.put(`/api/usulan/update/${id}`, data);
  return response.data;
};

// Add other usulan related services here
export const getKriteria = async () => {
  const response = await axiosInstance.get("/api/kriteria");
  return response.data.data;
};

export const getPeriode = async () => {
  const response = await axiosInstance.get("/api/periode");
  return response.data.data;
};

export const getLimbah = async () => {
  const response = await axiosInstance.get("/api/pengelolaan-limbah");
  return response.data.data;
};

export const getSumberListrik = async () => {
  const response = await axiosInstance.get("/api/sumber-listrik");
  return response.data.data;
};

export const getLimbahDetail = async (id) => {
  const response = await axiosInstance.get(`/api/pengelolaan-limbah/${id}`);
  return response.data.data;
};

export const postLimbah = async (data) => {
  const response = await axiosInstance.post(`/api/pengelolaan-limbah`, data);
  return response.data;
};

export const putLimbah = async (id, data) => {
  const response = await axiosInstance.put(`/api/pengelolaan-limbah/${id}`, data);
  return response.data;
};

export const deleteLimbah = async (id) => {
  const response = await axiosInstance.delete(`/api/pengelolaan-limbah/${id}`);
  return response.data;
};

export const verifyUsulanDetail = async (id_usulan, id_puskesmas, data) => {
  const response = await axiosInstance.post(`/api/usulan/verifikasidetail/${id_usulan}/${id_puskesmas}`, data);
  return response.data;
};
