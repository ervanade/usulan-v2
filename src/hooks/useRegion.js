import useSWR from "swr";
import { getProvinsi, getKabupaten, getKecamatan, getPuskesmasByKecamatan, getPuskesmasByKabupaten } from "../api/services/regionService";

export const useProvinsi = () => {
  const { data, error, isLoading } = useSWR("provinsi", getProvinsi);
  return { data, error, isLoading };
};

export const useKabupaten = (idProvinsi) => {
  const { data, error, isLoading } = useSWR(
    idProvinsi ? ["kabupaten", idProvinsi] : null,
    () => getKabupaten(idProvinsi)
  );
  return { data, error, isLoading };
};

export const useKecamatan = (idKabupaten) => {
  const { data, error, isLoading } = useSWR(
    idKabupaten ? ["kecamatan", idKabupaten] : null,
    () => getKecamatan(idKabupaten)
  );
  return { data, error, isLoading };
};

export const usePuskesmas = (idKecamatan) => {
  const { data, error, isLoading } = useSWR(
    idKecamatan ? ["puskesmas-kecamatan", idKecamatan] : null,
    () => getPuskesmasByKecamatan(idKecamatan)
  );
  return { data, error, isLoading };
};

export const usePuskesmasByKabupaten = (idKabupaten) => {
  const { data, error, isLoading } = useSWR(
    idKabupaten ? ["puskesmas-kabupaten", idKabupaten] : null,
    () => getPuskesmasByKabupaten(idKabupaten)
  );
  return { data, error, isLoading };
};
