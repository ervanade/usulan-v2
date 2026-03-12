import axiosInstance from "../axiosInstance";

export const getUsulanList = async () => {
  const response = await axiosInstance.get("/api/puskesmas");
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
  const response = await axiosInstance.post("/api/puskesmas/filter", filters);
  return response.data.data;
};

export const deleteUsulan = async (id) => {
  const response = await axiosInstance.delete(`/api/distribusi/${id}`);
  return response.data;
};

export const updateUsulan = async (id, data) => {
  const response = await axiosInstance.put(`/api/usulan/${id}`, data);
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
