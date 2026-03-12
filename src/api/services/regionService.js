import axiosInstance from "../axiosInstance";

export const getProvinsi = async () => {
  const response = await axiosInstance.get("/api/provinsi");
  return response.data.data;
};

export const getKabupaten = async (idProvinsi) => {
  const response = await axiosInstance.get(`/api/getkabupaten/${idProvinsi}`);
  return response.data.data;
};

export const getKecamatan = async (idKabupaten) => {
  const response = await axiosInstance.get(`/api/getkecamatan/${idKabupaten}`);
  return response.data.data;
};

export const getPuskesmasByKecamatan = async (idKecamatan) => {
  const response = await axiosInstance.get(`/api/getpuskesmas/${idKecamatan}`);
  return response.data.data;
};
