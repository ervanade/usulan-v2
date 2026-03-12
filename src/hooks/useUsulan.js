import useSWR from "swr";
import { getUsulanList, getUsulanDetail, getKriteria, getPeriode } from "../api/services/usulanService";

export const useUsulan = () => {
  const { data, error, isLoading, mutate } = useSWR("usulan-list", getUsulanList);

  return {
    usulan: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useUsulanDetail = (id, periodeId = null) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ["usulan-detail", id, periodeId] : null,
    () => getUsulanDetail(id, periodeId)
  );

  return {
    usulan: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useKriteria = () => {
  const { data, error, isLoading } = useSWR("kriteria", getKriteria);

  return {
    kriteria: data,
    isLoading,
    isError: error,
  };
};

export const usePeriode = () => {
  const { data, error, isLoading } = useSWR("periode", getPeriode);

  return {
    periode: data,
    isLoading,
    isError: error,
  };
};
